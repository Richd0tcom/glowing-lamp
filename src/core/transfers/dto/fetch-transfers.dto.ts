import { ApiProperty } from "@nestjs/swagger";
import * as Joi from "joi";
import { JoiSchema, JoiSchemaOptions } from "nestjs-joi";

@JoiSchemaOptions({
    allowUnknown: false,
  })

export class FetchTransferQueryParamsDto {

    @JoiSchema(Joi.string())
    page: string;

    @JoiSchema(Joi.date())
    start_date: string;

    @JoiSchema(Joi.date())
    end_date: string
}