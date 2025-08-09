"use client";

import { Header } from "@/components/Landing/header";
import { Footer } from "@/components/Landing/footer";
import Link from "next/link";
import { Confetti } from "@/components/common/Confetti";
import { useCartLoader } from "@/hooks/useCartLoader";
import { useCheckout } from "@/hooks/useCheckout";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export default function CheckoutPage() {
  const { cartItems, user, cartId, loading, setCart } = useCartLoader();
  const checkout = useCheckout({ user, cartId, cartItems, setCart });

  if (checkout.orderPlaced) {
    return (
      <main className="bg-background min-h-screen flex flex-col items-center justify-center">
        <Confetti />
        <Header />
        <div className="flex flex-col items-center justify-center gap-6 min-h-[60vh]">
          <h1 className="text-4xl font-bold text-green-600 drop-shadow">
            Order Placed!
          </h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your purchase.
          </p>
          <p className="text-md text-muted-foreground">
            Redirecting to home in 5 seconds...
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-background min-h-screen">
      <Header />
      <div className="w-full flex flex-col md:flex-row md:justify-center md:gap-8 px-2 md:px-10 py-8 max-w-[1200px] mx-auto">
        <div className="flex-1">
          <CheckoutForm
            // values
            email={checkout.email}
            newsAndOffers={checkout.newsAndOffers}
            country={checkout.country}
            firstName={checkout.firstName}
            lastName={checkout.lastName}
            address1={checkout.address1}
            address2={checkout.address2}
            city={checkout.city}
            postalCode={checkout.postalCode}
            phone={checkout.phone}
            saveInfo={checkout.saveInfo}
            payment={checkout.payment}
            // setters
            setEmail={checkout.setEmail}
            setNewsAndOffers={checkout.setNewsAndOffers}
            setFirstName={checkout.setFirstName}
            setLastName={checkout.setLastName}
            setAddress1={checkout.setAddress1}
            setAddress2={checkout.setAddress2}
            setCity={checkout.setCity}
            setPostalCode={checkout.setPostalCode}
            setPhone={checkout.setPhone}
            setSaveInfo={checkout.setSaveInfo}
            setPayment={checkout.setPayment}
            // summary
            shippingFee={checkout.shippingFee}
            submitting={checkout.submitting}
            errors={checkout.errors}
            // handlers
            onSubmitCOD={checkout.handleCODSubmit}
            onSubmitStripe={checkout.handleStripeSubmit}
          />
        </div>
        <div className="md:max-w-[420px] w-full">
          <section className="mb-3">
            <h2 className="text-lg font-bold mb-2 px-2">Order summary</h2>
            <hr />
            <OrderSummary
              loading={loading}
              cartItems={cartItems}
              subtotal={checkout.subtotal}
              shippingFee={checkout.shippingFee}
              total={checkout.total}
            />
          </section>
        </div>
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