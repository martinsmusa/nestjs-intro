import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export const Serialize = <DTO extends ClassConstructor<any>>(dto: DTO) => {
  return UseInterceptors(new SerializeInterceptor(dto));
};

export class SerializeInterceptor<DTO extends ClassConstructor<any>> implements NestInterceptor {
  constructor(private dto: DTO) {
  }

  /**
   * Executes before the request is passed to request handler
   * @param context
   * @param next
   */
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true
        });
      })
    );
  }
}
