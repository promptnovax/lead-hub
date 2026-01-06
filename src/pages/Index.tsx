import { useState } from 'react';
import { useLeads } from '@/hooks/useLeads';
import { LeadsTable } from '@/components/dashboard/LeadsTable';
import { Plus, Loader2, TrendingUp, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Index = () => {
  const { leads, loading: leadsLoading, addLead, updateLead, deleteLead, uploadScreenshot } = useLeads();
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

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
              <Button onClick={addLead} size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all">
                <Plus className="w-5 h-5" />
                Add New Lead
              </Button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-xs font-medium uppercase tracking-wide">Total Leads</p>
                  <p className="text-3xl font-bold mt-1">{filteredLeads.length}</p>
                </div>
                <div className="text-4xl opacity-20">📊</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-xs font-medium uppercase tracking-wide">Today's Leads</p>
                  <p className="text-3xl font-bold mt-1">{todayLeads}</p>
                </div>
                <div className="text-4xl opacity-20">📅</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-xs font-medium uppercase tracking-wide">Closed Deals</p>
                  <p className="text-3xl font-bold mt-1">{closedLeads}</p>
                </div>
                <div className="text-4xl opacity-20">✅</div>
              </div>
            </div>
            
            {invalidLeads > 0 ? (
              <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-xs font-medium uppercase tracking-wide">Invalid Leads</p>
                    <p className="text-3xl font-bold mt-1">{invalidLeads}</p>
                  </div>
                  <div className="text-4xl opacity-20">⚠️</div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-lg p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-xs font-medium uppercase tracking-wide">Conversion</p>
                    <p className="text-3xl font-bold mt-1">{conversionRate}%</p>
                  </div>
                  <div className="text-3xl opacity-20"><TrendingUp /></div>
                </div>
              </div>
            )}
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
