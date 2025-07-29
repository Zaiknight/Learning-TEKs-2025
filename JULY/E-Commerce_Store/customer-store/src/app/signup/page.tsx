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

    const res = await fetch("/api/auth/signup",{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name, last_name, email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if(!res.ok){
      setEmailError(data.error || "Login failed. Please check your credentials.");
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
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="last_name" className="text-sm font-medium">Last Name</label>
            <Input
              id="last_name"
              placeholder="Smith"
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