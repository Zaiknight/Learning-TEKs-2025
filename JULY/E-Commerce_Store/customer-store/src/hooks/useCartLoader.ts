"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/constants/env";
import { CartItem, Product, UserSummary } from "@/types/commerce";
import { getAuthMe, getCartItems, getProduct, getUserCart } from "@/services/checkoutApi";
import { useCartContext } from "@/context/CartContext";

export function useCartLoader() {
  const { cart, setCart } = useCartContext();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<UserSummary>(null);
  const [cartId, setCartId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function run() {
      setLoading(true);
      try {
        const authData = await getAuthMe().catch(() => ({} as any));
        if (authData?.user?.id) {
          setUser(authData.user);
          const cartRes = await getUserCart(authData.user.id).catch(() => ({} as any));
          const serverCartId = cartRes?.data?.id ?? null;
          setCartId(serverCartId);
          if (serverCartId) {
            const itemsRes = await getCartItems(serverCartId).catch(() => ({} as any));
            const items = Array.isArray(itemsRes?.data) ? itemsRes!.data : [];
            const detailed = await Promise.all(
              items.map(async (it:any) => {
                const prodRes = await getProduct(it.product_id).catch(() => ({} as any));
                const prod = prodRes?.data as Product | undefined;
                if (!prod) return null;
                return {
                  product: {
                    ...prod,
                    image_url: prod.image_url
                      ? prod.image_url
                      : (prod as any).img_name
                      ? `${API_BASE_URL}/upload/${(prod as any).img_name}`
                      : "/placeholder.png",
                  },
                  quantity: it.quantity,
                } as CartItem;
              })
            );
            setCartItems(detailed.filter(Boolean) as CartItem[]);
            setLoading(false);
            return;
          }
          setCartItems([]);
          setLoading(false);
        } else {
          setUser(null);
          setCartId(null);
          // Guest cart from context/local storage
          setCartItems(
            Object.values(cart).map((x: any) => ({
              product: {
                ...x.product,
                image_url: x.product.image_url || x.product.image || "/placeholder.png",
              },
              quantity: x.quantity,
            }))
          );
          setLoading(false);
        }
      } catch {
        setCartItems([]);
        setLoading(false);
      }
    }
    run();
  }, [cart, setCart]);

  return { cartItems, setCartItems, user, cartId, loading, setLoading, setCart };
}