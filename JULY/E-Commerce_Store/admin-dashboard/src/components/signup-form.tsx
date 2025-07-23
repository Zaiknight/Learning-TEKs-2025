import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createAdmin } from "@/api/auth.api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Field errors
  const [firstNameError, setFirstNameError] = useState<string | null>(null); 
  const [lastNameError, setLastNameError] = useState<string | null>(null); 
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const navigate = useNavigate();

  function clearFieldErrors() {
    setFirstNameError(null);
    setLastNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
  }

  const createAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    clearFieldErrors();

    let hasError = false;
    if (!firstName) {
      setFirstNameError("First Name is required");
      hasError = true;
    }
    if (!lastName) {
      setLastNameError("Last Name is required");
      hasError = true;
    }
    if (!email) {
      setEmailError("Email is required");
      hasError = true;
    }
    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    }
    if (!confirmPassword) {
      setConfirmPasswordError("Confirm Password is required");
      hasError = true;
    }
    if (password && confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      hasError = true;
    }
    if (hasError) return;

    setLoading(true);
    const result = await createAdmin(firstName, lastName, email, password);
    setLoading(false);

    // Handle backend field validation errors
    if (result.validation_errors) {
      result.validation_errors.forEach((err: any) => {
        if (err.path?.includes("first_name")) setFirstNameError(err.message);
        if (err.path?.includes("last_name")) setLastNameError(err.message);
        if (err.path?.includes("email")) setEmailError(err.message);
        if (err.path?.includes("password")) setPasswordError(err.message);
      });
      setError(result.message);
      return;
    }

    // Handle backend general errors
    if (result.error) {
      setError(result.error);
      return;
    }

    // Success
    navigate("/");
  };

  return (
    <form onSubmit={createAccount} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your details below to create an account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="firstname">First Name</Label>
          <Input
            id="firstname"
            placeholder="Jane"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={cn(firstNameError && "ring-2 ring-red-500")}
          />
          {firstNameError && <p className="text-red-500">{firstNameError}</p>}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="lastname">Last Name</Label>
          <Input
            id="lastname"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={cn(lastNameError && "ring-2 ring-red-500")}
          />
          {lastNameError && <p className="text-red-500">{lastNameError}</p>}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="m@xyz.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cn(emailError && "ring-2 ring-red-500")}
          />
          {emailError && <p className="text-red-500">{emailError}</p>}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={cn(passwordError && "ring-2 ring-red-500")}
          />
          {passwordError && <p className="text-red-500">{passwordError}</p>}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={cn(confirmPasswordError && "ring-2 ring-red-500")}
          />
          {confirmPasswordError && <p className="text-red-500">{confirmPasswordError}</p>}
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an Account?{" "}
        <a href="/" className="underline underline-offset-4">
          Login
        </a>
      </div>
    </form>
  );
}