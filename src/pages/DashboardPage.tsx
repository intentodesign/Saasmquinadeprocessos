import { FileText, Download, Zap, Crown, Plus, TrendingUp } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ProcessCard } from '../components/ProcessCard';
import { EmptyState } from '../components/EmptyState';
import { Process, User } from '../lib/types';
import { getCategoryIcon, formatDate } from '../lib/utils';

interface DashboardPageProps {
  user: User;
  processes: Process[];
  onNavigate: (path: string) => void;
  onDeleteProcess: (id: string) => void;
}

export function DashboardPage({ user, processes, onNavigate, onDeleteProcess }: DashboardPageProps) {
  const recentProcesses = [...processes]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  const completedCount = processes.filter(p => p.status === 'complete').length;
  const monthlyCount = processes.length;

  const templates = [
    { id: 1, title: 'Diagnóstico de Suspensão', category: 'Manutenção', icon: '🔧' },
    { id: 2, title: 'Atendimento ao Cliente', category: 'Atendimento', icon: '👥' },
    { id: 3, title: 'Inspeção Pré-entrega', category: 'Manutenção', icon: '✅' },
  ];

  const handleExport = (process: Process) => {
    alert(`Exportando "${process.name}" como PDF...`);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <Card className="p-6 bg-gradient-to-br from-[#2563eb]/5 to-[#0ea5e9]/5 border-[#2563eb]/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[#1e293b] mb-2">Olá, {user.name.split(' ')[0]}! 👋</h1>
            <p className="text-[#64748b]">
              Você criou {processes.length} processos. Continue documentando sua empresa.
            </p>
          </div>
          <Button 
            onClick={() => onNavigate('/process/new')}
            className="bg-[#2563eb] hover:bg-[#1d4ed8]"
          >
            <Plus className="mr-2 h-5 w-5" />
            Criar Novo Processo
          </Button>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-[#2563eb]/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-[#2563eb]" />
            </div>
            <Badge variant="secondary" className="bg-[#10b981]/10 text-[#10b981]">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3 este mês
            </Badge>
          </div>
          <p className="text-2xl text-[#1e293b] mb-1">{monthlyCount}</p>
          <p className="text-sm text-[#64748b]">POPs Criados</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
              <Download className="h-6 w-6 text-[#10b981]" />
            </div>
            <Badge variant="secondary" className="bg-[#10b981]/10 text-[#10b981]">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2 esta semana
            </Badge>
          </div>
          <p className="text-2xl text-[#1e293b] mb-1">8</p>
          <p className="text-sm text-[#64748b]">Exportações</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center">
              <Zap className="h-6 w-6 text-[#f59e0b]" />
            </div>
          </div>
          <p className="text-2xl text-[#1e293b] mb-1">2.340</p>
          <p className="text-sm text-[#64748b]">Tokens IA restantes</p>
        </Card>

        <Card className="p-6 border-[#f59e0b]/30 bg-[#f59e0b]/5">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center">
              <Crown className="h-6 w-6 text-[#f59e0b]" />
            </div>
          </div>
          <p className="text-2xl text-[#1e293b] mb-1">Profissional</p>
          <button 
            onClick={() => onNavigate('/pricing')}
            className="text-sm text-[#2563eb] hover:underline"
          >
            Ver detalhes →
          </button>
        </Card>
      </div>

      {/* Recent Processes */}
      <div data-tour="processes-section">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#1e293b]">Seus Últimos Processos</h2>
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('/processes')}
          >
            Ver todos →
          </Button>
        </div>

        {recentProcesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProcesses.map((process) => (
              <ProcessCard
                key={process.id}
                process={process}
                onView={() => onNavigate(`/process/${process.id}/view`)}
                onEdit={() => onNavigate(`/process/${process.id}/edit`)}
                onExport={() => handleExport(process)}
                onDelete={() => onDeleteProcess(process.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="Nenhum processo criado ainda"
            description="Crie seu primeiro POP em menos de 5 minutos"
            actionLabel="Criar Primeiro Processo"
            onAction={() => onNavigate('/process/new')}
          />
        )}
      </div>

      {/* Suggested Templates */}
      <div>
        <div className="mb-6">
          <h2 className="text-[#1e293b] mb-2">Templates Sugeridos</h2>
          <p className="text-[#64748b]">
            Comece rápido com nossos templates prontos para oficinas automotivas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card 
              key={template.id}
              className="p-6 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => onNavigate('/process/new')}
            >
              <div className="text-4xl mb-4">{template.icon}</div>
              <h3 className="text-[#1e293b] mb-2 group-hover:text-[#2563eb] transition-colors">
                {template.title}
              </h3>
              <p className="text-sm text-[#64748b] mb-4">{template.category}</p>
              <Button variant="ghost" className="w-full group-hover:bg-[#2563eb]/10">
                Usar Template →
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}