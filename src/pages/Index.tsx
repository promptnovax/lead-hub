import { useState, useMemo } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { LeadsGrid } from '@/components/dashboard/LeadsGrid';
import { LeadModal } from '@/components/dashboard/LeadModal';
import { mockLeads } from '@/data/mockLeads';
import { Lead } from '@/types/lead';
import { isToday, isPast } from 'date-fns';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

const Index = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [activeView, setActiveView] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const filteredLeads = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (activeView) {
      case 'today':
        return leads.filter(l => {
          const created = new Date(l.createdAt);
          created.setHours(0, 0, 0, 0);
          return created.getTime() === today.getTime();
        });
      case 'pending':
        return leads.filter(l => {
          const followUp = new Date(l.nextFollowUpDate);
          followUp.setHours(0, 0, 0, 0);
          return followUp.getTime() === today.getTime() && l.status !== 'closed' && l.status !== 'lost';
        });
      case 'overdue':
        return leads.filter(l => {
          const followUp = new Date(l.nextFollowUpDate);
          followUp.setHours(0, 0, 0, 0);
          return followUp.getTime() < today.getTime() && l.status !== 'closed' && l.status !== 'lost';
        });
      default:
        return leads;
    }
  }, [leads, activeView]);

  const getViewTitle = () => {
    switch (activeView) {
      case 'today':
        return "Today's Leads";
      case 'pending':
        return 'Pending Follow-ups';
      case 'overdue':
        return 'Overdue Leads';
      default:
        return 'All Leads';
    }
  };

  const handleAddLead = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleDeleteLead = (id: string) => {
    setLeads(leads.filter(l => l.id !== id));
    toast.success('Lead deleted successfully');
  };

  const handleSaveLead = (leadData: Partial<Lead>) => {
    if (leadData.id) {
      // Update existing lead
      setLeads(leads.map(l => {
        if (l.id === leadData.id) {
          const updatedNotes = leadData.notes && leadData.notes.length > 0
            ? [...l.notes, ...leadData.notes]
            : l.notes;
          return { ...l, ...leadData, notes: updatedNotes };
        }
        return l;
      }));
      toast.success('Lead updated successfully');
    } else {
      // Add new lead
      const newLead: Lead = {
        id: Date.now().toString(),
        name: leadData.name || '',
        company: leadData.company || '',
        platform: leadData.platform || 'whatsapp',
        assignedTo: 'salesperson1',
        status: leadData.status || 'new',
        lastActionDate: new Date(),
        nextFollowUpDate: leadData.nextFollowUpDate || new Date(),
        screenshots: [],
        notes: leadData.notes || [],
        createdAt: new Date(),
      };
      setLeads([newLead, ...leads]);
      toast.success('Lead added successfully');
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView}
        onAddLead={handleAddLead}
      />
      
      <main className="flex-1 overflow-auto">
        <Header />
        
        <div className="p-8 space-y-8">
          <StatsCards leads={leads} />
          
          <LeadsGrid 
            leads={filteredLeads}
            title={getViewTitle()}
            onEdit={handleEditLead}
            onDelete={handleDeleteLead}
          />
        </div>
      </main>

      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLead}
        lead={editingLead}
      />
      
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Index;
