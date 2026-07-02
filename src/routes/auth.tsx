import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, KeyRound, ArrowLeft, Loader2, User } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign In · SRI VENKETESWARA OIL MILL" },
      { name: "description", content: "Sign in with a one-time email code." },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/shop" });
    });
  }, [navigate]);

  async function handleAuth(e?: React.FormEvent) {
    e?.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      toast.error("Enter a valid email address");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: { full_name: name },
        },
      });
      
      setLoading(false);
      if (error) {
        console.error("Signup error:", error);
        toast.error(error?.message || "Signup failed. Please try again.");
        return;
      }
      toast.success("Account created successfully. You can now sign in.");
      setMode("signin");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      
      setLoading(false);
      if (error) {
        console.error("Signin error:", error);
        toast.error(error?.message || "Sign in failed. Please try again.");
        return;
      }
      toast.success("Signed in successfully");
      navigate({ to: "/shop" });
    }
  }

  return (
    <div
      className="min-h-screen px-4 py-12"
      style={{ background: "var(--gradient-cream)" }}
    >
      <div className="mx-auto max-w-md">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <div className="rounded-3xl border border-border bg-card p-8 shadow-xl">
          <div className="mb-6 flex flex-col items-center text-center">
            <div
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-full font-serif text-xl font-bold text-[oklch(0.22_0.04_50)]"
              style={{ background: "var(--gradient-gold)" }}
            >
              SV
            </div>
            <h1 className="font-serif text-2xl font-semibold text-foreground">
              {mode === "signin" ? "Welcome back" : "Create an account"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Sign in to access your orders and wishlist."
                : "Join us for a premium traditional oil experience."}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {mode === "signup" && (
              <label className="block">
                <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Full Name
                </span>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </label>
            )}
              <label className="block">
                <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Email address
                </span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    autoFocus
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Password
                </span>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </label>
              
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === "signin" ? "Sign in" : "Create account"}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center text-sm">
              <span className="text-muted-foreground">
                {mode === "signin" ? "Don't have an account?" : "Already have an account?"}
              </span>
              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="ml-2 font-medium text-primary hover:underline"
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </div>

          <p className="mt-6 text-center text-[11px] leading-relaxed text-muted-foreground">
            By continuing, you agree to receive a one-time verification email
            from SRI VENKETESWARA OIL MILL.
          </p>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <span>Forgot your password? </span>
            <Link to="/forgot-password" className="text-primary hover:underline">
              Reset it here.
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
