import { Router } from "express";
import { getPaymentStrategy } from "../payments/PaymentStrategyFactory";

const router = Router();
router.post("/stripe", async (req, res) => {
//   try {
    const { orderData } = req.body;
    const strategy = getPaymentStrategy("stripe");
    const { paymentUrl } = await strategy.createPayment({ ...orderData});
    res.json({ paymentUrl });
//   } catch (err) {
//     console.error("Stripe payment error:", err);
//     res.status(500).json({ error: "Could not create Stripe payment." });
//   }
});

export default router;