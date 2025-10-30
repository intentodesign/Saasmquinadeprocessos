import { useState, useEffect, useRef } from 'react';
import { Bot, User as UserIcon, ArrowLeft, Loader2, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Process, ProcessStep, User, BrandingSettings } from '../lib/types';
import { generateId } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface CreateProcessPageProps {
  user: User;
  branding?: BrandingSettings;
  onNavigate: (path: string) => void;
  onCreateProcess: (process: Process) => void;
}

type Message = {
  id: string;
  type: 'bot' | 'user';
  content: string;
  isTyping?: boolean;
};

const N8N_WEBHOOK_URL = 'https://n8n.intentomarcas.com.br/webhook/process-chat';

export function CreateProcessPage({ user, branding, onNavigate, onCreateProcess }: CreateProcessPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [processComplete, setProcessComplete] = useState(false);
  const [processData, setProcessData] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Generate unique session ID
    const newSessionId = `session_${generateId()}`;
    setSessionId(newSessionId);

    // Add personalized greeting immediately
    const companyName = branding?.companyName || user.company || 'sua empresa';
    addBotMessage(`Olá, ${user.name}! 👋 Sou o Rô Bot, assistente da ${companyName}!`);

    // Get initial instructions from N8N
    setTimeout(() => {
      sendMessageToN8N('__START__', newSessionId);
    }, 500);
  }, []);

  const addBotMessage = (content: string) => {
    const id = generateId();
    setMessages(prev => [...prev, { id, type: 'bot', content, isTyping: false }]);
  };

  const addUserMessage = (content: string) => {
    const id = generateId();
    setMessages(prev => [...prev, { id, type: 'user', content }]);
  };

  const addTypingIndicator = () => {
    const id = generateId();
    setMessages(prev => [...prev, { id: `typing-${id}`, type: 'bot', content: '...', isTyping: true }]);
  };

  const removeTypingIndicator = () => {
    setMessages(prev => prev.filter(m => !m.isTyping));
  };

  const sendMessageToN8N = async (message: string, sid?: string) => {
    try {
      setIsLoading(true);

      // Add typing indicator
      if (message !== '__START__') {
        addTypingIndicator();
      }

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          sessionId: sid || sessionId,
          userName: user.name,
          companyName: branding?.companyName || user.company || 'sua empresa',
        }),
      });

      const data = await response.json();

      removeTypingIndicator();

      if (data.success) {
        // Add bot response
        addBotMessage(data.message);

        // Check if process is complete
        if (data.complete && data.process) {
          setProcessComplete(true);
          setProcessData(data.process);
        }
      } else {
        addBotMessage('Desculpe, ocorreu um erro. Pode tentar novamente?');
      }
    } catch (error) {
      console.error('Error calling N8N:', error);
      removeTypingIndicator();
      addBotMessage('Ops! Tive um problema de conexão. Pode tentar novamente?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const inputValue = currentInput.trim();
    if (!inputValue || isLoading) return;

    // Add user message to UI
    addUserMessage(inputValue);
    setCurrentInput('');

    // Send to N8N
    await sendMessageToN8N(inputValue);
  };

  const createProcess = () => {
    if (!processData) return;

    const stepsList: ProcessStep[] = processData.steps.map((step: any): ProcessStep => ({
      id: generateId(),
      title: step.title,
      description: step.description,
      responsible: step.responsible || processData.responsible,
      duration: step.duration || '15 min',
      warning: step.warning,
      order: step.order,
    }));

    const newProcess: Process = {
      id: generateId(),
      name: processData.name,
      category: processData.category,
      status: 'complete',
      steps: stepsList,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      tags: processData.standards || [],
      metadata: {
        code: `POP-${processData.category.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-3)}`,
        revision: 'Rev. 01',
      },
    };

    onCreateProcess(newProcess);
    onNavigate(`/process/${newProcess.id}/view`);
  };

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
            <span className="text-sm text-[#64748b]">Rô Bot</span>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/robot-avatar.png" alt="Rô Bot" />
              <AvatarFallback className="bg-gradient-to-br from-[#2563eb] to-[#0ea5e9] text-white">
                <Bot className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
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
                  <AvatarImage src="/robot-avatar.png" alt="Rô Bot" />
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
                    <div className={`prose prose-sm max-w-none ${message.type === 'user' ? 'prose-invert' : ''}`}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                          li: ({ children }) => <li className="mb-1">{children}</li>,
                          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                          h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-base font-bold mb-1">{children}</h3>,
                          hr: () => <hr className="my-3 border-t border-gray-300" />,
                          code: ({ children }) => <code className="bg-gray-100 px-1 rounded text-sm">{children}</code>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </Card>
              </div>

              {message.type === 'user' && (
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarFallback className="bg-[#64748b] text-white">
                    <UserIcon className="h-5 w-5" />
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
          {processComplete && processData && (
            <div className="flex justify-center">
              <Button
                onClick={createProcess}
                className="bg-[#10b981] hover:bg-[#059669]"
                size="lg"
              >
                ✓ Ver Meu Processo
              </Button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      {!processComplete && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="max-w-3xl mx-auto px-6 py-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder={isLoading ? 'Rô Bot está digitando...' : 'Digite sua mensagem...'}
                className="flex-1"
                disabled={isLoading}
                autoFocus
              />
              <Button
                type="submit"
                className="bg-[#2563eb] hover:bg-[#1d4ed8]"
                disabled={!currentInput.trim() || isLoading}
                size="icon"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
            <p className="text-xs text-[#64748b] mt-2 text-center">
              Pressione Enter para enviar • Powered by AI
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
