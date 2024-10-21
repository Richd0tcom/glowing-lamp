import { Model, ModelObject, RelationMappings, RelationMappingsThunk } from "objection";
import mixins from "src/db/mixin";

/**
 * User model
 */
export class User extends mixins(Model){
    static tableName: string = 'users';

    /**
     * Unique ID of the user
     */
    public readonly id: string;

    /**
     * unique username of the user
     */
    public username: string;

    
    public password: string;


    public createdAt: Date | string;

    static hidden = ["password",] 
}
