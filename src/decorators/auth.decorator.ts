/* eslint-disable @typescript-eslint/naming-convention */

import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { PermissionGuard } from 'src/guards/permission.guard';
import { RolesGuard } from 'src/guards/roles.guard';

export function Auth(scopes?: string[]) {
  if (scopes && scopes.length > 0) {
    return applyDecorators(SetMetadata('scopes', scopes), UseGuards(JwtAuthGuard, RolesGuard));
  }
  return applyDecorators(UseGuards(JwtAuthGuard));
}

export function AuthPermission(permissions: string[]) {
  return applyDecorators(SetMetadata('permissions', permissions), UseGuards(PermissionGuard));
}
