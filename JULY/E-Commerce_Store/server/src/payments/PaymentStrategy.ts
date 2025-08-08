export interface PaymentStrategy {
    createPayment(orderData ?: any): Promise<{ paymentUrl: string }>;
    handleWebhook?(req: any, res: any): Promise<void>;
    verifyPayment?(paymentId: string): Promise<{ paid: boolean; details?: any }>;
  }