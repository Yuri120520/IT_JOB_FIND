import { Module } from '@nestjs/common';

import { AuthClientResolver } from './auth.resolver';
import { AuthClientService } from './auth.service';

import { UserModule } from '@/main/client/user/user.module';
import { AuthService } from '@/main/shared/auth/auth.service';

@Module({
  imports: [UserModule],
  providers: [AuthClientResolver, AuthClientService, AuthService]
})
export class AuthClientModule {}
