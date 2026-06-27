import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/SiteHeader";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password — Sri Venkateshwara Oil Mill" },
      { name: "description", content: "Recover access to your account or use email OTP login." },
    ],
  }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      toast.error("Enter a valid email address");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(clean);
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSubmitted(true);
    toast.success("If the account exists, a reset email has been sent.");
  };

  return (
    <div className="min-h-screen bg-background px-4 py-12" style={{ background: "var(--gradient-cream)" }}>
      <SiteHeader />
      <div className="mx-auto max-w-md">
        <Link
          to="/auth"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>

        <div className="rounded-3xl border border-border bg-card p-8 shadow-xl">
          <div className="mb-6 text-center">
            <div
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-full font-serif text-xl font-bold text-[oklch(0.22_0.04_50)]"
              style={{ background: "var(--gradient-gold)" }}
            >
              SV
            </div>
            <h1 className="font-serif text-2xl font-semibold text-foreground">Forgot password</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We'll send a reset link to your email if your account is registered.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-sm text-muted-foreground">
              A password recovery email has been sent. Check your inbox and follow the instructions.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Email address
                </span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
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
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset email"}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-[11px] leading-relaxed text-muted-foreground">
            You can also sign in with a one-time code from the sign in page if you don't remember your password.
          </p>
        </div>
      </div>
    </div>
  );
}
