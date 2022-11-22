import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { getManager } from 'typeorm';

import { ROLE } from '@/common/constant';
import { ROLES_KEY } from '@/decorators/roles.decorator';
import { GetUserQuery } from '@/main/shared/user/query/getUser.query';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this._reflector.getAllAndOverride<ROLE[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!requiredRoles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);

    const {
      req: { user }
    } = ctx.getContext();

    const userWithRole = await GetUserQuery.getUserById(user.id, false, getManager(), ['role']);

    return requiredRoles.some(role => userWithRole.role.name === role);
  }
}
