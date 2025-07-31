"use client";
import { useState } from "react";

type User = { id: number; name: string; email: string };
type CartItem = { id: number; cart_id: number; product_id: number; quantity: number };
type Product = { id: number; name: string; price: number; [key: string]: any };

const API_URL = process.env.API_BASE_URL || "http://localhost:5000";

export function useCart() {
  const [user, setUser] = useState<User | null>(null);

  // Fetch currently logged in user
  async function fetchUser() {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        return data.user as User;
      } else {
        setUser(null);
        return null;
      }
    } catch (err) {
      setUser(null);
      return null;
    }
  }

  // Get cart ID for the logged-in user
  async function getCartID(): Promise<number | null> {
    // Always ensure user is loaded
    const currentUser = user || (await fetchUser());
    const user_id = currentUser?.id;
    if (!user_id) {
      return null;
    }
    try {
      const res = await fetch(`${API_URL}/cart/${user_id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) return null;
      const cart_data = await res.json();
      const cart_id = cart_data?.data?.id;
      return cart_id ?? null;
    } catch {
      return null;
    }
  }

  async function getCartItems(): Promise<CartItem[]> {
    const cart_id = await getCartID();
    if (!cart_id) return [];
    try {
      const res = await fetch(`${API_URL}/cartItem/${cart_id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data.data) ? data.data : [];
    } catch {
      return [];
    }
  }

  // Get all product details in the cart
  async function getCartProducts(): Promise<(Product & { quantity: number })[]> {
    const items = await getCartItems();
    if (!items.length) return [];
    // Fetch all products in parallel
    const products = await Promise.all(
      items.map(async (item) => {
        try {
          const res = await fetch(`${API_URL}/products/${item.product_id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          if (!res.ok) return null;
          const data = await res.json();
          // Adjust according to your product API structure
          if (data?.data) {
            return { ...data.data, quantity: item.quantity };
          }
          return null;
        } catch {
          return null;
        }
      })
    );
    // Filter out failed fetches
    return products.filter(Boolean) as (Product & { quantity: number })[];
  }

  return {
    user,
    fetchUser,
    getCartID,
    getCartItems,
    getCartProducts,
  };
}