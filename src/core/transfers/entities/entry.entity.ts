import { Model } from "objection";
import { TxType } from "src/common/enums/common.enums";
import mixins from "src/db/mixin";

export class Entry extends mixins(Model) {
    static tableName: string = 'entries';
  
    /**
     * unique id of the entry
     */
    public readonly id: string;

    /**
     * unique id of the user whom entry belongs to
     */
    public userId: string;

    /**
     *  amount deposited or withdrawn
     */
    public amount: number;

    /**
     * Transaction type (Debit | Credit)
     */
    public txType: TxType;
  
  
    public createdAt: Date | string;
}