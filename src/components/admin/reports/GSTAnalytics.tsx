import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

export function GSTAnalytics({ data }: { data: any }) {
  if (!data) return null;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>GST Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <span className="text-sm text-muted-foreground block">Total GST Collected (Selected Period)</span>
          <span className="text-3xl font-bold">₹{data.total_gst?.toLocaleString() || 0}</span>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead className="text-right">GST Collected</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.monthly?.map((m: any, i: number) => (
              <TableRow key={i}>
                <TableCell>{format(new Date(m.month), 'MMMM yyyy')}</TableCell>
                <TableCell className="text-right font-medium">₹{m.gst}</TableCell>
              </TableRow>
            ))}
            {(!data.monthly || data.monthly.length === 0) && (
              <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground">No GST data available.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
