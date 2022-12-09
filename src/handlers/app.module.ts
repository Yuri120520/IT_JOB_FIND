import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { configuration } from '@/config';
import { AdminModule } from '@/main/admin/admin.module';
import { ClientModule } from '@/main/client/client.module';
import { DatabaseModule } from '@/modules/database.module';
import { I18n_Module } from '@/modules/i18n.module';
import { StripeWebHookModule } from '@/modules/stripe.module';
import { JwtStrategy } from '@/providers/strategies/jwt.strategy';

@Module({
  imports: [
    DatabaseModule,
    I18n_Module,
    AdminModule,
    ClientModule,
    StripeWebHookModule,
    JwtModule.register({
      secret: configuration.jwt.secretKey,
      signOptions: { expiresIn: configuration.jwt.expiredIn }
    })
  ],
  providers: [JwtStrategy]
})
export class AppModule {}
