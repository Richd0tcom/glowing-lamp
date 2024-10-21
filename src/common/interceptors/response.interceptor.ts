
import { map } from 'rxjs/operators';
import { CallHandler, ExecutionContext, INestApplication, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 *  Intercepts the response to give a unifed schema
 */
@Injectable()
export class ResponseHandler implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        data,
        message: data.message ?? 'success'
      }))
    );
  }
}
