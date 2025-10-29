// Tipos da aplicação
export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'basic' | 'professional' | 'enterprise';
  company?: string;
  avatar?: string;
  onboardingCompleted?: boolean;
  tutorialCompleted?: boolean;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  responsible?: string;
  duration?: string;
  warning?: string;
  order: number;
}

export interface Process {
  id: string;
  name: string;
  category: 'maintenance' | 'service' | 'administrative' | 'other';
  status: 'draft' | 'complete';
  steps: ProcessStep[];
  createdAt: string;
  updatedAt: string;
  version: number;
  tags: string[];
  metadata?: {
    code?: string;
    revision?: string;
    approver?: string;
    effectiveDate?: string;
  };
}

export interface BrandingSettings {
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  companyName: string;
}

export interface AppState {
  user: User | null;
  processes: Process[];
  brandingSettings: BrandingSettings;
}
