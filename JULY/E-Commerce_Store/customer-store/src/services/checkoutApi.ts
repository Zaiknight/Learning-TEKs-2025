import { API_BASE_URL } from "@/constants/env";
import { CartItem, Address, UserSummary } from "@/types/commerce";
import { jsonFetch } from "./apiClient";
import { PaymentMethod } from "@/constants/payment";

// Auth
export async function getAuthMe(): Promise<{ user?: { id: number; email: string } }> {
  return jsonFetch("/api/auth/me", { credentials: "include" });
}

// Cart (server-side)
export async function getUserCart(userId: number) {
  return jsonFetch<{ data?: { id?: number } }>(`${API_BASE_URL}/cart/${userId}`);
}

export async function getCartItems(cartId: number) {
  return jsonFetch<{ data?: Array<{ product_id: number; quantity: number }> }>(
    `${API_BASE_URL}/cartItem/${cartId}`
  );
}

export async function getProduct(productId: number) {
  return jsonFetch<{ data?: any }>(`${API_BASE_URL}/products/${productId}`);
}

export async function createOrder(params: {
  userId?: number;
  email: string;
  paymentMethod: PaymentMethod | string | null;
}) {
  const body = params.userId
    ? {
        user_id: params.userId,
        user_email: params.email,
        status: "pending",
        payment_method: params.paymentMethod,
      }
    : {
        user_email: params.email,
        status: "pending",
        payment_method: params.paymentMethod,
      };

  const url = params.userId
    ? "/api/checkout/order"
    : "/api/checkout/guestOrder";

  return jsonFetch<{ data?: { id?: number } }>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function saveAddress(params: {
  userId?: number;
  email: string;
  orderId: number;
  address: Address;
}) {
  const payload = {
    user_id: params.userId,
    address_1: params.address.address1,
    address_2: params.address.address2,
    province: params.address.city,
    country: params.address.country,
    contact: params.address.phone,
    user_email: params.email,
    order_id: params.orderId,
  };
  return jsonFetch("/api/checkout/address", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function addOrderItems(params: {
  orderId: number;
  cartItems: CartItem[];
}) {
  // Keep as multiple calls for now, but in parallel to reduce latency
  await Promise.all(
    params.cartItems.map((item) =>
      jsonFetch("/api/checkout/orderItems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: params.orderId,
          product_id: item.product.id,
          quantity: item.quantity,
        }),
      })
    )
  );
}

export async function clearServerCart(cartId: number) {
  return jsonFetch(`http://localhost:5000/cartItem/empty/${cartId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}

// Stripe
export async function createStripeSession(params: {
  orderId: number;
  email: string;
  cartItems: CartItem[];
  total: number;
  address: Address;
}) {
  return jsonFetch<{ paymentUrl: string }>(`http://localhost:5000/checkout/stripe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderId: params.orderId,
      orderData: {
        email: params.email,
        cartItems: params.cartItems,
        total: params.total,
        address: {
          address1: params.address.address1,
          address2: params.address.address2,
          city: params.address.city,
          country: params.address.country,
          postalCode: params.address.postalCode,
          phone: params.address.phone,
          firstName: params.address.firstName,
          lastName: params.address.lastName,
        },
      },
    }),
  });
}
