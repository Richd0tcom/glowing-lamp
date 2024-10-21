import { ApiProperty } from "@nestjs/swagger";
import * as Joi from "joi";
import { JoiSchema, JoiSchemaOptions } from "nestjs-joi";
import { TxType } from "../entities/transfer.entity";

@JoiSchemaOptions({
    allowUnknown: false,
  })

export class FetchTransferQueryParamsDto {

    @JoiSchema(Joi.string())
    page: string;

    @JoiSchema(Joi.date())
    startDate: string;

    @JoiSchema(Joi.date())
    endDate: string

    @JoiSchema(Joi.string())
    type: TxType
}