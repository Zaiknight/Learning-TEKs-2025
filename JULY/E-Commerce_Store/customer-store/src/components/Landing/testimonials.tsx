import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export function Testimonials() {
  const reviews = [
    {
      name: "James Gunn",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "Great selection and super fast delivery. I love this store!"
    },
    {
      name: "Joanah Snow",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      text: "Customer support is amazing. Highly recommend to everyone."
    },
    {
      name: "Robbert Newson",
      image: "https://randomuser.me/api/portraits/men/9.jpg",
      text: "Amazing Quality"
    },
    {
      name: "Bilal Kamran",
      image: "https://randomuser.me/api/portraits/men/65.jpg",
      text: "TEKs Products are great, I recommend."
    }
    
  ];
  return (
    <section className="w-full py-16 bg-muted">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold">What Our Customers Say</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {reviews.map((review, idx) => (
            <Card key={idx} className="max-w-md mx-auto w-full">
              <CardContent className="flex flex-col items-center gap-4 py-8">
                <Avatar>
                  <AvatarImage src={review.image} />
                  <AvatarFallback>{review.name[0]}</AvatarFallback>
                </Avatar>
                <div className="font-semibold">{review.name}</div>
                <div className="text-muted-foreground text-center">{review.text}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}