import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class TenancyGuard implements CanActivate {

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    // get headers from request
    const request = context.switchToHttp().getRequest<Request>();

    const tenantId = request.header('X-TENANT');

    if (!tenantId) {
      return false;
    }

    // get locals from response
    const response = context.switchToHttp().getResponse<Response>();

    // put tenacy in locals
    (response.locals as any).tenantId = tenantId;

    return true;
  }
}
