/* eslint-disable @typescript-eslint/naming-convention */
export const WEBHOOK_EVENT_TYPE = {
  CHECKOUT_SESSION: {
    ASYNC_PAYMENT_FAILED: 'checkout.session.async_payment_failed',
    ASYNC_PAYMENT_SUCCEEDED: 'checkout.session.async_payment_succeeded',
    COMPLETED: 'checkout.session.completed',
    EXPIRED: 'checkout.session.expired'
  }
};
