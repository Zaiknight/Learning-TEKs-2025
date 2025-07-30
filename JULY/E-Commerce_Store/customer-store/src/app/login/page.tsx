"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Login failed. Please check your credentials.");
      setLoading(false);
      return;
    }
    

    router.push("/#home");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md bg-card rounded-xl shadow p-8 border">
        <h1 className="text-2xl font-bold text-center text-primary mb-2">Sign In</h1>
        <p className="text-sm text-center text-muted-foreground mb-8">
          Welcome back! Enter your credentials to access your account.
        </p>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="mt-1"
              disabled={loading}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          <Button type="submit" className="mt-2 w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <div className="flex justify-between mt-6 text-sm">
          <Link href="/signup" className="text-primary hover:underline">
            Don't have an account? Sign Up
          </Link>
          <Link href="/forgot-password" className="text-muted-foreground hover:text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
      </div>
    </main>
  );
}