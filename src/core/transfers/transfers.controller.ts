import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';

@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Post('/')
  create(@Body() createTransferDto: CreateTransferDto) {
    return this.transfersService.create(createTransferDto);
  }

}
