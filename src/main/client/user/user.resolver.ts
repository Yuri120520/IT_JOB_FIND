import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { Auth } from '@/decorators/auth.decorator';
import { Context, GetContext } from '@/decorators/user.decorator';
import { UserUpdateInput } from '@/main/shared/user/dto';
import { IUser } from '@/main/shared/user/interface';
import { UserSharedResolver } from '@/main/shared/user/user.resolver';

@Auth()
@Resolver()
export class UserResolver extends UserSharedResolver {
  @Mutation(() => IUser)
  async updateMe(@Args('input') userUpdateInput: UserUpdateInput, @GetContext() ctx: Context): Promise<IUser> {
    return this.userService.updateUser(userUpdateInput, ctx);
  }

  @Query(() => IUser)
  async getMe(@GetContext() ctx: Context, @Info() info: GraphQLResolveInfo): Promise<IUser> {
    return this.userService.findOne(
      {
        id: ctx.currentUser.id
      },
      info,
      true
    );
  }
}
