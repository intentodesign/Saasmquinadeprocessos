import { useState, useEffect } from 'react';
import { DragDropFlowchart } from './DragDropFlowchart';
import { MermaidFlowchart } from './MermaidFlowchart';
import { ProcessStep } from '../lib/types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Code, Eye, Download, RefreshCw, Move } from 'lucide-react';

interface FlowchartEditorProps {
  steps: ProcessStep[];
  processName: string;
  onStepsChange?: (steps: ProcessStep[]) => void;
  companyLogo?: string;
  companyName?: string;
}

export function FlowchartEditor({ steps, processName, onStepsChange, companyLogo, companyName }: FlowchartEditorProps) {
  const [viewMode, setViewMode] = useState<'interactive' | 'mermaid' | 'code'>('interactive');
  const [mermaidCode, setMermaidCode] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const generateMermaidCode = (): string => {
    let code = 'graph TD\n';
    
    // Start node
    code += '  Start([Início])\n';
    code += '  Start --> Step1\n\n';
    
    // Track warning counter
    let warningCounter = 0;
    
    // Add all steps
    steps.forEach((step, index) => {
      const currentStep = `Step${index + 1}`;
      const nextStep = index < steps.length - 1 ? `Step${index + 2}` : 'End';
      
      // Format step title - escape special characters
      const stepTitle = step.title
        .replace(/[\"'`]/g, '')
        .replace(/[()[\]{}]/g, '')
        .replace(/\\/g, '')
        .trim()
        .substring(0, 50);
      
      // Determine node type
      if (step.warning) {
        code += `  ${currentStep}{${stepTitle}}\n`;
      } else if (step.title.toLowerCase().includes('verificar') || 
                 step.title.toLowerCase().includes('conferir') ||
                 step.title.toLowerCase().includes('checar')) {
        code += `  ${currentStep}{${stepTitle}}\n`;
      } else {
        code += `  ${currentStep}[${stepTitle}]\n`;
      }
      
      // Add connection
      if (index < steps.length - 1) {
        code += `  ${currentStep} --> ${nextStep}\n\n`;
      } else {
        code += `  ${currentStep} --> End\n\n`;
      }
      
      // Add metadata notes
      if (step.responsible || step.duration) {
        const noteId = `Note${index + 1}`;
        let noteText = '';
        if (step.responsible) noteText += step.responsible;
        if (step.duration) noteText += step.responsible ? ` - ${step.duration}` : step.duration;
        const cleanNoteText = noteText.replace(/[\"'`]/g, '').substring(0, 40);
        code += `  ${noteId}["${cleanNoteText}"]\n`;
        code += `  ${noteId} -.-> ${currentStep}\n\n`;
      }
      
      // Add warning notes
      if (step.warning) {
        warningCounter++;
        const warningId = `Warning${warningCounter}`;
        const warningText = step.warning
          .replace(/[\"'`]/g, '')
          .replace(/[()[\]{}]/g, '')
          .trim()
          .substring(0, 40);
        code += `  ${warningId}["${warningText}"]\n`;
        code += `  ${warningId} -.-> ${currentStep}\n\n`;
      }
    });
    
    // End node
    code += '  End([Fim])\n\n';
    
    // Styles
    code += '  classDef startEnd fill:#10b981,stroke:#059669,stroke-width:3px,color:#fff\n';
    code += '  classDef normalStep fill:#2563eb,stroke:#1d4ed8,stroke-width:2px,color:#fff\n';
    code += '  classDef decisionStep fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff\n';
    code += '  classDef noteStyle fill:#f1f5f9,stroke:#cbd5e1,stroke-width:1px,color:#1e293b\n';
    code += '  classDef warningStyle fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e\n\n';
    
    // Apply styles
    code += '  class Start,End startEnd\n';
    
    const normalSteps = steps
      .map((step, i) => {
        if (step.warning || 
            step.title.toLowerCase().includes('verificar') || 
            step.title.toLowerCase().includes('conferir') ||
            step.title.toLowerCase().includes('checar')) {
          return null;
        }
        return `Step${i + 1}`;
      })
      .filter(Boolean)
      .join(',');
    
    if (normalSteps) {
      code += `  class ${normalSteps} normalStep\n`;
    }
    
    const decisionSteps = steps
      .map((step, i) => {
        if (step.warning || 
            step.title.toLowerCase().includes('verificar') || 
            step.title.toLowerCase().includes('conferir') ||
            step.title.toLowerCase().includes('checar')) {
          return `Step${i + 1}`;
        }
        return null;
      })
      .filter(Boolean)
      .join(',');
    
    if (decisionSteps) {
      code += `  class ${decisionSteps} decisionStep\n`;
    }
    
    // Only add notes that exist
    const notesList = steps
      .map((step, i) => (step.responsible || step.duration) ? `Note${i + 1}` : null)
      .filter(Boolean)
      .join(',');
    if (notesList) {
      code += `  class ${notesList} noteStyle\n`;
    }
    
    // Only add warnings that exist
    if (warningCounter > 0) {
      const warningsList = Array.from({ length: warningCounter }, (_, i) => `Warning${i + 1}`).join(',');
      code += `  class ${warningsList} warningStyle\n`;
    }
    
    return code;
  };

  const handleExportDiagram = () => {
    const code = generateMermaidCode();
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${processName.toLowerCase().replace(/\s+/g, '-')}-fluxograma.mmd`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    const code = generateMermaidCode();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        alert('Código Mermaid copiado para a área de transferência!');
      }).catch(() => {
        alert('Erro ao copiar código');
      });
    }
  };

  const handleRefresh = () => {
    setMermaidCode(generateMermaidCode());
  };

  if (!mounted) {
    return (
      <Card className="p-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-pulse text-gray-400">Carregando editor...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[#1e293b]">Editor de Fluxograma</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
            >
              <Code className="mr-2 h-4 w-4" />
              Copiar Código
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportDiagram}
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar .mmd
            </Button>
          </div>
        </div>

        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'interactive' | 'mermaid' | 'code')}>
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="interactive">
              <Move className="mr-2 h-4 w-4" />
              Clique e Arraste
            </TabsTrigger>
            <TabsTrigger value="mermaid">
              <Eye className="mr-2 h-4 w-4" />
              Visualização
            </TabsTrigger>
            <TabsTrigger value="code">
              <Code className="mr-2 h-4 w-4" />
              Código
            </TabsTrigger>
          </TabsList>

          <TabsContent value="interactive" className="mt-6">
            <div className="overflow-hidden shadow-xl">
              <DragDropFlowchart 
                steps={steps} 
                onStepsChange={onStepsChange}
                companyLogo={companyLogo}
                companyName={companyName}
              />
            </div>
            
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl shadow-md">
                <div className="flex items-start gap-3 text-sm text-blue-900">
                  <span className="text-2xl">✨</span>
                  <div>
                    <p className="font-semibold mb-3 text-blue-700">
                      💡 Modo Interativo
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">▸</span>
                        <span>Clique e arraste os blocos para reorganizar a ordem dos passos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">▸</span>
                        <span>Use os controles de zoom e navegação no canto</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">▸</span>
                        <span>Passe o mouse sobre os blocos para ver mais detalhes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">▸</span>
                        <span>Mudanças sincronizam automaticamente com o processo</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-slate-50 to-gray-50 border-2 border-slate-200 rounded-xl shadow-md">
                <div className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="text-2xl">📋</span>
                  <div>
                    <p className="font-semibold mb-3 text-slate-800">
                      Legenda de Cores
                    </p>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 border-2 border-white shadow-sm" />
                        <span><strong className="text-emerald-700">Verde:</strong> Início/Fim do processo</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 border-2 border-white shadow-sm" />
                        <span><strong className="text-blue-700">Azul:</strong> Etapas normais</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 border-2 border-white shadow-sm" />
                        <span><strong className="text-orange-700">Laranja:</strong> Decisões e verificações</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mermaid" className="mt-6">
            <div className="bg-white rounded-lg border-2 p-8 min-h-[400px]">
              <MermaidFlowchart steps={steps} />
            </div>
            
            <div className="mt-4 p-4 bg-[#f1f5f9] rounded-lg">
              <div className="flex items-start gap-2 text-sm text-[#64748b]">
                <span className="text-[#2563eb]">💡</span>
                <div>
                  <p className="mb-2">
                    <strong>Visualização Mermaid:</strong>
                  </p>
                  <p>
                    Esta é uma representação estática do fluxograma. 
                    Use a aba "Clique e Arraste" para editar interativamente.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code" className="mt-6">
            <div className="space-y-4">
              <Textarea
                value={mermaidCode || generateMermaidCode()}
                onChange={(e) => setMermaidCode(e.target.value)}
                className="font-mono text-sm min-h-[500px]"
                placeholder="Código Mermaid será gerado aqui..."
              />
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleCopyCode}
                >
                  Copiar Código
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open('https://mermaid.live', '_blank')}
                >
                  Abrir Editor Online
                </Button>
              </div>

              <div className="p-4 bg-[#fef3c7] border border-[#f59e0b] rounded-lg">
                <p className="text-sm text-[#92400e]">
                  <strong>📝 Nota:</strong> Você pode editar o código Mermaid manualmente para personalizar o fluxograma. 
                  Use o <a href="https://mermaid.live" target="_blank" rel="noopener noreferrer" className="underline">Mermaid Live Editor</a> para testar suas alterações.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
