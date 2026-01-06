import { Lead } from '@/types/lead';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2, Paperclip, X, Image } from 'lucide-react';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useRef } from 'react';

interface LeadsTableProps {
  leads: Lead[];
  onUpdate: (id: string, field: keyof Lead, value: any) => void;
  onDelete: (id: string) => void;
  onAddAttachment: (leadId: string, file: File) => void;
  onRemoveAttachment: (leadId: string, attachmentId: string) => void;
}

const statusOptions = [
  { value: 'new', label: 'New', color: 'bg-blue-500' },
  { value: 'contacted', label: 'Contacted', color: 'bg-yellow-500' },
  { value: 'interested', label: 'Interested', color: 'bg-green-500' },
  { value: 'closed', label: 'Closed', color: 'bg-emerald-600' },
  { value: 'lost', label: 'Lost', color: 'bg-red-500' },
];

export function LeadsTable({ 
  leads, 
  onUpdate, 
  onDelete, 
  onAddAttachment,
  onRemoveAttachment 
}: LeadsTableProps) {
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleFileChange = (leadId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAddAttachment(leadId, file);
      e.target.value = '';
    }
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[200px] font-semibold">Name</TableHead>
            <TableHead className="w-[220px] font-semibold">Email</TableHead>
            <TableHead className="w-[160px] font-semibold">Phone</TableHead>
            <TableHead className="w-[130px] font-semibold">Status</TableHead>
            <TableHead className="w-[250px] font-semibold">Notes</TableHead>
            <TableHead className="w-[120px] font-semibold">Attachments</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id} className="hover:bg-muted/30">
              <TableCell className="p-1">
                <Input
                  value={lead.name}
                  onChange={(e) => onUpdate(lead.id, 'name', e.target.value)}
                  placeholder="Enter name..."
                  className="border-0 bg-transparent focus-visible:ring-1 h-9"
                />
              </TableCell>
              <TableCell className="p-1">
                <Input
                  type="email"
                  value={lead.email}
                  onChange={(e) => onUpdate(lead.id, 'email', e.target.value)}
                  placeholder="Enter email..."
                  className="border-0 bg-transparent focus-visible:ring-1 h-9"
                />
              </TableCell>
              <TableCell className="p-1">
                <Input
                  value={lead.phone}
                  onChange={(e) => onUpdate(lead.id, 'phone', e.target.value)}
                  placeholder="Enter phone..."
                  className="border-0 bg-transparent focus-visible:ring-1 h-9"
                />
              </TableCell>
              <TableCell className="p-1">
                <Select
                  value={lead.status}
                  onValueChange={(value) => onUpdate(lead.id, 'status', value)}
                >
                  <SelectTrigger className="border-0 bg-transparent focus:ring-1 h-9">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusOptions.find(s => s.value === lead.status)?.color}`} />
                        {statusOptions.find(s => s.value === lead.status)?.label}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
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
                <Textarea
                  value={lead.notes}
                  onChange={(e) => onUpdate(lead.id, 'notes', e.target.value)}
                  placeholder="Add notes..."
                  className="border-0 bg-transparent focus-visible:ring-1 min-h-[36px] h-9 resize-none py-2"
                />
              </TableCell>
              <TableCell className="p-1">
                <div className="flex items-center gap-1">
                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => fileInputRefs.current[lead.id] = el}
                    onChange={(e) => handleFileChange(lead.id, e)}
                    className="hidden"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRefs.current[lead.id]?.click()}
                    className="h-8 w-8 p-0"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  
                  {lead.attachments.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 gap-1 px-2">
                          <Image className="w-3 h-3" />
                          {lead.attachments.length}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Attachments</p>
                          <div className="grid grid-cols-2 gap-2">
                            {lead.attachments.map((attachment) => (
                              <div key={attachment.id} className="relative group">
                                <img
                                  src={attachment.url}
                                  alt={attachment.name}
                                  className="w-full h-24 object-cover rounded-md border border-border"
                                />
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => onRemoveAttachment(lead.id, attachment.id)}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </TableCell>
              <TableCell className="p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(lead.id)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          
          {leads.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                No leads yet. Click "Add Lead" to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
