"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useCartContext } from "@/context/CartContext";
import { Header } from "@/components/Landing/header";
import { Footer } from "@/components/Landing/footer";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";

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

export default function CheckoutPage() {
  const { cart } = useCartContext();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [email, setEmail] = useState("");
  const [newsAndOffers, setNewsAndOffers] = useState(true);
  const [country] = useState("Pakistan");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);
  const [payment, setPayment] = useState("cod");
  const [billingAddress, setBillingAddress] = useState("same");

  // Fetch cart items from context (guest) or backend (logged in)
  useEffect(() => {
    async function fetchCartItems() {
      setLoading(true);
      try {
        const authRes = await fetch("/api/auth/me", { credentials: "include" });
        const authData = await authRes.json();
        if (authRes.ok && authData.user) {
          // Logged in: get cart id
          const cartRes = await fetch(`${API_BASE_URL}/cart/${authData.user.id}`);
          if (cartRes.ok) {
            const cartData = await cartRes.json();
            const cartId = cartData?.data?.id;
            if (cartId) {
              const cartItemRes = await fetch(`${API_BASE_URL}/cartItem/${cartId}`);
              if (cartItemRes.ok) {
                const cartItemData = await cartItemRes.json();
                const items: any[] = Array.isArray(cartItemData.data) ? cartItemData.data : [];
                // Fetch product details in parallel
                const detailed = await Promise.all(
                  items.map(async (item) => {
                    const prodRes = await fetch(`${API_BASE_URL}/products/${item.product_id}`);
                    if (!prodRes.ok) return null;
                    const prodData = await prodRes.json();
                    const prod = prodData?.data;
                    if (!prod) return null;
                    return {
                      product: {
                        ...prod,
                        image_url: prod.image_url
                          ? prod.image_url
                          : prod.img_name
                          ? `${API_BASE_URL}/upload/${prod.img_name}`
                          : "/placeholder.png",
                      },
                      quantity: item.quantity,
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
          // Not logged in: use context cart
          setCartItems(
            Object.values(cart).map((x) => ({
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
    fetchCartItems();
    // eslint-disable-next-line
  }, [cart]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product.price || 0) * item.quantity,
    0
  );
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  return (
    <main className="bg-background min-h-screen">
      {/* Header bar */}
      <Header />
      <div className="flex justify-between items-center border-b px-4 py-3 bg-white">
        <div className="font-medium">Total</div>
        <div className="text-xl font-bold text-primary">
          Rs {total.toLocaleString()}
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row md:justify-center md:gap-8 px-2 md:px-10 py-8 max-w-[1200px] mx-auto">
        {/* Left side: Contact, Delivery, Shipping, Payment, Billing */}
        <div className="flex-1 md:max-w-[430px] w-full mb-10 md:mb-0">
          {/* Contact */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">Contact</h2>
              <Link href="/login" className="text-primary underline text-sm">
                Log in
              </Link>
            </div>
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-2"
            />
            <div className="flex items-center gap-2">
              <Checkbox
                checked={newsAndOffers}
                onCheckedChange={() => setNewsAndOffers(!newsAndOffers)}
                id="news"
              />
              <Label htmlFor="news" className="cursor-pointer">
                Email me with news and offers
              </Label>
            </div>
          </section>

          {/* Delivery */}
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-2">Delivery</h2>
            <div className="mb-2">
              <Label htmlFor="country" className="text-muted-foreground text-sm">
                Country/Region
              </Label>
              <select
                id="country"
                className="border rounded px-3 py-2 w-full mt-1"
                value={country}
                disabled
              >
                <option value="Pakistan">Pakistan</option>
              </select>
            </div>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="First name (optional)"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <Input
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mb-2"
            />
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Input
                placeholder="Postal code (optional)"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
            <Input
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mb-2"
            />
            <div className="flex items-center gap-2">
              <Checkbox
                checked={saveInfo}
                onCheckedChange={() => setSaveInfo(!saveInfo)}
                id="saveInfo"
              />
              <Label htmlFor="saveInfo" className="cursor-pointer">
                Save this information for next time
              </Label>
            </div>
          </section>

          {/* Shipping method */}
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-2">Shipping method</h2>
            <Card>
              <CardContent className="flex justify-between items-center py-4">
                <span>COURIER SERVICES</span>
                <span className="font-semibold">Rs {shippingFee.toLocaleString()}</span>
              </CardContent>
            </Card>
          </section>

          {/* Payment */}
          <section className="mb-0">
            <h2 className="text-lg font-bold mb-2">Payment</h2>
                       
              <Card>
              <CardContent className="flex justify-between items-center py-4">
                <Label htmlFor="cod" className="text-base font-semibold px-4 py-3">Cash on Delivery (COD)</Label>
                <div className="bg-muted px-4 py-3 text-sm text-muted-foreground">
                  We deliver all over Pakistan. Estimated delivery time:
                  <br />
                  Karachi: 1 to 4 working days.
                  <br />
                  Nationwide: 4 to 7 working days.
                  <br />
                  <br />
                  Cash On Delivery is for Pakistan Only
                </div>
                </CardContent>
              </Card>
          </section>
        </div>

        {/* Right side: Order summary */}
        <div className="md:max-w-[420px] w-full">
          <section className="mb-3">
            <h2 className="text-lg font-bold mb-2 px-2">Order summary</h2>
            <hr></hr>
            <div className="border-b py-4 mb-4">
              {loading ? (
                <div className="text-center py-4 text-muted-foreground">Loading cart...</div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 mb-3">
                    <Image
                      src={item.product.image_url || item.product.image || "/placeholder.png"}
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
            <div className="flex justify-between py-2 font-bold text-lg">
              <span>Total</span>
              <span>PKR Rs {total.toLocaleString()}</span>
            </div>
          </section>

          <Button size="lg" className="w-full bg-black text-white mt-6">
            Complete order
          </Button>
            </div>
            </div>
          <footer className="mt-10 text-xs text-muted-foreground flex flex-wrap gap-2 justify-center mb-5">
            <Link href="#">Refund policy</Link>
            <Link href="#">Shipping</Link>
            <Link href="#">Privacy policy</Link>
            <Link href="#">Terms of service</Link>
            <Link href="#">Contact</Link>
          </footer>
          <Footer />
        
    </main>
  );
}