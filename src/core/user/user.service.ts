import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ModelClass } from 'objection';
import { User } from './entities/user.entity';
import { Entry, Transfer } from '../transfers/entities/transfer.entity';
import { KnexInstance } from 'src/db';
import { isTrueModel } from 'src/common/helpers/object';

@Injectable()
export class UserService {
  constructor(@Inject('Entry') private Entry: ModelClass<Entry>, @Inject('User') private User: ModelClass<User>) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async getDetails(username: string) {
    const user = await User.query().findOne({username});

    if (!isTrueModel(user)) {
      throw new NotFoundException('user not found')
    }

    return user;
  }

  async getDetailsWithBalance(userId: string) {

    const results = await KnexInstance('entries')
      .select({
        userId: 'userId',
        currentBalance: KnexInstance.raw(
          `SUM(CASE WHEN "txType" = \'credit\' THEN CAST(amount AS DECIMAL(10,2)) WHEN "txType" = \'debit\' THEN -CAST(amount AS DECIMAL(10,2)) ELSE 0 END)`,
        ),
      })
      .where('userId', '=', userId)
      .groupBy('userId');

    const balanceResult = results[0];

    console.log(balanceResult.currentBalance);

    return balanceResult?.currentBalance || 0;
  }
}
