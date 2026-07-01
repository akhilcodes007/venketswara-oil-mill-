import { ArrowDownIcon, ArrowUpIcon, IndianRupee, ShoppingBag, Users, Package, Star, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KPIGridProps {
  data: any;
}

export function KPIGrid({ data }: KPIGridProps) {
  if (!data) return null;

  const current = data.current || {};
  const previous = data.previous || {};
  const global = data.global || {};

  const calculateChange = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return ((curr - prev) / prev) * 100;
  };

  const renderKPI = (title: string, value: string | number, change?: number, icon?: any, subtitle?: string) => {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {change !== undefined && (
            <div className={`text-xs flex items-center mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
              {Math.abs(change).toFixed(1)}% from prev. period
            </div>
          )}
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {renderKPI("Total Revenue", `₹${current.revenue?.toLocaleString() || 0}`, calculateChange(current.revenue, previous.revenue), <IndianRupee />)}
      {renderKPI("Total Orders", current.orders || 0, calculateChange(current.orders, previous.orders), <ShoppingBag />)}
      {renderKPI("Average Order Value", `₹${Math.round(current.aov || 0).toLocaleString()}`, calculateChange(current.aov, previous.aov), <IndianRupee />)}
      {renderKPI("New Customers", current.customers || 0, calculateChange(current.customers, previous.customers), <Users />)}
      
      {renderKPI("Today's Revenue", `₹${global.today_revenue?.toLocaleString() || 0}`, undefined, <IndianRupee />)}
      {renderKPI("Monthly Revenue", `₹${global.monthly_revenue?.toLocaleString() || 0}`, undefined, <IndianRupee />)}
      {renderKPI("Delivered Orders", current.delivered || 0, undefined, <Package />)}
      {renderKPI("Pending Orders", current.pending || 0, undefined, <Package />)}

      {renderKPI("Total Products", global.total_products || 0, undefined, <Package />)}
      {renderKPI("Total Categories", global.total_categories || 0, undefined, <Package />)}
      {renderKPI("Average Rating", `${Number(global.average_rating || 0).toFixed(1)} / 5`, undefined, <Star />)}
      {renderKPI("Active Partners", global.active_delivery_partners || 0, undefined, <Truck />)}
    </div>
  );
}
