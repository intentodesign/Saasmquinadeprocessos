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
        <h1 className="text-[#1e293b]">Plano Único, Duas Formas de Pagamento</h1>
        <p className="text-lg text-[#64748b]">
          Escolha a opção que melhor se adapta ao seu negócio
        </p>
      </div>

      {/* Pricing Options */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {pricingOptions.map((option, index) => (
            <Card key={index} className={`p-8 ${option.popular ? 'border-[#2563eb] border-2 shadow-lg' : ''}`}>
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