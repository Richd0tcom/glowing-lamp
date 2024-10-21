import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from "nestjs-joi"

/**
 *  Data object for signing up and signing in
 */
@JoiSchemaOptions({
    allowUnknown: false,
  })
export class CreateAuthDto {

    /**
     * username of the client
     */
    @JoiSchema(Joi.string().required())
    username!: string;

    /**
     * clients passoword
     */
    @JoiSchema(Joi.string().required())
    password: string;
}
