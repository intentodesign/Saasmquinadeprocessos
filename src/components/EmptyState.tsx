import { LucideIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Card className="p-12 text-center">
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#64748b]/10 flex items-center justify-center">
        <Icon className="h-10 w-10 text-[#64748b]" />
      </div>
      <h3 className="text-[#1e293b] mb-2">{title}</h3>
      <p className="text-[#64748b] mb-6 max-w-md mx-auto">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          className="bg-[#f59e0b] hover:bg-[#d97706]"
        >
          {actionLabel}
        </Button>
      )}
    </Card>
  );
}
