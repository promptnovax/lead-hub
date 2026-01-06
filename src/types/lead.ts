export interface LeadAttachment {
  id: string;
  url: string;
  name: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'interested' | 'closed' | 'lost';
  notes: string;
  attachments: LeadAttachment[];
  createdAt: Date;
}
