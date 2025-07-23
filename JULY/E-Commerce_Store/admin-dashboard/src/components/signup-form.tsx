import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your Details below to Create Account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com"/>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password"/>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Confirm Password</Label>
          <Input id="password" type="password"/>
        </div>
        <Button type="submit" className="w-full">
          Create Account
        </Button>
        
      </div>
      <div className="text-center text-sm">
        Already have an Account{" "}
        <a href="/" className="underline underline-offset-4">
          Login
        </a>
      </div>
    </form>
  )
}
