import { useState } from 'react';
import { Lead } from '@/types/lead';
import { LeadsTable } from '@/components/dashboard/LeadsTable';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

const Index = () => {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      date: new Date(),
      name: 'Ahmed Khan',
      leadSource: 'instagram',
      phone: '+92 300 1234567',
      email: 'ahmed@company.com',
      country: 'Pakistan',
      city: 'Karachi',
      clientType: 'individual_agent',
      servicePitch: 'ai_automation',
      firstMessageSent: true,
      replyReceived: false,
      seen: true,
      interested: false,
      followUpNeeded: true,
      followUpDate: new Date(Date.now() + 86400000),
      screenshotFile: undefined,
      notes: '',
      status: 'new',
      createdAt: new Date(),
    },
  ]);

  const addNewLead = () => {
    const newLead: Lead = {
      id: Date.now().toString(),
      date: new Date(),
      name: '',
      leadSource: 'instagram',
      phone: '',
      email: '',
      country: '',
      city: '',
      clientType: 'individual_agent',
      servicePitch: 'ai_automation',
      firstMessageSent: false,
      replyReceived: false,
      seen: false,
      interested: false,
      followUpNeeded: false,
      screenshotFile: undefined,
      notes: '',
      status: 'new',
      createdAt: new Date(),
    };
    setLeads([...leads, newLead]);
    toast.success('New lead added');
  };

  const updateLead = (id: string, field: keyof Lead, value: any) => {
    setLeads(leads.map(lead => 
      lead.id === id ? { ...lead, [field]: value } : lead
    ));
  };

  const deleteLead = (id: string) => {
    setLeads(leads.filter(lead => lead.id !== id));
    toast.success('Lead deleted');
  };

  // Stats for current user only
  const todayLeads = leads.filter(l => {
    const today = new Date();
    const leadDate = new Date(l.date);
    return leadDate.toDateString() === today.toDateString();
  }).length;

  const invalidLeads = leads.filter(l => !l.screenshotFile).length;

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
              <span className="text-destructive">
                ⚠️ Invalid: <span className="font-medium">{invalidLeads}</span>
              </span>
            </div>
          </div>
          <Button onClick={addNewLead} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Lead
          </Button>
        </div>
      </header>

      {/* Table */}
      <main className="p-6">
        <LeadsTable 
          leads={leads}
          onUpdate={updateLead}
          onDelete={deleteLead}
        />
      </main>
    </div>
  );
};

export default Index;
