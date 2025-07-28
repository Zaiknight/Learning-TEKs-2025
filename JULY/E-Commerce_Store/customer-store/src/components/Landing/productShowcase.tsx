import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ProductShowcase() {
  const products = [
    {
      id: 1,
      name: "Wireless Earbuds",
      description: "Crystal clear sound and all-day comfort.",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
      price: "₹1,999"
    },
    {
      id: 2,
      name: "Smart Watch",
      description: "Track your health and stay connected.",
      image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400",
      price: "₹2,999"
    },
    {
      id: 3,
      name: "Eco Water Bottle",
      description: "Reusable, stylish, and eco-friendly.",
      image: "https://images.unsplash.com/photo-1526178613658-3f1622045574?w=400",
      price: "₹499"
    }
  ];
  return (
    <section className="w-full py-16">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded" />
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{product.description}</p>
                <p className="font-bold mt-2">{product.price}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Add to Cart</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}