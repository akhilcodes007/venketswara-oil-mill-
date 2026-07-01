import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Download, Printer } from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";

import { KPIGrid } from "@/components/admin/reports/KPIGrid";
import { SalesCharts } from "@/components/admin/reports/SalesCharts";
import { ProductAnalytics } from "@/components/admin/reports/ProductAnalytics";
import { CustomerOrderAnalytics } from "@/components/admin/reports/CustomerOrderAnalytics";
import { GSTAnalytics } from "@/components/admin/reports/GSTAnalytics";

export const Route = createFileRoute("/admin/reports")({
  component: AdminReports,
});

function AdminReports() {
  const [dateRange, setDateRange] = useState("last30");
  const [loading, setLoading] = useState(true);
  
  const [kpis, setKpis] = useState<any>(null);
  const [sales, setSales] = useState<any[]>([]);
  const [products, setProducts] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [gst, setGst] = useState<any>(null);
  const [inventory, setInventory] = useState<any>(null);
  const [customers, setCustomers] = useState<any>(null);
  const [orders, setOrders] = useState<any>(null);
  const [deliveries, setDeliveries] = useState<any>(null);
  const [reviews, setReviews] = useState<any>(null);

  const printRef = useRef<HTMLDivElement>(null);

  const getDateFilter = () => {
    const today = new Date();
    let start = today;
    let end = today;
    let grouping = "day";

    switch (dateRange) {
      case "today":
        start = new Date(today.setHours(0,0,0,0));
        end = new Date(today.setHours(23,59,59,999));
        break;
      case "yesterday":
        start = subDays(new Date(today.setHours(0,0,0,0)), 1);
        end = subDays(new Date(today.setHours(23,59,59,999)), 1);
        break;
      case "last7":
        start = subDays(today, 7);
        break;
      case "last30":
        start = subDays(today, 30);
        grouping = "week";
        break;
      case "thisMonth":
        start = startOfMonth(today);
        end = endOfMonth(today);
        grouping = "week";
        break;
      case "lastMonth":
        start = startOfMonth(subDays(startOfMonth(today), 1));
        end = endOfMonth(start);
        grouping = "week";
        break;
      case "thisYear":
        start = startOfYear(today);
        end = endOfYear(today);
        grouping = "month";
        break;
    }
    return { start: start.toISOString(), end: end.toISOString(), grouping };
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const { start, end, grouping } = getDateFilter();
      const p = { p_start: start, p_end: end };

      const [rKpi, rSales, rProd, rCat, rGst, rInv, rCust, rOrd, rDel, rRev] = await Promise.all([
        supabase.rpc("get_dashboard_kpis", p),
        supabase.rpc("get_sales_analytics", { ...p, p_grouping: grouping }),
        supabase.rpc("get_product_analytics", p),
        supabase.rpc("get_category_analytics", p),
        supabase.rpc("get_gst_analytics", p),
        supabase.rpc("get_inventory_analytics"),
        supabase.rpc("get_customer_analytics", p),
        supabase.rpc("get_order_analytics", p),
        supabase.rpc("get_delivery_analytics", p),
        supabase.rpc("get_review_analytics", p)
      ]);

      setKpis(rKpi.data);
      setSales(rSales.data);
      setProducts(rProd.data);
      setCategories(rCat.data);
      setGst(rGst.data);
      setInventory(rInv.data);
      setCustomers(rCust.data);
      setOrders(rOrd.data);
      setDeliveries(rDel.data);
      setReviews(rRev.data);
    } catch (err) {
      toast.error("Failed to load analytics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    let debounceTimer: NodeJS.Timeout;
    const handleRealtime = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => loadData(), 2000); // 2 sec debounce
    };

    const channels = supabase.channel('custom-all-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'new_orders' }, handleRealtime)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, handleRealtime)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, handleRealtime)
      .subscribe();

    return () => {
      clearTimeout(debounceTimer);
      supabase.removeChannel(channels);
    };
  }, [dateRange]);

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    
    // Summary
    const summaryData = [
      ["Report Generated", format(new Date(), "PPpp")],
      ["Date Range Filter", dateRange],
      ["Total Revenue", kpis?.current?.revenue],
      ["Total Orders", kpis?.current?.orders],
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryData), "Summary");
    
    // Sales
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sales || []), "Sales");
    
    // Products
    if (products?.top_selling) {
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(products.top_selling), "Top Products");
    }

    XLSX.writeFile(wb, `SVOM_Analytics_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(`SRI VENKETESWARA OIL MILL - Analytics Report`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), "PPpp")} | Range: ${dateRange}`, 14, 22);
    
    autoTable(doc, {
      startY: 30,
      head: [['Metric', 'Value']],
      body: [
        ['Total Revenue', `Rs. ${kpis?.current?.revenue}`],
        ['Total Orders', kpis?.current?.orders],
        ['Total Customers', kpis?.current?.customers],
        ['Average Order Value', `Rs. ${Math.round(kpis?.current?.aov || 0)}`]
      ],
    });

    autoTable(doc, {
      head: [['Period', 'Revenue', 'Orders']],
      body: sales?.map(s => [format(new Date(s.period), 'PP'), s.revenue, s.orders]) || []
    });

    doc.save(`SVOM_Analytics_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `SVOM_Analytics_${format(new Date(), 'yyyy-MM-dd')}`,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Monitor your business performance and insights.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last7">Last 7 Days</SelectItem>
              <SelectItem value="last30">Last 30 Days</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={handleExportExcel} title="Export to Excel">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleExportPDF} title="Export to PDF">
            <span className="font-bold text-xs">PDF</span>
          </Button>
          <Button variant="outline" size="icon" onClick={() => handlePrint()} title="Print Report">
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div ref={printRef} className="print:p-8 space-y-8 bg-white/50 p-2 rounded-xl">
          <div className="hidden print:block mb-8">
            <h1 className="text-3xl font-serif font-bold text-[#3f513f]">SRI VENKETESWARA OIL MILL</h1>
            <h2 className="text-xl mt-2">Analytics Report</h2>
            <p className="text-sm text-gray-500 mt-1">Generated: {format(new Date(), 'PPpp')} | Filter: {dateRange}</p>
          </div>

          <KPIGrid data={kpis} />
          <SalesCharts data={sales} />
          <CustomerOrderAnalytics 
            customerData={customers} 
            orderData={orders} 
            deliveryData={deliveries} 
            reviewData={reviews} 
          />
          <ProductAnalytics data={products} inventory={inventory} />
          <GSTAnalytics data={gst} />
        </div>
      )}
    </div>
  );
}
