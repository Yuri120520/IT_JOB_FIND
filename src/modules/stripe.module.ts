import { Module } from '@nestjs/common';

import StripeWebhookController from '@/main/shared/stripe/stripe.controller';
import { StripeService } from '@/main/shared/stripe/stripe.service';

@Module({
  controllers: [StripeWebhookController],
  providers: [StripeService]
})
export class StripeWebHookModule {}
