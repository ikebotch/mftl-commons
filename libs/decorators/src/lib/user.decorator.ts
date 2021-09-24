import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IamInterfaces } from 'mftl-common-interfaces';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IamInterfaces.AuthenticationToken => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
