import { useCallback, useEffect, useState } from 'react';
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
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ProcessStep, StepType } from '../lib/types';
import {
  Play,
  Flag,
  AlertTriangle,
  GripVertical,
  FileText,
  Settings,
  Database
} from 'lucide-react';
import { motion } from 'motion/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

// Configuração de estilos por tipo
const STEP_STYLES = {
  process: {
    gradient: 'from-blue-500 to-blue-600',
    icon: Settings,
    shape: 'rectangle',
    color: '#3b82f6'
  },
  decision: {
    gradient: 'from-orange-500 to-orange-600',
    icon: AlertTriangle,
    shape: 'diamond',
    color: '#f97316'
  },
  io: {
    gradient: 'from-purple-500 to-purple-600',
    icon: Database,
    shape: 'parallelogram',
    color: '#a855f7'
  },
  document: {
    gradient: 'from-green-500 to-green-600',
    icon: FileText,
    shape: 'document',
    color: '#22c55e'
  },
  subprocess: {
    gradient: 'from-cyan-500 to-cyan-600',
    icon: Settings,
    shape: 'rectangle-double',
    color: '#06b6d4'
  }
};

// Custom Node Component - SIMPLIFICADO
function StepNodeV2({ data }: { data: any }) {
  const [isHovered, setIsHovered] = useState(false);
  const isStartEnd = data.isStartEnd;
  const stepType: StepType = data.stepType || 'process';
  const config = STEP_STYLES[stepType];
  const Icon = isStartEnd ? (data.label === 'Início' ? Play : Flag) : config.icon;

  const getShape = () => {
    if (isStartEnd) {
      return 'rounded-full'; // Círculo para início/fim
    }

    switch (config.shape) {
      case 'diamond':
        return 'diamond-shape';
      case 'parallelogram':
        return 'parallelogram-shape';
      case 'document':
        return 'document-shape';
      case 'rectangle-double':
        return 'rectangle-double-shape';
      default:
        return 'rounded-xl';
    }
  };

  const isDraggable = !isStartEnd;
  const gradient = isStartEnd ? 'from-emerald-500 to-emerald-600' : config.gradient;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative"
          >
            {/* Diamond Shape (Decisão) */}
            {config.shape === 'diamond' && (
              <div
                className={`
                  relative
                  w-40 h-40
                  transform rotate-45
                  bg-gradient-to-br ${gradient}
                  shadow-lg border-2 border-white/30
                  transition-all duration-300
                  ${isHovered ? 'shadow-2xl scale-110' : ''}
                `}
              >
                <div className="absolute inset-0 transform -rotate-45 flex items-center justify-center p-4">
                  <div className="text-center text-white">
                    <Icon className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-xs font-semibold leading-tight">{data.label}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Rectangle Shape (Processo, Subprocesso) */}
            {(config.shape === 'rectangle' || config.shape === 'rectangle-double') && (
              <div
                className={`
                  relative
                  px-6 py-3
                  ${config.shape === 'rectangle-double' ? 'border-4 border-double' : 'border-2'}
                  ${getShape()}
                  bg-gradient-to-br ${gradient}
                  shadow-lg border-white/30
                  min-w-[160px]
                  transition-all duration-300
                  ${isHovered ? 'shadow-2xl scale-105' : ''}
                `}
              >
                {isDraggable && isHovered && (
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md">
                    <GripVertical className="h-3 w-3 text-gray-600" />
                  </div>
                )}

                {!isStartEnd && data.stepIndex >= 0 && (
                  <div className="absolute -top-2 -right-2 bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md">
                    {data.stepIndex + 1}
                  </div>
                )}

                <div className="text-center text-white flex items-center justify-center gap-2">
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <div className="text-sm font-semibold leading-tight">{data.label}</div>
                </div>
              </div>
            )}

            {/* Parallelogram Shape (I/O) */}
            {config.shape === 'parallelogram' && (
              <div
                className={`
                  relative
                  px-6 py-3
                  bg-gradient-to-br ${gradient}
                  shadow-lg border-2 border-white/30
                  min-w-[160px]
                  transition-all duration-300
                  ${isHovered ? 'shadow-2xl scale-105' : ''}
                `}
                style={{
                  clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)'
                }}
              >
                {isDraggable && isHovered && (
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md">
                    <GripVertical className="h-3 w-3 text-gray-600" />
                  </div>
                )}

                {!isStartEnd && data.stepIndex >= 0 && (
                  <div className="absolute -top-2 -right-2 bg-white text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md">
                    {data.stepIndex + 1}
                  </div>
                )}

                <div className="text-center text-white flex items-center justify-center gap-2">
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <div className="text-sm font-semibold leading-tight">{data.label}</div>
                </div>
              </div>
            )}

            {/* Document Shape */}
            {config.shape === 'document' && (
              <div
                className={`
                  relative
                  px-6 py-3 pb-4
                  bg-gradient-to-br ${gradient}
                  shadow-lg border-2 border-white/30
                  min-w-[160px]
                  transition-all duration-300
                  rounded-t-xl
                  ${isHovered ? 'shadow-2xl scale-105' : ''}
                `}
                style={{
                  borderBottomLeftRadius: '50% 20%',
                  borderBottomRightRadius: '50% 20%'
                }}
              >
                {isDraggable && isHovered && (
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md">
                    <GripVertical className="h-3 w-3 text-gray-600" />
                  </div>
                )}

                {!isStartEnd && data.stepIndex >= 0 && (
                  <div className="absolute -top-2 -right-2 bg-white text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md">
                    {data.stepIndex + 1}
                  </div>
                )}

                <div className="text-center text-white flex items-center justify-center gap-2">
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <div className="text-sm font-semibold leading-tight">{data.label}</div>
                </div>
              </div>
            )}

            {/* Circle Shape (Início/Fim) */}
            {isStartEnd && (
              <div
                className={`
                  relative
                  w-28 h-28
                  ${getShape()}
                  bg-gradient-to-br ${gradient}
                  shadow-lg border-2 border-white/30
                  flex items-center justify-center
                  transition-all duration-300
                  ${isHovered ? 'shadow-2xl scale-105' : ''}
                `}
              >
                <div className="text-center text-white">
                  <Icon className="h-5 w-5 mx-auto mb-1" />
                  <div className="text-sm font-bold">{data.label}</div>
                </div>
              </div>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold text-sm">{data.label}</p>
            {data.description && <p className="text-xs text-gray-600">{data.description}</p>}
            {data.responsible && <p className="text-xs"><strong>Responsável:</strong> {data.responsible}</p>}
            {data.duration && <p className="text-xs"><strong>Duração:</strong> {data.duration}</p>}
            {data.warning && (
              <div className="pt-2 border-t">
                <p className="text-xs text-amber-600"><strong>⚠️ Atenção:</strong> {data.warning}</p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const nodeTypes: NodeTypes = {
  stepNode: StepNodeV2,
};

interface DragDropFlowchartProps {
  steps: ProcessStep[];
  onStepsChange?: (steps: ProcessStep[]) => void;
  className?: string;
  companyLogo?: string;
  companyName?: string;
}

export function DragDropFlowchartV2({ steps, onStepsChange, className = '', companyLogo, companyName }: DragDropFlowchartProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Convert ProcessSteps to ReactFlow nodes and edges
  const convertStepsToFlow = useCallback((processSteps: ProcessStep[]) => {
    const flowNodes: Node[] = [];
    const flowEdges: Edge[] = [];
    let yPosition = 0;
    const stepSpacing = 180;

    // Start node
    flowNodes.push({
      id: 'start',
      type: 'stepNode',
      position: { x: 250, y: yPosition },
      data: {
        label: 'Início',
        isStartEnd: true,
        stepIndex: -1
      },
    });

    yPosition += stepSpacing;

    // Add edge from start to first step
    if (processSteps.length > 0) {
      flowEdges.push({
        id: 'e-start-step0',
        source: 'start',
        target: 'step-0',
        type: 'smoothstep',
        animated: true,
        style: {
          stroke: '#10b981',
          strokeWidth: 2.5,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#10b981',
          width: 20,
          height: 20
        },
      });
    }

    // Process steps
    processSteps.forEach((step, index) => {
      const stepType = step.type || 'process';
      const config = STEP_STYLES[stepType];

      // Main step node
      flowNodes.push({
        id: `step-${index}`,
        type: 'stepNode',
        position: { x: 250, y: yPosition },
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

      // Add edge to next step
      if (index < processSteps.length - 1) {
        const edgeColor = config.color;
        flowEdges.push({
          id: `e-step${index}-step${index + 1}`,
          source: `step-${index}`,
          target: `step-${index + 1}`,
          type: 'smoothstep',
          animated: true,
          style: {
            stroke: edgeColor,
            strokeWidth: 2.5,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: edgeColor,
            width: 20,
            height: 20
          },
        });
      }

      yPosition += stepSpacing;
    });

    // End node
    flowNodes.push({
      id: 'end',
      type: 'stepNode',
      position: { x: 250, y: yPosition },
      data: {
        label: 'Fim',
        isStartEnd: true,
        stepIndex: -1
      },
    });

    // Add edge from last step to end
    if (processSteps.length > 0) {
      const lastStepType = processSteps[processSteps.length - 1].type || 'process';
      const lastColor = STEP_STYLES[lastStepType].color;

      flowEdges.push({
        id: `e-step${processSteps.length - 1}-end`,
        source: `step-${processSteps.length - 1}`,
        target: 'end',
        type: 'smoothstep',
        animated: true,
        style: {
          stroke: lastColor,
          strokeWidth: 2.5,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: lastColor,
          width: 20,
          height: 20
        },
      });
    } else {
      flowEdges.push({
        id: 'e-start-end',
        source: 'start',
        target: 'end',
        type: 'smoothstep',
        animated: true,
        style: {
          stroke: '#10b981',
          strokeWidth: 2.5,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#10b981',
          width: 20,
          height: 20
        },
      });
    }

    return { nodes: flowNodes, edges: flowEdges };
  }, []);

  // Update flow when steps change
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = convertStepsToFlow(steps);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [steps, convertStepsToFlow, setNodes, setEdges]);

  // Handle node drag end
  const onNodeDragStop = useCallback(
    (_event: any, node: Node) => {
      if (!onStepsChange || !node.id.startsWith('step-')) return;

      const stepNodes = nodes
        .filter((n) => n.id.startsWith('step-') && n.data.stepIndex >= 0)
        .sort((a, b) => a.position.y - b.position.y);

      const newOrder = stepNodes.map((n) => n.data.stepIndex);
      const reorderedSteps = newOrder.map((index) => steps[index]);

      onStepsChange(reorderedSteps);
    },
    [nodes, steps, onStepsChange]
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className={`${className} relative bg-gradient-to-br from-slate-50 to-slate-100`} style={{ height: '700px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.3}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.75 }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        className="touch-none"
      >
        <Background
          color="#94a3b8"
          gap={20}
          size={1.5}
          className="opacity-30"
        />

        <Controls
          className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl shadow-lg"
          showInteractive={false}
        />

        <MiniMap
          nodeColor={(node) => {
            if (node.data.isStartEnd) return '#10b981';
            const stepType = node.data.stepType || 'process';
            return STEP_STYLES[stepType].color;
          }}
          maskColor="rgba(0, 0, 0, 0.05)"
          className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl shadow-lg"
        />

        {/* Top Panel */}
        {(companyLogo || companyName) && (
          <Panel position="top-left" className="m-4">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white/95 backdrop-blur-sm px-5 py-3 rounded-xl shadow-lg border border-slate-200 flex items-center gap-3"
            >
              {companyLogo && <img src={companyLogo} alt="Logo" className="h-8 w-auto" />}
              {companyName && <span className="font-semibold text-slate-800">{companyName}</span>}
            </motion.div>
          </Panel>
        )}

        {/* Legend */}
        <Panel position="bottom-center" className="m-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-xl shadow-lg border border-slate-200"
          >
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600" />
                <span>Início/Fim</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-blue-600" />
                <span>Processo</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 transform rotate-45 bg-gradient-to-br from-orange-500 to-orange-600" />
                <span>Decisão</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-gradient-to-br from-purple-500 to-purple-600 transform skew-x-12" />
                <span>Entrada/Saída</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-gradient-to-br from-green-500 to-green-600 rounded-t" />
                <span>Documento</span>
              </div>
            </div>
          </motion.div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
