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

// Dummy authentication state
const useAuth = () => {
  const [user, setUser] = useState<{ name: string } | null>(null);
  return {
    user,
    login: () => setUser({ name: "John Doe" }),
    logout: () => setUser(null),
  };
};

// Example: category columns (customize as needed)
const productColumns = [
  {
    title: "Laptops",
    items: [
      { label: "Laptops", href: "/categories/laptops" },
      { label: "Laptops | Used", href: "/categories/laptops-used" },
      { label: "Laptop Accessories", href: "/categories/laptop-accessories" },
      { label: "Cameras | Drones", href: "/categories/cameras-drones" },
      { label: "Cartridges & Toners", href: "/categories/cartridges-toners" },
      { label: "Casing", href: "/categories/casing" },
      { label: "Cooling Solutions", href: "/categories/cooling-solutions" },
    ],
  },
  {
    title: "Gaming",
    items: [
      { label: "Desktop Computers", href: "/categories/desktop-computers" },
      { label: "Gaming Consoles", href: "/categories/gaming-consoles" },
      { label: "Gaming Furniture", href: "/categories/gaming-furniture" },
      { label: "Gaming Products", href: "/categories/gaming-products" },
      { label: "Graphic Cards", href: "/categories/graphic-cards" },
      { label: "Graphic Tablets", href: "/categories/graphic-tablets" },
      { label: "Hard Drives", href: "/categories/hard-drives" },
    ],
  },
  {
    title: "Peripherals",
    items: [
      { label: "Headsets | Headphones | Mic", href: "/categories/headsets-headphones-mic" },
      { label: "Keyboard", href: "/categories/keyboard" },
      { label: "LCD/LED Monitors", href: "/categories/monitors" },
      { label: "Memory Cards", href: "/categories/memory-cards" },
      { label: "Memory Module / RAM", href: "/categories/ram" },
      { label: "Motherboards", href: "/categories/motherboards" },
      { label: "Mouse", href: "/categories/mouse" },
    ],
  },
  {
    title: "Network & Office",
    items: [
      { label: "Network Products", href: "/categories/network-products" },
      { label: "Peripherals / Misc", href: "/categories/peripherals-misc" },
      { label: "Point Of Sale POS", href: "/categories/pos" },
      { label: "Power Supply", href: "/categories/power-supply" },
      { label: "Presenters", href: "/categories/presenters" },
      { label: "Printers", href: "/categories/printers" },
      { label: "Processors", href: "/categories/processors" },
    ],
  },
  {
    title: "More",
    items: [
      { label: "Projectors", href: "/categories/projectors" },
      { label: "Scanner", href: "/categories/scanner" },
      { label: "Smart Watches", href: "/categories/smart-watches" },
      { label: "Softwares", href: "/categories/softwares" },
      { label: "Solid-State Drives (SSD)", href: "/categories/ssd" },
      { label: "Speakers", href: "/categories/speakers" },
      { label: "Stabilizer", href: "/categories/stabilizer" },
    ],
  },
  {
    title: "Tablets & Media",
    items: [
      { label: "Tablet PC", href: "/categories/tablet-pc" },
      { label: "Tablet Accessories", href: "/categories/tablet-accessories" },
      { label: "TV Devices | Streaming", href: "/categories/tv-streaming" },
      { label: "Media Players", href: "/categories/media-players" },
      { label: "UPS", href: "/categories/ups" },
      { label: "USB Flash Drives", href: "/categories/usb-flash-drives" },
      { label: "Used Products", href: "/categories/used-products" },
    ],
  },
];

export function Header() {
  const { user, logout } = useAuth();
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
          {/* Products Dropdown */}
          <div className="relative" ref={productsDropdownRef}>
            <button
              onClick={() => setProductsDropdown((open) => !open)}
              className={`text-base font-medium transition-colors flex items-center gap-1 px-2 py-1 rounded ${
                productsDropdown
                  ? "text-yellow-500 bg-muted"
                  : "text-foreground hover:text-primary"
              }`}
              aria-haspopup="true"
              aria-expanded={productsDropdown}
              type="button"
            >
              Products
              <ChevronDown className="w-4 h-4" />
            </button>
            {productsDropdown && (
              <div
                className="fixed left-1/2 top-[4.5rem] z-40"
                style={{
                  transform: "translateX(-50%)",
                  minWidth: "900px",
                  maxWidth: "95vw",
                }}
              >
                <div className="bg-background border rounded shadow-lg animate-fade-in p-6 flex gap-8"
                  style={{ minHeight: 260 }}
                >
                  {productColumns.map((col, idx) => (
                    <div key={idx} className="min-w-[120px]">
                      <div className="mb-2 font-semibold text-primary/80 tracking-wide text-sm">{col.title}</div>
                      <ul className="space-y-1">
                        {col.items.map((item, ii) => (
                          <li key={ii}>
                            <Link
                              href={item.href}
                              className="text-sm text-foreground hover:text-primary hover:underline transition rounded focus:outline-none focus:ring-2 focus:ring-primary/30 px-1"
                              onClick={() => setProductsDropdown(false)}
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
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

          {/* If user is not logged in, show Sign In/Sign Up */}
          {!user ? (
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