import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingCart, LayoutDashboard, LogIn, LogOut, Heart, Menu, UserCircle } from "lucide-react";
import { useShop } from "@/lib/store";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const { cart, wishlist } = useShop();
  const count = cart.reduce((n, i) => n + i.qty, 0);
  const wishlistCount = wishlist.length;
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function initUser() {
      const { data } = await supabase.auth.getSession();
      setEmail(data.session?.user.email ?? null);
      if (data.session?.user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.session.user.id)
          .single();
        setRole(roleData?.role ?? null);
      } else {
        setRole(null);
      }
    }
    initUser();
    
    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, session) => {
      setEmail(session?.user.email ?? null);
      if (session?.user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();
        setRole(roleData?.role ?? null);
      } else {
        setRole(null);
      }
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
        ? "text-primary font-semibold"
        : "text-muted-foreground hover:text-foreground"
    }`;

  const mobileNavCls = (href: string) =>
    `block py-3 text-lg font-medium border-b border-border/50 ${
      pathname === href ? "text-primary" : "text-foreground hover:text-primary"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="p-2 -ml-2 text-foreground">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
              <SheetHeader className="text-left mb-6">
                <SheetTitle className="font-serif">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className={mobileNavCls("/")}>Home</Link>
                <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className={mobileNavCls("/shop")}>Shop</Link>
                <Link to="/heritage" onClick={() => setMobileMenuOpen(false)} className={mobileNavCls("/heritage")}>Heritage</Link>
                
                {email ? (
                  <>
                    <div className="mt-4 mb-2 text-sm text-muted-foreground uppercase tracking-widest font-semibold">Account</div>
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={mobileNavCls("/dashboard")}>Dashboard</Link>
                    <Link to="/dashboard" search={{ tab: "orders" }} onClick={() => setMobileMenuOpen(false)} className={mobileNavCls("/dashboard")}>Orders</Link>
                    <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className={mobileNavCls("/wishlist")}>Wishlist</Link>
                    {role === 'admin' && (
                      <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className={mobileNavCls("/admin")}>Admin Dashboard</Link>
                    )}
                    <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="block py-3 text-lg font-medium border-b border-border/50 text-destructive text-left w-full">
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="mt-6">
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-primary-foreground">
                      <LogIn className="h-5 w-5" /> Sign in
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 ml-2 md:ml-0 flex-1 md:flex-none">
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

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/shop" className={navCls("/shop")}>Shop</Link>
          <Link to="/heritage" className={navCls("/heritage")}>Heritage</Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex items-center gap-2">
            {email ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                    <UserCircle className="h-5 w-5 text-muted-foreground" />
                    <span className="max-w-[120px] truncate">{email}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" search={{ tab: "orders" }} className="cursor-pointer">
                      <ShoppingCart className="mr-2 h-4 w-4" /> Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist" className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" /> Wishlist
                    </Link>
                  </DropdownMenuItem>
                  {role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer font-medium text-primary">
                          <LayoutDashboard className="mr-2 h-4 w-4" /> Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive cursor-pointer focus:text-destructive focus:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <LogIn className="h-4 w-4" />
                Sign in
              </Link>
            )}
            
            <Link
              to="/wishlist"
              className="relative flex h-10 items-center gap-2 rounded-full bg-[var(--gold)] px-4 text-[oklch(0.22_0.04_50)] hover:opacity-90 transition-opacity"
            >
              <Heart className="h-4 w-4" />
              <span className="text-sm font-medium">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="ml-1 rounded-full bg-[oklch(0.11_0.05_95)] px-2 text-xs font-bold text-[var(--cream)]">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </div>

          <Link
            to="/checkout"
            className="relative flex h-10 items-center gap-2 rounded-full bg-primary px-4 md:px-5 text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <ShoppingCart className="h-5 w-5 md:h-4 md:w-4" />
            <span className="hidden md:inline text-sm font-medium">Cart</span>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 md:static md:h-auto md:w-auto items-center justify-center md:ml-1 rounded-full bg-[var(--gold)] md:px-2 text-[10px] md:text-xs font-bold text-[oklch(0.22_0.04_50)] border-2 border-background md:border-0">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}