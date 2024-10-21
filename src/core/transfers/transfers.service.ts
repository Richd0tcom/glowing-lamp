import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { ModelClass, transaction } from 'objection';
import { User } from '../user/entities/user.entity';
import { Entry, Reference, Transfer, TxType } from './entities/transfer.entity';
import { isTrueModel } from 'src/common/helpers/object';
import { UserService } from '../user/user.service';
import { FetchTransferQueryParamsDto } from './dto/fetch-transfers.dto';

@Injectable()
export class TransfersService {
  constructor(
    @Inject('User') private User: ModelClass<User>,
    @Inject('Reference') private Reference: ModelClass<Reference>,
    @Inject() private userService: UserService,
  ) {}

  /**
   * Transfers funds between two users using their usernames.
   * 
   * @async
   * @param {CreateTransferDto} createTransferDto - The transfer data object.
   *
   * @returns {Promise<Transfer>} - The created transfer transaction.
   *
   */
  async create(
    userId: string,
    createTransferDto: CreateTransferDto,
  ): Promise<Transfer> {
    const fromUser = await this.User.query().findById(userId);
    if (!isTrueModel(fromUser)) {
      throw new UnauthorizedException();
    }

    const ref = await this.Reference.query().findById(
      createTransferDto.transactionReference,
    );

    if (!isTrueModel(ref)) {
      throw new ForbiddenException('no transaction reference');
    }

    if (ref.transactionId !== null) {
      throw new ForbiddenException('duplicate transaction reference');
    }

    const toUser = await this.User.query().findOne({
      username: createTransferDto.toUsername,
    });

    if (!isTrueModel(toUser)) {
      throw new NotFoundException('recipient does not exist');
    }

    if (userId === toUser.id) {
      throw new ForbiddenException('cannot send to self');
    }

    
    const balance = await this.userService.fetchBalance(userId, false);
    if (Number(balance.currentBalance) < Number(createTransferDto.amount)) {
      throw new ForbiddenException('insufficient funds');
    }

    const tx = await this.createTransaction(
      userId,
      toUser.id,
      String(createTransferDto.amount),
      createTransferDto.transactionReference,
      createTransferDto.description,
    );

    await Promise.all([
      this.userService.updateBalance(fromUser),
      this.userService.updateBalance(toUser),
    ]);

    return tx;
  }

  async createRef() {
    const tx = await this.Reference.query().insert({});
    return tx;
  }

  private async createTransaction(
    fromUserId: string,
    toUserId: string,
    amount: string,
    transactionReference: string,
    description: string = '',
  ) {
    try {
      const trans = await transaction(
        Transfer,
        Entry,
        this.Reference,
        async (Transfer, Entry, Reference) => {

          /**
           * Debit from user
           */
          await Entry.query().insert({
            userId: fromUserId,
            amount,
            txType: TxType.DEBIT,
          });

          /**
           * credit to user
           *  */ 
          await Entry.query().insert({
            userId: toUserId,
            amount,
            txType: TxType.CREDIT,
          });

          /**
           * record transfer
           */
          
          const Tf = await Transfer.query().insert({
            fromUserId,
            toUserId,
            amount,
            description,
            transactionReference,
          });

          await Reference.query().patchAndFetchById(transactionReference, {
            transactionId: Tf.id,
          });

          /**
           * Retrieve Transfer with participant details
           */
          return await Transfer.query()
            .findById(Tf.id)
            .withGraphFetched('[sender, recipient]');
        },
      );

      return trans;
    } catch (error) {
      console.log(error);
      throw new ServiceUnavailableException('kx transaction failed');
    }
  }

  async getTransfers(userId: string, query: FetchTransferQueryParamsDto) {
    const page = Number(query?.page) || 1;
    const transfers = await Transfer.query()
      .where('fromUserId', userId)
      .orWhere('toUserId', userId)
      .withGraphFetched('[sender, recipient]')
      .page(page - 1, 3);

    return { ...transfers, page };
  }
}
