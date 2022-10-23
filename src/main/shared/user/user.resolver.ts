import { BaseResolver } from '@enouvo-packages/base-nestjs-api';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { UserUpdateInput } from './dto';
import { IUser, IUsers } from './interface';
import { UserService } from './user.service';

import { User } from '@/db/entities/User';
import { Auth } from '@/decorators/auth.decorator';
import { Context, GetContext } from '@/decorators/user.decorator';

@Auth()
@Resolver()
export class UserResolver extends BaseResolver<IUsers, IUser>({
  getAllBase: IUsers,
  getOneBase: IUser,
  classRef: User.name
}) {
  constructor(protected service: UserService) {
    super(service);
  }

  @Mutation(() => IUser)
  async updateMe(@Args('input') userUpdateInput: UserUpdateInput, @GetContext() ctx: Context): Promise<IUser> {
    return this.service.updateUser(userUpdateInput, ctx);
  }
  @Query(() => IUser, { name: 'getMe' })
  async getMe(@GetContext() ctx: Context, @Info() info: GraphQLResolveInfo) {
    const { currentUser } = ctx;
    return await this.service.findOne(currentUser.id, info);
  }
}
