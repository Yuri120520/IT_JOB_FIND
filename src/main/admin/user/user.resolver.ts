import { Injectable } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';

import { UserAdminService } from './user.service';

import { ROLE } from '@/common/constant';
import { Auth } from '@/decorators/auth.decorator';
import { Roles } from '@/decorators/roles.decorator';
import { ChangeStatusOfUserInput } from '@/main/shared/user/dto';
import { IUser } from '@/main/shared/user/interface';

@Roles(ROLE.ADMIN)
@Auth(['Roles'])
@Injectable()
export class UserAdminResolver {
  constructor(private service: UserAdminService) {}

  @Mutation(() => IUser, { name: 'changeStatusOfUser' })
  async changeStatusOfUser(@Args('input') input: ChangeStatusOfUserInput) {
    return await this.service.updateStatusOfUser(input.userId, input.isActive);
  }
}
