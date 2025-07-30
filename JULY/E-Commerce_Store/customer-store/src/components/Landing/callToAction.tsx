"use client"
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const useAuth = () => {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);


  return { user, loading };
};

export function CallToAction() {
  const { user, loading } = useAuth();

  // Optional: you may want to not render until loading is false
  if (loading) return null;

  return !user ? (
    <section className="w-full py-20 text-center">
      <div className="container mx-auto flex flex-col items-center gap-6">
        <h3 className="text-2xl md:text-3xl font-bold">
          Ready to experience better shopping?
        </h3>
        <Button size="lg">Sign Up Now</Button>
      </div>
    </section>
  ) : null;
}