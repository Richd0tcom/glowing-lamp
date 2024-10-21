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
import { Reference, Transfer,} from './entities/transfer.entity';
import { isTrueModel } from 'src/common/helpers/object';
import { UserService } from '../user/user.service';
import { FetchTransferQueryParamsDto } from './dto/fetch-transfers.dto';
import { TransactionExceptionMessage, TxType } from 'src/common/enums/common.enums';
import { Entry } from './entities/entry.entity';

@Injectable()
export class TransfersService {
  constructor(
    @Inject('User') private User: ModelClass<User>,
    @Inject('Entry') private Entry: ModelClass<Entry>,
    @Inject('Transfer') private Transfer: ModelClass<Transfer>,
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
      throw new ForbiddenException(TransactionExceptionMessage.INVALID_TX_REFERENCE);
    }

    if (ref.transactionId !== null) {
      throw new ForbiddenException(TransactionExceptionMessage.DUPLICATE_TX_REFERENCE);
    }

    const toUser = await this.User.query().findOne({
      username: createTransferDto.toUsername,
    });

    if (!isTrueModel(toUser)) {
      throw new NotFoundException(TransactionExceptionMessage.NO_RECIPIENT);
    }

    if (userId === toUser.id) {
      throw new ForbiddenException(TransactionExceptionMessage.SEND_TO_SELF_EXCEPTION);
    }

    
    const balance = await this.userService.fetchBalance(userId, false);
    if (Number(balance.currentBalance) < Number(createTransferDto.amount)) {
      throw new ForbiddenException(TransactionExceptionMessage.INSUFFICIENT_FUND);
    }

    const tx = await this.createTransaction(
      userId,
      toUser.id,
      Number(createTransferDto.amount),
      createTransferDto.transactionReference,
      createTransferDto.description,
    );

    await Promise.all([
      this.userService.updateBalance(fromUser),
      this.userService.updateBalance(toUser),
    ]);

    return tx;
  }

  /**
   * Generates a unique transaction reference
   * 
   * @returns {Promise<Reference>}
   */
  async createRef(): Promise<Reference> {
    const tx = await this.Reference.query().insert({});
    return tx;
  }

  private async createTransaction(
    fromUserId: string,
    toUserId: string,
    amount: number,
    transactionReference: string,
    description: string = '',
  ) {
    try {
      const trans = await transaction(
        this.Transfer,
        this.Entry,
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
      throw new ServiceUnavailableException(TransactionExceptionMessage.TX_FAILED);
    }
  }

  /**
   * Fetch users transfers while providing filtering and pagination
   * 
   * @param userId 
   * @param query 
   * @returns {Promise<{ page: number; total: number; results: Transfer[]; }>}
   */
  async getTransfers(userId: string, query: FetchTransferQueryParamsDto): Promise<{ page: number; total: number; results: Transfer[]; }> {
    const page = Number(query?.page) || 1;
    const transfers = await Transfer.query()
      .where('fromUserId', userId)
      .orWhere('toUserId', userId)
      .withGraphFetched('[sender, recipient]')
      .page(page - 1, 3);

    return { ...transfers, page };
  }
}
