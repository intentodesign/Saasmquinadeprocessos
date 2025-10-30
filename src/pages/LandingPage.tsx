import { MessageSquare, Sparkles, Download, Move, ShieldCheck, Wrench, Palette, History, FileText, Play, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const features = [
    { icon: Move, title: 'Editor Visual Drag & Drop', description: 'Arraste e organize etapas facilmente' },
    { icon: ShieldCheck, title: 'Conformidade ISO 9001', description: 'Templates prontos para certificação' },
    { icon: Wrench, title: 'Templates para Oficinas', description: 'Processos específicos do setor automotivo' },
    { icon: Palette, title: 'White Label', description: 'Personalize com sua marca' },
    { icon: History, title: 'Versionamento Automático', description: 'Controle todas as mudanças' },
    { icon: FileText, title: 'Exportação Multi-formato', description: 'PDF, Mermaid e mais' },
  ];

  const pricingOptions = [
    {
      name: 'Essencial',
      price: 'R$ 667',
      subtitle: 'anual',
      features: ['Até 20 processos documentados', 'Exportação PDF básica', 'Fluxogramas visuais', 'Suporte por email'],
      popular: false,
    },
    {
      name: 'Profissional',
      price: 'R$ 997',
      subtitle: 'anual',
      features: ['Processos ilimitados', 'White Label completo', 'Exportação multi-formato', 'IA Rô Bot incluída', 'Suporte prioritário', 'Versionamento automático'],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'R$ 1.497',
      subtitle: 'anual',
      features: ['Tudo do Profissional', 'Treinamento personalizado (1h)', 'API de integração', 'Gerente de conta dedicado'],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/logo.svg"
                alt="Logo Máquina de Processos"
                className="h-8 w-auto"
              />
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#" className="text-[#64748b] hover:text-[#1e293b] transition-colors">Início</a>
              <a href="#funcionalidades" className="text-[#64748b] hover:text-[#1e293b] transition-colors">Funcionalidades</a>
              <a href="#precos" className="text-[#64748b] hover:text-[#1e293b] transition-colors">Preços</a>
              <a href="#" className="text-[#64748b] hover:text-[#1e293b] transition-colors">Contato</a>
            </nav>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => onNavigate('/login')}>
                Entrar
              </Button>
              <Button onClick={() => onNavigate('/register')} className="bg-[#2563eb] hover:bg-[#1d4ed8]">
                Começar Grátis
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <Badge className="bg-[#10b981] hover:bg-[#059669]">
              ✓ Grátis para 3 processos
            </Badge>
            
            <h1 className="text-[#1e293b] leading-tight">
              Documente Processos em Minutos, Não em Semanas
            </h1>
            
            <p className="text-lg text-[#64748b]">
              IA cria seus Procedimentos Operacionais Padrão automaticamente. Conforme ISO 9001. Sem consultoria cara.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={() => onNavigate('/register')}
                className="bg-[#f59e0b] hover:bg-[#d97706] text-white"
              >
                Criar Meu Primeiro Processo Grátis
              </Button>
              <Button size="lg" variant="ghost">
                <Play className="mr-2 h-5 w-5" />
                Ver Como Funciona
              </Button>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-2xl p-6 border">
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2563eb] to-[#0ea5e9] flex items-center justify-center text-white">
                    🔧
                  </div>
                  <div>
                    <h3 className="text-[#1e293b]">Troca de Óleo Completa</h3>
                    <p className="text-xs text-[#64748b]">Manutenção Preventiva</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded bg-[#f8fafc]">
                      <div className="w-6 h-6 rounded-full bg-[#2563eb] text-white text-xs flex items-center justify-center">
                        {i}
                      </div>
                      <div className="h-2 bg-[#e2e8f0] rounded flex-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-[#1e293b] mb-4">Como Funciona</h2>
            <p className="text-lg text-[#64748b]">Três passos simples para criar seus POPs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#2563eb]/10 flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-[#2563eb]" />
              </div>
              <h3 className="text-[#1e293b]">Converse com a IA</h3>
              <p className="text-[#64748b]">
                Responda perguntas simples sobre seu processo. Nosso assistente inteligente guia você.
              </p>
            </Card>

            <Card className="p-8 text-center space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#f59e0b]/10 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-[#f59e0b]" />
              </div>
              <h3 className="text-[#1e293b]">IA Gera o POP</h3>
              <p className="text-[#64748b]">
                Em segundos, receba um procedimento completo, formatado e pronto para usar.
              </p>
            </Card>

            <Card className="p-8 text-center space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#10b981]/10 flex items-center justify-center">
                <Download className="h-8 w-8 text-[#10b981]" />
              </div>
              <h3 className="text-[#1e293b]">Exporte Personalizado</h3>
              <p className="text-[#64748b]">
                Baixe em PDF com seu logo e cores, ou Mermaid para edição técnica.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="funcionalidades" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-[#1e293b] mb-4">Funcionalidades</h2>
            <p className="text-lg text-[#64748b]">Tudo que você precisa para documentar processos profissionalmente</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card key={i} className="p-6 hover:shadow-md transition-shadow">
                  <Icon className="h-10 w-10 text-[#2563eb] mb-4" />
                  <h3 className="text-[#1e293b] mb-2">{feature.title}</h3>
                  <p className="text-[#64748b]">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precos" className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-[#1e293b] mb-4">Plano Único, Duas Formas de Pagamento</h2>
            <p className="text-lg text-[#64748b]">Escolha a opção que melhor se adapta ao seu negócio</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingOptions.map((option, i) => (
              <Card key={i} className={`p-8 ${option.popular ? 'border-[#2563eb] border-2 shadow-lg' : ''}`}>
                {option.popular && (
                  <Badge className="mb-4 bg-[#2563eb]">Mais Escolhido</Badge>
                )}
                <h3 className="text-[#1e293b] mb-2">{option.name}</h3>
                <div className="mb-2">
                  <span className="text-[#1e293b]">{option.price}</span>
                </div>
                <p className="text-sm text-[#64748b] mb-6">{option.subtitle}</p>
                <ul className="space-y-3 mb-8">
                  {option.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-[#64748b]">
                      <Check className="h-5 w-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={option.popular ? 'default' : 'outline'}
                  onClick={() => onNavigate('/pricing')}
                >
                  Assinar Agora
                </Button>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="link" onClick={() => onNavigate('/pricing')}>
              Ver todos os recursos incluídos →
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563eb] to-[#0ea5e9]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.5"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-[#1e293b]">Máquina de Processos</span>
              </div>
              <p className="text-sm text-[#64748b]">Feito para empresários brasileiros 🇧🇷</p>
            </div>

            <div>
              <h4 className="text-[#1e293b] mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-[#64748b]">
                <li><a href="#" className="hover:text-[#1e293b]">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-[#1e293b]">Preços</a></li>
                <li><a href="#" className="hover:text-[#1e293b]">Templates</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#1e293b] mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-[#64748b]">
                <li><a href="#" className="hover:text-[#1e293b]">Sobre</a></li>
                <li><a href="#" className="hover:text-[#1e293b]">Blog</a></li>
                <li><a href="#" className="hover:text-[#1e293b]">Contato</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#1e293b] mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-[#64748b]">
                <li><a href="#" className="hover:text-[#1e293b]">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-[#1e293b]">Privacidade</a></li>
                <li><a href="#" className="hover:text-[#1e293b]">Suporte</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 text-center text-sm text-[#64748b]">
            <p>© 2025 Máquina de Processos. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
