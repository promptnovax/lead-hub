import { Platform, PLATFORM_LABELS } from '@/types/lead';
import { MessageCircle, Instagram, Linkedin, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlatformBadgeProps {
  platform: Platform;
  size?: 'sm' | 'md';
}

const platformConfig = {
  whatsapp: {
    icon: MessageCircle,
    className: 'bg-platform-whatsapp/20 text-platform-whatsapp border-platform-whatsapp/30',
  },
  instagram: {
    icon: Instagram,
    className: 'bg-platform-instagram/20 text-platform-instagram border-platform-instagram/30',
  },
  linkedin: {
    icon: Linkedin,
    className: 'bg-platform-linkedin/20 text-platform-linkedin border-platform-linkedin/30',
  },
  email: {
    icon: Mail,
    className: 'bg-platform-email/20 text-platform-email border-platform-email/30',
  },
};

export function PlatformBadge({ platform, size = 'md' }: PlatformBadgeProps) {
  const config = platformConfig[platform];
  const Icon = config.icon;

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full border font-medium",
      config.className,
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
    )}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {PLATFORM_LABELS[platform]}
    </span>
  );
}
