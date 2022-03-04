import { RefundModel } from '../payment-processor.model';
import { convertAmountToFintech } from '../payment-processor.utils';

export class CreateRefund {
  id!: string;
  amount?: number;
  reason?: string;

  constructor(refundData: RefundModel) {
    const { id, amount, reason } = refundData;
    if (amount) {
      this.amount = convertAmountToFintech(Number(amount));
    }

    this.id = id;
    if (reason) {
      this.reason = reason;
    }
  }

  paystack() {
    const refund = {};
    if (this.amount) {
      Object.assign(refund, { ...refund, amount: this.amount });
    }

    if (this.reason) {
      Object.assign(refund, {
        ...refund,
        customer_note: this.reason,
        merchant_note: this.reason,
      });
    }
    return {
      transaction: this.id,
      ...refund,
    };
  }

  stripe() {
    const refund = {};
    if (this.amount) {
      Object.assign(refund, { ...refund, amount: this.amount });
    }

    if (this.reason) {
      Object.assign(refund, { ...refund, reason: this.reason });
    }
    return {
      charge: this.id,
      ...refund,
    };
  }
}
