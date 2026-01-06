import { LeadStatus, STATUS_LABELS } from '@/types/lead';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: LeadStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<LeadStatus, string> = {
  new: 'bg-status-new/20 text-status-new border-status-new/30',
  replied: 'bg-status-replied/20 text-status-replied border-status-replied/30',
  seen: 'bg-status-seen/20 text-status-seen border-status-seen/30',
  interested: 'bg-status-interested/20 text-status-interested border-status-interested/30',
  closed: 'bg-status-closed/20 text-status-closed border-status-closed/30',
  lost: 'bg-status-lost/20 text-status-lost border-status-lost/30',
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full border font-medium",
      statusConfig[status],
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
    )}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full mr-1.5",
        status === 'new' && 'bg-status-new',
        status === 'replied' && 'bg-status-replied',
        status === 'seen' && 'bg-status-seen',
        status === 'interested' && 'bg-status-interested',
        status === 'closed' && 'bg-status-closed',
        status === 'lost' && 'bg-status-lost',
      )} />
      {STATUS_LABELS[status]}
    </span>
  );
}
