import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class SecretGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    // get headers from request
    const request = context.switchToHttp().getRequest<Request>();

    const secret = request.header('X-SECRET');

    if (!secret) {
      throw new ForbiddenException('Secret Signature Not Provided');
    }

    // get locals from response
    // const response = context.switchToHttp().getResponse<Response>();

    // put tenacy in locals
    if (process.env.CONSTANT_SECRET_KEY !== secret) {
      throw new ForbiddenException('Secret Signature Invalid');
    }

    return true;
  }
}

