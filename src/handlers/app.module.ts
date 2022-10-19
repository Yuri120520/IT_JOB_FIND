import { configuration } from '@/config';
import { DatabaseModule } from '@/modules/database.module';
import { JwtStrategy } from '@/providers/strategies/jwt.strategy';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: configuration.jwt.secretKey,
      signOptions: { expiresIn: configuration.jwt.expiredIn }
    })
  ],
  providers: [JwtStrategy]
})
export class AppModule {}
