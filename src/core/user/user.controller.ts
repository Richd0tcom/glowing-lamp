import { Controller, Get, Post, Body, Request,  Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ExcludeNullInterceptor } from 'src/common/f.interceptor';

@ApiTags('Users')
@UseInterceptors(ExcludeNullInterceptor)
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
