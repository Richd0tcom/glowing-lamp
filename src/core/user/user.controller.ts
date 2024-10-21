import { Controller, Get, Post, Body, Request,  Patch, Param, Delete, UseGuards, UseInterceptors, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseHandler } from 'src/common/interceptors/response.interceptor';
import { HttpExceptionFilter } from 'src/common/filters/exception.filter';
import { AuthRequest, BalanceWithUsername } from 'src/common/interfaces/common.interface';
import { User } from './entities/user.entity';

/**
 * User controller for handling routes prefixed with /users
 */
@ApiTags('Users')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseHandler)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}



  /**
   * Gets a users details with their balance
   * 
   * @param req 
   * @returns {Promise<BalanceWithUsername>}
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/id')
  getDetailsWithBalance(@Request() req: AuthRequest): Promise<BalanceWithUsername> {
    return this.userService.getDetailsWithBalance(req.user.id);
  }

    /**
   * Gets a users details 
   * 
   * @param username 
   * @returns {Promise<User>}
   */
  @Get(':username')
  get(@Param('username') username: string): Promise<User> {
    return this.userService.getDetails(username);
  }

}
