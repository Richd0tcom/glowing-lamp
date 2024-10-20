import { Controller, Get, Post, Body, Request, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';

@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  create(@Request() req, @Body() createTransferDto: CreateTransferDto) {
    return this.transfersService.create(req.user.id, createTransferDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  get(@Request() req) {
    console.log(req.user)
    
    return this.transfersService.getTransfers(req.user.id)
  }
}
