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
import { useRouter } from "next/navigation";
import { CreditCardIcon } from "lucide-react";
import { FaMoneyBillWave } from "react-icons/fa";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";

function Confetti() {
  useEffect(() => {
    let confettiScript: HTMLScriptElement | null = null;
    if (typeof window !== "undefined") {
      confettiScript = document.createElement("script");
      confettiScript.src =
        "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
      confettiScript.async = true;
      confettiScript.onload = () => {
        // @ts-ignore
        if (window.confetti) {
          // @ts-ignore
          window.confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      };
      document.body.appendChild(confettiScript);
    }
    return () => {
      if (confettiScript) document.body.removeChild(confettiScript);
    };
  }, []);
  return null;
}

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
  const { cart, setCart } = useCartContext();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [payment, setPayment] = useState<string | null>("");

  // Form state
  const [email, setEmail] = useState("");
  const [newsAndOffers, setNewsAndOffers] = useState(true);
  const [country] = useState("Pakistan");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);

  // Error state for each field
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // For logged-in detection
  const [user, setUser] = useState<{ id?: number; email?: string } | null>(null);
  const [cartId, setCartId] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    async function fetchCartItems() {
      setLoading(true);
      try {
        const authRes = await fetch("/api/auth/me", { credentials: "include" });
        const authData = await authRes.json();
        if (authRes.ok && authData.user) {
          setUser(authData.user);
          const cartRes = await fetch(`${API_BASE_URL}/cart/${authData.user.id}`);
          if (cartRes.ok) {
            const cartData = await cartRes.json();
            const cartIdValue = cartData?.data?.id;
            setCartId(cartIdValue ?? null);
            if (cartIdValue) {
              const cartItemRes = await fetch(`${API_BASE_URL}/cartItem/${cartIdValue}`);
              if (cartItemRes.ok) {
                const cartItemData = await cartItemRes.json();
                const items: any[] = Array.isArray(cartItemData.data) ? cartItemData.data : [];
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
          setUser(null);
          setCartId(null);
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
  }, [cart]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product.price || 0) * item.quantity,
    0
  );
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  function validateFields() {
    const errs: { [key: string]: string } = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) errs.email = "Please enter a valid email address.";
    if (!address1) errs.address1 = "Address Line 1 is required.";
    if (!address2) errs.address2 = "Address Line 2 is required.";
    if (!city) errs.city = "City is required.";
    if (!phone || !/^(\+92|0)\s?\d{10,12}$/.test(phone.replace(/\s+/g, ""))) errs.phone = "Please enter a valid phone number.";
    if (!payment) errs.payment = "Please select payment method.";
    return errs;
  }

  // COD handler (default)
  async function handleOrderComplete(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    const fieldErrors = validateFields();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setSubmitting(true);

    try {
      let orderId: number | undefined = undefined;
      if (user) {
        const orderPayload = {
          user_id: user.id,
          user_email: email,
          status: "pending",
          payment_method: payment,
        };
        const orderRes = await fetch("/api/checkout/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        });
        if (!orderRes.ok) {
          const data = await orderRes.json().catch(() => ({}));
          setErrors({ order: data?.error || "Failed to create order." });
          setSubmitting(false);
          return;
        }
        const orderData = await orderRes.json();
        orderId = orderData?.data?.id;
      } else {
        const guestPayload = { 
          user_email: email,
          status: "pending",
          payment_method: payment,
         };
        const orderRes = await fetch("/api/checkout/guestOrder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(guestPayload),
        });
        if (!orderRes.ok) {
          const data = await orderRes.json().catch(() => ({}));
          setErrors({ order: data?.error || "Failed to create guest order." });
          setSubmitting(false);
          return;
        }
        const orderData = await orderRes.json();
        orderId = orderData?.data?.id;
      }
      if (!orderId) {
        setErrors({ order: "Order ID not returned." });
        setSubmitting(false);
        return;
      }

      // address
      const addressPayload = {
        user_id: user?.id,
        address_1: address1,
        address_2: address2,
        province: city,
        country: "Pakistan",
        contact: phone,
        user_email: email,
        order_id: orderId
      };
      const addressRes = await fetch("/api/checkout/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressPayload),
      });
      if (!addressRes.ok) {
        const data = await addressRes.json().catch(() => ({}));
        setErrors({ address: data?.error || "Failed to save address." });
        setSubmitting(false);
        return;
      }

      // order items
      for (const item of cartItems) {
        const orderItemPayload = {
          order_id: orderId,
          product_id: item.product.id,
          quantity: item.quantity,
        };
        const itemRes = await fetch("/api/checkout/orderItems", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderItemPayload),
        });
        if (!itemRes.ok) {
          const data = await itemRes.json().catch(() => ({}));
          setErrors({ orderItems: data?.error || "Failed to add order item." });
          setSubmitting(false);
          return;
        }
      }

      // clear cart
      if (user && cartId) {
        await fetch(`${API_BASE_URL}/cartItem/empty/${cartId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
      } else {
        if (typeof window !== "undefined") {
          localStorage.removeItem("cart");
        }
        setCart({});
      }

      setOrderPlaced(true);

      setTimeout(() => {
        router.push("/");
      }, 5000);
    } catch (err: any) {
      setErrors({ general: err.message || "Unexpected error occurred." });
    } finally {
      setSubmitting(false);
    }
  }

  // Stripe handler
  async function handleStripePay(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    const fieldErrors = validateFields();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setSubmitting(true);

    try {
      let orderId: number | undefined = undefined;
      if (user) {
        const orderPayload = {
          user_id: user.id,
          user_email: email,
          status: "pending",
          payment_method: payment,
          payment_status: "Paid"
        };
        const orderRes = await fetch("/api/checkout/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        });
        if (!orderRes.ok) {
          const data = await orderRes.json().catch(() => ({}));
          setErrors({ order: data?.error || "Failed to create order." });
          setSubmitting(false);
          return;
        }
        const orderData = await orderRes.json();
        orderId = orderData?.data?.id;
      } else {
        const guestPayload = { 
          user_email: email,
          status: "pending",
          payment_method: payment,
         };
        const orderRes = await fetch("/api/checkout/guestOrder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(guestPayload),
        });
        if (!orderRes.ok) {
          const data = await orderRes.json().catch(() => ({}));
          setErrors({ order: data?.error || "Failed to create guest order." });
          setSubmitting(false);
          return;
        }
        const orderData = await orderRes.json();
        orderId = orderData?.data?.id;
      }
      if (!orderId) {
        setErrors({ order: "Order ID not returned." });
        setSubmitting(false);
        return;
      }

      // address
      const addressPayload = {
        user_id: user?.id,
        address_1: address1,
        address_2: address2,
        province: city,
        country: "Pakistan",
        contact: phone,
        user_email: email,
        order_id: orderId
      };
      const addressRes = await fetch("/api/checkout/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressPayload),
      });
      if (!addressRes.ok) {
        const data = await addressRes.json().catch(() => ({}));
        setErrors({ address: data?.error || "Failed to save address." });
        setSubmitting(false);
        return;
      }

      // order items
      for (const item of cartItems) {
        const orderItemPayload = {
          order_id: orderId,
          product_id: item.product.id,
          quantity: item.quantity,
        };
        const itemRes = await fetch("/api/checkout/orderItems", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderItemPayload),
        });
        if (!itemRes.ok) {
          const data = await itemRes.json().catch(() => ({}));
          setErrors({ orderItems: data?.error || "Failed to add order item." });
          setSubmitting(false);
          return;
        }
      }

      // clear cart
      if (user && cartId) {
        await fetch(`${API_BASE_URL}/cartItem/empty/${cartId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
      } else {
        if (typeof window !== "undefined") {
          localStorage.removeItem("cart");
        }
        setCart({});
      }
      const stripeRes = await fetch("http://localhost:5000/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          orderData: {
            email,         
            cartItems,     
            total,         
            address: {
              address1,
              address2,
              city,
              country,
              postalCode,
              phone,
              firstName,
              lastName,
            }
          }
        }),
      });
      if (!stripeRes.ok) {
        const data = await stripeRes.json().catch(() => ({}));
        setErrors({ general: data?.error || "Stripe payment failed." });
        setSubmitting(false);
        return;
      }
      const { paymentUrl } = await stripeRes.json();
      window.location.href = paymentUrl;
    } catch (err: any) {
      setErrors({ general: err.message || "Unexpected error occurred." });
    } finally {
      setSubmitting(false);
      
    }
  }

  if (orderPlaced) {
    return (
      <main className="bg-background min-h-screen flex flex-col items-center justify-center">
        <Confetti />
        <Header />
        <div className="flex flex-col items-center justify-center gap-6 min-h-[60vh]">
          <h1 className="text-4xl font-bold text-green-600 drop-shadow">Order Placed!</h1>
          <p className="text-lg text-muted-foreground">Thank you for your purchase.</p>
          <p className="text-md text-muted-foreground">Redirecting to home in 5 seconds...</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-background min-h-screen">
      <Header />
      <div className="flex justify-between items-center border-b px-4 py-3 bg-white">
        <div className="font-medium">Total</div>
        <div className="text-xl font-bold text-primary">
          Rs {total.toLocaleString()}
        </div>
      </div>
      <div className="w-full flex flex-col md:flex-row md:justify-center md:gap-8 px-2 md:px-10 py-8 max-w-[1200px] mx-auto">
        <form
          onSubmit={
            payment === "Online(Card Payment)"
              ? handleStripePay
              : handleOrderComplete
          }
          noValidate
          className="w-full flex flex-col md:flex-row md:justify-center md:gap-8 px-2 md:px-10 py-8 max-w-[1200px] mx-auto"
        >
          {/* Left: Form */}
          <div className="flex-1 md:max-w-[430px] w-full mb-10 md:mb-0">
            {/* Contact */}
            <section className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">Contact</h2>
              </div>
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mb-2 ${errors.email ? "border-red-500" : ""}`}
                required
              />
              {errors.email && (
                <div className="text-xs text-red-500 mb-1">{errors.email}</div>
              )}
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
                <Label
                  htmlFor="country"
                  className="text-muted-foreground text-sm"
                >
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
                placeholder="Address Line 1"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                className={`mb-2 ${errors.address1 ? "border-red-500" : ""}`}
                required
              />
              {errors.address1 && (
                <div className="text-xs text-red-500 mb-1">
                  {errors.address1}
                </div>
              )}
              <Input
                placeholder="Address Line 2"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                className={`mb-2 ${errors.address2 ? "border-red-500" : ""}`}
                required
              />
              {errors.address2 && (
                <div className="text-xs text-red-500 mb-1">
                  {errors.address2}
                </div>
              )}
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Province"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={errors.city ? "border-red-500" : ""}
                  required
                />
                <Input
                  placeholder="Postal code (optional)"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
              {errors.city && (
                <div className="text-xs text-red-500 mb-1">{errors.city}</div>
              )}
              <Input
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`mb-2 ${errors.phone ? "border-red-500" : ""}`}
                required
              />
              {errors.phone && (
                <div className="text-xs text-red-500 mb-1">{errors.phone}</div>
              )}
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
              {errors.address && (
                <div className="text-xs text-red-500 mt-2">{errors.address}</div>
              )}
            </section>
            {/* Shipping method */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-2">Shipping method</h2>
              <Card>
                <CardContent className="flex justify-between items-center py-4">
                  <span>COURIER SERVICES</span>
                  <span className="font-semibold">
                    Rs {shippingFee.toLocaleString()}
                  </span>
                </CardContent>
              </Card>
            </section>
            {/* Payment */}
            <section className="mb-0">
              <h2 className="text-lg font-bold mb-2">Payment</h2>
              <RadioGroup defaultValue="comfortable">
                <Card>
                  <CardContent className="flex justify-between items-center py-4 ">
                    <RadioGroupItem
                      value="Cash on Delivery (COD)"
                      id="cod"
                      checked={payment === "Cash on Delivery (COD)"}
                      onClick={() => setPayment("Cash on Delivery (COD)")}
                    />
                    <FaMoneyBillWave />
                    Cash on Delivery (COD)
                    <div className="bg-muted px-4 py-3 text-sm text-muted-foreground">
                      Karachi: 1 to 4 working days.
                      <br />
                      Nationwide: 4 to 7 working days.
                      <br />
                    </div>
                  </CardContent>
                </Card>
                <br />
                <Card>
                  <CardContent className="flex justify-between items-center py-4 ">
                    <RadioGroupItem
                      value="Online(Card Payment)"
                      id="stripe"
                      checked={payment === "Online(Card Payment)"}
                      onClick={() => setPayment("Online(Card Payment)")}
                    />
                    <CreditCardIcon />
                    Credit/Debit Card
                    <div className="bg-muted px-4 py-3 text-sm text-muted-foreground">
                      MasterCard and Visa Accepted
                      <br />
                      Karachi: 1 to 4 working days.
                      <br />
                      Nationwide: 4 to 7 working days.
                      <br />
                    </div>
                  </CardContent>
                </Card>
              </RadioGroup>
              {errors.payment && (
                <div className="text-xs text-red-500 mt-2">{errors.payment}</div>
              )}
              {errors.order && (
                <div className="text-xs text-red-500 mt-2">{errors.order}</div>
              )}
              {errors.orderItems && (
                <div className="text-xs text-red-500 mt-2">
                  {errors.orderItems}
                </div>
              )}
              {errors.general && (
                <div className="text-xs text-red-500 mt-2">
                  {errors.general}
                </div>
              )}
            </section>
          </div>
          {/* Right: Order summary */}
          <div className="md:max-w-[420px] w-full">
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
                    <div
                      key={item.product.id}
                      className="flex items-center gap-3 mb-3"
                    >
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
                        Rs
                        {" " +
                          (item.product.price * item.quantity).toLocaleString()}
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
            <Button
              size="lg"
              className="w-full bg-black text-white mt-6"
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? payment === "Online(Card Payment)"
                  ? "Redirecting..."
                  : "Submitting..."
                : payment === "Online(Card Payment)"
                ? "Pay"
                : "Complete order"}
            </Button>
          </div>
        </form>
      </div>
      <footer className="mt-10 text-xs text-muted-foreground flex flex-wrap gap-2 justify-center mb-5">
        <Link href="#">Refund policy</Link>
        <Link href="#">Shipping</Link>
        <Link href="#">Privacy policy</Link>
        <Link href="#">Terms of service</Link>
        <Link href="/#contact">Contact</Link>
      </footer>
      <Footer />
    </main>
  );
}