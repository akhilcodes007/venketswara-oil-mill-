import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, ArrowRight, Heart, MapPin, User, ShoppingBag } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — SRI VENKETESWARA OIL MILL" },
      { name: "description", content: "Manage your account, saved addresses, and wishlist." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { user, loading } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    setSigningOut(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-foreground">Customer Profile</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your account information, saved addresses, and wishlist.
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-border bg-card p-10 text-center text-muted-foreground">
            Loading profile…
          </div>
        ) : !user ? (
          <div className="rounded-3xl border border-border bg-card p-10 text-center">
            <User className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-4 font-serif text-xl text-foreground">Sign in to access your profile</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your wishlist and saved addresses are kept in your browser for easy checkout.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/shop">Continue shopping</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <section className="rounded-3xl border border-border bg-card p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Account</p>
                  <h2 className="mt-3 font-serif text-2xl text-foreground">{user.email ?? "Profile"}</h2>
                </div>
                <Badge variant="secondary">Signed in</Badge>
              </div>

              <div className="mt-8 space-y-4 text-sm text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <p>{user.email}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">User ID</p>
                  <p className="break-all">{user.id}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Authentication</p>
                  <p>Email OTP login via Supabase.</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild>
                  <Link to="/addresses">Saved addresses</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/wishlist">Wishlist</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link to="/dashboard">Orders</Link>
                </Button>
              </div>
            </section>

            <section className="rounded-3xl border border-border bg-card p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Quick actions</p>
              <div className="mt-6 space-y-4">
                <Link
                  to="/addresses"
                  className="flex items-center gap-3 rounded-2xl border border-border bg-background/70 p-4 text-sm text-foreground transition hover:border-primary hover:bg-primary/5"
                >
                  <MapPin className="h-5 w-5" />
                  Manage your saved addresses
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center gap-3 rounded-2xl border border-border bg-background/70 p-4 text-sm text-foreground transition hover:border-primary hover:bg-primary/5"
                >
                  <Heart className="h-5 w-5" />
                  Review wishlist items
                </Link>
                <Link
                  to="/checkout"
                  className="flex items-center gap-3 rounded-2xl border border-border bg-background/70 p-4 text-sm text-foreground transition hover:border-primary hover:bg-primary/5"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Continue to checkout
                </Link>
              </div>
              <div className="mt-8 border-t border-border pt-6">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Help</p>
                <div className="mt-4 text-sm text-muted-foreground">
                  If you need help, use the WhatsApp support button at the bottom of the screen.
                </div>
              </div>
            </section>
          </div>
        )}

        {user && (
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={signOut} variant="outline" disabled={signingOut}>
              {signingOut ? "Signing out…" : "Sign out"}
            </Button>
            <Button asChild variant="ghost">
              <Link to="/shop">Back to shop</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
