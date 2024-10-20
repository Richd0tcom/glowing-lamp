import { Injectable, NestInterceptor, ExecutionContext, HttpException, HttpStatus, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const body = context.switchToHttp().getRequest().params;
        // e.g. throw an exception if property is missing

        console.log('intercepttor bodee:  ', body)

        return next.handle()
    }
}