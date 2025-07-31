"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Header } from "@/components/Landing/header";
import { FeaturedProducts } from "@/components/Landing/productShowcase";

type CartItem = {
  id: number | string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  stock?: number;
};

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: number } | null>(null);

  // Fetch user and cart
  useEffect(() => {
    async function fetchCart() {
      setLoading(true);
      try {
        // Check if user is logged in
        const authRes = await fetch("/api/auth/me", { credentials: "include" });
        const authData = await authRes.json();
        if (authRes.ok && authData.user) {
          setUser(authData.user);
          // Logged in: get cart id
          const cartRes = await fetch(`${API_BASE_URL}/cart/${authData.user.id}`);
          if (cartRes.ok) {
            const cartData = await cartRes.json();
            const cartId = cartData?.data?.id;
            if (cartId) {
              // Get cart items
              const cartItemRes = await fetch(`${API_BASE_URL}/cartItem/${cartId}`);
              if (cartItemRes.ok) {
                const cartItemData = await cartItemRes.json();
                const items: any[] = Array.isArray(cartItemData.data) ? cartItemData.data : [];
                // Now fetch product details in parallel
                const detailed = await Promise.all(
                  items.map(async (item) => {
                    const prodRes = await fetch(`${API_BASE_URL}/products/${item.product_id}`);
                    if (!prodRes.ok) return null;
                    const prodData = await prodRes.json();
                    const prod = prodData?.data;
                    if (!prod) return null;
                    return {
                      id: prod.id,
                      name: prod.name,
                      price: prod.price,
                      image_url: prod.image_url
                        ? prod.image_url
                        : prod.img_name
                        ? `${API_BASE_URL}/upload/${prod.img_name}`
                        : "/placeholder.png",
                      quantity: item.quantity,
                      stock: prod.stock,
                      cartItemId: item.id, // cartItem row id for backend PATCH/DELETE
                    };
                  })
                );
                setCartItems(detailed.filter(Boolean) as CartItem[]);
                setLoading(false);
                return;
              }
            }
          }
          setCartItems([]);
          setLoading(false);
        } else {
          setUser(null);
          // Not logged in: use localStorage
          if (typeof window !== "undefined") {
            const cartLS = window.localStorage.getItem("cart");
            if (cartLS) {
              const cartObj = JSON.parse(cartLS) as {
                [id: string]: { product: any; quantity: number };
              };
              const localItems = Object.values(cartObj).map((x) => ({
                id: x.product.id,
                name: x.product.name,
                price: x.product.price,
                image_url: x.product.image || "/placeholder.png",
                quantity: x.quantity,
                stock: x.product.stock,
              }));
              setCartItems(localItems);
            } else {
              setCartItems([]);
            }
          }
          setLoading(false);
        }
      } catch {
        setCartItems([]);
        setLoading(false);
      }
    }
    fetchCart();
  }, []);

  const handleAddQuantity = async (idx: number, newQty: number) => {
    if (newQty < 1) return;
    const item = cartItems[idx];
    // For logged-in users: PATCH backend
    if (user) {
      const id = (item as any).cartItemId;
      const res = await fetch(`${API_BASE_URL}/cartItem/add/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id ,quantity: newQty }),
      });
      if (res.ok) {
        setCartItems((old) =>
          old.map((c, i) => (i === idx ? { ...c, quantity: newQty } : c))
        );
      }
    } else {
      // Guests: update localStorage
      if (typeof window !== "undefined") {
        const cartLS = window.localStorage.getItem("cart");
        if (cartLS) {
          const cartObj = JSON.parse(cartLS);
          if (cartObj[item.id]) {
            cartObj[item.id].quantity = newQty;
            window.localStorage.setItem("cart", JSON.stringify(cartObj));
            setCartItems((old) =>
              old.map((c, i) => (i === idx ? { ...c, quantity: newQty } : c))
            );
          }
        }
      }
    }
  };

  const handleSubQuantity = async (idx: number, newQty: number) => {
    if (newQty < 1) return;
    const item = cartItems[idx];
    // For logged-in users: PATCH backend
    if (user) {
      const id = (item as any).cartItemId;
      const res = await fetch(`${API_BASE_URL}/cartItem/sub/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id ,quantity: newQty }),
      });
      if (res.ok) {
        setCartItems((old) =>
          old.map((c, i) => (i === idx ? { ...c, quantity: newQty } : c))
        );
      }
    } else {
      // Guests: update localStorage
      if (typeof window !== "undefined") {
        const cartLS = window.localStorage.getItem("cart");
        if (cartLS) {
          const cartObj = JSON.parse(cartLS);
          if (cartObj[item.id]) {
            cartObj[item.id].quantity = newQty;
            window.localStorage.setItem("cart", JSON.stringify(cartObj));
            setCartItems((old) =>
              old.map((c, i) => (i === idx ? { ...c, quantity: newQty } : c))
            );
          }
        }
      }
    }
  };

  // Remove item for localStorage and backend
  const handleRemove = async (idx: number) => {
    const item = cartItems[idx];
    if (user) {
      const cartItemId = (item as any).cartItemId;
      await fetch(`${API_BASE_URL}/cartItem/${cartItemId}`, {
        method: "DELETE",
      });
      setCartItems((old) => old.filter((_, i) => i !== idx));
    } else {
      if (typeof window !== "undefined") {
        const cartLS = window.localStorage.getItem("cart");
        if (cartLS) {
          const cartObj = JSON.parse(cartLS);
          delete cartObj[item.id];
          window.localStorage.setItem("cart", JSON.stringify(cartObj));
          setCartItems((old) => old.filter((_, i) => i !== idx));
        }
      }
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col items-center bg-background px-4 py-12">
        <div className="w-full max-w-2xl bg-card rounded-xl shadow p-8 border">
          <h1 className="text-2xl font-bold text-primary mb-2 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Your Cart
          </h1>
          {loading ? (
            <div className="text-center text-muted-foreground py-12">
              Loading your cart...
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              Your cart is empty.
              <Link href="/categories" className="block mt-4 text-primary hover:underline">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-muted mb-8">
                {cartItems.map((item, idx) => (
                  <li key={item.id} className="flex items-center gap-4 py-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      {/* Quantity modifier UI */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border rounded px-2 py-1" style={{minWidth: 80}}>
                          <button
                            aria-label="Decrease quantity"
                            className="text-lg px-2 text-muted-foreground hover:text-primary cursor-pointer"
                            onClick={() => handleSubQuantity(idx, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                          >-</button>
                          <span className="mx-2 w-4 text-center">{item.quantity}</span>
                          <button
                            aria-label="Increase quantity"
                            className="text-lg px-2 text-muted-foreground hover:text-primary cursor-pointer"
                            onClick={() =>
                              handleAddQuantity(
                                idx,
                                Math.min(item.stock || 99, item.quantity + 1)
                              )
                            }
                            disabled={item.stock !== undefined && item.quantity >= item.stock}
                          >+</button>
                        </div>
                        <button
                          className="ml-4 text-sm underline text-muted-foreground hover:text-red-600 cursor-pointer"
                          onClick={() => handleRemove(idx)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="font-semibold">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-bold text-primary text-xl">
                  Rs. {total.toLocaleString()}
                </span>
              </div>
              <Button size="lg" className="w-full cursor-pointer">
                Proceed to Checkout
              </Button>
            </>
          )}
        </div>
        < FeaturedProducts />
      </main>
    </>
  );
}