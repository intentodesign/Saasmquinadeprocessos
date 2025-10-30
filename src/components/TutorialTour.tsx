import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { X, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface TutorialTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: '🎉 Bem-vindo à Máquina de Processos!',
    description: 'Vou te mostrar rapidinho como funciona tudo por aqui. É super simples!',
    position: 'center',
  },
  {
    id: 'create-process',
    title: '✨ Criar Novo Processo',
    description: 'É aqui que a mágica acontece! Clique aqui para criar um novo POP conversando comigo. Eu vou te fazer algumas perguntas e criar o processo automaticamente.',
    target: '[data-tour="create-button"]',
    position: 'right',
  },
  {
    id: 'processes',
    title: '📚 Seus Processos',
    description: 'Aqui você vê todos os processos criados. Você pode editá-los, visualizá-los como fluxograma e exportar em PDF.',
    target: '[data-tour="processes-section"]',
    position: 'bottom',
  },
  {
    id: 'sidebar',
    title: '📋 Menu de Navegação',
    description: 'Aqui no menu lateral você encontra tudo: Dashboard, Meus Processos, Criar Novo, Configurações e Plano.',
    target: '[data-tour="sidebar"]',
    position: 'right',
  },
  {
    id: 'branding',
    title: '🎨 Personalização',
    description: 'Nas configurações você pode ajustar o logo e as cores da sua empresa a qualquer momento.',
    target: '[data-tour="settings"]',
    position: 'right',
  },
  {
    id: 'start',
    title: '🚀 Vamos Começar!',
    description: 'Agora você está pronto! Que tal criar seu primeiro processo? Eu vou estar aqui para te ajudar!',
    position: 'center',
  },
];

export function TutorialTour({ onComplete, onSkip }: TutorialTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const step = tourSteps[currentStep];

  useEffect(() => {
    if (step.target) {
      const element = document.querySelector(step.target) as HTMLElement;
      if (element) {
        setHighlightedElement(element);
        
        // Scroll element into view first
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Wait for scroll to finish before calculating position
        setTimeout(() => {
          const rect = element.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

          let top = 0;
          let left = 0;
          const tooltipWidth = 320; // Width of the tooltip card
          const tooltipHeight = 280; // Approximate height

          switch (step.position) {
            case 'right':
              top = rect.top + scrollTop + rect.height / 2 - tooltipHeight / 2;
              left = rect.right + scrollLeft + 24;
              break;
            case 'left':
              top = rect.top + scrollTop + rect.height / 2 - tooltipHeight / 2;
              left = rect.left + scrollLeft - tooltipWidth - 24;
              break;
            case 'top':
              top = rect.top + scrollTop - tooltipHeight - 24;
              left = rect.left + scrollLeft + rect.width / 2 - tooltipWidth / 2;
              break;
            case 'bottom':
              top = rect.bottom + scrollTop + 24;
              left = rect.left + scrollLeft + rect.width / 2 - tooltipWidth / 2;
              break;
          }

          // Ensure tooltip stays within viewport
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          
          if (left < 20) left = 20;
          if (left + tooltipWidth > viewportWidth - 20) left = viewportWidth - tooltipWidth - 20;
          if (top < 20) top = 20;
          if (top + tooltipHeight > scrollTop + viewportHeight - 20) top = scrollTop + viewportHeight - tooltipHeight - 20;

          setTooltipPosition({ top, left });
        }, 500);
      }
    } else {
      setHighlightedElement(null);
    }
  }, [currentStep, step]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[9998]"
          onClick={handleSkip}
        />
      </AnimatePresence>

      {/* Highlight spotlight */}
      {highlightedElement && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            top: highlightedElement.getBoundingClientRect().top + window.pageYOffset,
            left: highlightedElement.getBoundingClientRect().left + window.pageXOffset,
            width: highlightedElement.offsetWidth,
            height: highlightedElement.offsetHeight,
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 bg-white/10 rounded-lg border-4 border-blue-500 shadow-2xl"
            style={{
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 30px rgba(59, 130, 246, 0.8)',
            }}
          />
        </div>
      )}

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`fixed z-[10000] pointer-events-auto ${step.position === 'center' ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : ''}`}
          style={
            step.position !== 'center'
              ? { top: tooltipPosition.top, left: tooltipPosition.left }
              : {}
          }
        >
          <Card className="w-80 shadow-2xl border-2 border-blue-500">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-500">
                    Passo {currentStep + 1} de {tourSteps.length}
                  </span>
                </div>
                <button
                  onClick={handleSkip}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="mb-6">
                <h3 className="mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>

              {/* Progress bar */}
              <div className="mb-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button
                    onClick={handlePrevious}
                    variant="outline"
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {currentStep === tourSteps.length - 1 ? 'Começar!' : 'Próximo'}
                  {currentStep !== tourSteps.length - 1 && (
                    <ArrowRight className="w-4 h-4 ml-2" />
                  )}
                </Button>
              </div>

              {/* Skip button */}
              {currentStep < tourSteps.length - 1 && (
                <button
                  onClick={handleSkip}
                  className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Pular tutorial
                </button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
