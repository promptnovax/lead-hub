import { useLeads } from '@/hooks/useLeads';
import { Card } from '@/components/ui/card';
import { Loader2, Users, TrendingUp, DollarSign, Calendar, Target, Award, AlertCircle } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';

const Admin = () => {
  const { leads, loading } = useLeads();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate comprehensive statistics
  const totalLeads = leads.length;
  const closedLeads = leads.filter(l => l.status === 'closed').length;
  const lostLeads = leads.filter(l => l.status === 'lost').length;
  const activeLeads = leads.filter(l => ['new', 'replied', 'interested'].includes(l.status)).length;

  const totalRevenue = leads
    .filter(l => l.status === 'closed' && l.deal_value)
    .reduce((sum, l) => sum + (l.deal_value || 0), 0);

  const averageDealValue = closedLeads > 0 ? totalRevenue / closedLeads : 0;
  const conversionRate = totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(1) : 0;

  // Group leads by salesperson
  const leadsBySalesperson = leads.reduce((acc, lead) => {
    const name = lead.salesperson_name || 'Unassigned';
    if (!acc[name]) {
      acc[name] = {
        total: 0,
        closed: 0,
        revenue: 0,
      };
    }
    acc[name].total++;
    if (lead.status === 'closed') {
      acc[name].closed++;
      acc[name].revenue += lead.deal_value || 0;
    }
    return acc;
  }, {} as Record<string, { total: number; closed: number; revenue: number }>);

  // Group leads by source
  const leadsBySource = leads.reduce((acc, lead) => {
    const source = lead.lead_source;
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Top performers
  const topPerformers = Object.entries(leadsBySalesperson)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="border-b border-border/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">Comprehensive overview of all lead activities and performance metrics</p>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-white dark:bg-slate-800 border-none shadow-sm hover:shadow-md transition-all border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Leads</p>
                <p className="text-4xl font-bold mt-2 text-slate-900 dark:text-white">{totalLeads}</p>
                <p className="text-slate-400 text-sm mt-1 font-medium">Capture Pipeline</p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800 border-none shadow-sm hover:shadow-md transition-all border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Pipeline</p>
                <p className="text-4xl font-bold mt-2 text-slate-900 dark:text-white">{activeLeads}</p>
                <p className="text-slate-400 text-sm mt-1 font-medium">In Conversion</p>
              </div>
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl">
                <Target className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800 border-none shadow-sm hover:shadow-md transition-all border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Gross Revenue</p>
                <p className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">${totalRevenue.toLocaleString()}</p>
                <p className="text-slate-400 text-sm mt-1 font-medium">{closedLeads} Settled Deals</p>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
                <DollarSign className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800 border-none shadow-sm hover:shadow-md transition-all border-l-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Efficiency</p>
                <p className="text-4xl font-bold mt-2 text-slate-900 dark:text-white">{conversionRate}%</p>
                <p className="text-slate-400 text-sm mt-1 font-medium">Win Probability</p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl">
                <TrendingUp className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-emerald-600" />
              <h3 className="font-semibold text-lg">Closed Deals</h3>
            </div>
            <p className="text-3xl font-bold">{closedLeads}</p>
            <p className="text-sm text-muted-foreground mt-1">Won opportunities</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h3 className="font-semibold text-lg">Lost Deals</h3>
            </div>
            <p className="text-3xl font-bold">{lostLeads}</p>
            <p className="text-sm text-muted-foreground mt-1">Unsuccessful attempts</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-lg">Avg Deal Value</h3>
            </div>
            <p className="text-3xl font-bold">${averageDealValue.toFixed(0)}</p>
            <p className="text-sm text-muted-foreground mt-1">Per closed deal</p>
          </Card>
        </div>

        {/* Performance Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performers */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              Top Performers
            </h3>
            <div className="space-y-3">
              {topPerformers.map(([name, stats], index) => (
                <div key={name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{name}</p>
                      <p className="text-xs text-muted-foreground">{stats.closed}/{stats.total} closed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${stats.revenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                </div>
              ))}
              {topPerformers.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No data available yet</p>
              )}
            </div>
          </Card>

          {/* Lead Sources */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Lead Sources
            </h3>
            <div className="space-y-3">
              {Object.entries(leadsBySource)
                .sort((a, b) => b[1] - a[1])
                .map(([source, count]) => {
                  const percentage = ((count / totalLeads) * 100).toFixed(1);
                  return (
                    <div key={source} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium capitalize">{source.replace('_', ' ')}</span>
                        <span className="text-muted-foreground">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              {Object.keys(leadsBySource).length === 0 && (
                <p className="text-center text-muted-foreground py-8">No data available yet</p>
              )}
            </div>
          </Card>
        </div>

        {/* All Salespeople Performance */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">All Salespeople Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Salesperson</th>
                  <th className="text-right py-3 px-4">Total Leads</th>
                  <th className="text-right py-3 px-4">Closed</th>
                  <th className="text-right py-3 px-4">Conversion %</th>
                  <th className="text-right py-3 px-4">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(leadsBySalesperson)
                  .sort((a, b) => b[1].revenue - a[1].revenue)
                  .map(([name, stats]) => {
                    const convRate = stats.total > 0 ? ((stats.closed / stats.total) * 100).toFixed(1) : 0;
                    return (
                      <tr key={name} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{name}</td>
                        <td className="text-right py-3 px-4">{stats.total}</td>
                        <td className="text-right py-3 px-4">{stats.closed}</td>
                        <td className="text-right py-3 px-4">{convRate}%</td>
                        <td className="text-right py-3 px-4 font-bold text-green-600">
                          ${stats.revenue.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
