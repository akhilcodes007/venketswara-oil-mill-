import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, BarChart, Bar, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface SalesChartsProps {
  data: any[];
}

export function SalesCharts({ data }: SalesChartsProps) {
  if (!data || data.length === 0) return (
    <Card className="col-span-full mb-8">
      <CardContent className="h-[350px] flex items-center justify-center text-muted-foreground">
        No sales data available for this period.
      </CardContent>
    </Card>
  );

  const formattedData = data.map(d => ({
    ...d,
    date: format(new Date(d.period), 'MMM dd')
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3f513f" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3f513f" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="date" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(val) => `₹${val}`} tick={{fontSize: 12}} tickLine={false} axisLine={false} width={80} />
                <RechartsTooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#3f513f" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Orders Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="date" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} width={40} />
                <RechartsTooltip formatter={(value) => [value, 'Orders']} cursor={{fill: '#f4f4f4'}} />
                <Bar dataKey="orders" fill="#f2e3c6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
