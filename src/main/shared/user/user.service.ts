import { BaseService } from '@enouvo-packages/base-nestjs-api';
import { Injectable } from '@nestjs/common';

import { ChangePasswordInput, UserUpdateInput } from './dto';
import { IUser, IUsers } from './interface';
import { GetUserQuery } from './query/getUser.query';

import { ResponseMessageBase } from '@/common/interfaces/returnBase';
import { User } from '@/db/entities/User';
import { Context } from '@/decorators/user.decorator';
import { messageKey } from '@/i18n';
import { PasswordUtil } from '@/providers/password';

@Injectable()
export class UserService extends BaseService<IUsers, IUser> {
  constructor() {
    super(User);
  }

  public async updateUser(userUpdateInput: UserUpdateInput, ctx: Context): Promise<IUser> {
    const { id } = ctx.currentUser;

    const user = await GetUserQuery.getUserById(id);

    const updated = await User.merge(user, { ...userUpdateInput, email: user.email });

    await updated.save();

    return updated;
  }

  public async changePassword(changePasswordInput: ChangePasswordInput, ctx: Context): Promise<ResponseMessageBase> {
    const { password, newPassword } = changePasswordInput;
    const user = await GetUserQuery.getUserById(ctx.currentUser.id);

    await PasswordUtil.validateHash(password, user.password);

    user.password = await PasswordUtil.generateHash(newPassword);

    await user.save();

    return {
      success: true,
      message: messageKey.BASE.SUCCESSFULLY
    };
  }
}
