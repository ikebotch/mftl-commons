import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RoleGuard } from 'mftl-common-guards';

export const Roles = (...roles: string[]) =>
  applyDecorators(SetMetadata('roles', roles), UseGuards(RoleGuard));
