import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Home, MapPin, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/addresses")({
  head: () => ({
    meta: [
      { title: "Saved Addresses — SRI VENKETESWARA OIL MILL" },
      { name: "description", content: "Manage your delivery addresses for faster checkout." },
    ],
  }),
  component: Addresses,
});

type Address = {
  id: string;
  label: string;
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
};

const STORAGE_KEY = "svom_addresses_v1";

const blankAddress = {
  label: "Home",
  address: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
};

function Addresses() {
  const { user, loading } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState({ ...blankAddress });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setAddresses(JSON.parse(raw));
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses]);

  const editing = useMemo(
    () => addresses.find((address) => address.id === editingId) ?? null,
    [addresses, editingId],
  );

  useEffect(() => {
    if (!editing) {
      setForm({ ...blankAddress });
      return;
    }
    setForm({
      label: editing.label,
      address: editing.address,
      landmark: editing.landmark,
      city: editing.city,
      state: editing.state,
      pincode: editing.pincode,
      phone: editing.phone,
    });
  }, [editing]);

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const cleaned = {
      ...form,
      label: form.label.trim() || "Home",
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
      phone: form.phone.trim(),
    };

    if (!cleaned.address || !cleaned.city || !cleaned.state || !cleaned.pincode || !cleaned.phone) {
      return;
    }

    setSaving(true);
    const next = [...addresses];
    if (editingId) {
      const index = next.findIndex((address) => address.id === editingId);
      if (index >= 0) {
        next[index] = {
          ...next[index],
          ...cleaned,
        };
      }
      setEditingId(null);
    } else {
      next.push({
        id: typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}`,
        ...cleaned,
        isDefault: next.length === 0,
      });
    }
    setAddresses(next);
    setSaving(false);
    setForm({ ...blankAddress });
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((address) => ({
        ...address,
        isDefault: address.id === id,
      })),
    );
  };

  const removeAddress = (id: string) => {
    setAddresses((prev) => {
      const next = prev.filter((address) => address.id !== id);
      if (!next.some((address) => address.isDefault) && next.length > 0) {
        next[0].isDefault = true;
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-5xl px-4 py-10 text-center text-muted-foreground">
          Loading…
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <MapPin className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-6 font-serif text-3xl text-foreground">Saved addresses require an account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Please sign in to manage your delivery locations and speed up checkout.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/auth">Sign in</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/shop">Browse products</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-serif text-3xl text-foreground">Saved Addresses</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Keep multiple delivery addresses for easy checkout.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Your addresses are stored locally in your browser.
          </div>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[420px_1fr]">
          <form onSubmit={handleSave} className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{editingId ? "Edit address" : "Add new address"}</p>
                <p className="text-xs text-muted-foreground">
                  Add a location for delivery and save it for later.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <Label>Label</Label>
                <Input
                  value={form.label}
                  onChange={(event) => setForm({ ...form, label: event.target.value })}
                  placeholder="Home, Office, Relative"
                />
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  value={form.address}
                  onChange={(event) => setForm({ ...form, address: event.target.value })}
                  placeholder="Street, house number, area"
                />
              </div>
              <div>
                <Label>Landmark</Label>
                <Input
                  value={form.landmark}
                  onChange={(event) => setForm({ ...form, landmark: event.target.value })}
                  placeholder="Nearby landmark"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>City</Label>
                  <Input
                    value={form.city}
                    onChange={(event) => setForm({ ...form, city: event.target.value })}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label>State</Label>
                  <Input
                    value={form.state}
                    onChange={(event) => setForm({ ...form, state: event.target.value })}
                    placeholder="State"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Pincode</Label>
                  <Input
                    value={form.pincode}
                    onChange={(event) => setForm({ ...form, pincode: event.target.value })}
                    placeholder="Pin code"
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={form.phone}
                    onChange={(event) => setForm({ ...form, phone: event.target.value })}
                    placeholder="Mobile number"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button type="submit" disabled={saving}>
                {editingId ? "Update address" : "Save address"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ ...blankAddress });
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>

          <section className="space-y-6">
            {addresses.length === 0 ? (
              <div className="rounded-3xl border border-border bg-card p-10 text-center text-muted-foreground">
                <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-xl text-foreground">No saved addresses yet</h2>
                <p className="mt-2">Add your first delivery address to make checkout faster.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div key={address.id} className="rounded-3xl border border-border bg-card p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <Home className="h-4 w-4" />
                          {address.label}
                          {address.isDefault && (
                            <span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] uppercase tracking-[0.3em] text-primary">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground leading-6">
                          {address.address}
                          {address.landmark ? ` · ${address.landmark}` : ""}
                          <br />
                          {address.city}, {address.state} · {address.pincode}
                          <br />
                          {address.phone}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {!address.isDefault && (
                          <Button
                            variant="outline"
                            onClick={() => setDefaultAddress(address.id)}
                          >
                            Set default
                          </Button>
                        )}
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setEditingId(address.id);
                          }}
                        >
                          Edit
                        </Button>
                        <Button variant="ghost" onClick={() => removeAddress(address.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
