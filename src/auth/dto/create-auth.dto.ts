import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from "nestjs-joi"

@JoiSchemaOptions({
    allowUnknown: false,
  })
export class CreateAuthDto {

    @JoiSchema(Joi.string().required())
    username!: string;

    @JoiSchema(Joi.string().required())
    password: string;
}
