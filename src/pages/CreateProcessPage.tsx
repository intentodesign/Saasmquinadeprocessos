import { useState, useEffect, useRef } from 'react';
import { Bot, User, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import { Process, ProcessStep } from '../lib/types';
import { generateId } from '../lib/utils';

interface CreateProcessPageProps {
  onNavigate: (path: string) => void;
  onCreateProcess: (process: Process) => void;
}

type Message = {
  id: string;
  type: 'bot' | 'user';
  content: string;
  options?: string[];
  isTyping?: boolean;
};

export function CreateProcessPage({ onNavigate, onCreateProcess }: CreateProcessPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    steps: '',
    responsible: '',
    equipment: '',
    safety: '',
    standards: '',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial message
    setTimeout(() => {
      addBotMessage('Olá! Vou te ajudar a criar um Procedimento Operacional Padrão. Qual o nome do processo que você quer documentar?');
    }, 500);
  }, []);

  const addBotMessage = (content: string, options?: string[]) => {
    const id = generateId();
    setMessages(prev => [...prev, { id: `typing-${id}`, type: 'bot', content: '...', isTyping: true }]);
    
    setTimeout(() => {
      setMessages(prev => {
        const filtered = prev.filter(m => !m.isTyping);
        return [...filtered, { id, type: 'bot', content, options }];
      });
    }, 800);
  };

  const addUserMessage = (content: string) => {
    const id = generateId();
    setMessages(prev => [...prev, { id, type: 'user', content }]);
  };

  const handleCategoryClick = (category: string) => {
    const categoryMap: Record<string, string> = {
      'Manutenção': 'maintenance',
      'Atendimento': 'service',
      'Administrativo': 'administrative',
      'Outro': 'other',
    };
    
    handleSubmit(category, categoryMap[category]);
  };

  const handleSubmit = (value?: string, categoryValue?: string) => {
    const inputValue = value || currentInput.trim();
    if (!inputValue && step !== 8) return;

    addUserMessage(inputValue);
    setCurrentInput('');

    // Process steps
    switch (step) {
      case 0: // Name
        setFormData(prev => ({ ...prev, name: inputValue }));
        setStep(1);
        setTimeout(() => {
          addBotMessage('Ótimo! Este processo pertence a qual categoria?', [
            'Manutenção',
            'Atendimento',
            'Administrativo',
            'Outro'
          ]);
        }, 1000);
        break;

      case 1: // Category
        setFormData(prev => ({ ...prev, category: categoryValue || 'other' }));
        setStep(2);
        setTimeout(() => {
          addBotMessage('Agora me conta: quais são as etapas principais deste processo? Pode listar uma por linha.');
        }, 1000);
        break;

      case 2: // Steps
        setFormData(prev => ({ ...prev, steps: inputValue }));
        setStep(3);
        setTimeout(() => {
          addBotMessage('Perfeito! Quem é o responsável por executar este processo?');
        }, 1000);
        break;

      case 3: // Responsible
        setFormData(prev => ({ ...prev, responsible: inputValue }));
        setStep(4);
        setTimeout(() => {
          addBotMessage('Precisa de algum equipamento ou ferramenta especial? (Digite "não" se não precisar)');
        }, 1000);
        break;

      case 4: // Equipment
        setFormData(prev => ({ ...prev, equipment: inputValue }));
        setStep(5);
        setTimeout(() => {
          addBotMessage('Existe algum requisito de segurança importante? (Digite "não" se não houver)');
        }, 1000);
        break;

      case 5: // Safety
        setFormData(prev => ({ ...prev, safety: inputValue }));
        setStep(6);
        setTimeout(() => {
          addBotMessage('Por último: este processo tem alguma norma específica que precisa seguir? (ex: ISO 9001, NR-12) Digite "não" se não houver.');
        }, 1000);
        break;

      case 6: // Standards
        setFormData(prev => ({ ...prev, standards: inputValue }));
        setStep(7);
        setIsLoading(true);
        setTimeout(() => {
          addBotMessage('Incrível! Agora vou gerar seu POP. Isso leva uns 10 segundos... ⏳');
        }, 1000);
        
        // Simulate AI generation
        setTimeout(() => {
          setIsLoading(false);
          setStep(8);
          addBotMessage(`✓ Pronto! Seu SOP "${formData.name}" foi criado. Vamos visualizar?`);
        }, 3000);
        break;

      case 8: // Complete
        createProcess();
        break;
    }
  };

  const createProcess = () => {
    const stepsList = formData.steps
      .split('\n')
      .filter(s => s.trim())
      .map((stepText, index): ProcessStep => ({
        id: generateId(),
        title: stepText.trim(),
        description: `Descrição detalhada da etapa: ${stepText.trim()}`,
        responsible: formData.responsible,
        duration: '15 min',
        warning: formData.safety && formData.safety.toLowerCase() !== 'não' ? formData.safety : undefined,
        order: index + 1,
      }));

    const newProcess: Process = {
      id: generateId(),
      name: formData.name,
      category: formData.category as any,
      status: 'complete',
      steps: stepsList,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      tags: [],
      metadata: {
        code: `POP-${formData.category.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-3)}`,
        revision: 'Rev. 01',
      },
    };

    onCreateProcess(newProcess);
    onNavigate(`/process/${newProcess.id}/view`);
  };

  const progress = (step / 7) * 100;

  return (
    <div className="min-h-screen bg-[#f8fafc] relative">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => onNavigate('/dashboard')}
            className="flex items-center gap-2 text-[#64748b] hover:text-[#1e293b] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Sair</span>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563eb] to-[#0ea5e9] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.5"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="px-6 pb-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between text-xs text-[#64748b] mb-2">
              <span>Pergunta {Math.min(step + 1, 7)} de 7</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-3xl mx-auto px-6 py-8 pb-32">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'bot' && (
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-[#2563eb] to-[#0ea5e9] text-white">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'} max-w-xl`}>
                <Card
                  className={`p-4 ${
                    message.type === 'user'
                      ? 'bg-[#f59e0b] text-white border-[#f59e0b]'
                      : 'bg-white'
                  }`}
                >
                  {message.isTyping ? (
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#64748b] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-[#64748b] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-[#64748b] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  ) : (
                    <p className={message.type === 'user' ? 'text-white' : 'text-[#1e293b]'}>
                      {message.content}
                    </p>
                  )}
                </Card>

                {/* Quick Reply Options */}
                {message.options && !message.isTyping && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {message.options.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleCategoryClick(option)}
                        className="hover:bg-[#2563eb] hover:text-white hover:border-[#2563eb]"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {message.type === 'user' && (
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarFallback className="bg-[#64748b] text-white">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {/* Loading Message */}
          {isLoading && (
            <Card className="p-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#2563eb] mx-auto mb-3" />
              <p className="text-[#64748b] mb-2">Analisando suas respostas...</p>
              <p className="text-sm text-[#64748b]">Gerando diagrama e formatando documento...</p>
            </Card>
          )}

          {/* Completion Button */}
          {step === 8 && !isLoading && (
            <div className="flex justify-center">
              <Button
                onClick={createProcess}
                className="bg-[#2563eb] hover:bg-[#1d4ed8]"
                size="lg"
              >
                Ver Meu Processo
              </Button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      {step < 8 && !isLoading && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
          <div className="max-w-3xl mx-auto px-6 py-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="flex gap-3"
            >
              {step === 2 ? (
                <Textarea
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder="Digite cada etapa em uma linha..."
                  className="flex-1 min-h-[80px]"
                  autoFocus
                />
              ) : (
                <Input
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder="Digite sua resposta..."
                  className="flex-1"
                  autoFocus
                />
              )}
              <Button
                type="submit"
                className="bg-[#2563eb] hover:bg-[#1d4ed8]"
                disabled={!currentInput.trim() && step !== 8}
              >
                Enviar
              </Button>
            </form>
            <p className="text-xs text-[#64748b] mt-2 text-center">
              Pressione Enter para enviar
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
