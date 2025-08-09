"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Address, CartItem, UserSummary } from "@/types/commerce";
import { PaymentMethod, PAYMENT_METHODS } from "@/constants/payment";
import {
  addOrderItems,
  clearServerCart,
  createOrder,
  createStripeSession,
  saveAddress,
} from "@/services/checkoutApi";
import { validateCheckout, CheckoutErrors } from "@/utils/checkoutValidation";

export function useCheckout(params: {
  user: UserSummary;
  cartId: number | null;
  cartItems: CartItem[];
  setCart: (v: any) => void;
}) {
  const router = useRouter();

  // Form state
  const [email, setEmail] = useState("");
  const [newsAndOffers, setNewsAndOffers] = useState(true);
  const [country] = useState("Pakistan");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);
  const [payment, setPayment] = useState<PaymentMethod>(PAYMENT_METHODS.COD);

  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const address: Address = {
    address1,
    address2,
    city,
    country,
    postalCode,
    phone,
    firstName,
    lastName,
  };

  const subtotal = params.cartItems.reduce(
    (sum, item) => sum + (item.product.price || 0) * item.quantity,
    0
  );
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  function validateOrSetErrors(): boolean {
    const errs = validateCheckout({ email, address, payment });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function createOrderAndAttach(): Promise<number> {
    const res = await createOrder({
      userId: params.user?.id,
      email,
      paymentMethod: payment,
    });
    const orderId = res?.data?.id;
    if (!orderId) throw new Error("Order ID not returned.");

    await saveAddress({
      userId: params.user?.id,
      email,
      orderId,
      address, 
    });

    await addOrderItems({ orderId, cartItems: params.cartItems });
    return orderId;
  }

  async function clearLocalCart() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
    params.setCart({});
  }

  // COD flow
  async function handleCODSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    if (!validateOrSetErrors()) return;

    setSubmitting(true);
    try {
      await createOrderAndAttach();

      // Clear cart for COD immediately after order confirmation
      if (params.user?.id && params.cartId) {
        await clearServerCart(params.cartId);
      } else {
        await clearLocalCart();
      }

      setOrderPlaced(true);
      setTimeout(() => router.push("/"), 5000);
    } catch (err: any) {
      setErrors({ general: err.message || "Unexpected error occurred." });
    } finally {
      setSubmitting(false);
    }
  }

  // Stripe flow (do NOT clear cart here; clear on success webhook or success page)
  async function handleStripeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    if (!validateOrSetErrors()) return;

    setSubmitting(true);
    try {
      const orderId = await createOrderAndAttach();

      const { paymentUrl } = await createStripeSession({
        orderId,
        email,
        cartItems: params.cartItems,
        total,
        address,
      });
      window.location.href = paymentUrl;
    } catch (err: any) {
      setErrors({ general: err.message || "Stripe payment failed." });
    } finally {
      setSubmitting(false);
    }
  }

  return {
    // state
    email,
    newsAndOffers,
    country,
    firstName,
    lastName,
    address1,
    address2,
    city,
    postalCode,
    phone,
    saveInfo,
    payment,
    errors,
    submitting,
    orderPlaced,

    // derived
    subtotal,
    shippingFee,
    total,

    // setters
    setEmail,
    setNewsAndOffers,
    setFirstName,
    setLastName,
    setAddress1,
    setAddress2,
    setCity,
    setPostalCode,
    setPhone,
    setSaveInfo,
    setPayment,

    // handlers
    handleCODSubmit,
    handleStripeSubmit,
  };
}