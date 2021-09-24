import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';


@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // get request
    const request = context.switchToHttp().getRequest<Request>();

    // get context from token
    const ctx = (request as any)?.user?.ctx;

    // get roles passed to decorator
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    return roles.every((role: string) => ctx?.includes(role));
  }
}
