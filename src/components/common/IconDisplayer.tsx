// components/IconDisplay.tsx
import { getIconComponent } from '@/services/icons';
import { LucideIcon } from 'lucide-react';

interface IconDisplayProps
{
  iconName: string;
  className?: string;
  size?: number;
}

export default function IconDisplayer({ iconName, className = "", size = 16 }: IconDisplayProps)
{
  const IconComponent = getIconComponent(iconName) as LucideIcon;
  
  return <IconComponent className={className} size={size} />;
}