import { Model, ModelObject, RelationMappings, RelationMappingsThunk } from "objection";
import mixins from "src/db/mixin";


export class Account extends mixins(Model){
    static tableName: string = 'accounts';

    public readonly id: string;
    public username: string;
    public password: string;


    public created_at: Date | string;

    static hidden = ["password",] 
}
