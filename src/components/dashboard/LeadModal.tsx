import { useState, useEffect } from 'react';
import { Lead, Platform, LeadStatus, PLATFORM_LABELS, STATUS_LABELS } from '@/types/lead';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Upload, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Partial<Lead>) => void;
  lead?: Lead | null;
}

const platforms: Platform[] = ['whatsapp', 'instagram', 'linkedin', 'email'];
const statuses: LeadStatus[] = ['new', 'replied', 'seen', 'interested', 'closed', 'lost'];

export function LeadModal({ isOpen, onClose, onSave, lead }: LeadModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    platform: 'whatsapp' as Platform,
    status: 'new' as LeadStatus,
    nextFollowUpDate: '',
    note: '',
  });

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        company: lead.company,
        platform: lead.platform,
        status: lead.status,
        nextFollowUpDate: new Date(lead.nextFollowUpDate).toISOString().split('T')[0],
        note: '',
      });
    } else {
      setFormData({
        name: '',
        company: '',
        platform: 'whatsapp',
        status: 'new',
        nextFollowUpDate: new Date().toISOString().split('T')[0],
        note: '',
      });
    }
  }, [lead, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const leadData: Partial<Lead> = {
      id: lead?.id,
      name: formData.name,
      company: formData.company,
      platform: formData.platform,
      status: formData.status,
      nextFollowUpDate: new Date(formData.nextFollowUpDate),
      lastActionDate: new Date(),
      notes: formData.note ? [{ id: Date.now().toString(), text: formData.note, createdAt: new Date() }] : [],
    };

    onSave(leadData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {lead ? 'Edit Lead' : 'Add New Lead'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Lead Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ahmed Khan"
                required
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="TechCorp Solutions"
                required
                className="bg-secondary border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Platform *</Label>
              <Select
                value={formData.platform}
                onValueChange={(value: Platform) => setFormData({ ...formData, platform: value })}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((p) => (
                    <SelectItem key={p} value={p}>
                      {PLATFORM_LABELS[p]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: LeadStatus) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="followUp">Next Follow-up Date *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="followUp"
                type="date"
                value={formData.nextFollowUpDate}
                onChange={(e) => setFormData({ ...formData, nextFollowUpDate: e.target.value })}
                required
                className="bg-secondary border-border pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note (Optional)</Label>
            <Textarea
              id="note"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="Client ne budget bola, kal follow-up..."
              className="bg-secondary border-border min-h-[80px]"
            />
          </div>

          {/* Screenshot Upload UI */}
          <div className="space-y-2">
            <Label>Screenshots (Optional)</Label>
            <div className="grid grid-cols-3 gap-3">
              {['Message Sent', 'Reply Received', 'Seen Proof'].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed",
                    "border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  )}
                >
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground text-center">{type}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
            >
              {lead ? 'Save Changes' : 'Add Lead'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
