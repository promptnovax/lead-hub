import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLeads } from '@/hooks/useLeads';
import { LeadsTable } from '@/components/dashboard/LeadsTable';
import { Plus, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { leads, loading: leadsLoading, addLead, updateLead, deleteLead, uploadScreenshot } = useLeads();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  // Stats for current user only - based on actual lead_date in database
  const today = new Date().toISOString().split('T')[0];
  const todayLeads = leads.filter(l => l.lead_date === today).length;
  const invalidLeads = leads.filter(l => !l.screenshot_url).length;

  if (authLoading || leadsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Leads</h1>
            <div className="flex items-center gap-4 mt-1 text-sm">
              <span className="text-muted-foreground">
                📊 Total: <span className="font-medium text-foreground">{leads.length}</span>
              </span>
              <span className="text-muted-foreground">
                📅 Today: <span className="font-medium text-foreground">{todayLeads}</span>
              </span>
              {invalidLeads > 0 && (
                <span className="text-destructive">
                  ⚠️ Invalid: <span className="font-medium">{invalidLeads}</span>
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={addLead} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Lead
            </Button>
            <Button variant="outline" onClick={handleSignOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Table */}
      <main className="p-6">
        <LeadsTable 
          leads={leads}
          onUpdate={updateLead}
          onDelete={deleteLead}
          onUploadScreenshot={uploadScreenshot}
        />
      </main>
    </div>
  );
};

export default Index;
