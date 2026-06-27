import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, KeyRound, ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign In · Sri Venkateshwara Oil Mill" },
      { name: "description", content: "Sign in with a one-time email code." },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/shop" });
    });
  }, [navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function sendCode(e?: React.FormEvent) {
    e?.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      toast.error("Enter a valid email address");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: clean,
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setEmail(clean);
    setStep("otp");
    setCooldown(45);
    toast.success("Verification code sent to your email");
  }

  async function verifyCode(e?: React.FormEvent) {
    e?.preventDefault();
    if (code.length < 6) {
      toast.error("Enter the 6-digit code");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: "email",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Signed in successfully");
    navigate({ to: "/shop" });
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
              {step === "email" ? "Welcome" : "Verify your email"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {step === "email"
                ? "Sign in or create an account with a one-time code sent to your email."
                : `We sent a 6-digit code to ${email}`}
            </p>
          </div>

          {step === "email" ? (
            <form onSubmit={sendCode} className="space-y-4">
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
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Send verification code
              </button>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  6-digit code
                </span>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    autoFocus
                    maxLength={6}
                    required
                    value={code}
                    onChange={(e) =>
                      setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="123456"
                    className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-3 text-center text-lg font-semibold tracking-[0.4em] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </label>
              <button
                type="submit"
                disabled={loading || code.length < 6}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Verify & continue
              </button>
              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setCode("");
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Change email
                </button>
                <button
                  type="button"
                  disabled={cooldown > 0 || loading}
                  onClick={() => sendCode()}
                  className="font-medium text-primary disabled:text-muted-foreground"
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-[11px] leading-relaxed text-muted-foreground">
            By continuing, you agree to receive a one-time verification email
            from Sri Venkateshwara Oil Mill.
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