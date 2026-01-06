export type Platform = 'whatsapp' | 'instagram' | 'linkedin' | 'email';

export type LeadStatus = 'new' | 'replied' | 'seen' | 'interested' | 'closed' | 'lost';

export interface LeadNote {
  id: string;
  text: string;
  createdAt: Date;
}

export interface LeadScreenshot {
  id: string;
  type: 'message_sent' | 'reply_received' | 'seen_proof';
  url: string;
  uploadedAt: Date;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  platform: Platform;
  assignedTo: string;
  status: LeadStatus;
  lastActionDate: Date;
  nextFollowUpDate: Date;
  screenshots: LeadScreenshot[];
  notes: LeadNote[];
  createdAt: Date;
}

export const PLATFORM_LABELS: Record<Platform, string> = {
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  email: 'Email',
};

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  replied: 'Replied',
  seen: 'Seen',
  interested: 'Interested',
  closed: 'Closed',
  lost: 'Lost',
};
