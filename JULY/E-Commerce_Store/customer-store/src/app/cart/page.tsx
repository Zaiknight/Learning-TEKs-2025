"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Header } from "@/components/Landing/header";

const cartItems = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 129.99,
    image: "/images/headphones.jpg",
    quantity: 1,
  },
  {
    id: 2,
    name: "Smartphone Stand",
    price: 19.99,
    image: "/images/stand.jpg",
    quantity: 2,
  },
];

export default function CartPage() {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
  <>
    <Header/>
      <main className="min-h-screen flex flex-col items-center bg-background px-4 py-12">
        <div className="w-full max-w-2xl bg-card rounded-xl shadow p-8 border">
          <h1 className="text-2xl font-bold text-primary mb-2 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Your Cart
          </h1>
          {cartItems.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              Your cart is empty.
              <Link href="#products" className="block mt-4 text-primary hover:underline">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-muted mb-8">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex items-center gap-4 py-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </div>
                    </div>
                    <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-bold text-primary text-xl">${total.toFixed(2)}</span>
              </div>
              <Button size="lg" className="w-full">
                Proceed to Checkout
              </Button>
            </>
          )}
        </div>
      </main>
    </>
  );
}