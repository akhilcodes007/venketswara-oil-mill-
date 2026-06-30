import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/cms")({
  component: AdminCMS,
});

function AdminCMS() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CMS & Banners</h1>
          <p className="text-muted-foreground">
            Manage your homepage banners and content.
          </p>
        </div>
      </div>
      
      <div className="rounded-md border p-8 text-center text-muted-foreground">
        Banner management interface will go here.
      </div>
    </div>
  );
}
