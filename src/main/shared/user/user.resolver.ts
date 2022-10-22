import { BaseResolver } from '@enouvo-packages/base-nestjs-api';
import { Resolver } from '@nestjs/graphql';

import { IUser, IUsers } from './interface';
import { UserService } from './user.service';

import { User } from '@/db/entities/User';

@Resolver()
export class UserSharedResolver extends BaseResolver<IUsers, IUser>({
  getAllBase: IUsers,
  getOneBase: IUser,
  classRef: User.name
}) {
  constructor(protected userService: UserService) {
    super(userService);
  }
}
