import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  const d = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - d.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `há ${diffDays} dias`;
  if (diffDays < 30) return `há ${Math.floor(diffDays / 7)} semanas`;
  
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    maintenance: 'Manutenção',
    service: 'Atendimento',
    administrative: 'Administrativo',
    other: 'Outro',
  };
  return labels[category] || category;
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    maintenance: '🔧',
    service: '👥',
    administrative: '📋',
    other: '📄',
  };
  return icons[category] || '📄';
}

export function getStatusLabel(status: string): string {
  return status === 'complete' ? 'Completo' : 'Rascunho';
}

export function getPlanLabel(plan: string): string {
  const labels: Record<string, string> = {
    free: 'Gratuito',
    basic: 'Básico',
    professional: 'Profissional',
    enterprise: 'Enterprise',
  };
  return labels[plan] || plan;
}

export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}
