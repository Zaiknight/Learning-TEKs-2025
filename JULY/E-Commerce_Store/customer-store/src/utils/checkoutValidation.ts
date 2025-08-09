import { Address } from "@/types/commerce";
import { PaymentMethod } from "@/constants/payment";

export type CheckoutErrors = { [key: string]: string };

export function validateCheckout(params: {
  email: string;
  address: Address;
  payment?: PaymentMethod | string | null;
}) {
  const { email, address, payment } = params;
  const errs: CheckoutErrors = {};

  if (!email || !/\S+@\S+\.\S+/.test(email))
    errs.email = "Please enter a valid email address.";

  if (!address.address1) errs.address1 = "Address Line 1 is required.";
  
  if (!address.city) errs.city = "City/Province is required.";

  const normalizedPhone = address.phone?.replace(/\s+/g, "");
  if (!normalizedPhone || !/^(\+92|0)\d{10,12}$/.test(normalizedPhone))
    errs.phone = "Please enter a valid phone number.";

  if (!payment) errs.payment = "Please select payment method.";

  return errs;
}