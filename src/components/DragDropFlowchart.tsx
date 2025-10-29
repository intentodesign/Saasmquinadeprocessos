import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { ProcessStep } from '../lib/types';
import { 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  GripVertical, 
  Clock, 
  User,
  Flag,
  Workflow,
  ZoomIn,
  ZoomOut,
  Maximize2,
  LayoutGrid
} from 'lucide-react';
import { motion } from 'motion/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';

// Custom Node Component for Process Steps with modern design
function StepNode({ data }: { data: any }) {
  const [isHovered, setIsHovered] = useState(false);
  const isDecision = data.isDecision;
  const isStartEnd = data.isStartEnd;

  const getIcon = () => {
    if (isStartEnd) {
      return data.label === 'Início' ? <Play className="h-4 w-4" /> : <Flag className="h-4 w-4" />;
    }
    if (isDecision) {
      return <AlertCircle className="h-4 w-4" />;
    }
    return <Workflow className="h-4 w-4" />;
  };

  const getGradient = () => {
    if (isStartEnd) {
      return 'bg-gradient-to-br from-emerald-500 to-emerald-600';
    }
    if (isDecision) {
      return 'bg-gradient-to-br from-amber-500 to-orange-500';
    }
    return 'bg-gradient-to-br from-blue-600 to-blue-700';
  };

  const isDraggable = !isStartEnd;

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
            <div
              className={`
                relative px-5 py-4 rounded-xl shadow-lg border-2 min-w-[200px] max-w-[280px]
                transition-all duration-300 cursor-pointer group
                ${getGradient()}
                ${isHovered ? 'shadow-2xl scale-105 border-white/40' : 'border-white/20'}
                ${!isStartEnd ? 'hover:shadow-2xl' : ''}
              `}
              style={{
                clipPath: isDecision ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' : undefined,
                padding: isDecision ? '28px 40px' : undefined,
              }}
            >
              {/* Drag Handle */}
              {isDraggable && (
                <div className={`
                  absolute -left-2 top-1/2 -translate-y-1/2 
                  bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-md
                  transition-all duration-300
                  ${isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-90'}
                `}>
                  <GripVertical className="h-4 w-4 text-gray-600" />
                </div>
              )}

              {/* Step Number Badge */}
              {!isStartEnd && data.stepIndex >= 0 && (
                <div className="absolute -top-3 -right-3 bg-white text-blue-600 rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-md border-2 border-blue-600">
                  {data.stepIndex + 1}
                </div>
              )}

              <div className="text-center text-white relative z-10">
                {/* Icon & Title */}
                <div className="flex items-center justify-center gap-2 mb-1">
                  {getIcon()}
                  <div className="font-semibold text-sm leading-tight">{data.label}</div>
                </div>

                {/* Metadata */}
                {(data.responsible || data.duration) && (
                  <div className="mt-3 pt-3 border-t border-white/30 space-y-1.5">
                    {data.responsible && (
                      <div className="flex items-center justify-center gap-1.5 text-xs">
                        <User className="h-3 w-3" />
                        <span className="opacity-95">{data.responsible}</span>
                      </div>
                    )}
                    {data.duration && (
                      <div className="flex items-center justify-center gap-1.5 text-xs">
                        <Clock className="h-3 w-3" />
                        <span className="opacity-95">{data.duration}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Warning Badge */}
              {data.warning && (
                <div className="mt-3 p-2.5 bg-amber-50 text-amber-900 rounded-lg text-xs border border-amber-200 shadow-inner">
                  <div className="flex items-start gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                    <span className="leading-tight">{data.warning}</span>
                  </div>
                </div>
              )}

              {/* Shine effect on hover */}
              {isHovered && !isDecision && (
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-xl pointer-events-none" />
              )}
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <div className="space-y-1.5">
            <p className="font-semibold">{data.label}</p>
            {data.responsible && <p className="text-xs opacity-90">Responsável: {data.responsible}</p>}
            {data.duration && <p className="text-xs opacity-90">Duração: {data.duration}</p>}
            {isDraggable && (
              <p className="text-xs text-blue-400 mt-2 pt-2 border-t border-gray-700">
                💡 Arraste para reorganizar
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Custom Node Component for Notes with modern design
function NoteNode({ data }: { data: any }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="px-3 py-2.5 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-300 text-slate-700 text-xs max-w-[160px] shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start gap-1.5">
        <span className="text-slate-400 flex-shrink-0">📋</span>
        <span className="leading-tight">{data.label}</span>
      </div>
    </motion.div>
  );
}

const nodeTypes: NodeTypes = {
  stepNode: StepNode,
  noteNode: NoteNode,
};

interface DragDropFlowchartProps {
  steps: ProcessStep[];
  onStepsChange?: (steps: ProcessStep[]) => void;
  className?: string;
  companyLogo?: string;
  companyName?: string;
}

export function DragDropFlowchart({ steps, onStepsChange, className = '', companyLogo, companyName }: DragDropFlowchartProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Convert ProcessSteps to ReactFlow nodes and edges
  const convertStepsToFlow = useCallback((processSteps: ProcessStep[]) => {
    const flowNodes: Node[] = [];
    const flowEdges: Edge[] = [];
    let yPosition = 0;
    const stepSpacing = 150;

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
          stroke: '#3b82f6', 
          strokeWidth: 3,
          strokeLinecap: 'round'
        },
        markerEnd: { 
          type: MarkerType.ArrowClosed,
          color: '#3b82f6',
          width: 20,
          height: 20
        },
      });
    }

    // Process steps
    processSteps.forEach((step, index) => {
      const isDecision =
        step.warning ||
        step.title.toLowerCase().includes('verificar') ||
        step.title.toLowerCase().includes('conferir') ||
        step.title.toLowerCase().includes('checar');

      // Main step node
      flowNodes.push({
        id: `step-${index}`,
        type: 'stepNode',
        position: { x: 250, y: yPosition },
        data: {
          label: step.title,
          responsible: step.responsible,
          duration: step.duration,
          warning: step.warning,
          isDecision,
          stepIndex: index,
        },
        draggable: true,
      });

      // Add note node if has metadata
      if (step.responsible || step.duration) {
        const noteText = [step.responsible, step.duration].filter(Boolean).join(' - ');
        flowNodes.push({
          id: `note-${index}`,
          type: 'noteNode',
          position: { x: 50, y: yPosition },
          data: { label: noteText },
          draggable: false,
        });

        flowEdges.push({
          id: `e-note-${index}`,
          source: `note-${index}`,
          target: `step-${index}`,
          type: 'straight',
          style: { strokeDasharray: '5,5', stroke: '#cbd5e1' },
          animated: false,
        });
      }

      // Add edge to next step
      if (index < processSteps.length - 1) {
        flowEdges.push({
          id: `e-step${index}-step${index + 1}`,
          source: `step-${index}`,
          target: `step-${index + 1}`,
          type: 'smoothstep',
          animated: true,
          style: { 
            stroke: '#3b82f6', 
            strokeWidth: 3,
            strokeLinecap: 'round'
          },
          markerEnd: { 
            type: MarkerType.ArrowClosed,
            color: '#3b82f6',
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
      flowEdges.push({
        id: `e-step${processSteps.length - 1}-end`,
        source: `step-${processSteps.length - 1}`,
        target: 'end',
        type: 'smoothstep',
        animated: true,
        style: { 
          stroke: '#3b82f6', 
          strokeWidth: 3,
          strokeLinecap: 'round'
        },
        markerEnd: { 
          type: MarkerType.ArrowClosed,
          color: '#3b82f6',
          width: 20,
          height: 20
        },
      });
    } else {
      // If no steps, connect start to end
      flowEdges.push({
        id: 'e-start-end',
        source: 'start',
        target: 'end',
        type: 'smoothstep',
        animated: true,
        style: { 
          stroke: '#3b82f6', 
          strokeWidth: 3,
          strokeLinecap: 'round'
        },
        markerEnd: { 
          type: MarkerType.ArrowClosed,
          color: '#3b82f6',
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

  // Handle node drag end - reorder steps based on Y position
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
        defaultViewport={{ x: 0, y: 0, zoom: 0.85 }}
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
            if (node.data.isDecision) return '#f59e0b';
            return '#2563eb';
          }}
          maskColor="rgba(0, 0, 0, 0.05)"
          className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl shadow-lg"
        />

        {/* Top Panel with Company Info and Tips */}
        <Panel position="top-left" className="m-4">
          {(companyLogo || companyName) && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white/95 backdrop-blur-sm px-5 py-3 rounded-xl shadow-lg border border-slate-200 flex items-center gap-3"
            >
              {companyLogo && (
                <img src={companyLogo} alt="Logo" className="h-8 w-auto object-contain" />
              )}
              {companyName && (
                <span className="font-semibold text-slate-800">{companyName}</span>
              )}
            </motion.div>
          )}
        </Panel>

        <Panel position="top-right" className="m-4">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-xl shadow-lg border border-blue-500 flex items-center gap-2 text-sm"
          >
            <GripVertical className="h-4 w-4" />
            <span>Arraste os blocos para reorganizar</span>
          </motion.div>
        </Panel>

        {/* Bottom Panel with Legend */}
        <Panel position="bottom-center" className="m-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-xl shadow-lg border border-slate-200"
          >
            <div className="flex items-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 border-2 border-white shadow" />
                <span className="text-slate-700">Início/Fim</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 border-2 border-white shadow" />
                <span className="text-slate-700">Etapas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 border-2 border-white shadow" />
                <span className="text-slate-700">Decisões</span>
              </div>
            </div>
          </motion.div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
