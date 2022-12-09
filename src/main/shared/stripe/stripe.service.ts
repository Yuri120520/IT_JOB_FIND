/* eslint-disable no-param-reassign */
import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';

import { GetUserQuery } from '../user/query/getUser.query';
import { checkoutSessionEventHandler } from './command/checkoutSessionEvent.handler';
import { WEBHOOK_EVENT_TYPE } from './common/constant';
import { CreateStripeCheckoutSessionDto } from './dto';
import { CreateStripeCheckoutResponse, RequestWithRawBody } from './interface';

import { Job, JobStatus, PostInterval } from '@/db/entities/Job';
import { JobClientService } from '@/main/client/job/job.service';
import { emailService } from '@/services/smtp/services';
import { StripeAdapter } from '@/services/stripe';

@Injectable()
export class StripeService {
  private stripeAdapter: StripeAdapter;

  constructor() {
    this.stripeAdapter = new StripeAdapter();
  }

  public constructEventFromPayload(signature: string, payload: Buffer) {
    return this.stripeAdapter.constructEvent(signature, payload);
  }
  public async handleStripeWebhook(signature: string, request: RequestWithRawBody) {
    console.log('first', signature);
    if (!signature) {
      return {
        statusCode: 500,
        message: 'Missing stripe-signature header'
      };
    }
    try {
      const event: any = this.constructEventFromPayload(signature, request.body);

      // Handle the event
      switch (event.type) {
        case WEBHOOK_EVENT_TYPE.CHECKOUT_SESSION.ASYNC_PAYMENT_SUCCEEDED:
        case WEBHOOK_EVENT_TYPE.CHECKOUT_SESSION.COMPLETED: {
          await checkoutSessionEventHandler.handleCompleted(event);
          break;
        }
        case WEBHOOK_EVENT_TYPE.CHECKOUT_SESSION.ASYNC_PAYMENT_FAILED:
        case WEBHOOK_EVENT_TYPE.CHECKOUT_SESSION.EXPIRED: {
          await checkoutSessionEventHandler.handleFailed(event);
          break;
        }
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      return {
        statusCode: 200,
        message: JSON.stringify({
          received: true
        })
      };
    } catch (error) {
      //TODO: Add sentry logger for new error here
      return {
        statusCode: 500,
        message: `Webhook Error: ${error.message}`
      };
    }
  }

  public async createStripeCheckoutSession(
    userId: string,
    input: CreateStripeCheckoutSessionDto
  ): Promise<CreateStripeCheckoutResponse> {
    return await getManager().transaction(async transaction => {
      let job: Job;
      const {
        data: { postInterval },
        cancelUrl,
        successUrl
      } = input;
      const user = await GetUserQuery.getUserById(userId, true, transaction, ['role', 'company', 'company.user']);
      const jobs = await transaction.getRepository(Job).find({ companyId: user.company.id });
      if (postInterval === PostInterval.MONTH && jobs.length < 3) {
        input.data.status = JobStatus.OPEN;
        job = await JobClientService.upsertJob(userId, input.data, transaction);

        await emailService.sendEmailPostJobSuccessFully(user.company, job);

        return { paymentUrl: `${successUrl}/${job.id}` };
      }
      input.data.status = JobStatus.DRAFT;
      job = await JobClientService.upsertJob(userId, input.data, transaction);

      const stripeCheckoutSession = await this.stripeAdapter.createCheckoutSession({ job, successUrl, cancelUrl });
      job.paymentUrl = stripeCheckoutSession.url;
      await transaction.getRepository(Job).save(job);
      return { paymentUrl: stripeCheckoutSession.url };
    });
  }
}
