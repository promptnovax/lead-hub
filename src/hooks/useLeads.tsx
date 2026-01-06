import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Lead, LeadSource, LeadStatus, ClientType, ServicePitch } from '@/types/database';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

// Default user ID for non-authenticated usage
const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000000';

export function useLeads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Load leads from Supabase on mount
  useEffect(() => {
    fetchLeads();
  }, []);

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
      user_id: user?.id || DEFAULT_USER_ID,
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
    try {
      // Remove temporary ID and timestamps to let Supabase handle them
      const { id, created_at, updated_at, ...leadToInsert } = lead;

      const { data, error } = await supabase
        .from('leads')
        .insert({
          ...leadToInsert,
          user_id: user?.id || DEFAULT_USER_ID,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setLeads(prev => prev.map(l => l.id === tempId ? (data as Lead) : l));
        return data as Lead;
      }
    } catch (error: any) {
      console.error('Error persisting lead:', error);
      toast.error('Failed to save new lead: ' + error.message);
      return null;
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
      const fileName = `${user?.id || DEFAULT_USER_ID}/${leadId}-${Date.now()}.${fileExt}`;

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
