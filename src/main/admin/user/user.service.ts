import { BadGatewayException, Injectable } from '@nestjs/common';

import { User } from '@/db/entities/User';
import { GetUserQuery } from '@/main/shared/user/query/getUser.query';
import { UserService } from '@/main/shared/user/user.service';

@Injectable()
export class UserAdminService extends UserService {
  async updateStatusOfUser(userId: string, isActive: boolean) {
    const user = await GetUserQuery.getUserById(userId);

    if (user.isActive === isActive) {
      throw new BadGatewayException('User is in status.');
    }

    user.isActive = isActive;

    return await User.save(user);
  }
}
