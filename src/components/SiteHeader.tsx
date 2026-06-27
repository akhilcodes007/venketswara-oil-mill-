import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingCart, LayoutDashboard, LogIn, LogOut, Heart } from "lucide-react";
import { useShop } from "@/lib/store";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function SiteHeader() {
  const { cart, wishlist } = useShop();
  const count = cart.reduce((n, i) => n + i.qty, 0);
  const wishlistCount = wishlist.length;
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
  }

  const navCls = (href: string) =>
    `text-sm tracking-wide transition-colors ${
      pathname === href
        ? "text-primary"
        : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full font-serif text-lg font-bold text-[oklch(0.22_0.04_50)]"
            style={{ background: "var(--gradient-gold)" }}
          >
            SV
          </div>
          <div className="leading-tight">
            <div className="text-[10px] tracking-[0.25em] text-muted-foreground">
              ESTD 1919
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/shop" className={navCls("/shop")}>Shop</Link>
          <Link to="/heritage" className={navCls("/heritage")}>Heritage</Link>
          <Link to="/wishlist" className={navCls("/wishlist")}>Wishlist</Link>
          <Link to="/profile" className={navCls("/profile")}>Profile</Link>
          <Link to="/dashboard" className={navCls("/dashboard")}>Dashboard</Link>
        </nav>

        <div className="flex items-center gap-2">
          {email ? (
            <button
              onClick={signOut}
              className="hidden items-center gap-2 rounded-full border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground md:flex"
              title={email}
            >
              <LogOut className="h-4 w-4" />
              <span className="max-w-[140px] truncate">{email}</span>
            </button>
          ) : (
            <Link
              to="/auth"
              className="hidden items-center gap-2 rounded-full border border-border px-3 py-2 text-xs text-foreground hover:bg-muted md:flex"
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </Link>
          )}
          <Link
            to="/dashboard"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground md:flex"
            aria-label="Dashboard"
          >
            <LayoutDashboard className="h-5 w-5" />
          </Link>
          <Link
            to="/wishlist"
            className="relative hidden h-10 items-center gap-2 rounded-full bg-[var(--gold)] px-4 text-[oklch(0.22_0.04_50)] hover:opacity-90 md:flex"
          >
            <Heart className="h-4 w-4" />
            <span className="text-sm font-medium">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="ml-1 rounded-full bg-[oklch(0.11_0.05_95)] px-2 text-xs font-bold text-[var(--cream)]">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            to="/checkout"
            className="relative flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-primary-foreground hover:opacity-90"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="text-sm font-medium">Cart</span>
            {count > 0 && (
              <span className="ml-1 rounded-full bg-[var(--gold)] px-2 text-xs font-bold text-[oklch(0.22_0.04_50)]">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}