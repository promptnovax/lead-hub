export type LeadSource = 'google_maps' | 'instagram' | 'facebook' | 'whatsapp' | 'linkedin' | 'other';
export type LeadStatus = 'new' | 'replied' | 'interested' | 'closed' | 'lost';
export type ReasonLost = 'price' | 'no_reply' | 'fake' | 'other';

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
  
  // Activity Tracking
  firstMessageSent: boolean;
  replyReceived: boolean;
  seen: boolean;
  interested: boolean;
  followUpNeeded: boolean;
  followUpDate?: Date;
  
  // Proof Section
  screenshotLink: string;
  notes: string;
  
  // Outcome
  status: LeadStatus;
  dealValue?: number;
  reasonLost?: ReasonLost;
  otherReasonLost?: string;
  
  createdAt: Date;
}
