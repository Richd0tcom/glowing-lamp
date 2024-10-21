import { Controller, Get, Post, Body, Request, Patch, Param, Delete, UseGuards, UseFilters, UseInterceptors, Query } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/filters/exception.filter';
import { ResponseHandler } from 'src/common/f.interceptor';
import { FetchTransferQueryParamsDto } from './dto/fetch-transfers.dto';

@ApiTags('Transfers')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseHandler)
@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  create(@Request() req, @Body() createTransferDto: CreateTransferDto) {
    return this.transfersService.create(req.user.id, createTransferDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/ref')
  createRef() {
    return this.transfersService.createRef();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  get(@Request() req, @Query() query: FetchTransferQueryParamsDto) {
    console.log(req.user)
    
    return this.transfersService.getTransfers(req.user.id, query)
  }
}
