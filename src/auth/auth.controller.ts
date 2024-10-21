import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseFilters, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ResponseHandler } from 'src/common/interceptors/response.interceptor';
import { HttpExceptionFilter } from 'src/common/filters/exception.filter';

@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseHandler)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signUp(createAuthDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  signIn(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signIn(createAuthDto);
  }

}
