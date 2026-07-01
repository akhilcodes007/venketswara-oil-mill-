import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ProductAnalyticsProps {
  data: any;
  inventory: any;
}

export function ProductAnalytics({ data, inventory }: ProductAnalyticsProps) {
  if (!data || !inventory) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 mb-8">
      {/* Top Selling */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products (Qty)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Product</TableHead><TableHead className="text-right">Sold</TableHead></TableRow></TableHeader>
            <TableBody>
              {data.top_selling?.map((p: any, i: number) => (
                <TableRow key={i}><TableCell>{p.name}</TableCell><TableCell className="text-right font-medium">{p.qty}</TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Highest Revenue */}
      <Card>
        <CardHeader>
          <CardTitle>Highest Revenue Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Product</TableHead><TableHead className="text-right">Revenue</TableHead></TableRow></TableHeader>
            <TableBody>
              {data.highest_revenue?.map((p: any, i: number) => (
                <TableRow key={i}><TableCell>{p.name}</TableCell><TableCell className="text-right font-medium text-green-600">₹{p.revenue}</TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Least Selling */}
      <Card>
        <CardHeader>
          <CardTitle>Least Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Product</TableHead><TableHead className="text-right">Sold</TableHead></TableRow></TableHeader>
            <TableBody>
              {data.least_selling?.map((p: any, i: number) => (
                <TableRow key={i}><TableCell>{p.name}</TableCell><TableCell className="text-right font-medium">{p.qty}</TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Inventory Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm font-medium">Total Inventory Value</span>
              <span className="font-bold">₹{inventory.total_stock_value?.toLocaleString()}</span>
            </div>
            
            {inventory.out_of_stock?.length > 0 && (
              <div>
                <span className="text-sm font-bold text-red-600 mb-2 block">Out of Stock ({inventory.out_of_stock.length})</span>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  {inventory.out_of_stock.slice(0,3).map((p:any, i:number) => <li key={i}>{p.name}</li>)}
                </ul>
              </div>
            )}
            {inventory.low_stock?.length > 0 && (
              <div>
                <span className="text-sm font-bold text-orange-500 mb-2 block">Low Stock ({inventory.low_stock.length})</span>
                <ul className="text-sm space-y-1 text-muted-foreground flex flex-wrap gap-2">
                  {inventory.low_stock.slice(0,3).map((p:any, i:number) => <li key={i} className="bg-orange-100 text-orange-800 px-2 rounded">{p.name} ({p.stock})</li>)}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
