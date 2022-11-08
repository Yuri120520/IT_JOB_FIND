import { Module } from '@nestjs/common';

import { UserAdminResolver } from './user.resolver';
import { UserAdminService } from './user.service';

import { UserModule } from '@/main/shared/user/user.module';
import { UserResolver } from '@/main/shared/user/user.resolver';

@Module({
  providers: [UserAdminResolver, UserAdminService, UserResolver],
  imports: [UserModule]
})
export class UserAdminModule {}
