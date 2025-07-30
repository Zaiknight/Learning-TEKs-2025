"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Landing/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AiOutlineHeart, AiFillEye } from "react-icons/ai";
import { FaShippingFast, FaUndoAlt } from "react-icons/fa";
import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Footer } from "@/components/Landing/footer";
import { Testimonials } from "@/components/Landing/testimonials";

type Category = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  slug: string;
};

type Product = {
  id: string | number;
  name: string;
  description?: string;
  image_url: string;
  price: number;
  old_price?: number;
  slug: string;
  stock?: number;
  category_id?: number | string;
};

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  if (!params) return <div>Invalid URL</div>;
  const slugParam = params.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [wishlistModalOpen, setWishlistModalOpen] = useState(false);

  const [isLoggedIn] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(slug)}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data.product || null);

        // Correct category fetching logic
        if (data.product?.category_id) {
          // fetch category by id
          const catRes = await fetch(`/api/categories/[id]/${data.product.category_id}`);
          if (catRes.ok) {
            const catData = await catRes.json();
            if (catData?.category) {
              setCategory({
                id: catData.category.id,
                name: catData.category.name,
                description: catData.category.description,
                image_url: catData.category.image_url,
                slug: catData.category.slug,
              });
            }
          }
        }
      } catch (e) {
        setProduct(null);
      }
      setLoading(false);
    }
    if (slug) fetchProduct();
  }, [slug]);

  // Breadcrumbs WITH category
  const breadcrumbs = [
    { name: "Home", href: "/" },
    category
      ? { name: category.name, href: `/categories/${category.slug}` }
      : null,
    product
      ? { name: product.name, href: "#" }
      : null,
  ].filter(Boolean) as { name: string; href: string }[];

  const viewers = Math.floor(Math.random() * 30 + 1);
  const deliveryStart = "Aug 02";
  const deliveryEnd = "Aug 06";
  const stock = typeof product?.stock === "number" ? product.stock : 12;
  const showLowStock = stock <= 10;

  function handleWishlistClick() {
    if (!isLoggedIn) {
      setWishlistModalOpen(true);
    } else {
      // TODO: Implement add to wishlist
    }
  }

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-10 min-h-screen bg-background">
        {loading ? (
          <div className="text-center text-muted-foreground py-10">Loading...</div>
        ) : product ? (
          <>
            {/* Breadcrumbs */}
            <nav className="text-sm mb-8 flex items-center gap-2 text-muted-foreground">
              {breadcrumbs.map((item, idx) => (
                <span key={item.href} className="flex items-center gap-2">
                  <Link href={item.href} className="hover:underline text-foreground">{item.name}</Link>
                  {idx < breadcrumbs.length - 1 && <span className="mx-1">&gt;</span>}
                </span>
              ))}
            </nav>
            <div className="flex flex-col md:flex-row gap-16">
              {/* Product Image */}
              <div className="flex-1 flex flex-col items-center">
                <div className="bg-muted rounded-xl overflow-hidden shadow-md w-full max-w-[520px] aspect-square flex items-center justify-center">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    width={520}
                    height={520}
                    className="object-contain w-full h-full"
                    priority
                  />
                </div>
              </div>
              {/* Product Details */}
              <div className="flex-[1.4] flex flex-col gap-4 w-full max-w-[540px] mx-auto">
                {/* Title & Heart */}
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-3xl md:text-4xl font-semibold mb-1 text-foreground leading-tight">
                    {product.name}
                  </h1>
                  <Button
                    onClick={handleWishlistClick}
                    variant="ghost"
                    size="icon"
                    className="text-3xl text-muted-foreground hover:text-red-500 rounded-full border border-border"
                  >
                    <AiOutlineHeart />
                  </Button>
                </div>
                {/* Price */}
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-2xl text-red-600 font-semibold">
                    Rs.{product.price?.toLocaleString()}
                  </span>
                  {product.old_price && (
                    <span className="line-through text-base text-muted-foreground">
                      Rs.{product.old_price?.toLocaleString()}
                    </span>
                  )}
                </div>
                {/* Description */}
                {product.description && (
                  <p className="text-base text-muted-foreground mb-2">
                    {product.description}
                  </p>
                )}
                {/* Quantity selector */}
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-base font-medium">Quantity:</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >-</Button>
                  <Input
                    className="w-14 text-center"
                    type="number"
                    min={1}
                    max={stock}
                    value={quantity}
                    readOnly
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                  >+</Button>
                </div>
                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-black text-black bg-white hover:bg-black hover:text-white hover:border-white"
                  >
                    Add to cart
                  </Button>
                  <Button className="flex-1 bg-black border-black hover:bg-white hover:text-black hover:border-black text-white ">
                    Buy it now
                  </Button>
                </div>
                {/* Stock/urgency/extra info */}
                <div className="mt-8">
                  {showLowStock && (
                    <div>
                      <div className="text-base mb-1">
                        Only <span className="text-red-600 font-semibold">{stock}</span> item(s) left in stock!
                      </div>
                      <Progress className="w-full h-1 bg-muted mb-3" value={100 - (stock * 5)} />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <AiFillEye className="text-lg text-muted-foreground" />
                    <span className="font-semibold">{viewers}</span>
                    <span className="text-muted-foreground">people are viewing this right now</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarDays className="w-5 h-5 text-muted-foreground" />
                    <span className="font-semibold">Estimated Delivery:</span>
                    <span className="text-foreground">{deliveryStart} - {deliveryEnd}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <FaShippingFast className="w-5 h-5 text-muted-foreground" />
                    <span className="font-semibold">Free Shipping & Returns:</span>
                    <span className="text-foreground">On all orders over PKR 4000</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <FaUndoAlt className="w-5 h-5 text-muted-foreground" />
                    <span className="font-semibold">Easy Returns:</span>
                    <span className="text-foreground">7-day return policy</span>
                  </div>
                </div>
                <div className="mt-8">
                  <Badge variant="secondary" className="mr-2">100% Authentic</Badge>
                  <Badge variant="secondary">Secure Payments</Badge>
                </div>
              </div>
            </div>
            {/* Wishlist Modal */}
            <Dialog open={wishlistModalOpen} onOpenChange={setWishlistModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add to Wishlist</DialogTitle>
                </DialogHeader>
                <div className="py-4 text-center">
                  Please sign in to add this product to your wishlist.
                </div>
                <div className="flex gap-4 w-full">
                  <Button
                    className="flex-1 bg-primary text-white hover:bg-primary/90"
                    onClick={() => router.push("/login")}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="flex-1 bg-black text-white hover:bg-black/90"
                    onClick={() => router.push("/signup")}
                  >
                    Sign Up
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  className="mt-6 w-full"
                  onClick={() => setWishlistModalOpen(false)}
                >
                  Cancel
                </Button>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <div className="text-center text-destructive py-10">Product not found.</div>
        )}
        <Testimonials />
        <Footer />
      </main>
    </>
  );
}