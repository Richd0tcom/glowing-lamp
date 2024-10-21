import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Authentication/Authorization Guard for protecting routes  
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}