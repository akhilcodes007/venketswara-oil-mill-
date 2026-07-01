import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { toast } from "sonner";
import { Loader2, LayoutDashboard, Package, Image as ImageIcon, Users, ShoppingCart, Truck, Star, Mail, BarChart3 } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: "/auth" });
    }
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();
      
    if (roleData?.role !== "admin") {
      toast.error("You do not have permission to access this page.");
      throw redirect({ to: "/" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {



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
              to="/admin/reports"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted [&.active]:bg-primary [&.active]:text-primary-foreground"
            >
              <BarChart3 className="h-4 w-4" /> Reports & Analytics
            </Link>
            <Link
              to="/admin/products"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted [&.active]:bg-primary [&.active]:text-primary-foreground"
            >
              <Package className="h-4 w-4" /> Products
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted [&.active]:bg-primary [&.active]:text-primary-foreground"
            >
              <ShoppingCart className="h-4 w-4" /> Orders
            </Link>
            <Link
              to="/admin/customers"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted [&.active]:bg-primary [&.active]:text-primary-foreground"
            >
              <Users className="h-4 w-4" /> Customers
            </Link>
            <Link
              to="/admin/deliveries"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted [&.active]:bg-primary [&.active]:text-primary-foreground"
            >
              <Truck className="h-4 w-4" /> Deliveries
            </Link>
            <Link
              to="/admin/reviews"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted [&.active]:bg-primary [&.active]:text-primary-foreground"
            >
              <Star className="h-4 w-4" /> Reviews
            </Link>
            <Link
              to="/admin/emails"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted [&.active]:bg-primary [&.active]:text-primary-foreground"
            >
              <Mail className="h-4 w-4" /> Email Logs
            </Link>
            <Link
              to="/admin/delivery-partners"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted [&.active]:bg-primary [&.active]:text-primary-foreground"
            >
              <Users className="h-4 w-4" /> Delivery Partners
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
