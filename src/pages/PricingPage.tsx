import { Check, Zap } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { User } from '../lib/types';

interface PricingPageProps {
  user?: User;
  onNavigate: (path: string) => void;
}

export function PricingPage({ user, onNavigate }: PricingPageProps) {
  const [paymentOption, setPaymentOption] = useState<'upfront' | 'installments'>('upfront');

  const pricingOptions = [
    {
      type: 'upfront',
      name: 'Pagamento à Vista',
      initialPayment: 'R$ 997',
      maintenanceFee: 'R$ 37/mês',
      description: 'Pagamento inicial + manutenção mensal',
      highlight: true,
    },
    {
      type: 'installments',
      name: 'Parcelado',
      monthlyPayment: 'R$ 120',
      installments: '12x',
      description: 'Renovação anual automática',
      highlight: false,
    },
  ];

  const includedFeatures = [
    'SOPs ilimitados',
    'White-label completo',
    'Logo + cores personalizadas',
    'Templates completos ISO 9001',
    'Assistente IA',
    'Editor drag & drop',
    'Exportação PDF, Mermaid, SVG/PNG',
    'Versionamento automático',
    'Histórico de mudanças',
    'Usuários ilimitados',
    'API access',
    'Suporte prioritário',
    'Onboarding personalizado',
  ];

  const faqs = [
    {
      question: 'Qual a diferença entre as opções de pagamento?',
      answer: 'Na opção à vista, você paga R$ 997 inicialmente e mantém com R$ 37/mês. No parcelado, você divide o valor total em 12x de R$ 120 com renovação automática anual. Ambas as opções incluem todos os recursos da plataforma.',
    },
    {
      question: 'Como funciona a manutenção mensal?',
      answer: 'A manutenção mensal de R$ 37 garante acesso contínuo à plataforma, atualizações, suporte técnico e armazenamento dos seus SOPs na nuvem.',
    },
    {
      question: 'Vocês emitem nota fiscal?',
      answer: 'Sim, emitimos nota fiscal eletrônica (NF-e) automaticamente para todas as assinaturas. A nota é enviada por email após cada pagamento.',
    },
    {
      question: 'Tem garantia de reembolso?',
      answer: 'Sim! Oferecemos garantia de reembolso de 7 dias. Se não ficar satisfeito, basta solicitar o reembolso integral.',
    },
    {
      question: 'Os dados ficam seguros?',
      answer: 'Sim! Utilizamos criptografia SSL/TLS para todas as transferências de dados e fazemos backup diário de todos os documentos. Seus dados são armazenados em servidores seguros no Brasil.',
    },
    {
      question: 'Posso cancelar a qualquer momento?',
      answer: 'Sim, você pode cancelar sua assinatura a qualquer momento sem multas ou taxas adicionais. Você continuará tendo acesso até o final do período já pago.',
    },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-[#1e293b]">Plano Único com Todos os Recursos</h1>
        <p className="text-lg text-[#64748b]">
          Escolha a forma de pagamento que melhor se adapta ao seu negócio
        </p>
      </div>

      {/* Pricing Options */}
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {pricingOptions.map((option, index) => (
            <Card
              key={index}
              className={`p-8 flex flex-col cursor-pointer transition-all ${
                paymentOption === option.type
                  ? 'border-2 border-[#2563eb] shadow-lg'
                  : 'hover:shadow-md'
              }`}
              onClick={() => setPaymentOption(option.type as 'upfront' | 'installments')}
            >
              {option.highlight && (
                <Badge className="mb-4 bg-[#2563eb] w-fit">
                  Recomendado
                </Badge>
              )}

              <div className="mb-6">
                <h3 className="text-[#1e293b] mb-2">{option.name}</h3>
                <p className="text-sm text-[#64748b]">{option.description}</p>
              </div>

              <div className="mb-6">
                {option.type === 'upfront' ? (
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[#1e293b]">{option.initialPayment}</span>
                      <span className="text-sm text-[#64748b]">pagamento inicial</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl text-[#1e293b]">+</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[#1e293b]">{option.maintenanceFee}</span>
                      <span className="text-sm text-[#64748b]">manutenção</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-[#64748b]">{option.installments} de</span>
                    <span className="text-[#1e293b]">{option.monthlyPayment}</span>
                    <span className="text-sm text-[#64748b]">/mês</span>
                  </div>
                )}
              </div>

              <Button
                className={`w-full ${
                  paymentOption === option.type
                    ? 'bg-[#2563eb] hover:bg-[#1d4ed8]'
                    : ''
                }`}
                variant={paymentOption === option.type ? 'default' : 'outline'}
                onClick={() => {
                  setPaymentOption(option.type as 'upfront' | 'installments');
                  alert(`Assinar com ${option.name}...`);
                }}
              >
                {paymentOption === option.type ? 'Selecionado' : 'Escolher este plano'}
              </Button>
            </Card>
          ))}
        </div>

        {/* Included Features */}
        <Card className="p-8">
          <h3 className="text-[#1e293b] mb-6 text-center">
            Todos os recursos incluídos em ambas as opções
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {includedFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                <span className="text-[#64748b]">{feature}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* FAQ */}
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center">
          <h2 className="text-[#1e293b] mb-2">Perguntas Frequentes</h2>
          <p className="text-[#64748b]">
            Tire suas dúvidas sobre os planos
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-[#1e293b]">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-[#64748b]">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* CTA */}
      <Card className="p-8 bg-gradient-to-br from-[#2563eb] to-[#0ea5e9] text-white text-center">
        <h2 className="text-white mb-4">Pronto para começar?</h2>
        <p className="text-white/90 mb-6">
          Crie sua conta grátis agora e documente seu primeiro processo em minutos
        </p>
        <Button 
          size="lg" 
          onClick={() => onNavigate(user ? '/process/new' : '/register')}
          className="bg-white text-[#2563eb] hover:bg-white/90"
        >
          <Zap className="mr-2 h-5 w-5" />
          {user ? 'Criar Processo Agora' : 'Começar Grátis'}
        </Button>
      </Card>
    </div>
  );
}