import { PaymentStrategy } from "../PaymentStrategy";

export class CODStrategy implements PaymentStrategy {
  async createPayment(): Promise<{ paymentUrl: string }> {
    return { paymentUrl: "/order-confirmation?method=cod" };
  }
}