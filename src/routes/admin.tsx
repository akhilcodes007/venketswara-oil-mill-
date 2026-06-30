import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { toast } from "sonner";
import { Loader2, LayoutDashboard, Package, Image as ImageIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAdmin() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate({ to: "/auth" });
        return;
      }
      // Simplified check for Phase 1. Ideally this calls an edge function or checks role in table.
      // Assuming we have a user_roles table
      const { data: roleData, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();
        
      if (error || roleData?.role !== "admin") {
        toast.error("Unauthorized access.");
        navigate({ to: "/" });
        return;
      }
      setIsAdmin(true);
    }
    checkAdmin();
  }, [navigate]);

  if (isAdmin === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:flex-row md:p-8">
        <aside className="w-full shrink-0 md:w-64">
          <nav className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Admin Menu
            </h2>
            <Link
              to="/admin"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted [&.active]:bg-primary [&.active]:text-primary-foreground"
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
            <Link
              to="/admin/products"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted [&.active]:bg-primary [&.active]:text-primary-foreground"
            >
              <Package className="h-4 w-4" /> Products
            </Link>
            <Link
              to="/admin/cms"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted [&.active]:bg-primary [&.active]:text-primary-foreground"
            >
              <ImageIcon className="h-4 w-4" /> CMS & Banners
            </Link>
          </nav>
        </aside>
        <main className="flex-1">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm min-h-[500px]">
            <Outlet />
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
