import { Model, ModelObject, RelationMappings, RelationMappingsThunk } from "objection";
import mixins from "src/db/mixin";

export class User extends mixins(Model){
    static tableName: string = 'users';

    public readonly id: string;
    public username: string;
    public password: string;


    public createdAt: Date | string;

    static hidden = ["password",] 
}
