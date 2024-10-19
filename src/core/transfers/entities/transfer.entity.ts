import { Model, ModelObject, RelationMappings, RelationMappingsThunk } from "objection";
import mixins from "src/db/mixin";

export class Transfer extends mixins(Model){
    static tableName: string = 'transfers';

    public readonly id: string;
    public fromUserId: string;
    public toUserId: string;
    public amount: string;
    public description: string;

    public createdAt: Date | string; 
}

export class Entry extends mixins(Model){
    static tableName: string = 'entries';

    public readonly id: string;
    public userId: string;
    public amount: string;
    public txType: TxType;
    public description: string


    public createdAt: Date | string;

}

export enum TxType {
    CREDIT = 'credit',
    DEBIT = 'debit'
}

