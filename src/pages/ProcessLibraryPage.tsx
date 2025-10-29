import { useState } from 'react';
import { Plus, Search, Filter, FileText, Download, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ProcessCard } from '../components/ProcessCard';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { EmptyState } from '../components/EmptyState';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Process, BrandingSettings } from '../lib/types';
import { getCategoryLabel } from '../lib/utils';
import { AllProcessesDocument } from '../components/AllProcessesDocument';
import { generateAllProcessesPDF } from '../lib/pdf-utils';
import { toast } from 'sonner@2.0.3';

interface ProcessLibraryPageProps {
  processes: Process[];
  branding: BrandingSettings;
  onNavigate: (path: string) => void;
  onDeleteProcess: (id: string) => void;
}

export function ProcessLibraryPage({ processes, branding, onNavigate, onDeleteProcess }: ProcessLibraryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [showAllProcessesModal, setShowAllProcessesModal] = useState(false);
  const [isExportingAll, setIsExportingAll] = useState(false);

  const handleExport = (process: Process) => {
    alert(`Exportando "${process.name}" como PDF...`);
  };

  const handleExportAll = async () => {
    if (processes.length === 0) {
      toast.error('Nenhum processo para exportar');
      return;
    }

    setShowAllProcessesModal(true);
    setIsExportingAll(true);

    try {
      // Aguardar um pouco para o modal renderizar
      await new Promise(resolve => setTimeout(resolve, 500));

      toast.info(`Preparando ${processes.length} processo(s)...`);
      
      await generateAllProcessesPDF(
        'all-processes-document',
        branding.companyName,
        processes.length,
        (progress) => {
          if (progress === 10) toast.info('Renderizando fluxogramas...');
          if (progress === 30) toast.info('Aguarde, processando documento...');
          if (progress === 60) toast.info('Criando arquivo PDF...');
          if (progress === 90) toast.info('Finalizando download...');
        }
      );

      toast.success('Manual de Processos baixado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar todos os processos:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao gerar PDF';
      toast.error(errorMessage);
    } finally {
      setIsExportingAll(false);
      setTimeout(() => {
        setShowAllProcessesModal(false);
      }, 500);
    }
  };

  // Filter and sort processes
  const filteredProcesses = processes
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
      const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'oldest':
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        case 'a-z':
          return a.name.localeCompare(b.name);
        case 'z-a':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  const statusCounts = {
    all: processes.length,
    complete: processes.filter(p => p.status === 'complete').length,
    draft: processes.filter(p => p.status === 'draft').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[#1e293b] mb-2">Meus Processos</h1>
          <p className="text-[#64748b]">
            Gerencie todos os seus Procedimentos Operacionais Padrão
          </p>
        </div>
        <div className="flex gap-2">
          {processes.length > 0 && (
            <Button 
              onClick={handleExportAll}
              variant="outline"
              disabled={isExportingAll}
            >
              {isExportingAll ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Baixar Todos
                </>
              )}
            </Button>
          )}
          <Button 
            onClick={() => onNavigate('/process/new')}
            className="bg-[#2563eb] hover:bg-[#1d4ed8]"
          >
            <Plus className="mr-2 h-5 w-5" />
            Criar Novo
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748b]" />
            <Input
              placeholder="Buscar processos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter Chips */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              className={`cursor-pointer ${filterStatus === 'all' ? 'bg-[#2563eb]' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              Todos ({statusCounts.all})
            </Badge>
            <Badge
              variant={filterStatus === 'complete' ? 'default' : 'outline'}
              className={`cursor-pointer ${filterStatus === 'complete' ? 'bg-[#10b981]' : ''}`}
              onClick={() => setFilterStatus('complete')}
            >
              Completos ({statusCounts.complete})
            </Badge>
            <Badge
              variant={filterStatus === 'draft' ? 'default' : 'outline'}
              className={`cursor-pointer ${filterStatus === 'draft' ? 'bg-[#f59e0b]' : ''}`}
              onClick={() => setFilterStatus('draft')}
            >
              Rascunhos ({statusCounts.draft})
            </Badge>
          </div>

          {/* Category and Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                <SelectItem value="maintenance">Manutenção</SelectItem>
                <SelectItem value="service">Atendimento</SelectItem>
                <SelectItem value="administrative">Administrativo</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Mais recentes</SelectItem>
                <SelectItem value="oldest">Mais antigos</SelectItem>
                <SelectItem value="a-z">A-Z</SelectItem>
                <SelectItem value="z-a">Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Results */}
      {filteredProcesses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProcesses.map((process) => (
            <ProcessCard
              key={process.id}
              process={process}
              onView={() => onNavigate(`/process/${process.id}/view`)}
              onEdit={() => onNavigate(`/process/${process.id}/edit`)}
              onExport={() => handleExport(process)}
              onDelete={() => {
                if (confirm(`Tem certeza que deseja excluir "${process.name}"?`)) {
                  onDeleteProcess(process.id);
                }
              }}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#64748b]/10 flex items-center justify-center">
            <Search className="h-10 w-10 text-[#64748b]" />
          </div>
          <h3 className="text-[#1e293b] mb-2">Nenhum processo encontrado</h3>
          <p className="text-[#64748b] mb-6">
            {searchQuery
              ? `Nenhum resultado para "${searchQuery}"`
              : 'Ajuste os filtros ou crie um novo processo'}
          </p>
          {!searchQuery && (
            <Button 
              onClick={() => onNavigate('/process/new')}
              className="bg-[#f59e0b] hover:bg-[#d97706]"
            >
              <Plus className="mr-2 h-5 w-5" />
              Criar Primeiro Processo
            </Button>
          )}
        </Card>
      )}

      {/* Modal com documento completo (hidden, usado apenas para PDF) */}
      <Dialog open={showAllProcessesModal} onOpenChange={setShowAllProcessesModal}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Gerando Manual de Processos</DialogTitle>
            <DialogDescription>
              Aguarde enquanto preparamos o documento com {processes.length} processo(s)...
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-auto max-h-[70vh]" style={{ display: 'none' }}>
            <div id="all-processes-document">
              <AllProcessesDocument processes={processes} branding={branding} />
            </div>
          </div>
          {isExportingAll && (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-[#2563eb] mx-auto mb-4" />
                <p className="text-[#64748b]">Processando documento...</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}