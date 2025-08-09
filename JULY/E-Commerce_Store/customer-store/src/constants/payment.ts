export const PAYMENT_METHODS = {
    COD: "Cash on Delivery (COD)",
    CARD: "Online(Card Payment)",
  } as const;
  
  export type PaymentMethod =
    | typeof PAYMENT_METHODS.COD
    | typeof PAYMENT_METHODS.CARD;