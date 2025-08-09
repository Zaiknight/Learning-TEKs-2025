"use client";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { CheckoutErrors } from "@/utils/checkoutValidation";
import { PaymentMethod, PAYMENT_METHODS } from "@/constants/payment";

export function CheckoutForm(props: {
  // values
  email: string;
  newsAndOffers: boolean;
  country: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  postalCode: string;
  phone: string;
  saveInfo: boolean;
  payment: PaymentMethod;

  // setters
  setEmail: (v: string) => void;
  setNewsAndOffers: (v: boolean) => void;
  setFirstName: (v: string) => void;
  setLastName: (v: string) => void;
  setAddress1: (v: string) => void;
  setAddress2: (v: string) => void;
  setCity: (v: string) => void;
  setPostalCode: (v: string) => void;
  setPhone: (v: string) => void;
  setSaveInfo: (v: boolean) => void;
  setPayment: (v: PaymentMethod) => void;

  // summary
  shippingFee: number;
  submitting: boolean;
  errors: CheckoutErrors;

  // submit handlers
  onSubmitCOD: (e: React.FormEvent) => void;
  onSubmitStripe: (e: React.FormEvent) => void;
}) {
  const {
    email,
    newsAndOffers,
    country,
    firstName,
    lastName,
    address1,
    address2,
    city,
    postalCode,
    phone,
    saveInfo,
    payment,
    setEmail,
    setNewsAndOffers,
    setFirstName,
    setLastName,
    setAddress1,
    setAddress2,
    setCity,
    setPostalCode,
    setPhone,
    setSaveInfo,
    setPayment,
    shippingFee,
    submitting,
    errors,
    onSubmitCOD,
    onSubmitStripe,
  } = props;

  const handleSubmit = (e: React.FormEvent) => {
    if (payment === PAYMENT_METHODS.CARD) {
      onSubmitStripe(e);
    } else {
      onSubmitCOD(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
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
            placeholder="Address Line 1"
            value={address1}
            onChange={(e) => setAddress1(e.target.value)}
            className={`mb-2 ${errors.address1 ? "border-red-500" : ""}`}
            required
          />
          {errors.address1 && (
            <div className="text-xs text-red-500 mb-1">{errors.address1}</div>
          )}
          <Input
            placeholder="Address Line 2 (optional)"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
            className={`mb-2 ${errors.address2 ? "border-red-500" : ""}`}
          />
          {errors.address2 && (
            <div className="text-xs text-red-500 mb-1">{errors.address2}</div>
          )}
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Province/City"
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
        <PaymentMethodSelector
          value={payment}
          onChange={setPayment}
          error={errors.payment}
        />
        {errors.order && (
          <div className="text-xs text-red-500 mt-2">{errors.order}</div>
        )}
        {errors.orderItems && (
          <div className="text-xs text-red-500 mt-2">
            {errors.orderItems}
          </div>
        )}
        {errors.general && (
          <div className="text-xs text-red-500 mt-2">{errors.general}</div>
        )}
      </div>
      {/* Right column and submit button are rendered by the page to keep this component purely "form" */}
      <div className="md:max-w-[420px] w-full">
        {/* The submit button is kept here to keep native form submit behavior */}
        <Button
          size="lg"
          className="w-full bg-black text-white mt-6"
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? payment === PAYMENT_METHODS.CARD
              ? "Redirecting..."
              : "Submitting..."
            : payment === PAYMENT_METHODS.CARD
            ? "Pay"
            : "Complete order"}
        </Button>
      </div>
    </form>
  );
}