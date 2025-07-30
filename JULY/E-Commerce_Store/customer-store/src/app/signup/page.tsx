"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  //error states
  const [error, setError] = useState<string | null>(null);
  const [fnameError, setFnameError] = useState<string | null>(null);
  const [lnameError, setLnameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  //form states
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Reset all errors
    setError(null);
    setFnameError(null);
    setLnameError(null);
    setEmailError(null);
    setPasswordError(null);

    const res = await fetch("/api/auth/signup",{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name, last_name, email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if(!res.ok){
      if (data.validation_errors) {
        setFnameError(data.validation_errors.first_name || null);
        setLnameError(data.validation_errors.last_name || null);
        setEmailError(data.validation_errors.email || null);
        setPasswordError(data.validation_errors.password || null);
        setLoading(false);
        return;
      }


      setError("Signup failed. Account Already Exists.");
      setLoading(false);
      return;
    }

    router.push("/login");
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
            <label htmlFor="first_name" className="text-sm font-medium">First Name</label>
            <Input
              id="first_name"
              placeholder="John"
              className="mt-1"
              value={first_name}
              disabled={loading}
              onChange={e => setFirst_name(e.target.value)}
            />
            {fnameError && (
              <div className="text-red-500 text-sm text-center">{fnameError}</div>
            )}
          </div>
          <div>
            <label htmlFor="last_name" className="text-sm font-medium">Last Name</label>
            <Input
              id="last_name"
              placeholder="Smith"
              className="mt-1"
              value={last_name}
              disabled={loading}
              onChange={e => setLast_name(e.target.value)}
            />
            {lnameError && (
              <div className="text-red-500 text-sm text-center">{lnameError}</div>
            )}
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input
              id="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              className="mt-1"
              disabled={loading}
              onChange={e => setEmail(e.target.value)}
            />
            {emailError && (
              <div className="text-red-500 text-sm text-center">{emailError}</div>
            )}
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Minimum 8 characters"
              className="mt-1"
              value={password}
              disabled={loading}
              onChange={e => setPassword(e.target.value)}
            />
            {passwordError && (
              <div className="text-red-500 text-sm text-center">{passwordError}</div>
            )}
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
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