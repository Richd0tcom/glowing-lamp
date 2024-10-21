import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseFilters,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/filters/exception.filter';
import { ResponseHandler } from 'src/common/interceptors/response.interceptor';
import { FetchTransferQueryParamsDto } from './dto/fetch-transfers.dto';
import { Reference, Transfer, TxType } from './entities/transfer.entity';
import { AuthRequest } from 'src/common/interfaces/common.interface';



@ApiTags('Transfers')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseHandler)
@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  /**
   * Initiates a money transfer 
   * 
   * @param {AuthRequest} req - the current request context
   * @param {CreateTransferDto} createTransferDto 
   * @returns {Promise<Transfer>}
   */
  @UseGuards(JwtAuthGuard)
  @Post('/')
  create(@Request() req: AuthRequest, @Body() createTransferDto: CreateTransferDto): Promise<Transfer> {
    return this.transfersService.create(req.user.id, createTransferDto);
  }


  /**
   * Generates a transaction reference for Idempotency
   * 
   * @returns {Promise<Reference>}
   */
  @UseGuards(JwtAuthGuard)
  @Get('/ref')
  createRef(): Promise<Reference> {
    return this.transfersService.createRef();
  }

  /**
   * Retrieves all transactions of a user with pagination and filtering.
   * @param {AuthRequest} req - the current request context
   * @param {FetchTransferQueryParamsDto} [query] - The expected query parameters for filtering and pagination.
   * 
   * @returns {Promise<{page: number; total: number; results: Transfer[];}>} - The list of transactions.
   */
  @UseGuards(JwtAuthGuard)
  @Get('/')
  get(@Request() req: AuthRequest, @Query() query: FetchTransferQueryParamsDto): Promise<{ page: number; total: number; results: Transfer[]; }> {
    return this.transfersService.getTransfers(req.user.id, query);
  }
}
