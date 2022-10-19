import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    if (context.getArgs()[3]) {
      const path = context.getArgs()[2]['req'].baseUrl;
      const parentType = context.getArgs()[3]['parentType'];
      const fieldName = context.getArgs()[3]['fieldName'];
      return next.handle().pipe(
        tap(() => {
          Logger.debug(`Response Lag...${Date.now() - now}ms`);
          Logger.debug(`⛩  ${path} » ${parentType} » ${fieldName}`, 'GraphQL');
        })
      );
    }
    const parentType = `${context.getArgs()[0].route.path}`;
    const fieldName = `${context.getArgs()[0].route.stack[0].method}`;
    return next.handle().pipe(
      tap(() => {
        Logger.debug(`Response Lag...${Date.now() - now}ms`);
        Logger.debug(`⛩  ${parentType} » ${fieldName}`, 'GraphQL');
      })
    );
  }
}
