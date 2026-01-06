import { Lead, LeadSource, LeadStatus, ReasonLost } from '@/types/lead';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2, AlertCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LeadsTableProps {
  leads: Lead[];
  onUpdate: (id: string, field: keyof Lead, value: any) => void;
  onDelete: (id: string) => void;
}

const sourceOptions: { value: LeadSource; label: string }[] = [
  { value: 'google_maps', label: 'Google Maps' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'other', label: 'Other' },
];

const statusOptions: { value: LeadStatus; label: string; color: string }[] = [
  { value: 'new', label: 'New', color: 'bg-blue-500' },
  { value: 'replied', label: 'Replied', color: 'bg-yellow-500' },
  { value: 'interested', label: 'Interested', color: 'bg-green-500' },
  { value: 'closed', label: 'Closed', color: 'bg-emerald-600' },
  { value: 'lost', label: 'Lost', color: 'bg-red-500' },
];

const reasonLostOptions: { value: ReasonLost; label: string }[] = [
  { value: 'price', label: 'Price' },
  { value: 'no_reply', label: 'No Reply' },
  { value: 'fake', label: 'Fake' },
  { value: 'other', label: 'Other' },
];

export function LeadsTable({ leads, onUpdate, onDelete }: LeadsTableProps) {
  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  const isLeadInvalid = (lead: Lead) => !lead.screenshotLink.trim();

  return (
    <TooltipProvider>
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {/* Category Headers */}
              <TableRow className="bg-primary/10 border-b-2 border-primary/20">
                <TableHead colSpan={8} className="text-center font-bold text-primary border-r border-border">
                  📋 Basic Info
                </TableHead>
                <TableHead colSpan={6} className="text-center font-bold text-primary border-r border-border">
                  📊 Activity Tracking
                </TableHead>
                <TableHead colSpan={2} className="text-center font-bold text-primary border-r border-border">
                  📷 Proof Section
                </TableHead>
                <TableHead colSpan={4} className="text-center font-bold text-primary">
                  🎯 Outcome
                </TableHead>
              </TableRow>
              {/* Column Headers */}
              <TableRow className="bg-muted/50">
                {/* Basic Info */}
                <TableHead className="w-[110px] font-semibold text-xs">Date</TableHead>
                <TableHead className="w-[140px] font-semibold text-xs">Name</TableHead>
                <TableHead className="w-[130px] font-semibold text-xs">Lead Source</TableHead>
                <TableHead className="w-[100px] font-semibold text-xs">Other Source</TableHead>
                <TableHead className="w-[130px] font-semibold text-xs">Phone</TableHead>
                <TableHead className="w-[160px] font-semibold text-xs">Email</TableHead>
                <TableHead className="w-[100px] font-semibold text-xs">Country</TableHead>
                <TableHead className="w-[100px] font-semibold text-xs border-r border-border">City</TableHead>
                
                {/* Activity Tracking */}
                <TableHead className="w-[60px] font-semibold text-xs text-center">1st Msg</TableHead>
                <TableHead className="w-[60px] font-semibold text-xs text-center">Reply</TableHead>
                <TableHead className="w-[60px] font-semibold text-xs text-center">Seen</TableHead>
                <TableHead className="w-[60px] font-semibold text-xs text-center">Interest</TableHead>
                <TableHead className="w-[60px] font-semibold text-xs text-center">Follow-up</TableHead>
                <TableHead className="w-[110px] font-semibold text-xs border-r border-border">Follow-up Date</TableHead>
                
                {/* Proof Section */}
                <TableHead className="w-[160px] font-semibold text-xs">Screenshot Link</TableHead>
                <TableHead className="w-[180px] font-semibold text-xs border-r border-border">Notes</TableHead>
                
                {/* Outcome */}
                <TableHead className="w-[110px] font-semibold text-xs">Status</TableHead>
                <TableHead className="w-[100px] font-semibold text-xs">Deal Value</TableHead>
                <TableHead className="w-[100px] font-semibold text-xs">Reason Lost</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow 
                  key={lead.id} 
                  className={`hover:bg-muted/30 ${isLeadInvalid(lead) ? 'bg-destructive/5' : ''}`}
                >
                  {/* Basic Info */}
                  <TableCell className="p-1">
                    <Input
                      type="date"
                      value={formatDate(lead.date)}
                      onChange={(e) => onUpdate(lead.id, 'date', new Date(e.target.value))}
                      className="border-0 bg-transparent focus-visible:ring-1 h-8 text-xs"
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      value={lead.name}
                      onChange={(e) => onUpdate(lead.id, 'name', e.target.value)}
                      placeholder="Name..."
                      className="border-0 bg-transparent focus-visible:ring-1 h-8 text-xs"
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <Select
                      value={lead.leadSource}
                      onValueChange={(value: LeadSource) => onUpdate(lead.id, 'leadSource', value)}
                    >
                      <SelectTrigger className="border-0 bg-transparent focus:ring-1 h-8 text-xs">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceOptions.map((source) => (
                          <SelectItem key={source.value} value={source.value} className="text-xs">
                            {source.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      value={lead.otherSource || ''}
                      onChange={(e) => onUpdate(lead.id, 'otherSource', e.target.value)}
                      placeholder={lead.leadSource === 'other' ? 'Specify...' : '-'}
                      disabled={lead.leadSource !== 'other'}
                      className="border-0 bg-transparent focus-visible:ring-1 h-8 text-xs disabled:opacity-30"
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      value={lead.phone}
                      onChange={(e) => onUpdate(lead.id, 'phone', e.target.value)}
                      placeholder="Phone..."
                      className="border-0 bg-transparent focus-visible:ring-1 h-8 text-xs"
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      type="email"
                      value={lead.email}
                      onChange={(e) => onUpdate(lead.id, 'email', e.target.value)}
                      placeholder="Email..."
                      className="border-0 bg-transparent focus-visible:ring-1 h-8 text-xs"
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      value={lead.country}
                      onChange={(e) => onUpdate(lead.id, 'country', e.target.value)}
                      placeholder="Country..."
                      className="border-0 bg-transparent focus-visible:ring-1 h-8 text-xs"
                    />
                  </TableCell>
                  <TableCell className="p-1 border-r border-border">
                    <Input
                      value={lead.city}
                      onChange={(e) => onUpdate(lead.id, 'city', e.target.value)}
                      placeholder="City..."
                      className="border-0 bg-transparent focus-visible:ring-1 h-8 text-xs"
                    />
                  </TableCell>

                  {/* Activity Tracking */}
                  <TableCell className="p-1 text-center">
                    <Checkbox
                      checked={lead.firstMessageSent}
                      onCheckedChange={(checked) => onUpdate(lead.id, 'firstMessageSent', checked)}
                    />
                  </TableCell>
                  <TableCell className="p-1 text-center">
                    <Checkbox
                      checked={lead.replyReceived}
                      onCheckedChange={(checked) => onUpdate(lead.id, 'replyReceived', checked)}
                    />
                  </TableCell>
                  <TableCell className="p-1 text-center">
                    <Checkbox
                      checked={lead.seen}
                      onCheckedChange={(checked) => onUpdate(lead.id, 'seen', checked)}
                    />
                  </TableCell>
                  <TableCell className="p-1 text-center">
                    <Checkbox
                      checked={lead.interested}
                      onCheckedChange={(checked) => onUpdate(lead.id, 'interested', checked)}
                    />
                  </TableCell>
                  <TableCell className="p-1 text-center">
                    <Checkbox
                      checked={lead.followUpNeeded}
                      onCheckedChange={(checked) => onUpdate(lead.id, 'followUpNeeded', checked)}
                    />
                  </TableCell>
                  <TableCell className="p-1 border-r border-border">
                    <Input
                      type="date"
                      value={formatDate(lead.followUpDate)}
                      onChange={(e) => onUpdate(lead.id, 'followUpDate', e.target.value ? new Date(e.target.value) : undefined)}
                      disabled={!lead.followUpNeeded}
                      className="border-0 bg-transparent focus-visible:ring-1 h-8 text-xs disabled:opacity-30"
                    />
                  </TableCell>

                  {/* Proof Section */}
                  <TableCell className="p-1">
                    <div className="flex items-center gap-1">
                      <Input
                        value={lead.screenshotLink}
                        onChange={(e) => onUpdate(lead.id, 'screenshotLink', e.target.value)}
                        placeholder="Drive link..."
                        className={`border-0 bg-transparent focus-visible:ring-1 h-8 text-xs ${isLeadInvalid(lead) ? 'placeholder:text-destructive' : ''}`}
                      />
                      {isLeadInvalid(lead) && (
                        <Tooltip>
                          <TooltipTrigger>
                            <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Screenshot required - Lead invalid</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="p-1 border-r border-border">
                    <Textarea
                      value={lead.notes}
                      onChange={(e) => onUpdate(lead.id, 'notes', e.target.value)}
                      placeholder="Short summary..."
                      className="border-0 bg-transparent focus-visible:ring-1 min-h-[32px] h-8 resize-none py-1.5 text-xs"
                    />
                  </TableCell>

                  {/* Outcome */}
                  <TableCell className="p-1">
                    <Select
                      value={lead.status}
                      onValueChange={(value: LeadStatus) => onUpdate(lead.id, 'status', value)}
                    >
                      <SelectTrigger className="border-0 bg-transparent focus:ring-1 h-8 text-xs">
                        <SelectValue>
                          <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${statusOptions.find(s => s.value === lead.status)?.color}`} />
                            <span className="text-xs">{statusOptions.find(s => s.value === lead.status)?.label}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value} className="text-xs">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${status.color}`} />
                              {status.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      type="number"
                      value={lead.dealValue || ''}
                      onChange={(e) => onUpdate(lead.id, 'dealValue', e.target.value ? Number(e.target.value) : undefined)}
                      placeholder={lead.status === 'closed' ? 'Value...' : '-'}
                      disabled={lead.status !== 'closed'}
                      className="border-0 bg-transparent focus-visible:ring-1 h-8 text-xs disabled:opacity-30"
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <Select
                      value={lead.reasonLost || ''}
                      onValueChange={(value: ReasonLost) => onUpdate(lead.id, 'reasonLost', value)}
                      disabled={lead.status !== 'lost'}
                    >
                      <SelectTrigger className="border-0 bg-transparent focus:ring-1 h-8 text-xs disabled:opacity-30">
                        <SelectValue placeholder={lead.status === 'lost' ? 'Select...' : '-'} />
                      </SelectTrigger>
                      <SelectContent>
                        {reasonLostOptions.map((reason) => (
                          <SelectItem key={reason.value} value={reason.value} className="text-xs">
                            {reason.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(lead.id)}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {leads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={20} className="h-32 text-center text-muted-foreground">
                    No leads yet. Click "Add Lead" to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
}
