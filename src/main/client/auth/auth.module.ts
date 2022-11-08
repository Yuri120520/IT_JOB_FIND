import { Module } from '@nestjs/common';

import { AuthClientResolver } from './auth.resolver';
import { AuthClientService } from './auth.service';

import { AuthService } from '@/main/shared/auth/auth.service';
import { UserModule } from '@/main/shared/user/user.module';

@Module({
  imports: [UserModule],
  providers: [AuthClientResolver, AuthClientService, AuthService]
})
export class AuthClientModule {}
