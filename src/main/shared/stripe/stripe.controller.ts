import { Controller, Headers, HttpCode, Post, Req } from '@nestjs/common';

import { RequestWithRawBody } from './interface';

import { StripeService } from '@/main/shared/stripe/stripe.service';

@Controller('stripe-webhooks')
export default class StripeWebhookController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('/checkout')
  @HttpCode(200)
  async handleStripeConnectedAccountEvents(
    @Headers('stripe-signature') signature: string,
    @Req() request: RequestWithRawBody
  ) {
    return this.stripeService.handleStripeWebhook(signature, request);
  }
}
