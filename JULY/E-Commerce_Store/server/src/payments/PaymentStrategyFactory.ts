import { PaymentStrategy } from "./PaymentStrategy";
import { CODStrategy } from "./strategies/CODStrategy";
import { StripeStrategy } from "./strategies/StripeStrategy";


const strategyMap: Record<string, new () => PaymentStrategy> = {
  stripe: StripeStrategy,
  cod: CODStrategy,
//   gpay: GPAYStrategy,
};

export function getPaymentStrategy(method: string): PaymentStrategy { 
  const StrategyClass = strategyMap[method.toLowerCase()];
  if (!StrategyClass) {
    throw new Error(`Unsupported payment method: ${method}`);
  }
  return new StrategyClass();
}