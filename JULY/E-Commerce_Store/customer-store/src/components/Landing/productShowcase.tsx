"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const API_BASE_URL = "http://localhost:5000";

type Product = {
  id: number | string;
  name: string;
  image: string;
  price: number;
  description?: string;
  slug?: string;
};

const PRODUCTS_PER_PAGE = 5;

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();
        // Normalize for your API structure
        const arr = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];
        setProducts(
          arr.map((p: any) => ({
            id: p.id,
            name: p.name,
            image: p.img_name
              ? `${API_BASE_URL}/upload/${p.img_name}`
              : "/placeholder.png",
            price: p.price,
            description: p.description,
            slug: p.slug || slugify(p.name) || p.id, // prefer slug, fallback to slugified name or id
          }))
        );
      } catch {
        setProducts([]);
      }
    }
    fetchProducts();
  }, []);

  // pagination
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  function nextPage() {
    setPage((prev) => (prev + 1 >= totalPages ? 0 : prev + 1));
  }
  function prevPage() {
    setPage((prev) => (prev - 1 < 0 ? totalPages - 1 : prev - 1));
  }

  const visibleProducts = products.slice(
    page * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE + PRODUCTS_PER_PAGE
  );

  // For consistent layout, measure content height
  // We'll use flex and min-h to achieve this
  return (
    <section className="w-full py-16 bg-muted overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
        </div>
        <div className="flex justify-center items-center gap-4 mb-6 w-full">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Previous page"
            onClick={prevPage}
            disabled={products.length <= PRODUCTS_PER_PAGE}
            className="z-10"
          >
            <span className="sr-only">Previous</span>
            <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
          <div className="flex gap-6 w-auto">
            {visibleProducts.map((product) => (
              <Card
                key={product.id}
                className="w-[260px] shrink-0 group hover:shadow-lg transition-shadow flex flex-col h-[400px] justify-between"
              >
                <div>
                  <CardHeader>
                    <Link href={`/products/${product.slug}`} prefetch={false}>
                      <div className="flex flex-col items-center cursor-pointer">
                        <div className="w-[140px] h-[140px] relative mb-3 rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain"
                            sizes="140px"
                          />
                        </div>
                        <CardTitle className="text-base text-center line-clamp-2">
                          {product.name}
                        </CardTitle>
                      </div>
                    </Link>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center gap-2">
                    <div className="font-bold text-primary">
                      Rs. {product.price?.toLocaleString()}
                    </div>
                    {product.description && (
                      <div className="text-xs text-muted-foreground text-center line-clamp-2 min-h-[32px]">
                        {product.description}
                      </div>
                    )}
                  </CardContent>
                </div>
                <div className="px-6 pb-5 mt-auto">
                  <Button
                    className="w-full bg-black text-white hover:text-black cursor-pointer"
                    onClick={() => {
                      /* Add to cart logic here */
                    }}
                    variant="secondary"
                  >
                    Add to Cart
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Next page"
            onClick={nextPage}
            disabled={products.length <= PRODUCTS_PER_PAGE}
            className="z-10"
          >
            <span className="sr-only">Next</span>
            <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        </div>
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <span
              key={idx}
              className={`w-3 h-3 rounded-full ${
                idx === page ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Utility: fallback slugify if slug is missing
function slugify(str: string) {
  return String(str)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}