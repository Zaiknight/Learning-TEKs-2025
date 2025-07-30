"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Landing/header";

type Category = {
  id: string;
  name: string;
  description?: string;
  image_url: string;
  slug: string;
};

type Product = {
  id: string;
  name: string;
  image_url: string;
  price: number;
  slug: string;
};

export default function CategoryPage() {
  const params = useParams() as { slug: string };
  const slug = params.slug;
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategory() {
      setLoading(true);
      try {
        const res = await fetch(`/api/categories/${slug}`);
        const data = await res.json();
        if (res.ok && data.category) {
          setCategory(data.category);
          setProducts(data.products || []);
        } else {
          setCategory(null);
          setProducts([]);
        }
      } catch (e) {
        setCategory(null);
        setProducts([]);
      }
      setLoading(false);
    }
    if (slug) fetchCategory();
  }, [slug]);

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10 bg-background min-h-screen">
        {loading ? (
          <div className="text-center py-10 text-muted-foreground">Loading...</div>
        ) : category ? (
          <>
            <div className="flex flex-col items-center gap-3 mb-8">
              <div className="w-32 h-32 bg-muted rounded-xl overflow-hidden flex items-center justify-center shadow">
                <Image
                  src = {category.image_url}
                  alt={category.name}
                  width={128}
                  height={128}
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="text-3xl font-bold text-primary text-center">{category.name}</h1>
              {category.description && (
                <p className="text-center text-muted-foreground max-w-xl">{category.description}</p>
              )}
            </div>
            <h2 className="text-xl font-semibold mb-4">Products</h2>
            {products.length === 0 ? (
              <div className="text-center text-muted-foreground py-10">No Products...</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((prod) => (
                  <Link key={prod.id} href={`/products/${prod.slug}`}>
                    <div className="group bg-card rounded-xl p-4 border shadow hover:shadow-md transition-all flex flex-col items-center cursor-pointer">
                      <div className="w-24 h-24 mb-2 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                        <Image
                          src={prod.image_url}
                          alt={prod.name}
                          width={96}
                          height={96}
                          className="object-contain"
                        />
                      </div>
                      <div className="font-medium text-center group-hover:text-primary transition-colors mb-1 line-clamp-2">
                        {prod.name}
                      </div>
                      <div className="text-sm text-muted-foreground">{prod.price ? `Rs. ${prod.price}` : ""}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-destructive py-10">Category not Found.</div>
        )}
      </main>
    </>
  );
}