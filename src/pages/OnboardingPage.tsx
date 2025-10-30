import { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { Send, Upload, X } from 'lucide-react';

const robotAvatar = '/robot-avatar.png';

interface Message {
  id: string;
  sender: 'robot' | 'user';
  content: string;
  timestamp: Date;
}

interface OnboardingData {
  userName?: string;
  companyName?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

interface OnboardingPageProps {
  onComplete: (data: OnboardingData) => void;
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'robot',
      content: 'Olá! Eu sou o Rô Bot! 👋 Prazer em conhecer você! Estou aqui para te ajudar a criar processos incríveis para sua oficina. Antes de começarmos, preciso conhecer um pouquinho sobre você e sua empresa. Vamos lá?',
      timestamp: new Date(),
    },
  ]);
  
  const [currentInput, setCurrentInput] = useState('');
  const [step, setStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [logoFile, setLogoFile] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const addMessage = (sender: 'robot' | 'user', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender,
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addRobotMessage = async (content: string, delay = 800) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, delay));
    setIsTyping(false);
    addMessage('robot', content);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoFile(result);
        setOnboardingData(prev => ({ ...prev, logo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setOnboardingData(prev => ({ ...prev, logo: undefined }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!currentInput.trim() && step !== 3 && step !== 5) return;

    // Add user message
    if (currentInput.trim()) {
      addMessage('user', currentInput);
    }

    const input = currentInput.trim();
    setCurrentInput('');

    // Process based on current step
    switch (step) {
      case 0: // Nome do usuário
        setOnboardingData(prev => ({ ...prev, userName: input }));
        await addRobotMessage(`Muito prazer, ${input}! É ótimo ter você aqui! 😊`);
        await addRobotMessage('Agora me conta, qual é o nome da sua empresa/oficina?');
        setStep(1);
        break;

      case 1: // Nome da empresa
        setOnboardingData(prev => ({ ...prev, companyName: input }));
        await addRobotMessage(`${input}! Que nome bacana! 🚗`);
        await addRobotMessage('Você gostaria de adicionar o logotipo da sua empresa? Isso vai deixar seus processos ainda mais profissionais! (Você pode pular esta etapa se preferir)');
        setStep(2);
        break;

      case 2: // Pergunta sobre logo
        if (input.toLowerCase().includes('sim') || input.toLowerCase().includes('quero') || input.toLowerCase().includes('gostaria')) {
          await addRobotMessage('Perfeito! Use o botão abaixo para fazer o upload do seu logotipo.');
          setStep(3);
        } else {
          await addRobotMessage('Sem problemas! Você pode adicionar depois se quiser. 👍');
          await addRobotMessage('Agora vamos às cores! Você gostaria de personalizar as cores da sua marca nos processos?');
          setStep(4);
        }
        break;

      case 3: // Upload do logo
        if (logoFile) {
          await addRobotMessage('Logo carregado com sucesso! Ficou ótimo! ✨');
          await addRobotMessage('Agora vamos às cores! Você gostaria de personalizar as cores da sua marca nos processos?');
          setStep(4);
        }
        break;

      case 4: // Pergunta sobre cores
        if (input.toLowerCase().includes('sim') || input.toLowerCase().includes('quero') || input.toLowerCase().includes('gostaria')) {
          await addRobotMessage('Ótimo! Você pode escolher as cores usando os seletores abaixo.');
          setShowColorPicker(true);
          setStep(5);
        } else {
          await addRobotMessage('Tudo bem! Vamos usar cores padrão que ficam lindas também! 🎨');
          await finishOnboarding();
        }
        break;

      case 5: // Cores definidas
        await finishOnboarding();
        break;
    }
  };

  const finishOnboarding = async () => {
    await addRobotMessage('Perfeito! Tudo configurado! 🎉');
    await addRobotMessage('Agora vou te mostrar um tour rápido pelo sistema para você conhecer tudo. Preparado?');
    
    setTimeout(() => {
      onComplete(onboardingData);
    }, 2000);
  };

  const skipLogo = async () => {
    await addRobotMessage('Sem problemas! Você pode adicionar depois se quiser. 👍');
    await addRobotMessage('Agora vamos às cores! Você gostaria de personalizar as cores da sua marca nos processos?');
    setStep(4);
  };

  const confirmColors = async () => {
    await addRobotMessage('Cores escolhidas! Ficou show! 🎨');
    await finishOnboarding();
  };

  const skipColors = async () => {
    await addRobotMessage('Tudo bem! Vamos usar cores padrão que ficam lindas também! 🎨');
    setShowColorPicker(false);
    await finishOnboarding();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-2xl">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                <img src={robotAvatar} alt="Rô Bot" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-2xl">Bem-vindo à Máquina de Processos!</h1>
                <p className="text-blue-100">Configure sua conta com o Rô Bot</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {message.sender === 'robot' && (
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-200 flex-shrink-0 bg-white">
                      <img src={robotAvatar} alt="Rô Bot" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border-2 border-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-200 flex-shrink-0 bg-white">
                    <img src={robotAvatar} alt="Rô Bot" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-white border-2 border-gray-200 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Logo Upload Section */}
            {step === 3 && (
              <div className="flex justify-center">
                <div className="bg-white border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  
                  {!logoFile ? (
                    <>
                      <Upload className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-4">Clique para fazer upload do logotipo</p>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 hover:bg-blue-700 mb-2"
                      >
                        Escolher Arquivo
                      </Button>
                      <Button
                        onClick={skipLogo}
                        variant="ghost"
                        className="ml-2"
                      >
                        Pular esta etapa
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative inline-block">
                        <img
                          src={logoFile}
                          alt="Logo preview"
                          className="max-w-[200px] max-h-[100px] object-contain"
                        />
                        <button
                          onClick={removeLogo}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <Button
                          onClick={() => handleSubmit()}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Confirmar Logo
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Color Picker Section */}
            {showColorPicker && step === 5 && (
              <div className="flex justify-center">
                <div className="bg-white border-2 border-blue-300 rounded-lg p-6 w-full max-w-md">
                  <h3 className="mb-4 text-center">Escolha as cores da sua marca</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2">Cor Primária</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={onboardingData.primaryColor || '#2563eb'}
                          onChange={(e) => setOnboardingData(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="w-16 h-10 rounded border-2 border-gray-300 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={onboardingData.primaryColor || '#2563eb'}
                          onChange={(e) => setOnboardingData(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Cor Secundária</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={onboardingData.secondaryColor || '#0ea5e9'}
                          onChange={(e) => setOnboardingData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                          className="w-16 h-10 rounded border-2 border-gray-300 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={onboardingData.secondaryColor || '#0ea5e9'}
                          onChange={(e) => setOnboardingData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={confirmColors}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Confirmar Cores
                      </Button>
                      <Button
                        onClick={skipColors}
                        variant="outline"
                        className="flex-1"
                      >
                        Usar Padrão
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          {step < 3 && (
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t-2 border-gray-200">
              <div className="flex gap-2">
                <Input
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder={
                    step === 0 ? 'Digite seu nome...' :
                    step === 1 ? 'Digite o nome da sua empresa...' :
                    step === 2 ? 'Digite "sim" ou "não"...' :
                    'Digite sua resposta...'
                  }
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  type="submit"
                  disabled={!currentInput.trim() || isTyping}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          )}

          {step === 4 && !showColorPicker && (
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t-2 border-gray-200">
              <div className="flex gap-2">
                <Input
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder='Digite "sim" ou "não"...'
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  type="submit"
                  disabled={!currentInput.trim() || isTyping}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
