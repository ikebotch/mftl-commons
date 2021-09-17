import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { IamEntities } from 'mftl-common-entities';
import { IamInterfaces } from 'mftl-common-interfaces';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(IamEntities.ContextEntity)
    private contextRepository: Repository<IamEntities.ContextEntity>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // get request
    const request = context.switchToHttp().getRequest<Request>();

    // get context from token
    const ctx = (request as any).user.ctx;

    // get roles passed to decorator
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    return roles.every((role: string) => ctx.includes(role));
  }
}
