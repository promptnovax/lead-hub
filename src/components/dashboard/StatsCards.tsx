import { Lead } from '@/types/lead';
import { Users, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardsProps {
  leads: Lead[];
}

export function StatsCards({ leads }: StatsCardsProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayLeads = leads.filter(l => {
    const created = new Date(l.createdAt);
    created.setHours(0, 0, 0, 0);
    return created.getTime() === today.getTime();
  });

  const pendingFollowups = leads.filter(l => {
    const followUp = new Date(l.nextFollowUpDate);
    followUp.setHours(0, 0, 0, 0);
    return followUp.getTime() === today.getTime() && l.status !== 'closed' && l.status !== 'lost';
  });

  const overdueLeads = leads.filter(l => {
    const followUp = new Date(l.nextFollowUpDate);
    followUp.setHours(0, 0, 0, 0);
    return followUp.getTime() < today.getTime() && l.status !== 'closed' && l.status !== 'lost';
  });

  const closedLeads = leads.filter(l => l.status === 'closed');

  const stats = [
    {
      label: "Today's Leads",
      value: todayLeads.length,
      icon: Users,
      color: 'primary',
      gradient: 'from-primary/20 to-primary/5',
      iconBg: 'bg-primary/20',
      iconColor: 'text-primary',
    },
    {
      label: 'Pending Follow-ups',
      value: pendingFollowups.length,
      icon: Clock,
      color: 'warning',
      gradient: 'from-warning/20 to-warning/5',
      iconBg: 'bg-warning/20',
      iconColor: 'text-warning',
    },
    {
      label: 'Overdue',
      value: overdueLeads.length,
      icon: AlertTriangle,
      color: 'destructive',
      gradient: 'from-destructive/20 to-destructive/5',
      iconBg: 'bg-destructive/20',
      iconColor: 'text-destructive',
    },
    {
      label: 'Closed Deals',
      value: closedLeads.length,
      icon: CheckCircle,
      color: 'success',
      gradient: 'from-success/20 to-success/5',
      iconBg: 'bg-success/20',
      iconColor: 'text-success',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={cn(
              "relative overflow-hidden rounded-2xl p-6",
              "bg-card border border-border",
              "hover:border-primary/30 transition-all duration-300",
              "animate-fade-in"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-50",
              stat.gradient
            )} />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  stat.iconBg
                )}>
                  <Icon className={cn("w-6 h-6", stat.iconColor)} />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
