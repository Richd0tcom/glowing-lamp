import * as Joi from "joi";
import { JoiSchema, JoiSchemaOptions } from "nestjs-joi";

@JoiSchemaOptions({
    allowUnknown: false,
  })
export class CreateTransferDto {
    @JoiSchema(Joi.string().required())
    toUserId: string;

    @JoiSchema(Joi.string().required())
    amount: string;

    @JoiSchema(Joi.string())
    description: string;
}
