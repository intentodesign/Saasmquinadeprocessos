import { useState } from 'react';
import { Save, Download, Check, Plus, LayoutList, GitBranch, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner@2.0.3';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../components/ui/breadcrumb';
import { Process, ProcessStep } from '../lib/types';
import { getCategoryLabel, generateId } from '../lib/utils';
import { FlowchartEditor } from '../components/FlowchartEditor';
import { ProcessStepsEditor } from '../components/ProcessStepsEditor';
import { store } from '../lib/store';

interface ProcessEditorPageProps {
  process: Process;
  onNavigate: (path: string) => void;
  onUpdateProcess: (id: string, updates: Partial<Process>) => void;
}

export function ProcessEditorPage({ process, onNavigate, onUpdateProcess }: ProcessEditorPageProps) {
  const [editedProcess, setEditedProcess] = useState<Process>(process);
  const [viewMode, setViewMode] = useState<'cards' | 'diagram'>('cards');
  const branding = store.getBranding();

  const handleSave = () => {
    onUpdateProcess(process.id, editedProcess);
    toast.success('Processo salvo com sucesso!');
  };

  const handlePublish = () => {
    onUpdateProcess(process.id, { ...editedProcess, status: 'complete' });
    toast.success('Processo publicado!');
  };

  const handleExport = () => {
    // Salvar primeiro
    onUpdateProcess(process.id, editedProcess);
    toast.info('Redirecionando para visualização...');
    // Navegar para a página de visualização onde o PDF pode ser gerado
    setTimeout(() => {
      onNavigate(`/process/${process.id}`);
      toast.info('Use o botão "Exportar PDF" para baixar o documento');
    }, 500);
  };

  const handleStepsChange = (newSteps: ProcessStep[]) => {
    setEditedProcess(prev => ({
      ...prev,
      steps: newSteps,
    }));
  };

  const addStep = () => {
    const newStep: ProcessStep = {
      id: generateId(),
      title: 'Nova Etapa',
      description: 'Descrição da etapa...',
      order: editedProcess.steps.length + 1,
    };
    handleStepsChange([...editedProcess.steps, newStep]);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => onNavigate('/processes')} className="cursor-pointer">
                  Meus Processos
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>{editedProcess.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Input
              value={editedProcess.name}
              onChange={(e) => setEditedProcess(prev => ({ ...prev, name: e.target.value }))}
              className="max-w-md"
            />
            <Badge variant={editedProcess.status === 'complete' ? 'default' : 'secondary'}>
              Versão {editedProcess.version}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Salvar
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button onClick={handlePublish} className="bg-[#10b981] hover:bg-[#059669]">
              <Check className="mr-2 h-4 w-4" />
              Publicar
            </Button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 mt-4">
          <Button
            variant={viewMode === 'cards' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('cards')}
          >
            <LayoutList className="mr-2 h-4 w-4" />
            Cards
          </Button>
          <Button
            variant={viewMode === 'diagram' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('diagram')}
          >
            <GitBranch className="mr-2 h-4 w-4" />
            Fluxograma
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Canvas */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'cards' ? (
            <div className="max-w-4xl mx-auto">
              <ProcessStepsEditor 
                steps={editedProcess.steps}
                onStepsChange={handleStepsChange}
              />
            </div>
          ) : (
            // Diagram View
            <div className="max-w-5xl mx-auto space-y-4">
              <FlowchartEditor 
                steps={editedProcess.steps} 
                processName={editedProcess.name}
                onStepsChange={handleStepsChange}
                companyLogo={branding.logoUrl}
                companyName={branding.companyName}
              />
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l bg-white overflow-y-auto p-6 space-y-6">
          <div>
            <h3 className="text-[#1e293b] mb-4">Detalhes</h3>
            <div className="space-y-4">
              <div>
                <Label>Categoria</Label>
                <Select
                  value={editedProcess.category}
                  onValueChange={(value: any) => setEditedProcess(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Manutenção</SelectItem>
                    <SelectItem value="service">Atendimento</SelectItem>
                    <SelectItem value="administrative">Administrativo</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Data de criação</Label>
                <Input value={new Date(editedProcess.createdAt).toLocaleDateString('pt-BR')} disabled />
              </div>
              
              <div>
                <Label>Última modificação</Label>
                <Input value={new Date(editedProcess.updatedAt).toLocaleDateString('pt-BR')} disabled />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[#1e293b] mb-4">Metadados ISO 9001</h3>
            <div className="space-y-4">
              <div>
                <Label>Código do documento</Label>
                <Input
                  value={editedProcess.metadata?.code || ''}
                  onChange={(e) => setEditedProcess(prev => ({
                    ...prev,
                    metadata: { ...prev.metadata, code: e.target.value }
                  }))}
                  placeholder="Ex: POP-MAN-001"
                />
              </div>
              
              <div>
                <Label>Revisão</Label>
                <Input
                  value={editedProcess.metadata?.revision || ''}
                  onChange={(e) => setEditedProcess(prev => ({
                    ...prev,
                    metadata: { ...prev.metadata, revision: e.target.value }
                  }))}
                  placeholder="Ex: Rev. 02"
                />
              </div>
              
              <div>
                <Label>Aprovador</Label>
                <Input
                  value={editedProcess.metadata?.approver || ''}
                  onChange={(e) => setEditedProcess(prev => ({
                    ...prev,
                    metadata: { ...prev.metadata, approver: e.target.value }
                  }))}
                  placeholder="Nome do aprovador"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[#1e293b] mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {editedProcess.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={addStep}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-white shadow-lg flex items-center justify-center transition-all hover:scale-110"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}