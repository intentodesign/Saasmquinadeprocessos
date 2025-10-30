import { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateProcessPage } from './pages/CreateProcessPage';
import { ProcessEditorPage } from './pages/ProcessEditorPage';
import { ProcessLibraryPage } from './pages/ProcessLibraryPage';
import { ProcessViewPage } from './pages/ProcessViewPage';
import { BrandingSettingsPage } from './pages/BrandingSettingsPage';
import { PricingPage } from './pages/PricingPage';
import { OnboardingPage } from './pages/OnboardingPage';

// Components
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { TutorialTour } from './components/TutorialTour';

// Utils
import { store } from './lib/store';
import { User, Process, BrandingSettings } from './lib/types';

type Route = 
  | '/'
  | '/login'
  | '/register'
  | '/dashboard'
  | '/process/new'
  | `/process/${string}/edit`
  | `/process/${string}/view`
  | '/processes'
  | '/settings/branding'
  | '/pricing';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('/');
  const [user, setUser] = useState<User | null>(null);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [branding, setBranding] = useState<BrandingSettings | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  // Initialize app
  useEffect(() => {
    try {
      store.initialize();
      const currentUser = store.getUser();
      setUser(currentUser);
      setProcesses(store.getProcesses());
      setBranding(store.getBranding());

      // Check if user needs to see tutorial
      if (currentUser && currentUser.onboardingCompleted && !currentUser.tutorialCompleted) {
        setShowTutorial(true);
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      // Fallback to defaults
      setUser(null);
      setProcesses([]);
      setBranding({
        primaryColor: '#2563eb',
        secondaryColor: '#0ea5e9',
        companyName: 'Auto Center Premium',
      });
    }
  }, []);

  // Navigate function
  const navigate = (path: string) => {
    setCurrentRoute(path);
    window.scrollTo(0, 0);
  };

  // Auth functions
  const handleLogin = (email: string, password: string) => {
    const loggedUser = store.login(email, password);
    if (loggedUser) {
      setUser(loggedUser);
      // Check if user needs onboarding
      if (!loggedUser.onboardingCompleted) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
      toast.success('Login realizado com sucesso!');
    }
  };

  const handleRegister = (name: string, email: string, password: string) => {
    const newUser = store.register(name, email, password);
    setUser(newUser);
    navigate('/onboarding');
    toast.success('Conta criada com sucesso! Bem-vindo! 🎉');
  };

  const handleLogout = () => {
    store.logout();
    setUser(null);
    navigate('/');
    toast.info('Você saiu da sua conta');
  };

  // Process functions
  const handleCreateProcess = (process: Process) => {
    store.addProcess(process);
    setProcesses(store.getProcesses());
    toast.success(`Processo "${process.name}" criado com sucesso!`);
  };

  const handleUpdateProcess = (id: string, updates: Partial<Process>) => {
    store.updateProcess(id, updates);
    setProcesses(store.getProcesses());
    toast.success('Processo atualizado!');
  };

  const handleDeleteProcess = (id: string) => {
    store.deleteProcess(id);
    setProcesses(store.getProcesses());
    toast.success('Processo excluído');
  };

  // Branding functions
  const handleUpdateBranding = (newBranding: BrandingSettings) => {
    store.setBranding(newBranding);
    setBranding(newBranding);
    toast.success('Configurações de branding salvas!');
  };

  // Onboarding functions
  const handleOnboardingComplete = (data: any) => {
    // Update user
    if (user) {
      const updatedUser = {
        ...user,
        name: data.userName || user.name,
        company: data.companyName || user.company,
        onboardingCompleted: true,
      };
      store.setUser(updatedUser);
      setUser(updatedUser);
    }

    // Update branding
    const newBranding: BrandingSettings = {
      logo: data.logo,
      primaryColor: data.primaryColor || '#2563eb',
      secondaryColor: data.secondaryColor || '#0ea5e9',
      companyName: data.companyName || 'Minha Empresa',
    };
    store.setBranding(newBranding);
    setBranding(newBranding);

    // Show tutorial
    setShowTutorial(true);
    navigate('/dashboard');
  };

  const handleTutorialComplete = () => {
    if (user) {
      store.updateUserTutorial(true);
      const updatedUser = { ...user, tutorialCompleted: true };
      store.setUser(updatedUser);
      setUser(updatedUser);
    }
    setShowTutorial(false);
    toast.success('Tutorial concluído! Agora você está pronto para criar processos! 🚀');
  };

  const handleTutorialSkip = () => {
    if (user) {
      store.updateUserTutorial(true);
      const updatedUser = { ...user, tutorialCompleted: true };
      store.setUser(updatedUser);
      setUser(updatedUser);
    }
    setShowTutorial(false);
  };

  // Route protection
  const requireAuth = (component: React.ReactNode) => {
    if (!user) {
      return <LoginPage onNavigate={navigate} onLogin={handleLogin} />;
    }
    return component;
  };

  // Layout wrapper for authenticated pages
  const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    if (!user) return null;

    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <Navbar user={user} onNavigate={navigate} onLogout={handleLogout} />
        <div className="flex">
          <Sidebar
            user={user}
            currentPath={currentRoute}
            onNavigate={navigate}
            processCount={processes.length}
            maxProcesses={999}
          />
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </div>
    );
  };

  // Simple layout for pages without sidebar
  const SimpleAuthLayout = ({ children }: { children: React.ReactNode }) => {
    if (!user) return null;

    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <Navbar user={user} onNavigate={navigate} onLogout={handleLogout} />
        <main className="max-w-7xl mx-auto p-8">
          {children}
        </main>
      </div>
    );
  };

  // Render current route
  const renderRoute = () => {
    // Public routes
    if (currentRoute === '/') {
      return <LandingPage onNavigate={navigate} />;
    }

    if (currentRoute === '/login') {
      if (user) {
        navigate('/dashboard');
        return null;
      }
      return <LoginPage onNavigate={navigate} onLogin={handleLogin} />;
    }

    if (currentRoute === '/register') {
      if (user) {
        navigate('/dashboard');
        return null;
      }
      return <RegisterPage onNavigate={navigate} onRegister={handleRegister} />;
    }

    if (currentRoute === '/onboarding') {
      if (!user) {
        navigate('/login');
        return null;
      }
      return <OnboardingPage onComplete={handleOnboardingComplete} />;
    }

    if (currentRoute === '/pricing') {
      if (user) {
        return (
          <SimpleAuthLayout>
            <PricingPage user={user} onNavigate={navigate} />
          </SimpleAuthLayout>
        );
      }
      return <PricingPage onNavigate={navigate} />;
    }

    // Protected routes
    if (currentRoute === '/dashboard') {
      return requireAuth(
        <AuthLayout>
          <DashboardPage
            user={user!}
            processes={processes}
            onNavigate={navigate}
            onDeleteProcess={handleDeleteProcess}
          />
        </AuthLayout>
      );
    }

    if (currentRoute === '/process/new') {
      return requireAuth(
        <CreateProcessPage
          user={user!}
          branding={branding || undefined}
          onNavigate={navigate}
          onCreateProcess={handleCreateProcess}
        />
      );
    }

    if (currentRoute === '/processes') {
      return requireAuth(
        <AuthLayout>
          <ProcessLibraryPage
            processes={processes}
            branding={branding || {
              primaryColor: '#2563eb',
              secondaryColor: '#0ea5e9',
              companyName: 'Auto Center Premium',
            }}
            onNavigate={navigate}
            onDeleteProcess={handleDeleteProcess}
          />
        </AuthLayout>
      );
    }

    if (currentRoute === '/settings/branding') {
      return requireAuth(
        <AuthLayout>
          <BrandingSettingsPage
            branding={branding!}
            user={user!}
            onUpdateBranding={handleUpdateBranding}
            onNavigate={navigate}
          />
        </AuthLayout>
      );
    }

    // Dynamic routes
    const processViewMatch = currentRoute.match(/^\/process\/(.+)\/view$/);
    if (processViewMatch) {
      const processId = processViewMatch[1];
      const process = processes.find(p => p.id === processId);
      
      if (!process) {
        navigate('/processes');
        return null;
      }

      return requireAuth(
        <AuthLayout>
          <ProcessViewPage
            process={process}
            onNavigate={navigate}
            branding={branding || undefined}
          />
        </AuthLayout>
      );
    }

    const processEditMatch = currentRoute.match(/^\/process\/(.+)\/edit$/);
    if (processEditMatch) {
      const processId = processEditMatch[1];
      const process = processes.find(p => p.id === processId);
      
      if (!process) {
        navigate('/processes');
        return null;
      }

      return requireAuth(
        <ProcessEditorPage
          process={process}
          onNavigate={navigate}
          onUpdateProcess={handleUpdateProcess}
        />
      );
    }

    // 404 - Redirect to dashboard or home
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
    return null;
  };

  return (
    <>
      {renderRoute()}
      {showTutorial && (
        <TutorialTour 
          onComplete={handleTutorialComplete}
          onSkip={handleTutorialSkip}
        />
      )}
      <Toaster position="bottom-right" />
    </>
  );
}
