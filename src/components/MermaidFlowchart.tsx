import { useEffect, useRef, useState } from 'react';
import { ProcessStep } from '../lib/types';

interface MermaidFlowchartProps {
  steps: ProcessStep[];
  className?: string;
}

export function MermaidFlowchart({ steps, className = '' }: MermaidFlowchartProps) {
  const [mounted, setMounted] = useState(false);
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !mermaidRef.current || steps.length === 0) return;

    const loadMermaid = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const mermaid = (await import('mermaid')).default;
        
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis',
            padding: 15,
          },
          themeVariables: {
            primaryColor: '#2563eb',
            primaryTextColor: '#fff',
            primaryBorderColor: '#1d4ed8',
            lineColor: '#64748b',
            secondaryColor: '#f59e0b',
            tertiaryColor: '#10b981',
            fontSize: '16px',
          },
        });

        const diagramCode = generateMermaidDiagram(steps);
        
        if (mermaidRef.current) {
          // Use mermaid.render() for better control
          const id = `mermaid-${Date.now()}`;
          const { svg } = await mermaid.render(id, diagramCode);
          mermaidRef.current.innerHTML = svg;
        }
      } catch (error) {
        console.error('Error rendering Mermaid diagram:', error);
        // Fallback to simple list view
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = `
            <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p class="text-sm text-yellow-800">
                Não foi possível renderizar o fluxograma. Mostrando lista de passos:
              </p>
              <ol class="mt-4 space-y-2">
                ${steps.map((step, i) => `
                  <li class="text-sm">
                    <strong>${i + 1}. ${step.title}</strong>
                    ${step.responsible ? `<br><span class="text-gray-600">Responsável: ${step.responsible}</span>` : ''}
                  </li>
                `).join('')}
              </ol>
            </div>
          `;
        }
      }
    };

    loadMermaid();
  }, [steps, mounted]);

  const generateMermaidDiagram = (processSteps: ProcessStep[]): string => {
    let diagram = 'graph TD\n';
    
    // Start node
    diagram += '  Start([Início])\n';
    diagram += '  Start --> Step1\n\n';
    
    // Track warning counter for unique IDs
    let warningCounter = 0;
    
    // Add all steps
    processSteps.forEach((step, index) => {
      const currentStep = `Step${index + 1}`;
      const nextStep = index < processSteps.length - 1 ? `Step${index + 2}` : 'End';
      
      // Format step title - escape special characters properly
      const stepTitle = step.title
        .replace(/[\"'`]/g, '')
        .replace(/[()[\]{}]/g, '')
        .replace(/\\/g, '')
        .trim()
        .substring(0, 50);
      
      // Check if step has warning or decision point
      if (step.warning) {
        diagram += `  ${currentStep}{${stepTitle}}\n`;
      } else if (step.title.toLowerCase().includes('verificar') || 
                 step.title.toLowerCase().includes('conferir') ||
                 step.title.toLowerCase().includes('checar')) {
        diagram += `  ${currentStep}{${stepTitle}}\n`;
      } else {
        diagram += `  ${currentStep}[${stepTitle}]\n`;
      }
      
      // Add connection to next step
      if (index < processSteps.length - 1) {
        diagram += `  ${currentStep} --> ${nextStep}\n\n`;
      } else {
        diagram += `  ${currentStep} --> End\n\n`;
      }
      
      // Add note for responsible or duration
      if (step.responsible || step.duration) {
        const noteId = `Note${index + 1}`;
        let noteText = '';
        if (step.responsible) noteText += step.responsible;
        if (step.duration) noteText += step.responsible ? ` - ${step.duration}` : step.duration;
        // Remove emojis from Mermaid syntax - they cause parsing issues
        const cleanNoteText = noteText.replace(/[\"'`]/g, '').substring(0, 40);
        diagram += `  ${noteId}["${cleanNoteText}"]\n`;
        diagram += `  ${noteId} -.-> ${currentStep}\n\n`;
      }
      
      // Add warning node
      if (step.warning) {
        warningCounter++;
        const warningId = `Warning${warningCounter}`;
        const warningText = step.warning
          .replace(/[\"'`]/g, '')
          .replace(/[()[\]{}]/g, '')
          .trim()
          .substring(0, 40);
        diagram += `  ${warningId}["${warningText}"]\n`;
        diagram += `  ${warningId} -.-> ${currentStep}\n\n`;
      }
    });
    
    // End node
    diagram += '  End([Fim])\n\n';
    
    // Add styles
    diagram += '  classDef startEnd fill:#10b981,stroke:#059669,stroke-width:3px,color:#fff\n';
    diagram += '  classDef normalStep fill:#2563eb,stroke:#1d4ed8,stroke-width:2px,color:#fff\n';
    diagram += '  classDef decisionStep fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff\n';
    diagram += '  classDef noteStyle fill:#f1f5f9,stroke:#cbd5e1,stroke-width:1px,color:#1e293b\n';
    diagram += '  classDef warningStyle fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e\n\n';
    
    // Apply styles
    diagram += '  class Start,End startEnd\n';
    
    const normalSteps = processSteps
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
      diagram += `  class ${normalSteps} normalStep\n`;
    }
    
    const decisionSteps = processSteps
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
      diagram += `  class ${decisionSteps} decisionStep\n`;
    }
    
    // Only add notes that exist
    const notesList = processSteps
      .map((step, i) => (step.responsible || step.duration) ? `Note${i + 1}` : null)
      .filter(Boolean)
      .join(',');
    if (notesList) {
      diagram += `  class ${notesList} noteStyle\n`;
    }
    
    // Only add warnings that exist
    if (warningCounter > 0) {
      const warningsList = Array.from({ length: warningCounter }, (_, i) => `Warning${i + 1}`).join(',');
      diagram += `  class ${warningsList} warningStyle\n`;
    }
    
    return diagram;
  };

  if (!mounted) {
    return (
      <div className={`mermaid-container ${className}`}>
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-pulse text-gray-400">Carregando fluxograma...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`mermaid-container ${className}`}>
      <div ref={mermaidRef} className="flex justify-center items-center min-h-[300px]" />
    </div>
  );
}
