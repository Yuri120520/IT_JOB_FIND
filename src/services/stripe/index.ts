/* eslint-disable @typescript-eslint/naming-convention */
import { Stripe } from 'stripe';

import { POST_INTERVAL_COST } from './../../common/constant';
import { CheckoutSessionMetadata } from './interface';

import { configuration } from '@/config';
import { Job } from '@/db/entities/Job';

export class StripeAdapter {
  readonly stripe: Stripe;
  private readonly endpointSecret: string;

  constructor() {
    this.stripe = new Stripe(configuration.stripe.stripeSecretKey, {
      apiVersion: '2020-08-27',
      typescript: true
    });
    this.endpointSecret = configuration.stripe.endpointSecret;
  }

  public async createCheckoutSession({
    job,
    cancelUrl,
    successUrl
  }: {
    job: Job;
    cancelUrl: string;
    successUrl: string;
  }): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    console.log(POST_INTERVAL_COST[`${job.postInterval}`]);
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: 'usd',
          unit_amount: POST_INTERVAL_COST[`${job.postInterval}`] * 100,
          product_data: {
            name: `${job.postInterval} post interval`,
            description: `${job.postInterval} post interval`,
            images: ['https://it-job-find-bucket.s3.ap-southeast-1.amazonaws.com/Public/4359919.png']
          }
        },
        quantity: 1
      }
    ];
    const metadata: CheckoutSessionMetadata = { jobId: job.id };
    return await this.stripe.checkout.sessions.create({
      success_url: `${successUrl}/${job.id}`,
      cancel_url: cancelUrl,
      line_items: lineItems,
      mode: 'payment',
      metadata: metadata as unknown as Stripe.MetadataParam,
      expires_at: Math.round(Date.now() / 1000) + 1800
    });
  }

  public constructEvent(signature: string, payload: Buffer) {
    return this.stripe.webhooks.constructEvent(payload, signature, this.endpointSecret);
  }

  public async expireStripeCheckoutSession(stripeSessionId: string): Promise<void> {
    try {
      await this.stripe.checkout.sessions.expire(stripeSessionId);
    } catch (error) {
      console.log('Expire stripe: ', error);
      return;
    }
  }
}

export const stripeAdapter = new StripeAdapter();
