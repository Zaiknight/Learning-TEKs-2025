import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section className="w-full py-20 text-center">
      <div className="container mx-auto flex flex-col items-center gap-6">
        <h3 className="text-2xl md:text-3xl font-bold">Ready to experience better shopping?</h3>
        <Button size="lg">Sign Up Now</Button>
      </div>
    </section>
  );
}