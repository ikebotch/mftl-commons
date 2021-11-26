import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { TenancyService } from './tenancy.service';

@Injectable()
export class ProjectInterceptor implements NestInterceptor {
  constructor(private tenancyService: TenancyService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // get request
    const request = context.switchToHttp().getRequest() as Request;

    // get tenacy header
    const pid = (request as any).user.pid;

    // check for x-tennat header
    if (pid) {
      throw new BadRequestException('Invalid project id');
    }

    // set tenancy to service
    this.tenancyService.project = pid;

    return next.handle();
  }
}
