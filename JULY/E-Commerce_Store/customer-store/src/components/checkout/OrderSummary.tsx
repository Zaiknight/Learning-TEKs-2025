"use client";

import Image from "next/image";
import { CartItem } from "@/types/commerce";

export function OrderSummary(props: {
  loading: boolean;
  cartItems: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
}) {
  const { loading, cartItems, subtotal, shippingFee, total } = props;

  return (
    <section className="mb-3">
      <h2 className="text-lg font-bold mb-2 px-2">Order summary</h2>
      <hr />
      <div className="border-b py-4 mb-4">
        {loading ? (
          <div className="text-center py-4 text-muted-foreground">
            Loading cart...
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.product.id} className="flex items-center gap-3 mb-3">
              <Image
                src={
                  item.product.image_url ||
                  item.product.image ||
                  "/placeholder.png"
                }
                alt={item.product.name}
                width={50}
                height={50}
                className="rounded border"
              />
              <div className="flex-1">
                <div className="font-medium">{item.product.name}</div>
              </div>
              <div className="font-bold">
                Rs {(item.product.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex justify-between py-1">
        <span>Subtotal</span>
        <span>Rs {subtotal.toLocaleString()}</span>
      </div>
      <div className="flex justify-between py-2">
        <span>Shipping</span>
        <span>Rs {shippingFee.toLocaleString()}</span>
      </div>
      <div className="flex justify-between py-2 font-bold text-lg">
        <span>Total</span>
        <span>PKR Rs {total.toLocaleString()}</span>
      </div>
    </section>
  );
}