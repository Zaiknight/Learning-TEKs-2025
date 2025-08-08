import { PaymentStrategy } from "../PaymentStrategy";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-07-30.basil", 
});

export class StripeStrategy implements PaymentStrategy {
  async createPayment(orderData: any): Promise<{ paymentUrl: string }> {
    if (!Array.isArray(orderData.cartItems)) {
      throw new Error("cartItems must be an array.");
    }
    const lineItems = orderData.cartItems.map((item: any) => ({
      price_data: {
        currency: orderData.currency || "pkr",
        product_data: {
          name: item.product.name,
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/",
      cancel_url: "http://localhost:3000/#contact",
      customer_email: orderData.email,
      metadata: {
        orderId: orderData.orderId,
      },
    });

    return { paymentUrl: session.url || "" };
  }

  async handleWebhook(req: any, res: any): Promise<void> {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body, 
        sig!,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (err: any) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // if (event.type === "checkout.session.completed") {
    //   const session = event.data.object as Stripe.Checkout.Session;
      
      
    // }

    res.json({ received: true });
  }

  async verifyPayment(paymentId: string): Promise<{ paid: boolean; details?: any }> {
    const session = await stripe.checkout.sessions.retrieve(paymentId);
    const paid = session.payment_status === "paid";
    return { paid, details: session };
  }
}