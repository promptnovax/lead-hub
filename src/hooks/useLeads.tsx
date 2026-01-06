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

  const addLead = async (leadData?: Partial<Lead>) => {
    const today = new Date().toISOString().split('T')[0];

    // Default values merged with provided leadData
    const newLead = {
      user_id: user?.id || DEFAULT_USER_ID,
      lead_date: today,
      name: '',
      salesperson_name: '',
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
      ...leadData,
    };

    try {
      const { data, error } = await supabase
        .from('leads')
        .insert(newLead)
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });

        if (error.code === '23505') {
          toast.error('A lead with this information already exists.');
        } else {
          toast.error('Failed to add lead: ' + error.message);
        }
        throw error;
      }

      if (data) {
        setLeads([data as Lead, ...leads]);
        toast.success('New lead added');
        return data;
      }
    } catch (error: any) {
      console.error('Error adding lead:', error);
      return null;
    }
  };

  const updateLead = async (id: string, field: keyof Lead, value: any) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ [field]: value })
        .eq('id', id);

      if (error) throw error;

      setLeads(leads.map(lead =>
        lead.id === id ? { ...lead, [field]: value } : lead
      ));
    } catch (error: any) {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead');
    }
  };

  const deleteLead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setLeads(leads.filter(lead => lead.id !== id));
      toast.success('Lead deleted');
    } catch (error: any) {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete lead');
    }
  };

  const uploadScreenshot = async (leadId: string, file: File) => {
    try {
      // Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${DEFAULT_USER_ID}/${leadId}-${Date.now()}.${fileExt}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('screenshots')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('screenshots')
        .getPublicUrl(fileName);

      // Update lead with screenshot URL
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
