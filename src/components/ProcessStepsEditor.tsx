import { useState } from 'react';
import { ProcessStep, StepType } from '../lib/types';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { GripVertical, Edit, Trash, Copy, Plus, Settings, AlertTriangle, Database, FileText } from 'lucide-react';
import { generateId } from '../lib/utils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ProcessStepsEditorProps {
  steps: ProcessStep[];
  onStepsChange: (steps: ProcessStep[]) => void;
}

// Componente sortable para cada card
function SortableStepCard({
  step,
  index,
  editingStepId,
  setEditingStepId,
  updateStep,
  duplicateStep,
  deleteStep,
}: {
  step: ProcessStep;
  index: number;
  editingStepId: string | null;
  setEditingStepId: (id: string | null) => void;
  updateStep: (id: string, updates: Partial<ProcessStep>) => void;
  duplicateStep: (id: string) => void;
  deleteStep: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="p-5 hover:shadow-md transition-shadow"
    >
      {editingStepId === step.id ? (
        // Edit Mode
        <div className="space-y-4">
          <div>
            <Label>Título da Etapa</Label>
            <Input
              value={step.title}
              onChange={(e) => updateStep(step.id, { title: e.target.value })}
              placeholder="Título da etapa"
            />
          </div>

          <div>
            <Label>Tipo de Etapa</Label>
            <Select
              value={step.type || 'process'}
              onValueChange={(value: StepType) => updateStep(step.id, { type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="process">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-blue-600" />
                    <span>Processo</span>
                  </div>
                </SelectItem>
                <SelectItem value="decision">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span>Decisão</span>
                  </div>
                </SelectItem>
                <SelectItem value="io">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-purple-600" />
                    <span>Entrada/Saída</span>
                  </div>
                </SelectItem>
                <SelectItem value="document">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span>Documento</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Descrição</Label>
            <Textarea
              value={step.description}
              onChange={(e) => updateStep(step.id, { description: e.target.value })}
              placeholder="Descrição da etapa"
              rows={3}
            />
          </div>
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
            <div
              className="flex flex-col gap-2 pt-1"
              style={{ touchAction: 'none' }}
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-5 w-5 text-[#64748b] cursor-grab active:cursor-grabbing" />
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-[#1e293b]">
                  {index + 1}. {step.title}
                </h3>
                {step.type && (
                  <span className={`
                    text-xs px-2 py-1 rounded-full font-medium
                    ${step.type === 'process' ? 'bg-blue-100 text-blue-700' : ''}
                    ${step.type === 'decision' ? 'bg-orange-100 text-orange-700' : ''}
                    ${step.type === 'io' ? 'bg-purple-100 text-purple-700' : ''}
                    ${step.type === 'document' ? 'bg-green-100 text-green-700' : ''}
                    ${step.type === 'subprocess' ? 'bg-cyan-100 text-cyan-700' : ''}
                  `}>
                    {step.type === 'process' && 'Processo'}
                    {step.type === 'decision' && 'Decisão'}
                    {step.type === 'io' && 'Entrada/Saída'}
                    {step.type === 'document' && 'Documento'}
                    {step.type === 'subprocess' && 'Subprocesso'}
                  </span>
                )}
              </div>

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
  );
}

export function ProcessStepsEditor({ steps, onStepsChange }: ProcessStepsEditorProps) {
  const [editingStepId, setEditingStepId] = useState<string | null>(null);

  // Filtrar apenas steps conectados (com order definido)
  // Steps órfãos (order === undefined) não aparecem na lista
  const orderedSteps = steps
    .filter(step => step.order !== undefined && step.order !== null)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // precisa mover 8px antes de iniciar drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = orderedSteps.findIndex((s) => s.id === active.id);
      const newIndex = orderedSteps.findIndex((s) => s.id === over.id);

      // Reordenar apenas os steps ordenados
      const reorderedOrderedSteps = arrayMove(orderedSteps, oldIndex, newIndex).map((step, index) => ({
        ...step,
        order: index + 1,
      }));

      // Mesclar de volta com steps órfãos (que mantêm order = undefined)
      const orphanSteps = steps.filter(s => s.order === undefined || s.order === null);
      const allSteps = [...reorderedOrderedSteps, ...orphanSteps];

      onStepsChange(allSteps);
    }
  };

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
        order: orderedSteps.length + 1,
      };
      onStepsChange([...steps, newStep]);
    }
  };

  const addStep = () => {
    const newStep: ProcessStep = {
      id: generateId(),
      title: 'Nova Etapa',
      description: 'Descrição da etapa...',
      order: orderedSteps.length + 1,
    };
    onStepsChange([...steps, newStep]);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        <SortableContext
          items={orderedSteps.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {orderedSteps.map((step, index) => (
            <SortableStepCard
              key={step.id}
              step={step}
              index={index}
              editingStepId={editingStepId}
              setEditingStepId={setEditingStepId}
              updateStep={updateStep}
              duplicateStep={duplicateStep}
              deleteStep={deleteStep}
            />
          ))}
        </SortableContext>

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
    </DndContext>
  );
}

