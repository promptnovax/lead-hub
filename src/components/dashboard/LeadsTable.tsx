import { Lead, LeadSource, LeadStatus, ReasonLost, ClientType, ServicePitch } from '@/types/lead';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2, AlertCircle, Upload, Image, Eye } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRef } from 'react';

interface LeadsTableProps {
  leads: Lead[];
  onUpdate: (id: string, field: keyof Lead, value: any) => void;
  onDelete: (id: string) => void;
}

const sourceOptions: { value: LeadSource; label: string; emoji: string }[] = [
  { value: 'google_maps', label: 'Google Maps', emoji: '📍' },
  { value: 'instagram', label: 'Instagram', emoji: '📸' },
  { value: 'facebook', label: 'Facebook', emoji: '👤' },
  { value: 'whatsapp', label: 'WhatsApp', emoji: '💬' },
  { value: 'linkedin', label: 'LinkedIn', emoji: '💼' },
  { value: 'other', label: 'Other', emoji: '🔗' },
];

const statusOptions: { value: LeadStatus; label: string; color: string }[] = [
  { value: 'new', label: 'New', color: 'bg-blue-500' },
  { value: 'replied', label: 'Replied', color: 'bg-yellow-500' },
  { value: 'interested', label: 'Interested', color: 'bg-purple-500' },
  { value: 'closed', label: 'Closed', color: 'bg-emerald-500' },
  { value: 'lost', label: 'Lost', color: 'bg-red-500' },
];

const reasonLostOptions: { value: ReasonLost; label: string }[] = [
  { value: 'price', label: 'Price Issue' },
  { value: 'no_reply', label: 'No Reply' },
  { value: 'fake', label: 'Fake Lead' },
  { value: 'other', label: 'Other' },
];

const clientTypeOptions: { value: ClientType; label: string; emoji: string }[] = [
  { value: 'individual_agent', label: 'Individual Agent', emoji: '👤' },
  { value: 'brokerage', label: 'Brokerage', emoji: '🏢' },
  { value: 'developer', label: 'Developer', emoji: '🏗️' },
];

const servicePitchOptions: { value: ServicePitch; label: string; emoji: string }[] = [
  { value: 'ai_automation', label: 'AI Automation', emoji: '🤖' },
  { value: 'website', label: 'Website', emoji: '🌐' },
  { value: 'full_package', label: 'Full Package', emoji: '📦' },
];

export function LeadsTable({ leads, onUpdate, onDelete }: LeadsTableProps) {
  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  const isLeadInvalid = (lead: Lead) => !lead.screenshotFile;

  const handleFileUpload = (leadId: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onUpdate(leadId, 'screenshotFile', result);
      onUpdate(leadId, 'screenshotFileName', file.name);
    };
    reader.readAsDataURL(file);
  };

  return (
    <TooltipProvider>
      <div className="rounded-xl border border-border overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* Category Headers */}
            <thead>
              <tr className="bg-gradient-to-r from-primary/20 to-accent/20">
                <th colSpan={10} className="px-4 py-3 text-left font-bold text-primary border-r-2 border-border/50">
                  📋 Basic Info
                </th>
                <th colSpan={6} className="px-4 py-3 text-left font-bold text-primary border-r-2 border-border/50">
                  📊 Activity Tracking
                </th>
                <th colSpan={2} className="px-4 py-3 text-left font-bold text-primary border-r-2 border-border/50">
                  📷 Proof Section
                </th>
                <th colSpan={4} className="px-4 py-3 text-left font-bold text-primary">
                  🎯 Outcome
                </th>
              </tr>
              {/* Column Headers */}
              <tr className="bg-muted/70 border-t border-border">
                {/* Basic Info */}
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Name</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Source</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Other</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Phone</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Country</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">City</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Client Type</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide border-r-2 border-border/50">Service</th>
                
                {/* Activity Tracking */}
                <th className="px-2 py-2.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">Msg</th>
                <th className="px-2 py-2.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">Reply</th>
                <th className="px-2 py-2.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">Seen</th>
                <th className="px-2 py-2.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">Int.</th>
                <th className="px-2 py-2.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">F/U</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide border-r-2 border-border/50">F/U Date</th>
                
                {/* Proof Section */}
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Screenshot</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide border-r-2 border-border/50">Notes</th>
                
                {/* Outcome */}
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Value</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Lost Reason</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody className="bg-card">
              {leads.map((lead, index) => (
                <LeadRow 
                  key={lead.id}
                  lead={lead}
                  index={index}
                  isLeadInvalid={isLeadInvalid}
                  formatDate={formatDate}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onFileUpload={handleFileUpload}
                  sourceOptions={sourceOptions}
                  statusOptions={statusOptions}
                  reasonLostOptions={reasonLostOptions}
                  clientTypeOptions={clientTypeOptions}
                  servicePitchOptions={servicePitchOptions}
                />
              ))}
              
              {leads.length === 0 && (
                <tr>
                  <td colSpan={22} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <span className="text-4xl">📋</span>
                      <p className="font-medium">No leads yet</p>
                      <p className="text-sm">Click "Add Lead" to get started</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </TooltipProvider>
  );
}

interface LeadRowProps {
  lead: Lead;
  index: number;
  isLeadInvalid: (lead: Lead) => boolean;
  formatDate: (date: Date | undefined) => string;
  onUpdate: (id: string, field: keyof Lead, value: any) => void;
  onDelete: (id: string) => void;
  onFileUpload: (leadId: string, file: File) => void;
  sourceOptions: typeof sourceOptions;
  statusOptions: typeof statusOptions;
  reasonLostOptions: typeof reasonLostOptions;
  clientTypeOptions: typeof clientTypeOptions;
  servicePitchOptions: typeof servicePitchOptions;
}

function LeadRow({
  lead,
  index,
  isLeadInvalid,
  formatDate,
  onUpdate,
  onDelete,
  onFileUpload,
  sourceOptions,
  statusOptions,
  reasonLostOptions,
  clientTypeOptions,
  servicePitchOptions,
}: LeadRowProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <tr 
      className={`
        border-t border-border/50 transition-colors
        ${isLeadInvalid(lead) ? 'bg-destructive/10 hover:bg-destructive/15' : 'hover:bg-muted/40'}
        ${index % 2 === 0 ? 'bg-card' : 'bg-muted/20'}
      `}
    >
      {/* Basic Info */}
      <td className="px-2 py-1.5">
        <Input
          type="date"
          value={formatDate(lead.date)}
          onChange={(e) => onUpdate(lead.id, 'date', new Date(e.target.value))}
          className="h-9 w-[120px] border border-border/50 bg-background/50 focus:bg-background text-sm rounded-lg"
        />
      </td>
      <td className="px-2 py-1.5">
        <Input
          value={lead.name}
          onChange={(e) => onUpdate(lead.id, 'name', e.target.value)}
          placeholder="Enter name"
          className="h-9 w-[130px] border border-border/50 bg-background/50 focus:bg-background text-sm rounded-lg font-medium"
        />
      </td>
      <td className="px-2 py-1.5">
        <Select
          value={lead.leadSource}
          onValueChange={(value: LeadSource) => onUpdate(lead.id, 'leadSource', value)}
        >
          <SelectTrigger className="h-9 w-[120px] border border-border/50 bg-background/50 focus:bg-background text-sm rounded-lg">
            <SelectValue placeholder="Select">
              <span className="flex items-center gap-1.5">
                <span>{sourceOptions.find(s => s.value === lead.leadSource)?.emoji}</span>
                <span className="truncate text-xs">{sourceOptions.find(s => s.value === lead.leadSource)?.label}</span>
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {sourceOptions.map((source) => (
              <SelectItem key={source.value} value={source.value}>
                <span className="flex items-center gap-2">
                  <span>{source.emoji}</span>
                  <span>{source.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="px-2 py-1.5">
        <Input
          value={lead.otherSource || ''}
          onChange={(e) => onUpdate(lead.id, 'otherSource', e.target.value)}
          placeholder={lead.leadSource === 'other' ? 'Specify' : '—'}
          disabled={lead.leadSource !== 'other'}
          className="h-9 w-[90px] border border-border/50 bg-background/50 focus:bg-background text-sm rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
        />
      </td>
      <td className="px-2 py-1.5">
        <Input
          value={lead.phone}
          onChange={(e) => onUpdate(lead.id, 'phone', e.target.value)}
          placeholder="+1234567890"
          className="h-9 w-[120px] border border-border/50 bg-background/50 focus:bg-background text-sm rounded-lg"
        />
      </td>
      <td className="px-2 py-1.5">
        <Input
          type="email"
          value={lead.email}
          onChange={(e) => onUpdate(lead.id, 'email', e.target.value)}
          placeholder="email@example.com"
          className="h-9 w-[160px] border border-border/50 bg-background/50 focus:bg-background text-sm rounded-lg"
        />
      </td>
      <td className="px-2 py-1.5">
        <Input
          value={lead.country}
          onChange={(e) => onUpdate(lead.id, 'country', e.target.value)}
          placeholder="Country"
          className="h-9 w-[90px] border border-border/50 bg-background/50 focus:bg-background text-sm rounded-lg"
        />
      </td>
      <td className="px-2 py-1.5">
        <Input
          value={lead.city}
          onChange={(e) => onUpdate(lead.id, 'city', e.target.value)}
          placeholder="City"
          className="h-9 w-[90px] border border-border/50 bg-background/50 focus:bg-background text-sm rounded-lg"
        />
      </td>
      <td className="px-2 py-1.5">
        <Select
          value={lead.clientType}
          onValueChange={(value: ClientType) => onUpdate(lead.id, 'clientType', value)}
        >
          <SelectTrigger className="h-9 w-[130px] border border-border/50 bg-background/50 focus:bg-background text-sm rounded-lg">
            <SelectValue placeholder="Select">
              <span className="flex items-center gap-1.5">
                <span>{clientTypeOptions.find(c => c.value === lead.clientType)?.emoji}</span>
                <span className="truncate text-xs">{clientTypeOptions.find(c => c.value === lead.clientType)?.label}</span>
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {clientTypeOptions.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <span className="flex items-center gap-2">
                  <span>{type.emoji}</span>
                  <span>{type.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="px-2 py-1.5 border-r-2 border-border/50">
        <Select
          value={lead.servicePitch}
          onValueChange={(value: ServicePitch) => onUpdate(lead.id, 'servicePitch', value)}
        >
          <SelectTrigger className="h-9 w-[120px] border border-border/50 bg-background/50 focus:bg-background text-sm rounded-lg">
            <SelectValue placeholder="Select">
              <span className="flex items-center gap-1.5">
                <span>{servicePitchOptions.find(s => s.value === lead.servicePitch)?.emoji}</span>
                <span className="truncate text-xs">{servicePitchOptions.find(s => s.value === lead.servicePitch)?.label}</span>
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {servicePitchOptions.map((pitch) => (
              <SelectItem key={pitch.value} value={pitch.value}>
                <span className="flex items-center gap-2">
                  <span>{pitch.emoji}</span>
                  <span>{pitch.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>

      {/* Activity Tracking */}
      <td className="px-2 py-1.5">
        <div className="flex justify-center">
          <Checkbox
            checked={lead.firstMessageSent}
            onCheckedChange={(checked) => onUpdate(lead.id, 'firstMessageSent', checked)}
            className="h-5 w-5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </div>
      </td>
      <td className="px-2 py-1.5">
        <div className="flex justify-center">
          <Checkbox
            checked={lead.replyReceived}
            onCheckedChange={(checked) => onUpdate(lead.id, 'replyReceived', checked)}
            className="h-5 w-5 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
          />
        </div>
      </td>
      <td className="px-2 py-1.5">
        <div className="flex justify-center">
          <Checkbox
            checked={lead.seen}
            onCheckedChange={(checked) => onUpdate(lead.id, 'seen', checked)}
            className="h-5 w-5 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
          />
        </div>
      </td>
      <td className="px-2 py-1.5">
        <div className="flex justify-center">
          <Checkbox
            checked={lead.interested}
            onCheckedChange={(checked) => onUpdate(lead.id, 'interested', checked)}
            className="h-5 w-5 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
          />
        </div>
      </td>
      <td className="px-2 py-1.5">
        <div className="flex justify-center">
          <Checkbox
            checked={lead.followUpNeeded}
            onCheckedChange={(checked) => onUpdate(lead.id, 'followUpNeeded', checked)}
            className="h-5 w-5 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
          />
        </div>
      </td>
      <td className="px-2 py-1.5 border-r-2 border-border/50">
        <Input
          type="date"
          value={formatDate(lead.followUpDate)}
          onChange={(e) => onUpdate(lead.id, 'followUpDate', e.target.value ? new Date(e.target.value) : undefined)}
          disabled={!lead.followUpNeeded}
          className="h-9 w-[120px] border border-border/50 bg-background/50 focus:bg-background text-sm rounded-lg disabled:opacity-40"
        />
      </td>

      {/* Proof Section */}
      <td className="px-2 py-1.5">
        <div className="flex items-center gap-1.5">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileUpload(lead.id, file);
            }}
          />
          
          {lead.screenshotFile ? (
            <div className="flex items-center gap-1">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                    <Image className="w-3.5 h-3.5" />
                    <span className="max-w-[60px] truncate">{lead.screenshotFileName || 'Image'}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <img 
                    src={lead.screenshotFile} 
                    alt="Screenshot" 
                    className="w-full h-auto rounded-lg"
                  />
                </DialogContent>
              </Dialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Replace image</TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className={`h-8 gap-1.5 text-xs ${isLeadInvalid(lead) ? 'border-destructive/50 text-destructive hover:bg-destructive/10' : ''}`}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload
              </Button>
              {isLeadInvalid(lead) && (
                <Tooltip>
                  <TooltipTrigger>
                    <AlertCircle className="w-4 h-4 text-destructive" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-destructive text-destructive-foreground">
                    ⚠️ Screenshot required - Lead invalid
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
        </div>
      </td>
      <td className="px-2 py-1.5 border-r-2 border-border/50">
        <Textarea
          value={lead.notes}
          onChange={(e) => onUpdate(lead.id, 'notes', e.target.value)}
          placeholder="Add notes..."
          className="h-9 min-h-9 w-[140px] border border-border/50 bg-background/50 focus:bg-background text-sm rounded-lg resize-none py-2"
        />
      </td>

      {/* Outcome */}
      <td className="px-2 py-1.5">
        <Select
          value={lead.status}
          onValueChange={(value: LeadStatus) => onUpdate(lead.id, 'status', value)}
        >
          <SelectTrigger className="h-9 w-[110px] border border-border/50 bg-background/50 text-sm rounded-lg">
            <SelectValue>
              <span className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${statusOptions.find(s => s.value === lead.status)?.color}`} />
                <span className="text-xs">{statusOptions.find(s => s.value === lead.status)?.label}</span>
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                <span className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${status.color}`} />
                  <span>{status.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="px-2 py-1.5">
        <Input
          type="number"
          value={lead.dealValue || ''}
          onChange={(e) => onUpdate(lead.id, 'dealValue', e.target.value ? Number(e.target.value) : undefined)}
          placeholder={lead.status === 'closed' ? '$0' : '—'}
          disabled={lead.status !== 'closed'}
          className="h-9 w-[80px] border border-border/50 bg-background/50 focus:bg-background text-sm rounded-lg disabled:opacity-40"
        />
      </td>
      <td className="px-2 py-1.5">
        <Select
          value={lead.reasonLost || ''}
          onValueChange={(value: ReasonLost) => onUpdate(lead.id, 'reasonLost', value)}
          disabled={lead.status !== 'lost'}
        >
          <SelectTrigger className="h-9 w-[100px] border border-border/50 bg-background/50 text-sm rounded-lg disabled:opacity-40">
            <SelectValue placeholder={lead.status === 'lost' ? 'Select' : '—'} />
          </SelectTrigger>
          <SelectContent>
            {reasonLostOptions.map((reason) => (
              <SelectItem key={reason.value} value={reason.value}>
                {reason.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="px-2 py-1.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(lead.id)}
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </td>
    </tr>
  );
}
