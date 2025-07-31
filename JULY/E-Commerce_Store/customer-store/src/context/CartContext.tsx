"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Product = {
  id: number | string;
  name: string;
  price: number;
  image_url?: string;
  image?: string;
  stock?: number;
  [key: string]: any;
};
type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  cart: { [id: string]: CartItem };
  setCart: React.Dispatch<React.SetStateAction<{ [id: string]: CartItem }>>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used inside CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<{ [id: string]: CartItem }>({});

  async function refreshCart() {
    if (typeof window !== "undefined") {
      const cartLS = window.localStorage.getItem("cart");
      setCart(cartLS ? JSON.parse(cartLS) : {});
    }
  }

  useEffect(() => {
    refreshCart();
    window.addEventListener("storage", refreshCart);
    return () => window.removeEventListener("storage", refreshCart);
  }, []);

  return (
    <CartContext.Provider value={{ cart, setCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}