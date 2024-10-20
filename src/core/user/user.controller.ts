import { Controller, Get, Post, Body, Request,  Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':username')
  get(@Param('username') username: string) {
    return this.userService.getDetails(username);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/id')
  getDetailsWithBalance(@Request() req) {

    return this.userService.getDetailsWithBalance(req.user.id);
  }
}
