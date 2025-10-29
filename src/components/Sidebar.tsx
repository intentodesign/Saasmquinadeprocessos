import { Home, FolderOpen, PlusCircle, Settings, CreditCard } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { User } from '../lib/types';
import { cn } from '../lib/utils';

interface SidebarProps {
  user: User;
  currentPath: string;
  onNavigate: (path: string) => void;
  processCount?: number;
  maxProcesses?: number;
}

export function Sidebar({ user, currentPath, onNavigate, processCount = 12, maxProcesses = 50 }: SidebarProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const menuItems = [
    { icon: Home, label: 'Início', path: '/dashboard' },
    { icon: FolderOpen, label: 'Meus Processos', path: '/processes' },
    { icon: PlusCircle, label: 'Criar Novo', path: '/process/new', accent: true },
    { icon: Settings, label: 'Configurações', path: '/settings/branding' },
    { icon: CreditCard, label: 'Plano', path: '/pricing' },
  ];

  const percentage = (processCount / maxProcesses) * 100;

  return (
    <aside className="w-60 border-r bg-white h-screen sticky top-0 flex flex-col" data-tour="sidebar">
      {/* User Info */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-[#2563eb] to-[#0ea5e9] text-white">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate text-[#1e293b]">{user.name}</p>
            <p className="text-xs text-[#64748b] truncate">{user.company}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              data-tour={
                item.path === '/process/new' ? 'create-button' :
                item.path === '/settings/branding' ? 'settings' :
                undefined
              }
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                isActive && 'bg-[#2563eb]/10 text-[#2563eb] border-l-2 border-[#f59e0b] -ml-0.5 pl-[11px]',
                !isActive && item.accent && 'text-[#f59e0b] hover:bg-[#f59e0b]/10',
                !isActive && !item.accent && 'text-[#64748b] hover:bg-[#2563eb]/5'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Usage Indicator */}
      <div className="p-4 border-t">
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-[#64748b]">
            <span>POPs este mês</span>
            <span>{processCount}/{maxProcesses}</span>
          </div>
          <Progress value={percentage} className="h-1.5" />
        </div>
      </div>
    </aside>
  );
}
