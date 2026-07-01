import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, Circle, Package, Truck, Home, Bell, TrendingUp, TrendingDown, MessageSquare } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — SRI VENKETESWARA OIL MILL" },
      { name: "description", content: "Orders, payment history and live sales analytics." },
    ],
  }),
  component: Dashboard,
});

const STAGES = ["confirmed", "packed", "shipped", "out_for_delivery", "delivered"] as const;
const STAGE_LABEL: Record<string, string> = {
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out For Delivery",
  delivered: "Delivered",
};

type OrderItem = { id: string; name: string; size: string; price: number; qty: number; image?: string };
type OrderRow = {
  id: string;
  user_id: string | null;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  items: OrderItem[];
  subtotal: number;
  gst: number;
  shipping: number;
  discount: number;
  total: number;
  payment_method: string;
  status: string;
  created_at: string;
};

type ReviewRow = { id: string; product_id: string; rating: number; created_at: string };

function Dashboard() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const ordersQuery = useQuery({
    queryKey: ["orders", user?.id, isAdmin],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as OrderRow[];
    },
  });

  const reviewsQuery = useQuery({
    queryKey: ["reviews-all"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, product_id, rating, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ReviewRow[];
    },
  });

  // Realtime new-order alerts for the owner
  useEffect(() => {
    if (!isAdmin) return;
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") Notification.requestPermission();
    }
    const channel = supabase
      .channel("orders-owner")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          const o = payload.new as OrderRow;
          toast.success(`New order from ${o.customer_name} · ₹${o.total}`, {
            description: `${o.items.length} item(s) · ${o.payment_method}`,
          });
          try { audioRef.current?.play().catch(() => {}); } catch {}
          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            new Notification("New order received", {
              body: `${o.customer_name} placed an order of ₹${o.total}`,
            });
          }
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, queryClient]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="font-serif text-2xl text-foreground">Sign in to view your dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Track orders, view payment history and manage your account.
          </p>
          <Button asChild className="mt-5"><Link to="/auth">Sign in</Link></Button>
        </div>
      </div>
    );
  }

  const orders = ordersQuery.data ?? [];
  const reviews = reviewsQuery.data ?? [];
  const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0);
  const today = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.created_at).toDateString() === today);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <audio ref={audioRef} src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=" preload="auto" />
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-3xl md:text-4xl text-foreground">
                {isAdmin ? "Owner Dashboard" : "Your Dashboard"}
              </h1>
              {isAdmin && (
                <Badge className="bg-[var(--gold)] text-[oklch(0.22_0.04_50)]">
                  <Bell className="mr-1 h-3 w-3" /> Live alerts on
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {isAdmin
                ? "Realtime order feed, sales mix and review trends."
                : "Track orders, payment history and delivery progress."}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/shop">Continue shopping</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label={isAdmin ? "Total Orders" : "My Orders"} value={orders.length.toString()} />
          <Stat label="Today's Orders" value={todayOrders.length.toString()} />
          <Stat label={isAdmin ? "Total Revenue" : "Spent Total"} value={`₹${totalRevenue}`} />
          <Stat
            label="Avg. Order Value"
            value={`₹${orders.length ? Math.round(totalRevenue / orders.length) : 0}`}
          />
        </div>

        {isAdmin && (
          <>
            <ProductSalesMix orders={orders} />
            <ReviewsCompare reviews={reviews} />
          </>
        )}

        <section className="mt-12">
          <h2 className="font-serif text-2xl text-foreground">
            {isAdmin ? "All Orders" : "My Orders"}
          </h2>
          {ordersQuery.isLoading ? (
            <div className="mt-4 rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
              Loading orders…
            </div>
          ) : orders.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
              No orders yet.
            </div>
          ) : (
            <div className="mt-4 space-y-5">
              {orders.map((o) => (
                <article key={o.id} className="rounded-2xl border border-border bg-card p-6">
                  <header className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-mono text-xs text-muted-foreground">
                        Order #{o.id.slice(0, 8).toUpperCase()}
                      </div>
                      <div className="mt-1 font-serif text-lg text-foreground">{o.customer_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(o.created_at).toLocaleString()} · {o.payment_method}
                        {isAdmin && o.phone && ` · ${o.phone}`}
                      </div>
                      {isAdmin && (
                        <div className="mt-1 text-xs text-muted-foreground">{o.address}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge className="bg-primary text-primary-foreground capitalize">
                        {STAGE_LABEL[o.status] ?? o.status}
                      </Badge>
                      <div className="mt-2 font-serif text-2xl font-semibold text-foreground">
                        ₹{o.total}
                      </div>
                    </div>
                  </header>

                  <Tracker status={o.status} />

                  <ul className="mt-4 grid gap-2 text-sm md:grid-cols-2">
                    {o.items.map((i) => (
                      <li key={i.id + i.size} className="flex justify-between rounded-lg bg-muted/50 px-3 py-2">
                        <span className="text-foreground">{i.name} · {i.size} × {i.qty}</span>
                        <span className="text-muted-foreground">₹{i.price * i.qty}</span>
                      </li>
                    ))}
                  </ul>

                  {isAdmin && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {STAGES.map((s) => (
                        <button
                          key={s}
                          onClick={async () => {
                            const { error } = await supabase
                              .from("orders").update({ status: s }).eq("id", o.id);
                            if (error) toast.error(error.message);
                            else {
                              toast.success(`Marked as ${STAGE_LABEL[s]}`);
                              queryClient.invalidateQueries({ queryKey: ["orders"] });
                            }
                          }}
                          className={`rounded-full border px-3 py-1 text-xs transition ${
                            o.status === s
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background hover:border-primary/40"
                          }`}
                        >
                          {STAGE_LABEL[s]}
                        </button>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl text-foreground">Payment History</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                      No payments yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-mono text-xs">{o.id.slice(0, 8).toUpperCase()}</TableCell>
                      <TableCell>{o.customer_name}</TableCell>
                      <TableCell>{o.payment_method}</TableCell>
                      <TableCell>{new Date(o.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right font-medium">₹{o.total}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-serif text-3xl font-semibold text-foreground">{value}</div>
    </div>
  );
}

function Tracker({ status }: { status: string }) {
  const currentIdx = Math.max(0, STAGES.indexOf(status as (typeof STAGES)[number]));
  const icons = [CheckCircle2, Package, Truck, Truck, Home];
  return (
    <div className="mt-5 flex items-center gap-2">
      {STAGES.map((s, i) => {
        const Icon = i <= currentIdx ? icons[i] : Circle;
        const active = i <= currentIdx;
        return (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className={`hidden text-xs md:block ${active ? "text-foreground" : "text-muted-foreground"}`}>
              {STAGE_LABEL[s]}
            </div>
            {i < STAGES.length - 1 && (
              <div className={`h-px flex-1 ${i < currentIdx ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ProductSalesMix({ orders }: { orders: OrderRow[] }) {
  const stats = useMemo(() => {
    const map = new Map<string, { name: string; units: number; revenue: number }>();
    let totalUnits = 0;
    for (const o of orders) {
      for (const it of o.items) {
        const key = it.id;
        const cur = map.get(key) ?? { name: it.name, units: 0, revenue: 0 };
        cur.units += it.qty;
        cur.revenue += it.qty * it.price;
        map.set(key, cur);
        totalUnits += it.qty;
      }
    }
    const rows = Array.from(map.entries()).map(([id, v]) => ({
      id,
      ...v,
      pct: totalUnits ? (v.units / totalUnits) * 100 : 0,
    }));
    rows.sort((a, b) => b.units - a.units);
    return { rows, totalUnits };
  }, [orders]);

  const top = stats.rows[0];
  const low = stats.rows.filter((r) => r.units > 0).slice(-1)[0];

  return (
    <section className="mt-10">
      <h2 className="font-serif text-2xl text-foreground">Product Sales Mix</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Share of every product in total units sold.
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <SignalCard
          tone="up"
          title="Top seller"
          name={top?.name ?? "—"}
          detail={top ? `${top.units} units · ${top.pct.toFixed(1)}% of sales` : "No data yet"}
        />
        <SignalCard
          tone="down"
          title="Lowest mover"
          name={low?.name ?? "—"}
          detail={low ? `${low.units} units · ${low.pct.toFixed(1)}% of sales` : "No data yet"}
        />
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Units sold</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead className="w-[40%]">Share of sales</TableHead>
              <TableHead className="text-right">%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.totalUnits === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  Sales data will appear after the first order.
                </TableCell>
              </TableRow>
            ) : (
              stats.rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium text-foreground">{r.name}</TableCell>
                  <TableCell>{r.units}</TableCell>
                  <TableCell>₹{r.revenue}</TableCell>
                  <TableCell>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${r.pct.toFixed(1)}%` }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">{r.pct.toFixed(1)}%</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

function SignalCard({ tone, title, name, detail }: { tone: "up" | "down"; title: string; name: string; detail: string }) {
  const Icon = tone === "up" ? TrendingUp : TrendingDown;
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className={`h-4 w-4 ${tone === "up" ? "text-primary" : "text-destructive"}`} />
        {title}
      </div>
      <div className="mt-2 font-serif text-2xl text-foreground">{name}</div>
      <div className="mt-1 text-sm text-muted-foreground">{detail}</div>
    </div>
  );
}

function ReviewsCompare({ reviews }: { reviews: ReviewRow[] }) {
  const { thisCount, lastCount, thisAvg, lastAvg, productNames } = useMemo(() => {
    const now = new Date();
    const startThis = new Date(now.getFullYear(), now.getMonth(), 1);
    const startLast = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endLast = startThis;
    const productNames = new Map(PRODUCTS.map((p) => [p.id, p.name]));
    const inThis = reviews.filter((r) => new Date(r.created_at) >= startThis);
    const inLast = reviews.filter((r) => {
      const d = new Date(r.created_at);
      return d >= startLast && d < endLast;
    });
    const avg = (arr: ReviewRow[]) =>
      arr.length ? arr.reduce((s, r) => s + r.rating, 0) / arr.length : 0;
    return {
      thisCount: inThis.length,
      lastCount: inLast.length,
      thisAvg: avg(inThis),
      lastAvg: avg(inLast),
      productNames,
    };
  }, [reviews]);

  const diff = thisCount - lastCount;
  const pctChange = lastCount === 0
    ? (thisCount > 0 ? 100 : 0)
    : ((thisCount - lastCount) / lastCount) * 100;

  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl text-foreground">Customer Reviews</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        This month compared with the previous month.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Stat label="Reviews this month" value={thisCount.toString()} />
        <Stat label="Reviews last month" value={lastCount.toString()} />
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            {diff >= 0 ? (
              <TrendingUp className="h-4 w-4 text-primary" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
            Change
          </div>
          <div className="mt-2 font-serif text-3xl font-semibold text-foreground">
            {diff >= 0 ? "+" : ""}{diff} ({pctChange >= 0 ? "+" : ""}{pctChange.toFixed(0)}%)
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Avg rating: {thisAvg.toFixed(1)} ★ this · {lastAvg.toFixed(1)} ★ last
          </div>
        </div>
      </div>

      {reviews.length > 0 && (
        <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.slice(0, 10).map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium text-foreground">
                    <MessageSquare className="mr-1 inline h-3 w-3 text-muted-foreground" />
                    {productNames.get(r.product_id) ?? r.product_id}
                  </TableCell>
                  <TableCell>{"★".repeat(r.rating)}<span className="text-muted-foreground">{"★".repeat(5 - r.rating)}</span></TableCell>
                  <TableCell>{new Date(r.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
