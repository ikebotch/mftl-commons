import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { TenancyService } from './tenancy.service';

@Injectable()
export class TenancyInterceptor implements NestInterceptor {
  constructor(private tenancyService: TenancyService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // get tenacy header
    const headers = (context.switchToHttp().getRequest() as Request).headers;

    // check for x-tennat header
    if (!headers['x-tenant']) {
      throw new BadRequestException('Please provide a tenant id');
    }

    // set tenancy to service
    this.tenancyService.tenancy = headers['x-tenant'] as string;

    return next.handle();
  }
}
