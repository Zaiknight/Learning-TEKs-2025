import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="w-full py-24 text-center bg-background">
      <div className="container mx-auto flex flex-col items-center gap-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Welcome to <span className="text-primary">TEKs Store</span></h1>
        <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Discover the best deals, trending products, and new arrivals. Shop smart, shop easy.
        </p>
        <Button size="lg" className="mt-4">Start Shopping</Button>
      </div>
    </section>
  );
}