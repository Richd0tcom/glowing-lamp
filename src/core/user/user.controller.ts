import { Controller, Get, Post, Body, Request,  Patch, Param, Delete, UseGuards, UseInterceptors, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseHandler } from 'src/common/f.interceptor';
import { HttpExceptionFilter } from 'src/common/filters/exception.filter';

@ApiTags('Users')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseHandler)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}



  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/id')
  getDetailsWithBalance(@Request() req) {
    console.log('ran cont')

    return this.userService.getDetailsWithBalance(req.user.id);

  }

  @Get(':username')
  get(@Param('username') username: string) {
    return this.userService.getDetails(username);
  }

}
