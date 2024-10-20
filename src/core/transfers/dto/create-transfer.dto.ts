import { ApiProperty } from "@nestjs/swagger";
import * as Joi from "joi";
import { JoiSchema, JoiSchemaOptions } from "nestjs-joi";

@JoiSchemaOptions({
    allowUnknown: false,
  })
export class CreateTransferDto {

    @ApiProperty({ example: "rich", description: 'The username of the recipient' })
    @JoiSchema(Joi.string().required())
    toUsername: string;

    @JoiSchema(Joi.number().required())
    amount: number;

    @JoiSchema(Joi.string().allow(""))
    description: string;
}
