import { useState } from 'react';
import { ProcessStep } from '../lib/types';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { GripVertical, Edit, Trash, Copy, Plus } from 'lucide-react';
import { generateId } from '../lib/utils';

interface ProcessStepsEditorProps {
  steps: ProcessStep[];
  onStepsChange: (steps: ProcessStep[]) => void;
}

export function ProcessStepsEditor({ steps, onStepsChange }: ProcessStepsEditorProps) {
  const [editingStepId, setEditingStepId] = useState<string | null>(null);

  const updateStep = (stepId: string, updates: Partial<ProcessStep>) => {
    onStepsChange(
      steps.map(step =>
        step.id === stepId ? { ...step, ...updates } : step
      )
    );
  };

  const deleteStep = (stepId: string) => {
    if (confirm('Tem certeza que deseja excluir esta etapa?')) {
      onStepsChange(
        steps.filter(step => step.id !== stepId).map((step, index) => ({
          ...step,
          order: index + 1,
        }))
      );
    }
  };

  const duplicateStep = (stepId: string) => {
    const stepToDuplicate = steps.find(s => s.id === stepId);
    if (stepToDuplicate) {
      const newStep: ProcessStep = {
        ...stepToDuplicate,
        id: generateId(),
        title: `${stepToDuplicate.title} (cópia)`,
        order: steps.length + 1,
      };
      onStepsChange([...steps, newStep]);
    }
  };

  const addStep = () => {
    const newStep: ProcessStep = {
      id: generateId(),
      title: 'Nova Etapa',
      description: 'Descrição da etapa...',
      order: steps.length + 1,
    };
    onStepsChange([...steps, newStep]);
  };

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <Card key={step.id} className="p-5 hover:shadow-md transition-shadow">
          {editingStepId === step.id ? (
            // Edit Mode
            <div className="space-y-4">
              <Input
                value={step.title}
                onChange={(e) => updateStep(step.id, { title: e.target.value })}
                placeholder="Título da etapa"
              />
              <Textarea
                value={step.description}
                onChange={(e) => updateStep(step.id, { description: e.target.value })}
                placeholder="Descrição da etapa"
                rows={3}
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Responsável</Label>
                  <Input
                    value={step.responsible || ''}
                    onChange={(e) => updateStep(step.id, { responsible: e.target.value })}
                    placeholder="Ex: Mecânico"
                  />
                </div>
                <div>
                  <Label>Tempo estimado</Label>
                  <Input
                    value={step.duration || ''}
                    onChange={(e) => updateStep(step.id, { duration: e.target.value })}
                    placeholder="Ex: 15 min"
                  />
                </div>
              </div>
              <div>
                <Label>Aviso de Segurança</Label>
                <Input
                  value={step.warning || ''}
                  onChange={(e) => updateStep(step.id, { warning: e.target.value })}
                  placeholder="Ex: Use EPI adequado"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setEditingStepId(null)}>
                  Salvar
                </Button>
                <Button variant="outline" onClick={() => setEditingStepId(null)}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            // View Mode
            <div>
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-2 pt-1">
                  <GripVertical className="h-5 w-5 text-[#64748b] cursor-move" />
                </div>
                
                <div className="flex-1 space-y-3">
                  <h3 className="text-[#1e293b]">
                    {index + 1}. {step.title}
                  </h3>
                  
                  <p className="text-[#64748b]">{step.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    {step.responsible && (
                      <div className="flex items-center gap-1 text-[#64748b]">
                        <span>👤</span>
                        <span>Responsável: {step.responsible}</span>
                      </div>
                    )}
                    {step.duration && (
                      <div className="flex items-center gap-1 text-[#64748b]">
                        <span>⏱️</span>
                        <span>Tempo estimado: {step.duration}</span>
                      </div>
                    )}
                  </div>
                  
                  {step.warning && (
                    <div className="flex items-start gap-2 p-3 bg-[#f59e0b]/10 rounded-lg border border-[#f59e0b]/20">
                      <span className="text-[#f59e0b]">⚠️</span>
                      <span className="text-sm text-[#f59e0b]">Atenção: {step.warning}</span>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingStepId(step.id)}
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => duplicateStep(step.id)}
                    >
                      <Copy className="mr-1 h-3 w-3" />
                      Duplicar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteStep(step.id)}
                      className="text-[#ef4444] hover:text-[#ef4444]"
                    >
                      <Trash className="mr-1 h-3 w-3" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      ))}

      {/* Add Step Button */}
      <Button
        onClick={addStep}
        variant="outline"
        className="w-full border-dashed border-2 h-16 hover:bg-[#2563eb]/5 hover:border-[#2563eb]"
      >
        <Plus className="mr-2 h-5 w-5" />
        Adicionar Etapa
      </Button>
    </div>
  );
}
