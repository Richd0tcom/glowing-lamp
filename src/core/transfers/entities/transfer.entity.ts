import {
  Model,

  RelationMappings,
  RelationMappingsThunk,
} from 'objection';
import { User } from 'src/core/user/entities/user.entity';
import mixins from 'src/db/mixin';

/**
 *  Transfer Model 
 */
export class Transfer extends mixins(Model) {
  static tableName: string = 'transfers';

  /**
   * unique id of the transfer transaction
   */
  public readonly id: string;

  /**
   *  user ID of the sender
   */
  public fromUserId: string;

  /**
   * user ID of the recipient
   */
  public toUserId: string;

  /**
   *  amount sent
   */
  public amount: number;

  /**
   * description of the transaction
   */
  public description: string;

  /**
   * Transaction reference for Idempotency
   */
  public transactionReference: string;

  /**
   * Sender object (for graphs and joins)
   */
  public sender: User;

  /**
   * Recipient object (for graphs and joins)
   */
  public recipient: User;

  /**
   * Datetime of transfer
   */
  public createdAt: Date | string;

  static relationMappings: RelationMappings | RelationMappingsThunk = {

    /**
     *  Sender model relationship
     */
    sender: {
      relation: Model.HasOneRelation,
      modelClass: User,
      join: {
        from: 'transfers.fromUserId',
        to: 'users.id',
      },
    },

    /**
     *  Recipient model relationship
     */
    recipient: {
      relation: Model.HasOneRelation,
      modelClass: User,
      join: {
        from: 'transfers.toUserId',
        to: 'users.id',
      },
    },
  };
}


/**
 * Transaction Refernce model
 */
export class Reference extends mixins(Model) {

  static tableName: string = 'references';

  /**
   * Unique reference
   */
  public readonly id: string;

  /**
   * unique id of the transfer
   */
  public transactionId: string;

  /**
   * Datetime
   */
  public createdAt: Date | string;
}


