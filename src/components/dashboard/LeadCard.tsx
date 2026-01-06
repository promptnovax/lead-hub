import { Lead } from '@/types/lead';
import { PlatformBadge } from './PlatformBadge';
import { StatusBadge } from './StatusBadge';
import { Calendar, Clock, MessageSquare, Image, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isToday, isPast } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

export function LeadCard({ lead, onEdit, onDelete }: LeadCardProps) {
  const isOverdue = isPast(new Date(lead.nextFollowUpDate)) && 
                    !isToday(new Date(lead.nextFollowUpDate)) && 
                    lead.status !== 'closed' && 
                    lead.status !== 'lost';

  const followUpToday = isToday(new Date(lead.nextFollowUpDate)) && 
                        lead.status !== 'closed' && 
                        lead.status !== 'lost';

  return (
    <div className={cn(
      "group relative bg-card rounded-2xl border p-5 transition-all duration-300",
      "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
      isOverdue && "border-destructive/50 bg-destructive/5",
      followUpToday && "border-warning/50 bg-warning/5",
      "animate-fade-in"
    )}>
      {/* Overdue indicator */}
      {isOverdue && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-destructive to-destructive/50 rounded-t-2xl" />
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-foreground mb-1">{lead.name}</h3>
          <p className="text-sm text-muted-foreground">{lead.company}</p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-secondary transition-all">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdit(lead)} className="gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(lead.id)} 
              className="gap-2 text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <PlatformBadge platform={lead.platform} size="sm" />
        <StatusBadge status={lead.status} size="sm" />
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Last Action: {format(new Date(lead.lastActionDate), 'MMM d, yyyy')}</span>
        </div>
        
        <div className={cn(
          "flex items-center gap-2",
          isOverdue ? "text-destructive" : followUpToday ? "text-warning" : "text-muted-foreground"
        )}>
          <Clock className={cn("w-4 h-4", isOverdue && "animate-pulse")} />
          <span>
            Follow-up: {format(new Date(lead.nextFollowUpDate), 'MMM d, yyyy')}
            {isOverdue && ' (Overdue!)'}
            {followUpToday && ' (Today!)'}
          </span>
        </div>
      </div>

      {/* Notes & Screenshots indicators */}
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
        {lead.notes.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{lead.notes.length} note{lead.notes.length > 1 ? 's' : ''}</span>
          </div>
        )}
        {lead.screenshots.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Image className="w-3.5 h-3.5" />
            <span>{lead.screenshots.length} screenshot{lead.screenshots.length > 1 ? 's' : ''}</span>
          </div>
        )}
        {lead.notes.length === 0 && lead.screenshots.length === 0 && (
          <span className="text-xs text-muted-foreground/50">No attachments</span>
        )}
      </div>

      {/* Latest note preview */}
      {lead.notes.length > 0 && (
        <div className="mt-3 p-3 bg-secondary/50 rounded-lg">
          <p className="text-xs text-muted-foreground line-clamp-2">
            "{lead.notes[lead.notes.length - 1].text}"
          </p>
        </div>
      )}
    </div>
  );
}
