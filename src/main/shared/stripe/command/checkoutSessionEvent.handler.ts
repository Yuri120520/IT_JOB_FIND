import Stripe from 'stripe';
import { getManager } from 'typeorm';

import { Job, JobStatus } from '@/db/entities/Job';

class CheckoutSessionEventHandler {
  async handleFailed(event: Stripe.Event, transaction = getManager()) {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;

    try {
      await transaction
        .getRepository(Job)
        .createQueryBuilder()
        .delete()
        .where({ id: checkoutSession.metadata.jobId })
        .execute();
      // send email
    } catch (error) {
      console.log('Error: handle event checkout session fail:', error);
      return;
    }
  }

  async handleCompleted(event: Stripe.Event, transaction = getManager()) {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    try {
      await transaction
        .getRepository(Job)
        .createQueryBuilder()
        .update()
        .set({ status: JobStatus.OPEN })
        .where({ id: checkoutSession.metadata.jobId })
        .execute();
      //send Email
    } catch (error) {
      console.log('Error: handle event checkout session fail:', error);
      return;
    }
  }
}

export const checkoutSessionEventHandler = new CheckoutSessionEventHandler();
