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
      firstMessageSent: true,
      replyReceived: false,
      seen: true,
      interested: false,
      followUpNeeded: true,
      followUpDate: new Date(Date.now() + 86400000),
      screenshotLink: '',
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
      firstMessageSent: false,
      replyReceived: false,
      seen: false,
      interested: false,
      followUpNeeded: false,
      screenshotLink: '',
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

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Leads Workspace</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {leads.length} lead{leads.length !== 1 ? 's' : ''} • 
              <span className="text-destructive ml-1">
                {leads.filter(l => !l.screenshotLink.trim()).length} invalid (no screenshot)
              </span>
            </p>
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
