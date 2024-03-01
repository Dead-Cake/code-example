export interface IPaymentProcessing {
  id: string;
  payment_status: string;
  status: string;
  metadata: {
    internalStripePaymentId: string;
  },
  payment_intent: string;
}
