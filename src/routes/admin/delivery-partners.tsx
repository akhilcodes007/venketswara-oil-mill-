// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Plus, Search, Pencil, Trash2, Loader2, Truck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/delivery-partners")({
  component: AdminDeliveryPartners,
});

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name is required"),
  mobile: z.string().min(10, "Valid mobile number is required"),
  vehicle_type: z.string().min(2, "Vehicle type is required"),
  vehicle_number: z.string().min(4, "Vehicle number is required"),
  is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof schema>;

function AdminDeliveryPartners() {
  const [partners, setPartners] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      mobile: "",
      vehicle_type: "",
      vehicle_number: "",
      is_active: true,
    },
  });

  const fetchPartners = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("delivery_partners")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      toast.error("Failed to load delivery partners");
    } else {
      setPartners(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const openAddDialog = () => {
    setSelectedPartner(null);
    form.reset({
      name: "",
      mobile: "",
      vehicle_type: "",
      vehicle_number: "",
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (partner: any) => {
    setSelectedPartner(partner);
    form.reset({
      id: partner.id,
      name: partner.name,
      mobile: partner.mobile,
      vehicle_type: partner.vehicle_type,
      vehicle_number: partner.vehicle_number,
      is_active: partner.is_active ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this delivery partner? Note: If they have active deliveries, this will fail.")) return;
    const { error } = await supabase.from("delivery_partners").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Delivery partner deleted successfully");
      fetchPartners();
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (selectedPartner) {
      const { error } = await supabase.from("delivery_partners").update(values).eq("id", selectedPartner.id);
      if (error) toast.error(error.message);
      else toast.success("Delivery partner updated successfully");
    } else {
      const { error } = await supabase.from("delivery_partners").insert([values]);
      if (error) toast.error(error.message);
      else toast.success("Delivery partner created successfully");
    }

    setIsDialogOpen(false);
    fetchPartners();
  };

  const filtered = partners.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.mobile.includes(search) ||
    p.vehicle_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Delivery Partners</h1>
          <p className="text-muted-foreground">Manage your delivery fleet and personnel.</p>
        </div>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus className="h-4 w-4" /> Add Partner
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, mobile or vehicle #..." 
            className="pl-9" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partner Name</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Vehicle Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No delivery partners found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                        <Truck className="h-4 w-4" />
                      </div>
                      {partner.name}
                    </div>
                  </TableCell>
                  <TableCell>{partner.mobile}</TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{partner.vehicle_number}</div>
                    <div className="text-xs text-muted-foreground capitalize">{partner.vehicle_type}</div>
                  </TableCell>
                  <TableCell>
                    {partner.is_active ? (
                      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" onClick={() => openEditDialog(partner)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="text-destructive border-destructive/20 hover:bg-destructive/5" onClick={() => handleDelete(partner.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPartner ? "Edit Delivery Partner" : "Add Delivery Partner"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="mobile" render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="vehicle_type" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Type</FormLabel>
                    <FormControl><Input placeholder="e.g. Van, Bike" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="vehicle_number" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Number</FormLabel>
                    <FormControl><Input placeholder="KA 01 AB 1234" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* @ts-expect-error - rhf default vs zod */}
              <FormField control={form.control} name="is_active" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <p className="text-sm text-muted-foreground">Is this partner currently available?</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )} />

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">
                  {selectedPartner ? "Save Changes" : "Create Partner"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
