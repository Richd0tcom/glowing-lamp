import {
  ForbiddenException,
  Inject,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { ModelClass, transaction } from 'objection';
import { User } from '../user/entities/user.entity';
import { Entry, Transfer, TxType } from './entities/transfer.entity';
import { isTrueModel } from 'src/common/helpers/object';
import { UserService } from '../user/user.service';

@Injectable()
export class TransfersService {
  constructor(
    @Inject('User') private User: ModelClass<User>,
    @Inject() private userService: UserService,
  ) {}

  async create(userId: string, createTransferDto: CreateTransferDto) {
    const fromUser = await this.User.query().findById(userId);
    if (!isTrueModel(fromUser)) {
      throw new UnauthorizedException();
    }

    const toUser = await this.User.query().findOne({
      username: createTransferDto.toUsername,
    });

    if (!isTrueModel(toUser)) {
      throw new UnauthorizedException('recipient does not exist');
    }

    if (userId === toUser.id) {
      throw new ForbiddenException('cannot send to self');
    }

    //check balance from cache
    const balance = await this.userService.fetchBalance(userId, false);
    if (Number(balance.currentBalance) < Number(createTransferDto.amount)) {
      throw new ForbiddenException('insufficient funds');
    }

    const tx = await this.createTransaction(
      userId,
      toUser.id,
      String(createTransferDto.amount),
      createTransferDto.description,
    );

    await Promise.all([
      this.userService.updateBalance(fromUser),
      this.userService.updateBalance(toUser),
    ]);

    return tx;
  }

  private async createTransaction(
    fromUserId: string,
    toUserId: string,
    amount: string,
    description: string = '',
  ) {
    try {
      const trans = await transaction(
        Transfer,
        Entry,
        async (Transfer, Entry) => {
          // debit from user
          await Entry.query().insert({
            userId: fromUserId,
            amount,
            txType: TxType.DEBIT,
          });

          // credit to user
          await Entry.query().insert({
            userId: toUserId,
            amount,
            txType: TxType.CREDIT,
          });

          //record transfer
          const Tf = await Transfer.query().insert({
            fromUserId,
            toUserId,
            amount,
            description,
          });

          // add graph fetched users
          return await Transfer.query().findById(Tf.id);
        },
      );

      return trans;
    } catch (error) {
      console.log(error);
      throw new ServiceUnavailableException('kx transaction failed');
    }
  }

  async getTransfers(userId: string, page: number = 1) {
    const transfers = await Transfer.query()
      .where('fromUserId', userId)
      .orWhere('toUserId', userId)
      .withGraphFetched('[sender, recipient]')
      .page(page - 1, 3);

    return transfers;
  }
}
