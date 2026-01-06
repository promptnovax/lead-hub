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
      name: 'Ahmed Khan',
      email: 'ahmed@company.com',
      phone: '+92 300 1234567',
      status: 'new',
      notes: '',
      attachments: [],
      createdAt: new Date(),
    },
  ]);

  const addNewLead = () => {
    const newLead: Lead = {
      id: Date.now().toString(),
      name: '',
      email: '',
      phone: '',
      status: 'new',
      notes: '',
      attachments: [],
      createdAt: new Date(),
    };
    setLeads([...leads, newLead]);
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

  const addAttachment = (leadId: string, file: File) => {
    const attachment = {
      id: Date.now().toString(),
      url: URL.createObjectURL(file),
      name: file.name,
    };
    setLeads(leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, attachments: [...lead.attachments, attachment] }
        : lead
    ));
    toast.success('Image attached');
  };

  const removeAttachment = (leadId: string, attachmentId: string) => {
    setLeads(leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, attachments: lead.attachments.filter(a => a.id !== attachmentId) }
        : lead
    ));
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
              {leads.length} lead{leads.length !== 1 ? 's' : ''}
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
          onAddAttachment={addAttachment}
          onRemoveAttachment={removeAttachment}
        />
      </main>
    </div>
  );
};

export default Index;
