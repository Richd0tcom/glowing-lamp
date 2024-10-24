import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseFilters, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ResponseHandler } from 'src/common/interceptors/response.interceptor';
import { HttpExceptionFilter } from 'src/common/filters/exception.filter';
import { AuthResponse } from 'src/common/interfaces/common.interface';

/**
 * Auth Controller routes prefixed with /auth 
 */
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseHandler)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Sign up route
   * 
   * @param createAuthDto 
   * @returns 
   */
  @Post('/signup')
  signUp(@Body() createAuthDto: CreateAuthDto): Promise<AuthResponse> {
    return this.authService.signUp(createAuthDto);
  }

  /**
   * Sign in route
   * 
   * @param createAuthDto 
   * @returns {AuthResponse}
   */
  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  signIn(@Body() createAuthDto: CreateAuthDto): Promise<AuthResponse> {
    return this.authService.signIn(createAuthDto);
  }

}
