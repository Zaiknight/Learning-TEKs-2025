"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: Replace with real signup logic
    setTimeout(() => setLoading(false), 1200);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md bg-card rounded-xl shadow p-8 border">
        <h1 className="text-2xl font-bold text-center text-primary mb-2">Sign Up</h1>
        <p className="text-sm text-center text-muted-foreground mb-8">
          Create a new account to start shopping with us!
        </p>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Your Name"
              className="mt-1"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="mt-1"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Minimum 8 characters"
              className="mt-1"
              disabled={loading}
            />
          </div>
          <Button type="submit" className="mt-2 w-full" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
        <div className="flex justify-between mt-6 text-sm">
          <Link href="/login" className="text-primary hover:underline">
            Already have an account? Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}