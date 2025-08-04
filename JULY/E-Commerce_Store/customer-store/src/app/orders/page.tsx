"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Header } from "@/components/Landing/header";
import { Footer } from "@/components/Landing/footer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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

export default function MyOrdersPage() {
  const [user, setUser] = useState<{ email?: string } | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserAndOrders() {
      setLoading(true);
      try {
        // Get logged in user
        const authRes = await fetch("/api/auth/me", { credentials: "include" });
        const authData = await authRes.json();
        if (authRes.ok && authData.user && authData.user.email) {
          setUser(authData.user);
          const ordersRes = await fetch(
            `/api/orders?email=${encodeURIComponent(authData.user.email)}`,
            { credentials: "include" }
          );
          const ordersData = await ordersRes.json();
          console.log("ordersData:", ordersData);
          setOrders(Array.isArray(ordersData.data) ? ordersData.data : []);
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
            {orders.map((order) => (
              <Card key={order.id} className="shadow-sm">
                <CardHeader className="flex flex-row justify-between items-center">
                  <div>
                    <span className="font-semibold text-lg">Order #{order.id}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      Placed: {new Date(order.created_at).toLocaleString()}
                    </span>
                  </div>
                  <Badge
                    variant={
                      order.status === "pending"
                        ? "secondary"
                        : order.status === "completed"
                        ? "secondary"
                        : "default"
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
                        order.payment_method === "COD" ? "outline" : "secondary"
                      }
                    >
                      {order.payment_method}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Payment Status:</span>{" "}
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
                    <span className="text-muted-foreground">Last updated:</span>{" "}
                    {new Date(order.updated_at).toLocaleString()}
                  </div>
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