"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Landing/header";
import { Card } from "@/components/ui/card";

type Category = {
  id: string;
  name: string;
  image_url: string;
  slug: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (e) {
        setCategories([]);
      }
      setLoading(false);
    }
    fetchCategories();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen py-10 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-primary text-center mb-8">
            Shop
          </h1>
          {loading ? (
            <div className="text-center text-muted-foreground">Loading...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="group focus:outline-none"
                  tabIndex={0}
                >
                  <Card
                    className={`
                      flex flex-col items-center 
                      rounded-2xl border shadow-sm 
                      cursor-pointer bg-card 
                      transition-all duration-200
                      hover:border-primary 
                      hover:shadow-lg
                      hover:scale-105
                      active:scale-100
                      active:border-accent
                      p-6
                    `}
                  >
                    <div
                      className={`
                        w-28 h-28 mb-4 flex items-center justify-center 
                        bg-muted rounded-xl overflow-hidden
                        transition-all duration-200
                        group-hover:bg-primary/10
                        group-hover:scale-110
                        group-active:scale-100
                        shadow
                      `}
                    >
                      <Image
                        src={cat.image_url}
                        alt={cat.name}
                        width={110}
                        height={110}
                        className="object-contain"
                        priority
                      />
                    </div>
                    <div className="text-center text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {cat.name}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}