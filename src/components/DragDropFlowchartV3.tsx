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
  EdgeTypes,
  MarkerType,
  Panel,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  Handle,
  Position,
  useReactFlow,
  EdgeLabelRenderer,
  BaseEdge,
  getSmoothStepPath,
  EdgeProps,
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
function FlowNode({ data, selected, id }: { data: any; selected: boolean; id: string }) {
  const { setNodes, setEdges } = useReactFlow();
  const isStartEnd = data.isStartEnd;
  const stepType: StepType = data.stepType || 'process';
  const config = STEP_CONFIG[stepType];
  const Icon = isStartEnd ? (data.label === 'Início' ? Play : Flag) : config.icon;

  const baseColor = isStartEnd ? (data.label === 'Início' ? COLORS.start : COLORS.end) : config.color;
  const borderColor = selected ? COLORS.selected : baseColor;
  const borderWidth = selected ? 3 : 1.5;

  const handleDelete = useCallback(() => {
    // Usar applyChanges para manter histórico de undo
    setNodes((nds) => applyNodeChanges([{ type: 'remove', id }], nds));
    setEdges((eds) => applyEdgeChanges(
      eds
        .filter((e) => e.source === id || e.target === id)
        .map((e) => ({ type: 'remove' as const, id: e.id })),
      eds
    ));
  }, [id, setNodes, setEdges]);

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

      {/* Botão de deletar - só aparece quando selecionado */}
      {selected && !isStartEnd && (
        <button
          onClick={handleDelete}
          className="absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center bg-red-500 hover:bg-red-600 transition-colors shadow-md z-10"
          title="Deletar etapa (ou pressione Delete)"
        >
          <Trash2 className="h-3 w-3 text-white" />
        </button>
      )}
    </div>
  );
}

// Custom Edge Component - Com label editável e botão de delete
function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  selected,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [label, setLabel] = useState(data?.label || '');
  const [tempLabel, setTempLabel] = useState(label);

  const handleDelete = () => {
    // Usar applyEdgeChanges para manter histórico de undo
    setEdges((edges) => applyEdgeChanges([{ type: 'remove', id }], edges));
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setTempLabel(label);
  };

  const handleSaveLabel = () => {
    setLabel(tempLabel);
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === id ? { ...edge, data: { ...edge.data, label: tempLabel } } : edge
      )
    );
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveLabel();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setTempLabel(label);
    }
  };

  // Mostrar label apenas se: está editando, tem texto, ou está selecionada
  const showLabel = isEditing || label || selected;

  return (
    <>
      {/* Linha principal - com corte onde tem o label */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: selected ? 3 : 2,
        }}
      />

      {/* Label interativo */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {isEditing ? (
            // Campo de edição
            <input
              type="text"
              value={tempLabel}
              onChange={(e) => setTempLabel(e.target.value)}
              onBlur={handleSaveLabel}
              onKeyDown={handleKeyDown}
              placeholder="Digite o texto..."
              autoFocus
              className="px-2 py-1 text-xs border-2 border-blue-500 rounded bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ minWidth: '100px' }}
            />
          ) : showLabel ? (
            // Label com fundo branco (interrompe a linha visualmente)
            <div className="relative flex items-center gap-1">
              {/* Fundo branco que "corta" a linha */}
              <div
                className="absolute inset-0 bg-white rounded"
                style={{
                  margin: '-4px',
                  zIndex: -1,
                }}
              />

              {/* Conteúdo do label */}
              <div className="flex items-center gap-1 px-2 py-1">
                <span
                  onDoubleClick={handleDoubleClick}
                  className="text-xs font-medium cursor-pointer hover:text-blue-600 select-none"
                  title={label ? "Duplo clique para editar" : "Duplo clique para adicionar texto"}
                >
                  {label || (selected ? '+ Adicionar texto' : '')}
                </span>

                {/* Botão de deletar - só aparece quando selecionada */}
                {selected && (
                  <button
                    onClick={handleDelete}
                    className="p-1 hover:bg-red-100 rounded transition-colors"
                    title="Deletar conexão"
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            // Área invisível para capturar duplo clique quando não tem label
            isHovering && (
              <div
                onDoubleClick={handleDoubleClick}
                className="w-6 h-6 cursor-pointer opacity-0 hover:opacity-100 flex items-center justify-center"
                title="Duplo clique para adicionar texto"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              </div>
            )
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

const nodeTypes: NodeTypes = {
  flowNode: FlowNode,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
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
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
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
        nodeId: 'start',
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
          nodeId: `step-${index}`,
        },
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
        nodeId: 'end',
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
        type: 'custom',
        animated: true,
        data: { label: '' },
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
    setSelectedEdge(null); // Limpar seleção de edge

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

  // Callback para seleção de edge
  const onEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge.id);
    setSelectedNode(null); // Limpar seleção de node
    setEditPanelOpen(false);
  }, []);

  // Limpar seleções ao clicar no pane
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
    setEditPanelOpen(false);
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

  // Recalcular ordem das etapas baseado no grafo de conexões
  const recalculateStepOrder = useCallback((currentNodes: Node[], currentEdges: Edge[]) => {
    if (!onStepsChange) return;

    // Construir mapa de adjacências (grafo)
    const graph: Record<string, string[]> = {};
    currentEdges.forEach(edge => {
      if (!graph[edge.source]) graph[edge.source] = [];
      graph[edge.source].push(edge.target);
    });

    // Percorrer o grafo a partir do "start" usando BFS para encontrar steps conectados
    const visited = new Set<string>();
    const orderedStepIds: string[] = [];
    const queue = ['start'];

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      if (visited.has(nodeId)) continue;
      visited.add(nodeId);

      // Se for uma etapa (não start/end), adicionar na lista ordenada
      if (nodeId.startsWith('step-')) {
        orderedStepIds.push(nodeId);
      }

      // Adicionar filhos na fila
      const children = graph[nodeId] || [];
      children.forEach(childId => {
        if (!visited.has(childId)) {
          queue.push(childId);
        }
      });
    }

    // Criar set de IDs conectados para lookup rápido
    const connectedIdsSet = new Set(orderedStepIds);

    // Atualizar TODOS os steps:
    // - Conectados: recebem order sequencial (1, 2, 3...)
    // - Órfãos: order = null (não aparecem na lista de cards)
    const newSteps = steps.map((step, index) => {
      const nodeId = `step-${index}`;
      const connectedIndex = orderedStepIds.indexOf(nodeId);

      if (connectedIndex !== -1) {
        // Step conectado - ordem baseada em BFS
        return {
          ...step,
          order: connectedIndex + 1,
        };
      } else {
        // Step órfão - sem order (não aparece na lista de cards, mas fica no fluxograma)
        return {
          ...step,
          order: undefined,
        };
      }
    });

    // Atualizar apenas se algo mudou
    const hasChanges = newSteps.some((newStep, i) => {
      const oldStep = steps[i];
      return newStep.order !== oldStep.order;
    });

    if (hasChanges) {
      onStepsChange(newSteps);
    }
  }, [steps, onStepsChange]);

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
        type: 'custom',
        animated: true,
        data: { label: '' },
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

      // Recalcular ordem das etapas
      setTimeout(() => recalculateStepOrder(nodes, newEdges), 100);
    },
    [edges, nodes, setEdges, saveToHistory, recalculateStepOrder]
  );

  // Callback para mudanças de edges (incluindo deleção)
  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(changes);

      // Salvar no histórico e recalcular ordem após mudança
      const hasRemove = changes.some(c => c.type === 'remove');
      if (hasRemove) {
        setTimeout(() => {
          setEdges(currentEdges => {
            saveToHistory(nodes, currentEdges);
            recalculateStepOrder(nodes, currentEdges);
            return currentEdges;
          });
        }, 0);
      }
    },
    [onEdgesChange, nodes, saveToHistory, setEdges, recalculateStepOrder]
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

    // Usar applyChanges para manter histórico de undo do ReactFlow
    setNodes((nds) => {
      const updatedNodes = applyNodeChanges([{ type: 'remove', id: selectedNode }], nds);
      return updatedNodes;
    });

    setEdges((eds) => {
      const edgesToRemove = eds
        .filter((e) => e.source === selectedNode || e.target === selectedNode)
        .map((e) => ({ type: 'remove' as const, id: e.id }));
      const updatedEdges = applyEdgeChanges(edgesToRemove, eds);

      // Salvar no histórico customizado após aplicar mudanças
      setTimeout(() => {
        saveToHistory(nodes.filter(n => n.id !== selectedNode), updatedEdges);
      }, 0);

      return updatedEdges;
    });

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
    <div className={`${className} relative bg-white flowchart-container-v3`} style={{ height: '100vh', minHeight: '800px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges.map(edge => ({
          ...edge,
          selected: edge.id === selectedEdge,
        }))}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
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
        edgesReconnectable={true}
        edgesFocusable={true}
        nodesFocusable={true}
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

        {/* Ações (Undo/Redo/Reorganizar) */}
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
            💡 <strong>Dica:</strong> Arraste etapas para mover. Clique para editar. Arraste das bolinhas para conectar. Selecione e pressione Delete para remover.
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
