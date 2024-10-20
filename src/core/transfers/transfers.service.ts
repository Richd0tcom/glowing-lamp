import { Inject, Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { ModelClass, transaction } from 'objection';
import { User } from '../user/entities/user.entity';
import { Entry, Transfer, TxType } from './entities/transfer.entity';
import { isTrueModel } from 'src/common/helpers/object';

@Injectable()
export class TransfersService {
  constructor(@Inject('User') private userModel: ModelClass<User>,){}

  async create(userId: string, createTransferDto: CreateTransferDto) {
    const fromUser = await User.query().findById(userId);
    if (!isTrueModel(fromUser)) {
      throw new UnauthorizedException()
    }

    const toUser = await User.query().findOne({
      id: createTransferDto.toUserId,
    });

    if (!isTrueModel(toUser)) {
      throw new UnauthorizedException('recipient does not exist')
    }

    const rd = await this.createTransaction(
      userId,
      createTransferDto.toUserId,
      createTransferDto.amount,
      createTransferDto.description,
    );

    console.log(rd)

    return rd;
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
      console.log(error)
      throw new ServiceUnavailableException('kx transaction failed');
    }
  }

  async getTransfers(userId: string) {
    const transfers = await Transfer.query().where('fromUserId', userId);

    return transfers;
  }
}
