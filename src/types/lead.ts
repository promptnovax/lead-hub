export type LeadSource = 'google_maps' | 'instagram' | 'facebook' | 'whatsapp' | 'linkedin' | 'other';
export type LeadStatus = 'new' | 'replied' | 'interested' | 'closed' | 'lost';
export type ReasonLost = 'price' | 'no_reply' | 'fake' | 'other';
export type ClientType = 'individual_agent' | 'brokerage' | 'developer';
export type ServicePitch = 'ai_automation' | 'website' | 'full_package';

export interface Lead {
  id: string;
  
  // Basic Info
  date: Date;
  name: string;
  leadSource: LeadSource;
  otherSource?: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  clientType: ClientType;
  servicePitch: ServicePitch;
  
  // Activity Tracking
  firstMessageSent: boolean;
  replyReceived: boolean;
  seen: boolean;
  interested: boolean;
  followUpNeeded: boolean;
  followUpDate?: Date;
  
  // Proof Section
  screenshotFile?: string; // Base64 or URL for preview
  screenshotFileName?: string;
  notes: string;
  
  // Outcome
  status: LeadStatus;
  dealValue?: number;
  reasonLost?: ReasonLost;
  otherReasonLost?: string;
  
  createdAt: Date;
}
