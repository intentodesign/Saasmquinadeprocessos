import { useCallback, useEffect, useState, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  addEdge,
  NodeTypes,
  MarkerType,
  Panel,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ProcessStep, StepType } from '../lib/types';
import {
  Play,
  Flag,
  AlertTriangle,
  FileText,
  Settings,
  Database,
  Edit2,
  Trash2,
  Plus,
  RotateCcw,
  RotateCw,
  X,
  Save,
  Wand2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Cores fixas e limpas
const COLORS = {
  start: '#10b981', // verde para início
  end: '#10b981', // verde para fim
  process: '#3b82f6', // azul para processos
  decision: '#f97316', // laranja para decisões
  io: '#8b5cf6', // roxo para entrada/saída
  document: '#9ca3af', // cinza para documentos
  selected: '#2563eb', // azul escuro para seleção
  grid: '#e5e7eb', // cinza claro para grid
};

// Configuração de tipos de etapa
const STEP_CONFIG = {
  process: {
    color: COLORS.process,
    icon: Settings,
    label: 'Processo',
    shape: 'rectangle',
  },
  decision: {
    color: COLORS.decision,
    icon: AlertTriangle,
    label: 'Decisão',
    shape: 'diamond',
  },
  io: {
    color: COLORS.io,
    icon: Database,
    label: 'Entrada/Saída',
    shape: 'parallelogram',
  },
  document: {
    color: COLORS.document,
    icon: FileText,
    label: 'Documento',
    shape: 'rectangle',
  },
  subprocess: {
    color: COLORS.process,
    icon: Settings,
    label: 'Subprocesso',
    shape: 'rectangle',
  },
};

// Custom Node Component - LIMPO E SIMPLES
function FlowNode({ data, selected }: { data: any; selected: boolean }) {
  const isStartEnd = data.isStartEnd;
  const stepType: StepType = data.stepType || 'process';
  const config = STEP_CONFIG[stepType];
  const Icon = isStartEnd ? (data.label === 'Início' ? Play : Flag) : config.icon;

  const baseColor = isStartEnd ? (data.label === 'Início' ? COLORS.start : COLORS.end) : config.color;
  const borderColor = selected ? COLORS.selected : baseColor;
  const borderWidth = selected ? 3 : 1.5;

  // Renderiza forma baseada no tipo
  const renderShape = () => {
    // Início e Fim - Retângulo arredondado verde
    if (isStartEnd) {
      return (
        <div
          className="relative px-6 py-4 bg-white rounded-lg transition-all"
          style={{
            border: `${borderWidth}px solid ${borderColor}`,
            minWidth: '140px',
          }}
        >
          <Handle type="target" position={Position.Top} style={{ background: baseColor }} />
          <div className="flex items-center justify-center gap-2 text-sm font-semibold" style={{ color: baseColor }}>
            <Icon className="h-5 w-5" />
            <span>{data.label}</span>
          </div>
          <Handle type="source" position={Position.Bottom} style={{ background: baseColor }} />
        </div>
      );
    }

    // Losango - Decisão
    if (config.shape === 'diamond') {
      return (
        <div className="relative" style={{ width: '180px', height: '180px' }}>
          <Handle type="target" position={Position.Top} style={{ background: baseColor, top: '10%' }} />

          <div
            className="absolute inset-0 bg-white transform rotate-45 transition-all"
            style={{
              border: `${borderWidth}px solid ${borderColor}`,
              width: '140px',
              height: '140px',
              margin: '20px',
            }}
          >
            <div className="absolute inset-0 transform -rotate-45 flex items-center justify-center p-4">
              <div className="text-center" style={{ color: baseColor }}>
                <Icon className="h-5 w-5 mx-auto mb-1" />
                <div className="text-sm font-semibold leading-tight">{data.label}</div>
              </div>
            </div>
          </div>

          <Handle type="source" position={Position.Bottom} id="yes" style={{ background: baseColor, bottom: '10%' }} />
          <Handle type="source" position={Position.Right} id="no" style={{ background: baseColor, right: '10%' }} />
        </div>
      );
    }

    // Paralelogramo - Entrada/Saída
    if (config.shape === 'parallelogram') {
      return (
        <div className="relative">
          <Handle type="target" position={Position.Top} style={{ background: baseColor }} />

          <div
            className="relative px-6 py-3 bg-white transition-all"
            style={{
              border: `${borderWidth}px solid ${borderColor}`,
              clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
              minWidth: '160px',
            }}
          >
            <div className="flex items-center justify-center gap-2 text-sm font-semibold" style={{ color: baseColor }}>
              <Icon className="h-4 w-4" />
              <span>{data.label}</span>
            </div>
          </div>

          <Handle type="source" position={Position.Bottom} style={{ background: baseColor }} />
        </div>
      );
    }

    // Retângulo padrão - Processo e Documento
    return (
      <div
        className="relative px-6 py-3 bg-white rounded transition-all"
        style={{
          border: `${borderWidth}px solid ${borderColor}`,
          minWidth: '160px',
        }}
      >
        <Handle type="target" position={Position.Top} style={{ background: baseColor }} />

        <div className="flex items-center justify-center gap-2 text-sm font-semibold" style={{ color: baseColor }}>
          <Icon className="h-4 w-4" />
          <span>{data.label}</span>
        </div>

        <Handle type="source" position={Position.Bottom} style={{ background: baseColor }} />
      </div>
    );
  };

  return (
    <div className="relative">
      {renderShape()}

      {/* Número da etapa */}
      {!isStartEnd && data.stepIndex >= 0 && (
        <div
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: baseColor }}
        >
          {data.stepIndex + 1}
        </div>
      )}
    </div>
  );
}

const nodeTypes: NodeTypes = {
  flowNode: FlowNode,
};

// Interface de histórico para undo/redo
interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

interface EditPanelData {
  id: string;
  label: string;
  type: StepType;
  description: string;
  responsible: string;
  duration: string;
  warning: string;
}

interface DragDropFlowchartV3Props {
  steps: ProcessStep[];
  onStepsChange?: (steps: ProcessStep[]) => void;
  className?: string;
  companyName?: string;
}

export function DragDropFlowchartV3({
  steps,
  onStepsChange,
  className = '',
  companyName
}: DragDropFlowchartV3Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [editData, setEditData] = useState<EditPanelData | null>(null);

  // Sistema de undo/redo
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoingRef = useRef(false);

  // Salvar no histórico
  const saveToHistory = useCallback((nodes: Node[], edges: Edge[]) => {
    if (isUndoingRef.current) return;

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ nodes, edges });
      // Limitar histórico a 50 estados
      if (newHistory.length > 50) {
        newHistory.shift();
        return newHistory;
      }
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoingRef.current = true;
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(historyIndex - 1);
      setTimeout(() => {
        isUndoingRef.current = false;
      }, 100);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoingRef.current = true;
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(historyIndex + 1);
      setTimeout(() => {
        isUndoingRef.current = false;
      }, 100);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  // Converter ProcessSteps para ReactFlow
  const convertStepsToFlow = useCallback((processSteps: ProcessStep[]) => {
    const flowNodes: Node[] = [];
    const flowEdges: Edge[] = [];
    let yPosition = 100;
    const stepSpacing = 200;
    const xCenter = 400;

    // Nó de início
    flowNodes.push({
      id: 'start',
      type: 'flowNode',
      position: { x: xCenter, y: yPosition },
      data: {
        label: 'Início',
        isStartEnd: true,
        stepIndex: -1,
      },
    });

    yPosition += stepSpacing;

    // Adicionar etapas
    processSteps.forEach((step, index) => {
      const stepType = step.type || 'process';

      flowNodes.push({
        id: `step-${index}`,
        type: 'flowNode',
        position: { x: xCenter, y: yPosition },
        data: {
          label: step.title,
          description: step.description,
          responsible: step.responsible,
          duration: step.duration,
          warning: step.warning,
          stepType: stepType,
          stepIndex: index,
        },
        draggable: true,
      });

      yPosition += stepSpacing;
    });

    // Nó de fim
    flowNodes.push({
      id: 'end',
      type: 'flowNode',
      position: { x: xCenter, y: yPosition },
      data: {
        label: 'Fim',
        isStartEnd: true,
        stepIndex: -1,
      },
    });

    // Criar conexões lineares iniciais
    for (let i = 0; i < flowNodes.length - 1; i++) {
      const sourceNode = flowNodes[i];
      const targetNode = flowNodes[i + 1];
      const sourceType = sourceNode.data.stepType || 'process';
      const color = sourceNode.data.isStartEnd ? COLORS.start : STEP_CONFIG[sourceType]?.color || COLORS.process;

      flowEdges.push({
        id: `e-${sourceNode.id}-${targetNode.id}`,
        source: sourceNode.id,
        target: targetNode.id,
        type: 'smoothstep',
        animated: true,
        style: {
          stroke: color,
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: color,
          width: 20,
          height: 20,
        },
      });
    }

    return { nodes: flowNodes, edges: flowEdges };
  }, []);

  // Atualizar fluxo quando steps mudam
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = convertStepsToFlow(steps);
    setNodes(newNodes);
    setEdges(newEdges);

    // Salvar estado inicial no histórico apenas uma vez
    if (history.length === 0 && newNodes.length > 0) {
      setTimeout(() => {
        saveToHistory(newNodes, newEdges);
      }, 100);
    }
  }, [steps, convertStepsToFlow, setNodes, setEdges, history.length, saveToHistory]);

  // Callback para seleção de nó
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);

    // Abrir painel de edição se não for início/fim
    if (!node.data.isStartEnd && node.id.startsWith('step-')) {
      setEditData({
        id: node.id,
        label: node.data.label,
        type: node.data.stepType || 'process',
        description: node.data.description || '',
        responsible: node.data.responsible || '',
        duration: node.data.duration || '',
        warning: node.data.warning || '',
      });
      setEditPanelOpen(true);
    }
  }, []);

  // Salvar edição
  const handleSaveEdit = useCallback(() => {
    if (!editData) return;

    const updatedNodes = nodes.map(node => {
      if (node.id === editData.id) {
        return {
          ...node,
          data: {
            ...node.data,
            label: editData.label,
            stepType: editData.type,
            description: editData.description,
            responsible: editData.responsible,
            duration: editData.duration,
            warning: editData.warning,
          },
        };
      }
      return node;
    });

    setNodes(updatedNodes);
    saveToHistory(updatedNodes, edges);

    // Atualizar steps originais
    if (onStepsChange) {
      const stepIndex = parseInt(editData.id.replace('step-', ''));
      const updatedSteps = [...steps];
      updatedSteps[stepIndex] = {
        ...updatedSteps[stepIndex],
        title: editData.label,
        type: editData.type,
        description: editData.description,
        responsible: editData.responsible,
        duration: editData.duration,
        warning: editData.warning,
      };
      onStepsChange(updatedSteps);
    }

    setEditPanelOpen(false);
  }, [editData, nodes, edges, steps, setNodes, saveToHistory, onStepsChange]);

  // Callback para criar conexão
  const onConnect = useCallback(
    (params: Connection) => {
      // Determinar cor baseado no nó de origem
      const sourceNode = nodes.find(n => n.id === params.source);
      let edgeColor = COLORS.process;

      if (sourceNode) {
        if (sourceNode.data.isStartEnd) {
          edgeColor = sourceNode.data.label === 'Início' ? COLORS.start : COLORS.end;
        } else {
          const stepType = sourceNode.data.stepType || 'process';
          edgeColor = STEP_CONFIG[stepType]?.color || COLORS.process;
        }
      }

      const newEdge = {
        ...params,
        type: 'smoothstep',
        animated: true,
        style: {
          stroke: edgeColor,
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeColor,
          width: 20,
          height: 20,
        },
      };

      const newEdges = addEdge(newEdge, edges);
      setEdges(newEdges);
      saveToHistory(nodes, newEdges);
    },
    [edges, nodes, setEdges, saveToHistory]
  );

  // Callback para mudanças de edges (incluindo deleção)
  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(changes);

      // Salvar no histórico após mudança
      const hasRemove = changes.some(c => c.type === 'remove');
      if (hasRemove) {
        setTimeout(() => {
          setEdges(currentEdges => {
            saveToHistory(nodes, currentEdges);
            return currentEdges;
          });
        }, 0);
      }
    },
    [onEdgesChange, nodes, saveToHistory, setEdges]
  );

  // Callback para mudanças de nodes
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
    },
    [onNodesChange]
  );

  // Remover etapa selecionada
  const handleDeleteNode = useCallback(() => {
    if (!selectedNode || selectedNode === 'start' || selectedNode === 'end') return;

    const updatedNodes = nodes.filter(n => n.id !== selectedNode);
    const updatedEdges = edges.filter(e => e.source !== selectedNode && e.target !== selectedNode);

    setNodes(updatedNodes);
    setEdges(updatedEdges);
    saveToHistory(updatedNodes, updatedEdges);
    setSelectedNode(null);
    setEditPanelOpen(false);

    // Atualizar steps originais
    if (onStepsChange && selectedNode.startsWith('step-')) {
      const stepIndex = parseInt(selectedNode.replace('step-', ''));
      const updatedSteps = steps.filter((_, i) => i !== stepIndex);
      onStepsChange(updatedSteps);
    }
  }, [selectedNode, nodes, edges, steps, setNodes, setEdges, saveToHistory, onStepsChange]);

  // Reorganizar automaticamente o fluxograma
  const handleAutoLayout = useCallback(() => {
    const ySpacing = 200;
    const xCenter = 400;
    let yPosition = 100;

    const updatedNodes = nodes.map(node => {
      const newNode = {
        ...node,
        position: { x: xCenter, y: yPosition },
      };
      yPosition += ySpacing;
      return newNode;
    });

    setNodes(updatedNodes);
    saveToHistory(updatedNodes, edges);
  }, [nodes, edges, setNodes, saveToHistory]);

  // Detectar tecla Delete para remover edges/nodes
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (selectedNode && selectedNode !== 'start' && selectedNode !== 'end') {
          handleDeleteNode();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode, handleDeleteNode]);

  return (
    <div className={`${className} relative bg-white flowchart-container-v3`} style={{ height: '700px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        snapToGrid={true}
        snapGrid={[15, 15]}
        deleteKeyCode={['Delete', 'Backspace']}
      >
        {/* Grid sutil */}
        <Background
          color={COLORS.grid}
          gap={20}
          size={1}
          className="opacity-40"
        />

        {/* Controles */}
        <Controls
          className="bg-white border border-gray-200 rounded-lg shadow-sm"
          showInteractive={false}
        />

        {/* Minimapa */}
        <MiniMap
          nodeColor={(node) => {
            if (node.data.isStartEnd) return node.data.label === 'Início' ? COLORS.start : COLORS.end;
            const stepType = node.data.stepType || 'process';
            return STEP_CONFIG[stepType].color;
          }}
          maskColor="rgba(0, 0, 0, 0.05)"
          className="bg-white border border-gray-200 rounded-lg shadow-sm"
        />

        {/* Painel superior - Nome da empresa */}
        {companyName && (
          <Panel position="top-left" className="m-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
              <span className="font-semibold text-gray-800 text-sm">{companyName}</span>
            </div>
          </Panel>
        )}

        {/* Ações (Undo/Redo/Delete/Reorganizar) */}
        <Panel position="top-right" className="m-4">
          <div className="flex gap-2">
            <button
              onClick={handleAutoLayout}
              className="p-2 bg-blue-50 rounded-lg shadow-sm border border-blue-200 hover:bg-blue-100 transition-all"
              title="Reorganizar automaticamente"
            >
              <Wand2 className="h-4 w-4 text-blue-600" />
            </button>

            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Desfazer (Ctrl+Z)"
            >
              <RotateCcw className="h-4 w-4 text-gray-700" />
            </button>

            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Refazer (Ctrl+Y)"
            >
              <RotateCw className="h-4 w-4 text-gray-700" />
            </button>

            {selectedNode && selectedNode !== 'start' && selectedNode !== 'end' && (
              <button
                onClick={handleDeleteNode}
                className="p-2 bg-red-50 rounded-lg shadow-sm border border-red-200 hover:bg-red-100 transition-all"
                title="Remover etapa selecionada (Delete)"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>
            )}
          </div>
        </Panel>

        {/* Legenda */}
        <Panel position="bottom-center" className="m-4">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.start }} />
                <span>Início/Fim</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.process }} />
                <span>Processo</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 transform rotate-45" style={{ backgroundColor: COLORS.decision }} />
                <span>Decisão</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.io }} />
                <span>Entrada/Saída</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.document }} />
                <span>Documento</span>
              </div>
            </div>
          </div>
        </Panel>

        {/* Instruções */}
        <Panel position="bottom-left" className="m-4" style={{ zIndex: 4 }}>
          <div className="bg-blue-50 px-3 py-2 rounded-lg text-xs text-blue-700 max-w-xs border border-blue-200">
            💡 <strong>Dica:</strong> Arraste etapas para reposicionar. Clique para editar. Arraste das bolinhas para conectar. Delete/Backspace para remover conexões.
          </div>
        </Panel>
      </ReactFlow>

      {/* Painel de edição lateral */}
      <AnimatePresence>
        {editPanelOpen && editData && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute top-0 right-0 w-96 h-full bg-white border-l border-gray-200 shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Editar Etapa</h3>
                <button
                  onClick={() => setEditPanelOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Etapa
                  </label>
                  <input
                    type="text"
                    value={editData.label}
                    onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Ex: Verificar documentos"
                  />
                </div>

                {/* Tipo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Etapa
                  </label>
                  <select
                    value={editData.type}
                    onChange={(e) => setEditData({ ...editData, type: e.target.value as StepType })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="process">Processo</option>
                    <option value="decision">Decisão</option>
                    <option value="io">Entrada/Saída</option>
                    <option value="document">Documento</option>
                    <option value="subprocess">Subprocesso</option>
                  </select>
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    placeholder="Descreva o que acontece nesta etapa..."
                  />
                </div>

                {/* Responsável */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Responsável
                  </label>
                  <input
                    type="text"
                    value={editData.responsible}
                    onChange={(e) => setEditData({ ...editData, responsible: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Ex: Gerente de Qualidade"
                  />
                </div>

                {/* Duração */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tempo Estimado
                  </label>
                  <input
                    type="text"
                    value={editData.duration}
                    onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Ex: 15 minutos"
                  />
                </div>

                {/* Aviso */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Avisos/Observações
                  </label>
                  <textarea
                    value={editData.warning}
                    onChange={(e) => setEditData({ ...editData, warning: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    placeholder="Avisos importantes sobre esta etapa..."
                  />
                </div>

                {/* Botões */}
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Save className="h-4 w-4" />
                    Salvar
                  </button>
                  <button
                    onClick={() => setEditPanelOpen(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
