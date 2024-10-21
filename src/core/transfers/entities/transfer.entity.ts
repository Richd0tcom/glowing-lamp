import {
  Model,
  ModelObject,
  RelationMappings,
  RelationMappingsThunk,
} from 'objection';
import { User } from 'src/core/user/entities/user.entity';
import mixins from 'src/db/mixin';

export class Transfer extends mixins(Model) {
  static tableName: string = 'transfers';

  public readonly id: string;
  public fromUserId: string;
  public toUserId: string;
  public amount: string;
  public description: string;
  public transactionReference: string;

  public sender: User;
  public recipient: User;

  public createdAt: Date | string;

  static relationMappings: RelationMappings | RelationMappingsThunk = {
    sender: {
      relation: Model.HasOneRelation,
      modelClass: User,
      join: {
        from: 'transfers.fromUserId',
        to: 'users.id',
      },
    },

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

export class Entry extends mixins(Model) {
  static tableName: string = 'entries';

  public readonly id: string;
  public userId: string;
  public amount: string;
  public txType: TxType;
  public description: string;

  public createdAt: Date | string;
}

export class Reference extends mixins(Model) {

  static tableName: string = 'references';

  public readonly id: string;
  public transactionId: string;

  public createdAt: Date | string;
}

export enum TxType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}
