import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Lead, LeadSource, LeadStatus, ReasonLost, ClientType, ServicePitch } from '@/types/database';
import { toast } from 'sonner';

export function useLeads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch leads on mount
  useEffect(() => {
    if (user) {
      fetchLeads();
    } else {
      setLeads([]);
      setLoading(false);
    }
  }, [user]);

  const fetchLeads = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
    } else {
      setLeads((data as Lead[]) || []);
    }
    setLoading(false);
  };

  const addLead = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    const newLead = {
      user_id: user.id,
      lead_date: today,
      name: '',
      lead_source: 'instagram' as LeadSource,
      phone: '',
      email: '',
      country: '',
      city: '',
      client_type: 'individual_agent' as ClientType,
      service_pitch: 'ai_automation' as ServicePitch,
      first_message_sent: false,
      reply_received: false,
      seen: false,
      interested: false,
      follow_up_needed: false,
      notes: '',
      status: 'new' as LeadStatus,
    };

    const { data, error } = await supabase
      .from('leads')
      .insert(newLead)
      .select()
      .single();

    if (error) {
      console.error('Error adding lead:', error);
      toast.error('Failed to add lead');
    } else {
      setLeads([data as Lead, ...leads]);
      toast.success('New lead added');
    }
  };

  const updateLead = async (id: string, field: keyof Lead, value: any) => {
    const { error } = await supabase
      .from('leads')
      .update({ [field]: value })
      .eq('id', id);

    if (error) {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead');
    } else {
      setLeads(leads.map(lead => 
        lead.id === id ? { ...lead, [field]: value } : lead
      ));
    }
  };

  const deleteLead = async (id: string) => {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete lead');
    } else {
      setLeads(leads.filter(lead => lead.id !== id));
      toast.success('Lead deleted');
    }
  };

  const uploadScreenshot = async (leadId: string, file: File) => {
    if (!user) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${leadId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('screenshots')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading screenshot:', uploadError);
      toast.error('Failed to upload screenshot');
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('screenshots')
      .getPublicUrl(fileName);

    await updateLead(leadId, 'screenshot_url', publicUrl);
    await updateLead(leadId, 'screenshot_file_name', file.name);
    toast.success('Screenshot uploaded');
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
