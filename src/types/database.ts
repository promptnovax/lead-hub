export type LeadSource = 'google_maps' | 'instagram' | 'facebook' | 'whatsapp' | 'linkedin' | 'other';
export type LeadStatus = 'new' | 'replied' | 'interested' | 'closed' | 'lost';
export type ReasonLost = 'price' | 'no_reply' | 'fake' | 'other';
export type ClientType = 'individual_agent' | 'brokerage' | 'developer';
export type ServicePitch = 'ai_automation' | 'website' | 'full_package';

export interface Lead {
  id: string;
  user_id: string;
  
  // Basic Info
  lead_date: string;
  name: string;
  salesperson_name: string;
  lead_source: LeadSource;
  other_source?: string | null;
  phone: string;
  email: string;
  country: string;
  city: string;
  client_type: ClientType;
  service_pitch: ServicePitch;
  
  // Activity Tracking
  first_message_sent: boolean;
  reply_received: boolean;
  seen: boolean;
  interested: boolean;
  follow_up_needed: boolean;
  follow_up_date?: string | null;
  
  // Proof Section
  screenshot_url?: string | null;
  screenshot_file_name?: string | null;
  notes: string;
  
  // Outcome
  status: LeadStatus;
  deal_value?: number | null;
  reason_lost?: ReasonLost | null;
  other_reason_lost?: string | null;
  
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name?: string | null;
  created_at: string;
  updated_at: string;
}
