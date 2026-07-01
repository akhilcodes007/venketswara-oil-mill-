import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, RefreshCw, Mail, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export const Route = createFileRoute("/admin/emails")({
  component: AdminEmails,
});

function AdminEmails() {
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    let query = supabase
      .from("email_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;
    if (error) {
      toast.error("Failed to load email logs");
    } else {
      setLogs(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [statusFilter]);

  const handleRetry = async (log: any) => {
    if (log.attempts >= 5) {
      toast.error("Maximum retry attempts (5) reached.");
      return;
    }

    toast.info("Retrying email...");
    
    // Call the edge function manually or reset status to trigger webhook
    // We will reset the status to pending and clear the error, assuming the webhook listens to UPDATE or INSERT
    // Wait, typical Supabase webhooks listen to INSERT.
    // If webhook is INSERT only, we can call the edge function directly, or insert a new row.
    // Let's invoke the edge function directly for retry.
    
    const { data, error } = await supabase.functions.invoke('process-email', {
      body: { record: log }
    });

    if (error) {
      toast.error(`Retry failed: ${error.message}`);
    } else if (data?.error) {
      toast.error(`Retry failed: ${data.error}`);
    } else {
      toast.success("Email sent successfully!");
    }
    
    fetchLogs();
  };

  const filtered = logs.filter(l => 
    l.recipient?.toLowerCase().includes(search.toLowerCase()) || 
    l.subject?.toLowerCase().includes(search.toLowerCase()) ||
    l.template?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Sent</Badge>;
      case 'failed': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-none">Failed</Badge>;
      case 'processing': return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none">Processing</Badge>;
      default: return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-none">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Email Logs</h1>
          <p className="text-muted-foreground">Monitor automated emails and retry failures.</p>
        </div>
        <Button onClick={fetchLogs} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search recipient, subject, or template..." 
            className="pl-9" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant={statusFilter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('all')}>All</Button>
          <Button variant={statusFilter === 'pending' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('pending')}>Pending</Button>
          <Button variant={statusFilter === 'sent' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('sent')}>Sent</Button>
          <Button variant={statusFilter === 'failed' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('failed')}>Failed</Button>
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recipient</TableHead>
              <TableHead>Template & Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Attempts</TableHead>
              <TableHead>Created / Sent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No email logs found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {log.recipient}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-sm">{log.template}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[250px]" title={log.subject}>
                      {log.subject}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 items-start">
                      {getStatusBadge(log.status)}
                      {log.status === 'failed' && log.error_message && (
                        <span className="text-[10px] text-red-600 flex items-center max-w-[150px] truncate" title={log.error_message}>
                          <AlertTriangle className="h-3 w-3 mr-1 inline" /> {log.error_message}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={log.attempts >= 5 ? "text-red-500 font-bold" : ""}>
                      {log.attempts} / 5
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground space-y-1">
                    <div>C: {format(new Date(log.created_at), "MMM d, HH:mm")}</div>
                    {log.sent_at && <div>S: {format(new Date(log.sent_at), "MMM d, HH:mm")}</div>}
                  </TableCell>
                  <TableCell className="text-right">
                    {log.status === 'failed' && log.attempts < 5 && (
                      <Button variant="outline" size="sm" onClick={() => handleRetry(log)}>
                        Retry
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
