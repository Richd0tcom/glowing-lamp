import { Injectable } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { transaction } from 'objection';
import { User } from '../user/entities/user.entity';
import { Entry, Transfer, TxType } from './entities/transfer.entity';
import { isTrueModel } from 'src/common/helpers/object';

@Injectable()
export class TransfersService {
  async create(createTransferDto: CreateTransferDto) {

    const fromUser = await User.query().findById(createTransferDto.fromUserId);
    if(!isTrueModel(fromUser)){

      //throw instead
      return 'user not found'
    }

    const toUser = await User.query().findOne({id: createTransferDto.toUserId});

    if(!isTrueModel(toUser)){
      return 'user not found'
    }


    return 'This action adds a new transfer';
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
            description
          });

          // credit to user
          await Entry.query().insert({
            userId: toUserId,
            amount,
            txType: TxType.CREDIT,
            description
          });

          //record transfer
          const Tf = await Transfer.query().insert({
            fromUserId,
            toUserId,
            amount,
            description
          })

          // add graph fetched users 
          return await Transfer.query().findById(Tf.id)
        },
      );

      return trans
    } catch (error) {
      throw Error('kx transaction failed')
    }
  }
}
