"use client";
import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

// Dummy reviews data
const reviews = [
  {
    name: "James Gunn",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "Great selection and super fast delivery. I love this store!",
  },
  {
    name: "Joanah Snow",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    text: "Customer support is amazing. Highly recommend to everyone.",
  },
  {
    name: "Robbert Newson",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    text: "Amazing Quality",
  },
  {
    name: "Bilal Kamran",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
    text: "TEKs Products are great, I recommend.",
  },
  {
    name: "Aleena Bilal",
    image: "https://randomuser.me/api/portraits/women/95.jpg",
    text: "Great Experience so far...",
  },
  {
    name: "Sarah Parker",
    image: "https://randomuser.me/api/portraits/women/33.jpg",
    text: "Superb prices and fast shipping. Will order again!",
  },
  {
    name: "Arjun Patel",
    image: "https://randomuser.me/api/portraits/men/44.jpg",
    text: "Everything arrived in perfect condition. 5 stars.",
  },
  {
    name: "Fatima Zahra",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    text: "Easy checkout and quick support. Thank you!",
  },
  {
    name: "Michael Lee",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    text: "Very satisfied with my purchase. Highly recommended.",
  },
  {
    name: "Hira Sohail",
    image: "https://randomuser.me/api/portraits/women/66.jpg",
    text: "Wonderful products and friendly staff.",
  },
];

const SLIDES_TO_SHOW = 3;
const CARD_WIDTH = 320 + 32; // width + gap (w-[320px] + gap-8)
const SCROLL_SPEED = 0.5; // px per frame

export function Testimonials() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const reqRef = useRef<number>(SLIDES_TO_SHOW);
  const position = useRef(0);

  // Repeat array for infinite effect
  const repeatedReviews = [...reviews, ...reviews, ...reviews];

  // Animation loop
  useEffect(() => {
    function animate() {
      if (sliderRef.current) {
        position.current += SCROLL_SPEED;
        // Reset after one 'real' loop
        const loopWidth = reviews.length * CARD_WIDTH;
        if (position.current >= loopWidth) position.current = 0;
        sliderRef.current.style.transform = `translateX(-${position.current}px)`;
      }
      reqRef.current = requestAnimationFrame(animate);
    }
    reqRef.current = requestAnimationFrame(animate);
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, []);

  return (
    <section className="w-full py-16 bg-muted overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold">What Our Customers Say</h2>
        </div>
        <div className="relative w-full overflow-hidden">
          <div
            ref={sliderRef}
            className="flex gap-8"
            style={{
              willChange: "transform",
              transition: "none",
            }}
          >
            {repeatedReviews.map((review, idx) => (
              <div
                key={idx}
                className="w-[320px] shrink-0"
                style={{
                  opacity: 1,
                  transition: "opacity 0.6s",
                }}
              >
                <Card className="w-full h-full shadow-md">
                  <CardContent className="flex flex-col items-center gap-4 py-8">
                    <Avatar>
                      <AvatarImage src={review.image} />
                      <AvatarFallback>{review.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="font-semibold">{review.name}</div>
                    <div className="text-muted-foreground text-center">{review.text}</div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          {/* Gradient fade on sides */}
          <div className="pointer-events-none absolute top-0 left-0 h-full w-22 bg-gradient-to-r from-muted to-transparent" />
          <div className="pointer-events-none absolute top-0 right-0 h-full w-22 bg-gradient-to-l from-muted to-transparent" />
        </div>
      </div>
    </section>
  );
}