import Stripe from 'stripe';
import { getManager } from 'typeorm';

import { JobService } from '../../job/job.service';

import { Job, JobStatus } from '@/db/entities/Job';
import { emailService } from '@/services/smtp/services';

class CheckoutSessionEventHandler {
  async handleFailed(event: Stripe.Event, transaction = getManager()) {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;

    try {
      const job = await JobService.getOneById(checkoutSession.metadata.jobId, transaction, true, [
        'company',
        'company.user'
      ]);
      await transaction.getRepository(Job).createQueryBuilder().delete().where({ id: job.id }).execute();

      await emailService.sendEmailPostJobFail(job.company);
    } catch (error) {
      console.log('Error: handle event checkout session fail:', error);
      return;
    }
  }

  async handleCompleted(event: Stripe.Event, transaction = getManager()) {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    try {
      const job = await JobService.getOneById(checkoutSession.metadata.jobId, transaction, true, [
        'company',
        'company.user'
      ]);

      await transaction
        .getRepository(Job)
        .createQueryBuilder()
        .update()
        .set({ status: JobStatus.OPEN })
        .where({ id: job.id })
        .execute();

      await emailService.sendEmailPostJobSuccessFully(job.company, job);
    } catch (error) {
      console.log('Error: handle event checkout session fail:', error);
      return;
    }
  }
}

export const checkoutSessionEventHandler = new CheckoutSessionEventHandler();
