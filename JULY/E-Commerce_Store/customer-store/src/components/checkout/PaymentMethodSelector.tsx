"use client";

import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCardIcon } from "lucide-react";
import { FaMoneyBillWave } from "react-icons/fa";
import { PAYMENT_METHODS, PaymentMethod } from "@/constants/payment";

export function PaymentMethodSelector(props: {
  value: PaymentMethod;
  onChange: (v: PaymentMethod) => void;
  error?: string;
}) {
  return (
    <section className="mb-0">
      <h2 className="text-lg font-bold mb-2">Payment</h2>
      <RadioGroup value={props.value} onValueChange={(v) => props.onChange(v as PaymentMethod)}>
        <Card>
          <CardContent className="flex justify-between items-center py-4 ">
            <RadioGroupItem value={PAYMENT_METHODS.COD} id="cod" />
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
            <RadioGroupItem value={PAYMENT_METHODS.CARD} id="stripe" />
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
      {props.error && (
        <div className="text-xs text-red-500 mt-2">{props.error}</div>
      )}
    </section>
  );
}