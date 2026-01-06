import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Lead, LeadSource, LeadStatus, ClientType, ServicePitch } from '@/types/database';
import { toast } from 'sonner';
import { useAuth } from './useAuth';



export function useLeads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const persistingIds = useRef<Set<string>>(new Set());

  // Load leads from Supabase and localStorage on mount
  useEffect(() => {
    const init = async () => {
      await fetchLeads();

      // Load drafts from localStorage
      const savedDrafts = localStorage.getItem('lead_drafts');
      if (savedDrafts) {
        try {
          const drafts: Lead[] = JSON.parse(savedDrafts);
          // Only keep drafts that aren't already in the remote leads
          setLeads(prev => {
            const remoteIds = new Set(prev.map(l => l.id));
            const uniqueDrafts = drafts.filter(d => !remoteIds.has(d.id));
            return [...prev, ...uniqueDrafts];
          });
        } catch (e) {
          console.error('Error parsing lead drafts:', e);
        }
      }
    };
    init();
  }, []);

  // Save drafts to localStorage whenever they change
  useEffect(() => {
    const drafts = leads.filter(l => l.id.toString().startsWith('temp-'));
    localStorage.setItem('lead_drafts', JSON.stringify(drafts));
  }, [leads]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setLeads((data as Lead[]) || []);
    } catch (error: any) {
      console.error('Error loading leads:', error);
      toast.error('Failed to load leads: ' + error.message);
    }
    setLoading(false);
  };

  const addLead = () => {
    const today = new Date().toISOString().split('T')[0];

    // Create a temporary lead that isn't in the DB yet
    const tempLead: Lead = {
      id: `temp-${Date.now()}`, // Local temporary ID
      user_id: user?.id || null,
      lead_date: today,
      name: '',
      salesperson_name: '',
      lead_source: 'instagram',
      phone: '',
      email: '',
      country: '',
      city: '',
      client_type: 'individual_agent',
      service_pitch: 'ai_automation',
      first_message_sent: false,
      reply_received: false,
      seen: false,
      interested: false,
      follow_up_needed: false,
      notes: '',
      status: 'new',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add to the bottom of the list as requested ("nichy")
    setLeads(prev => [...prev, tempLead]);
    return tempLead;
  };

  const persistLead = async (tempId: string, lead: Lead) => {
    if (persistingIds.current.has(tempId)) return null;

    // Check if we already have enough data to persist
    if (!lead.name?.trim() && !lead.salesperson_name?.trim()) return null;

    persistingIds.current.add(tempId);

    try {
      // Remove temporary ID and timestamps to let Supabase handle them
      const { id, created_at, updated_at, ...leadToInsert } = lead;

      const { data, error } = await supabase
        .from('leads')
        .insert({
          ...leadToInsert,
          user_id: user?.id || null,
        })
        .select()
        .single();

      if (error) {
        // If it's a conflict, maybe it was already inserted? 
        // Or if it's missing data, don't toast too much.
        if (error.code === '23505') {
          console.warn('Conflict detected, attempting to refetch...');
          await fetchLeads();
          return null;
        }
        throw error;
      }

      if (data) {
        setLeads(prev => {
          const filtered = prev.filter(l => l.id !== tempId);
          // Check if this lead was already added via another sync or refetch
          if (filtered.some(l => l.id === data.id)) return filtered;
          return [...filtered, data as Lead];
        });

        // Remove from drafts in localStorage effectively
        const savedDrafts = localStorage.getItem('lead_drafts');
        if (savedDrafts) {
          const drafts = JSON.parse(savedDrafts).filter((d: any) => d.id !== tempId);
          localStorage.setItem('lead_drafts', JSON.stringify(drafts));
        }

        return data as Lead;
      }
    } catch (error: any) {
      console.error('Error persisting lead:', error);
      toast.error('Failed to save new lead: ' + error.message);
      return null;
    } finally {
      persistingIds.current.delete(tempId);
    }
  };

  const updateLead = async (id: string, field: keyof Lead, value: any) => {
    const isTemp = id.toString().startsWith('temp-');

    // Update local state first for immediate feedback
    const updatedLeads = leads.map(lead =>
      lead.id === id ? { ...lead, [field]: value, updated_at: new Date().toISOString() } : lead
    );
    setLeads(updatedLeads);

    const targetLead = updatedLeads.find(l => l.id === id);
    if (!targetLead) return;

    if (isTemp) {
      // Only persist to DB if they've started entering basic info
      if (field === 'name' || field === 'salesperson_name') {
        await persistLead(id, targetLead);
      }
    } else {
      try {
        const { error } = await supabase
          .from('leads')
          .update({ [field]: value })
          .eq('id', id);

        if (error) throw error;
      } catch (error: any) {
        console.error('Error updating lead:', error);
        toast.error('Failed to update lead');
      }
    }
  };

  const deleteLead = async (id: string) => {
    const isTemp = id.toString().startsWith('temp-');

    // Remove from local state
    setLeads(prev => prev.filter(lead => lead.id !== id));

    if (!isTemp) {
      try {
        const { error } = await supabase
          .from('leads')
          .delete()
          .eq('id', id);

        if (error) throw error;
        toast.success('Lead deleted');
      } catch (error: any) {
        console.error('Error deleting lead:', error);
        toast.error('Failed to delete lead');
      }
    }
  };

  const uploadScreenshot = async (leadId: string, file: File) => {
    const isTemp = leadId.toString().startsWith('temp-');
    if (isTemp) {
      toast.error('Please enter a name first to save the lead before uploading screenshots.');
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const folder = user?.id || 'public';
      const fileName = `${folder}/${leadId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('screenshots')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('screenshots')
        .getPublicUrl(fileName);

      await updateLead(leadId, 'screenshot_url', publicUrl);
      await updateLead(leadId, 'screenshot_file_name', file.name);

      toast.success('Screenshot uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading screenshot:', error);
      toast.error('Failed to upload screenshot: ' + error.message);
    }
  };

  return {
    leads,
    loading,
    addLead,
    updateLead,
    deleteLead,
    uploadScreenshot,
    refetch: fetchLeads,
  };
}
