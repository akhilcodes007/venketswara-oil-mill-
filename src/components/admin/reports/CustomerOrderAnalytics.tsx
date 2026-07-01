import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface AnalyticsProps {
  customerData: any;
  orderData: any;
  deliveryData: any;
  reviewData: any;
}

const COLORS = ['#3f513f', '#f2e3c6', '#4ade80', '#fbbf24', '#f87171', '#94a3b8'];

export function CustomerOrderAnalytics({ customerData, orderData, deliveryData, reviewData }: AnalyticsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 mb-8">
      {/* Customer Insights */}
      <Card>
        <CardHeader><CardTitle>Customer Insights</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-muted p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">{customerData?.new_customers || 0}</div>
              <div className="text-xs text-muted-foreground">New Customers</div>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">{customerData?.repeat_purchase_rate || 0}%</div>
              <div className="text-xs text-muted-foreground">Repeat Purchase Rate</div>
            </div>
          </div>
          <h4 className="text-sm font-semibold mb-2">Top Spenders</h4>
          <Table>
            <TableHeader><TableRow><TableHead>Customer</TableHead><TableHead className="text-right">Spent</TableHead></TableRow></TableHeader>
            <TableBody>
              {customerData?.top_spenders?.slice(0,4).map((c: any, i: number) => (
                <TableRow key={i}><TableCell>{c.name}</TableCell><TableCell className="text-right font-medium">₹{c.spent}</TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Status Distribution */}
      <Card>
        <CardHeader><CardTitle>Order Status Distribution</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderData?.status_distribution || []}
                  cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="count" nameKey="status"
                >
                  {(orderData?.status_distribution || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Delivery Performance */}
      <Card>
        <CardHeader><CardTitle>Delivery Partner Performance</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Partner</TableHead><TableHead className="text-center">Assigned</TableHead><TableHead className="text-center">Delivered</TableHead></TableRow></TableHeader>
            <TableBody>
              {deliveryData?.partner_performance?.map((p: any, i: number) => (
                <TableRow key={i}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell className="text-center">{p.total_assigned}</TableCell>
                  <TableCell className="text-center text-green-600 font-medium">{p.total_delivered}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Review Analytics */}
      <Card>
        <CardHeader><CardTitle>Review Analytics</CardTitle></CardHeader>
        <CardContent>
           <div className="flex items-center gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{reviewData?.average_rating || 0}</div>
              <div className="text-xs text-muted-foreground">Avg Rating</div>
            </div>
            <div className="space-y-1 flex-1">
              {reviewData?.distribution?.map((d: any) => (
                <div key={d.rating} className="flex items-center gap-2 text-xs">
                  <span className="w-8">{d.rating} Star</span>
                  <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-yellow-400 h-full" style={{ width: `${(d.count / Math.max(reviewData?.total_reviews || 1, 1)) * 100}%` }} />
                  </div>
                  <span className="w-6 text-right">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
