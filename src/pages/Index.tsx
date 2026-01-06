import { Plus, Loader2, TrendingUp, Filter, Users, Target, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AddLeadDialog } from '@/components/dashboard/AddLeadDialog';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const { leads, loading: leadsLoading, addLead, updateLead, deleteLead, uploadScreenshot } = useLeads();
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Filter leads based on date selection
  const getFilteredLeads = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    switch (dateFilter) {
      case 'today':
        return leads.filter(l => l.lead_date === today);
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return leads.filter(l => new Date(l.lead_date) >= weekAgo);
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return leads.filter(l => new Date(l.lead_date) >= monthAgo);
      default:
        return leads;
    }
  };

  const filteredLeads = getFilteredLeads();

  // Stats calculation based on filtered leads
  const today = new Date().toISOString().split('T')[0];
  const todayLeads = filteredLeads.filter(l => l.lead_date === today).length;
  const invalidLeads = filteredLeads.filter(l => !l.screenshot_url).length;
  const closedLeads = filteredLeads.filter(l => l.status === 'closed').length;
  const totalValue = filteredLeads
    .filter(l => l.status === 'closed' && l.deal_value)
    .reduce((sum, l) => sum + (l.deal_value || 0), 0);
  const conversionRate = filteredLeads.length > 0 ? Math.round((closedLeads / filteredLeads.length) * 100) : 0;

  if (leadsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="border-b border-border/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Lead Management Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">Track and manage your sales leads efficiently</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={dateFilter} onValueChange={(value: any) => setDateFilter(value)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)} size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all rounded-full px-6 bg-primary hover:bg-primary/90">
                <Plus className="w-5 h-5" />
                Add New Lead
              </Button>
            </div>
          </div>

          <AddLeadDialog
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onAddLead={addLead}
          />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Leads</p>
                  <p className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">{filteredLeads.length}</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-none">
                  All Sources
                </Badge>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Inquiries</p>
                  <p className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">{todayLeads}</p>
                </div>
                <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Badge variant="secondary" className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-none">
                  Received Today
                </Badge>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Closed Deals</p>
                  <p className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">{closedLeads}</p>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs text-emerald-600 font-bold">${totalValue.toLocaleString()}</span>
                <span className="text-xs text-slate-400 italic">Total Revenue</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between">
                {invalidLeads > 0 ? (
                  <>
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Action Required</p>
                      <p className="text-3xl font-bold mt-2 text-rose-600 dark:text-rose-400">{invalidLeads}</p>
                    </div>
                    <div className="p-3 bg-rose-50 dark:bg-rose-500/10 rounded-xl group-hover:scale-110 transition-transform">
                      <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Conversion Rate</p>
                      <p className="text-3xl font-bold mt-2 text-amber-600 dark:text-amber-400">{conversionRate}%</p>
                    </div>
                    <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                  </>
                )}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <p className="text-xs text-slate-400">
                  {invalidLeads > 0 ? "Leads missing screenshots" : "Overall performance"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Table */}
      <main className="max-w-[1600px] mx-auto p-6">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl shadow-xl">
          <LeadsTable
            leads={filteredLeads}
            onUpdate={updateLead}
            onDelete={deleteLead}
            onUploadScreenshot={uploadScreenshot}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
