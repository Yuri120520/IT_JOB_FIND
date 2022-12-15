import { Module } from '@nestjs/common';

import { StripeResolver } from './stripe.resolver';
import { StripeService } from './stripe.service';

@Module({
  providers: [StripeResolver, StripeService],
  exports: [StripeService]
})
export class StripeModule {}
