import { AppState, User, Process, BrandingSettings } from './types';

// LocalStorage keys
const STORAGE_KEYS = {
  USER: 'mp_user',
  PROCESSES: 'mp_processes',
  BRANDING: 'mp_branding',
};

// Mock data inicial
const MOCK_USER: User = {
  id: '1',
  name: 'Carlos Eduardo Silva',
  email: 'carlos@autocenterpremium.com.br',
  plan: 'professional',
  company: 'Auto Center Premium',
  onboardingCompleted: true,
  tutorialCompleted: true,
};

const MOCK_PROCESSES: Process[] = [
  {
    id: '1',
    name: 'Troca de Óleo Completa',
    category: 'maintenance',
    status: 'complete',
    version: 2,
    createdAt: '2025-10-20T10:00:00Z',
    updatedAt: '2025-10-23T15:30:00Z',
    tags: ['troca-oleo', 'manutenção', 'preventiva'],
    steps: [
      {
        id: 's1',
        title: 'Elevar o veículo',
        description: 'Utilize o elevador automotivo ou macaco hidráulico para elevar o veículo a uma altura segura de trabalho.',
        responsible: 'Mecânico',
        duration: '5 min',
        warning: 'Use cavaletes de segurança',
        order: 1,
      },
      {
        id: 's2',
        title: 'Drenar óleo usado',
        description: 'Localize o parafuso de drenagem do cárter e remova-o com a chave apropriada. Deixe o óleo drenar completamente em um recipiente adequado.',
        responsible: 'Mecânico',
        duration: '10 min',
        warning: 'Óleo pode estar quente',
        order: 2,
      },
      {
        id: 's3',
        title: 'Substituir filtro de óleo',
        description: 'Remova o filtro de óleo antigo com a chave de filtro. Lubrifique o anel do novo filtro com óleo limpo e instale-o.',
        responsible: 'Mecânico',
        duration: '5 min',
        order: 3,
      },
      {
        id: 's4',
        title: 'Reapertar parafuso de drenagem',
        description: 'Limpe o parafuso de drenagem e sua rosca. Recoloque o parafuso aplicando o torque especificado pelo fabricante.',
        responsible: 'Mecânico',
        duration: '3 min',
        order: 4,
      },
      {
        id: 's5',
        title: 'Adicionar óleo novo',
        description: 'Adicione óleo lubrificante novo pela tampa superior do motor. Utilize a quantidade e especificação recomendadas pelo fabricante.',
        responsible: 'Mecânico',
        duration: '5 min',
        order: 5,
      },
      {
        id: 's6',
        title: 'Verificação final',
        description: 'Ligue o motor por alguns minutos, desligue e verifique o nível de óleo. Complete se necessário. Verifique vazamentos.',
        responsible: 'Mecânico',
        duration: '7 min',
        warning: 'Verificar vazamentos',
        order: 6,
      },
    ],
    metadata: {
      code: 'POP-MAN-001',
      revision: 'Rev. 02',
      approver: 'João Silva',
      effectiveDate: '2025-10-25',
    },
  },
  {
    id: '2',
    name: 'Diagnóstico de Freios',
    category: 'maintenance',
    status: 'draft',
    version: 1,
    createdAt: '2025-10-22T14:00:00Z',
    updatedAt: '2025-10-22T14:00:00Z',
    tags: ['freios', 'diagnóstico'],
    steps: [
      {
        id: 's1',
        title: 'Inspeção visual',
        description: 'Realizar inspeção visual das pastilhas, discos e componentes do sistema de freios.',
        responsible: 'Mecânico',
        duration: '10 min',
        order: 1,
      },
    ],
  },
  {
    id: '3',
    name: 'Atendimento Inicial ao Cliente',
    category: 'service',
    status: 'complete',
    version: 1,
    createdAt: '2025-10-18T09:00:00Z',
    updatedAt: '2025-10-18T09:00:00Z',
    tags: ['atendimento', 'cliente'],
    steps: [
      {
        id: 's1',
        title: 'Recepção e boas-vindas',
        description: 'Cumprimentar o cliente de forma cordial e apresentar-se.',
        responsible: 'Recepcionista',
        duration: '2 min',
        order: 1,
      },
    ],
  },
  {
    id: '4',
    name: 'Balanceamento de Rodas',
    category: 'maintenance',
    status: 'complete',
    version: 1,
    createdAt: '2025-10-15T11:00:00Z',
    updatedAt: '2025-10-15T11:00:00Z',
    tags: ['balanceamento', 'rodas'],
    steps: [
      {
        id: 's1',
        title: 'Remover rodas',
        description: 'Elevar o veículo e remover as rodas que serão balanceadas.',
        responsible: 'Mecânico',
        duration: '10 min',
        order: 1,
      },
    ],
  },
  {
    id: '5',
    name: 'Orçamento de Serviços',
    category: 'administrative',
    status: 'complete',
    version: 1,
    createdAt: '2025-10-10T08:00:00Z',
    updatedAt: '2025-10-10T08:00:00Z',
    tags: ['orçamento', 'administrativo'],
    steps: [
      {
        id: 's1',
        title: 'Levantar necessidades',
        description: 'Identificar todos os serviços necessários através de inspeção ou solicitação do cliente.',
        responsible: 'Consultor',
        duration: '15 min',
        order: 1,
      },
    ],
  },
];

const DEFAULT_BRANDING: BrandingSettings = {
  primaryColor: '#2563eb',
  secondaryColor: '#0ea5e9',
  companyName: 'Auto Center Premium',
};

// Helper functions
export const store = {
  // User
  getUser: (): User | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  },
  
  setUser: (user: User | null) => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  // Processes
  getProcesses: (): Process[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROCESSES);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  },

  setProcesses: (processes: Process[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROCESSES, JSON.stringify(processes));
    } catch (error) {
      console.error('Error saving processes:', error);
    }
  },

  getProcess: (id: string): Process | undefined => {
    const processes = store.getProcesses();
    return processes.find(p => p.id === id);
  },

  addProcess: (process: Process) => {
    const processes = store.getProcesses();
    processes.push(process);
    store.setProcesses(processes);
  },

  updateProcess: (id: string, updates: Partial<Process>) => {
    const processes = store.getProcesses();
    const index = processes.findIndex(p => p.id === id);
    if (index !== -1) {
      processes[index] = { ...processes[index], ...updates, updatedAt: new Date().toISOString() };
      store.setProcesses(processes);
    }
  },

  deleteProcess: (id: string) => {
    const processes = store.getProcesses();
    const filtered = processes.filter(p => p.id !== id);
    store.setProcesses(filtered);
  },

  // Branding
  getBranding: (): BrandingSettings => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BRANDING);
      return stored ? JSON.parse(stored) : DEFAULT_BRANDING;
    } catch (error) {
      return DEFAULT_BRANDING;
    }
  },

  setBranding: (branding: BrandingSettings) => {
    try {
      localStorage.setItem(STORAGE_KEYS.BRANDING, JSON.stringify(branding));
    } catch (error) {
      console.error('Error saving branding:', error);
    }
  },

  // Initialize with mock data
  initialize: () => {
    try {
      if (!store.getUser()) {
        store.setUser(MOCK_USER);
      }
      if (store.getProcesses().length === 0) {
        store.setProcesses(MOCK_PROCESSES);
      }
      if (!localStorage.getItem(STORAGE_KEYS.BRANDING)) {
        store.setBranding(DEFAULT_BRANDING);
      }
    } catch (error) {
      console.error('Error initializing store:', error);
    }
  },

  // Auth helpers
  login: (email: string, password: string): User | null => {
    // Mock login - aceita qualquer email/senha
    const user = MOCK_USER;
    store.setUser(user);
    return user;
  },

  register: (name: string, email: string, password: string): User => {
    const user: User = {
      id: Date.now().toString(),
      name,
      email,
      plan: 'free',
      onboardingCompleted: false,
      tutorialCompleted: false,
    };
    store.setUser(user);
    return user;
  },

  updateUserOnboarding: (completed: boolean) => {
    const user = store.getUser();
    if (user) {
      user.onboardingCompleted = completed;
      store.setUser(user);
    }
  },

  updateUserTutorial: (completed: boolean) => {
    const user = store.getUser();
    if (user) {
      user.tutorialCompleted = completed;
      store.setUser(user);
    }
  },

  logout: () => {
    store.setUser(null);
  },
};
