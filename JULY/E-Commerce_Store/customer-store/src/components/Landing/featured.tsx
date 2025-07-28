import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Truck, ShieldCheck } from "lucide-react";

export function Features() {
  return (
    <section className="w-full py-16 bg-muted">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold">Why Shop With Us?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <ShoppingBag className="w-8 h-8 mx-auto text-primary" />
              <CardTitle>Wide Selection</CardTitle>
            </CardHeader>
            <CardContent>
              Explore thousands of products across multiple categories.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Truck className="w-8 h-8 mx-auto text-primary" />
              <CardTitle>Fast Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              Get your orders delivered quickly, right to your doorstep.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <ShieldCheck className="w-8 h-8 mx-auto text-primary" />
              <CardTitle>Secure Payments</CardTitle>
            </CardHeader>
            <CardContent>
              Shop with confidence using our secure and trusted payment options.
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}