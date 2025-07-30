"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  User,
  LogOut,
  Heart,
  ListOrdered,
  UserCircle,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";


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

  
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    
    window.location.reload();
  };

  return { user, loading, logout };
};

export function Header() {
  const { user, loading, logout } = useAuth();
  const [userDropdown, setUserDropdown] = useState(false);
  const [productsDropdown, setProductsDropdown] = useState(false);
  const router = useRouter();
  const productsDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns if clicked outside
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        productsDropdown &&
        productsDropdownRef.current &&
        !productsDropdownRef.current.contains(event.target as Node)
      ) {
        setProductsDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [productsDropdown]);

  return (
    <header className="w-full border-b bg-background/95 sticky top-0 z-30">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo / Brand */}
        <Link
          href="/#home"
          className="text-2xl font-bold text-primary tracking-tight whitespace-nowrap flex-shrink-0"
        >
          TEKs Store
        </Link>

        {/* Navigation links */}
        <nav className="flex items-center gap-4 relative w-full justify-center">
          <a href="/#features" className="text-base font-medium text-foreground hover:text-primary transition-colors">
            Features
          </a>
          <a href="/categories" className="text-base font-medium text-foreground hover:text-primary transition-colors">
            Shop
          </a>
          <a href="/#testimonials" className="text-base font-medium text-foreground hover:text-primary transition-colors">
            Reviews
          </a>
          <a href="/#contact" className="text-base font-medium text-foreground hover:text-primary transition-colors">
            Contact
          </a>
        </nav>

        {/* Action buttons */}
        <div className="flex items-center gap-2 relative">
          {/* Cart Icon */}
          <Link href="/cart" className="p-2 rounded hover:bg-accent transition-colors">
            <ShoppingCart className="w-6 h-6 text-primary" />
          </Link>

          {/* Show nothing until auth status is resolved */}
          {loading ? null : !user ? (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            // If user is logged in, show user icon with dropdown
            <div className="relative">
              <button
                onClick={() => setUserDropdown((open) => !open)}
                className="p-2 rounded-full hover:bg-accent transition-colors"
              >
                <UserCircle className="w-7 h-7 text-primary" />
              </button>
              {userDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-background rounded shadow-lg border z-50 animate-fade-in">
                  <div className="px-4 py-3 font-medium text-primary/90">
                    {user.name}
                  </div>
                  <button
                    className="flex items-center w-full px-4 py-2 text-foreground hover:bg-muted"
                    onClick={() => {
                      setUserDropdown(false);
                      router.push("/orders");
                    }}
                  >
                    <ListOrdered className="w-4 h-4 mr-2" />
                    My Orders
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-foreground hover:bg-muted"
                    onClick={() => {
                      setUserDropdown(false);
                      router.push("/account");
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    My Account
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-foreground hover:bg-muted"
                    onClick={() => {
                      setUserDropdown(false);
                      router.push("/wishlist");
                    }}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Wishlist
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-destructive hover:bg-muted"
                    onClick={() => {
                      logout();
                      setUserDropdown(false);
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}