"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Header } from "@/components/Landing/header";
import { Footer } from "@/components/Landing/footer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";

const API_BASE_URL = "http://localhost:5000";

type Order = {
  id: number;
  user_id: number;
  user_email: string;
  created_at: string;
  updated_at: string;
  status: string;
  payment_method: string;
  payment_status: string;
};

type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  image_url?: string;
};

export default function MyOrdersPage() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<{ [orderId: number]: OrderItem[] }>({});
  const [itemLoading, setItemLoading] = useState<{ [orderId: number]: boolean }>({});

  useEffect(() => {
    async function fetchUserAndOrders() {
      setLoading(true);
      try {
        const authRes = await fetch("/api/auth/me", { credentials: "include" });
        const authData = await authRes.json();
        if (authRes.ok && authData.user && authData.user.email) {
          setUser(authData.user);
          const ordersRes = await fetch(
            `/api/orders?email=${encodeURIComponent(authData.user.email)}`,
            { credentials: "include" }
          );
          const ordersData = await ordersRes.json();
          let result: Order[] = [];
          if (Array.isArray(ordersData.data)) {
            result = ordersData.data;
          } else if (ordersData.data) {
            result = [ordersData.data];
          } else {
            result = [];
          }
          setOrders(result);
        } else {
          setUser(null);
          setOrders([]);
        }
      } catch (err) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUserAndOrders();
  }, []);

  // Fetch order items when dropdown is expanded
  async function handleExpand(orderId: number, index: number) {
    if (expandedIndex === index) {
      setExpandedIndex(null);
      return;
    }
    setExpandedIndex(index);
    if (!orderItems[orderId]) {
      setItemLoading((prev) => ({ ...prev, [orderId]: true }));
      try {
        const res = await fetch(`/api/orders/orderItems?order_id=${orderId}`, {
          credentials: "include",
        });
        const data = await res.json();
        let items: OrderItem[] = [];
        if (Array.isArray(data.data)) {
          items = data.data;
        } else if (data.data) {
          items = [data.data];
        }
        // Fetch product info for each order item in parallel and build enriched items
        const enrichedItems = await Promise.all(
          items.map(async (item) => {
            try {
              const productUrl = `${API_BASE_URL}/products/${item.product_id}`;
              console.log("Fetching product:", productUrl);
              const prodRes = await fetch(productUrl);
              console.log("Product response status:", prodRes.status);
              if (!prodRes.ok) return {
                ...item,
                price: typeof item.price === "number" ? item.price : 0,
                product_name: item.product_name || "N/A",
                image_url: "/placeholder.png"
              };
              const prodData = await prodRes.json();
              console.log("Product data:", prodData);
              const prod = prodData?.data;
              return {
                ...item,
                image_url: prod?.image_url
                  ? prod.image_url
                  : prod?.img_name
                  ? `${API_BASE_URL}/upload/${prod.img_name}`
                  : "/placeholder.png",
                product_name: prod?.name || item.product_name || "N/A",
                price: typeof prod?.price === "number"
                  ? prod.price
                  : typeof item.price === "number"
                  ? item.price
                  : 0,
              };
            } catch (err) {
              console.log("Product fetch error:", err);
              return {
                ...item,
                price: typeof item.price === "number" ? item.price : 0,
                product_name: item.product_name || "N/A",
                image_url: "/placeholder.png"
              };
            }
          })
        );
        setOrderItems((prev) => ({ ...prev, [orderId]: enrichedItems }));
      } catch (err) {
        setOrderItems((prev) => ({ ...prev, [orderId]: [] }));
      } finally {
        setItemLoading((prev) => ({ ...prev, [orderId]: false }));
      }
    }
  }

  return (
    <main className="bg-background min-h-screen">
      <Header />
      <section className="max-w-2xl mx-auto pt-8 pb-16 px-2 w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>
        {loading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="w-full h-32 rounded-lg" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            No orders found.
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, idx) => (
              <Card key={order.id} className="shadow-sm">
                <CardHeader className="flex flex-row justify-between items-center">
                  <div>
                    <span className="font-semibold text-lg">
                      Order #{idx + 1}
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      Placed: {new Date(order.created_at).toLocaleString()}
                    </span>
                  </div>
                  <Badge
                    variant={
                      order.status === "pending"
                        ? "secondary"
                        : order.status === "completed"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {order.status}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Email:</span>{" "}
                    {order.user_email}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Payment:</span>{" "}
                    <Badge
                      variant={
                        order.payment_method === "COD"
                          ? "outline"
                          : "secondary"
                      }
                    >
                      {order.payment_method}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Payment Status:
                    </span>{" "}
                    <Badge
                      variant={
                        order.payment_status === "Unpaid"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {order.payment_status}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Last updated:
                    </span>{" "}
                    {new Date(order.updated_at).toLocaleString()}
                  </div>
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 flex items-center gap-1"
                      onClick={() => handleExpand(order.id, idx)}
                    >
                      {expandedIndex === idx ? (
                        <>
                          Hide Order Items <ArrowBigUp/>
                        </>
                      ) : (
                        <>
                          Show Order Items <ArrowBigDown/>
                        </>
                      )}
                    </Button>
                  </div>
                  {expandedIndex === idx && (
                    <div className="mt-2 p-3 border rounded bg-muted">
                      {itemLoading[order.id] ? (
                        <Skeleton className="h-14 w-full rounded" />
                      ) : orderItems[order.id] &&
                        orderItems[order.id].length > 0 ? (
                        <div>
                          <div className="font-semibold mb-2">Items:</div>
                          <ul className="space-y-2">
                            {orderItems[order.id].map((item) => (
                              <li
                                key={item.id}
                                className="flex items-center gap-3"
                              >
                                {item.image_url && (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={item.image_url}
                                    alt={item.product_name}
                                    width={40}
                                    height={40}
                                    className="rounded border"
                                  />
                                )}
                                <div className="flex-1">
                                  <span className="font-medium">
                                    {item.product_name}
                                  </span>
                                  <span className="text-xs ml-2 text-muted-foreground">
                                    x{item.quantity}
                                  </span>
                                </div>
                                <div className="font-bold">
                                  Rs {typeof item.price === "number" && typeof item.quantity === "number"
                                    ? (item.price * item.quantity).toLocaleString()
                                    : "0"}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="text-muted-foreground text-xs">
                          No items found for this order.
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}