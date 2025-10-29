import { Check, X, Zap, Crown, ChevronDown } from 'lucide-react';
import { Fragment } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { useState } from 'react';
import { User } from '../lib/types';

interface PricingPageProps {
  user?: User;
  onNavigate: (path: string) => void;
}

export function PricingPage({ user, onNavigate }: PricingPageProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

  const plans = [
    {
      name: 'Gratuito',
      price: { monthly: 'R$ 0', annually: 'R$ 0' },
      description: 'Para testar e pequenos projetos',
      features: [
        { name: '3 POPs por mês', included: true },
        { name: 'Templates básicos', included: true },
        { name: 'Exportar PDF', included: true },
        { name: 'Branding personalizado', included: false },
        { name: 'Templates ISO 9001', included: false },
        { name: 'Versionamento', included: false },
        { name: 'Suporte prioritário', included: false },
      ],
      cta: 'Plano Atual',
      highlight: false,
      tier: 'free',
    },
    {
      name: 'Básico',
      price: { monthly: 'R$ 97', annually: 'R$ 932' },
      description: 'Para oficinas pequenas e médias',
      features: [
        { name: '15 POPs por mês', included: true },
        { name: 'Sem marca Máquina de Processos', included: true },
        { name: 'Cores personalizadas', included: true },
        { name: 'Templates ISO 9001', included: true },
        { name: 'Exportar PDF e Mermaid', included: true },
        { name: 'Suporte email 48h', included: true },
        { name: 'Versionamento automático', included: false },
        { name: 'White-label completo', included: false },
      ],
      cta: 'Assinar Agora',
      highlight: true,
      tier: 'basic',
    },
    {
      name: 'Profissional',
      price: { monthly: 'R$ 297', annually: 'R$ 2.850' },
      description: 'Para oficinas estabelecidas',
      features: [
        { name: '50 SOPs por mês', included: true },
        { name: 'Logo + cores personalizadas', included: true },
        { name: 'Templates completos', included: true },
        { name: 'Versionamento automático', included: true },
        { name: 'Histórico de mudanças', included: true },
        { name: 'Suporte prioritário 24h', included: true },
        { name: 'Integração API', included: false },
        { name: 'Usuários ilimitados', included: false },
      ],
      cta: 'Assinar Agora',
      highlight: false,
      tier: 'professional',
    },
    {
      name: 'Enterprise',
      price: { monthly: 'R$ 997', annually: 'R$ 9.570' },
      description: 'Para redes e grandes operações',
      features: [
        { name: 'SOPs ilimitados', included: true },
        { name: 'White-label completo', included: true },
        { name: 'API access', included: true },
        { name: 'Usuários ilimitados', included: true },
        { name: 'Suporte dedicado', included: true },
        { name: 'Onboarding personalizado', included: true },
        { name: 'SLA garantido', included: true },
        { name: 'Gerente de conta', included: true },
      ],
      cta: 'Falar com Vendas',
      highlight: false,
      tier: 'enterprise',
    },
  ];

  const allFeatures = [
    {
      category: 'Criação de SOPs',
      features: [
        { name: 'SOPs por mês', free: '3', basic: '15', professional: '50', enterprise: 'Ilimitado' },
        { name: 'Assistente IA', free: true, basic: true, professional: true, enterprise: true },
        { name: 'Editor drag & drop', free: true, basic: true, professional: true, enterprise: true },
        { name: 'Templates básicos', free: true, basic: true, professional: true, enterprise: true },
        { name: 'Templates ISO 9001', free: false, basic: true, professional: true, enterprise: true },
        { name: 'Templates avançados', free: false, basic: false, professional: true, enterprise: true },
      ],
    },
    {
      category: 'Personalização',
      features: [
        { name: 'Cores personalizadas', free: false, basic: true, professional: true, enterprise: true },
        { name: 'Logo da empresa', free: false, basic: false, professional: true, enterprise: true },
        { name: 'White-label completo', free: false, basic: false, professional: false, enterprise: true },
      ],
    },
    {
      category: 'Exportação',
      features: [
        { name: 'PDF básico', free: true, basic: true, professional: true, enterprise: true },
        { name: 'PDF com branding', free: false, basic: true, professional: true, enterprise: true },
        { name: 'Código Mermaid', free: false, basic: true, professional: true, enterprise: true },
        { name: 'Imagem SVG/PNG', free: false, basic: false, professional: true, enterprise: true },
      ],
    },
    {
      category: 'Colaboração',
      features: [
        { name: 'Usuários', free: '1', basic: '3', professional: '10', enterprise: 'Ilimitado' },
        { name: 'Versionamento', free: false, basic: false, professional: true, enterprise: true },
        { name: 'Histórico de mudanças', free: false, basic: false, professional: true, enterprise: true },
        { name: 'Comentários', free: false, basic: false, professional: true, enterprise: true },
      ],
    },
    {
      category: 'Suporte',
      features: [
        { name: 'Email', free: 'Melhor esforço', basic: '48h', professional: '24h', enterprise: 'Prioritário' },
        { name: 'Chat ao vivo', free: false, basic: false, professional: true, enterprise: true },
        { name: 'Telefone', free: false, basic: false, professional: false, enterprise: true },
        { name: 'Gerente de conta', free: false, basic: false, professional: false, enterprise: true },
      ],
    },
  ];

  const faqs = [
    {
      question: 'Posso trocar de plano a qualquer momento?',
      answer: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. Ao fazer upgrade, você terá acesso imediato aos novos recursos. No downgrade, as mudanças entram em vigor no próximo ciclo de cobrança.',
    },
    {
      question: 'Como funciona o limite de SOPs?',
      answer: 'O limite se renova mensalmente. Por exemplo, no plano Básico você pode criar até 15 SOPs por mês. No próximo mês, o contador zera e você pode criar mais 15. SOPs criados anteriormente não são deletados.',
    },
    {
      question: 'Vocês emitem nota fiscal?',
      answer: 'Sim, emitimos nota fiscal eletrônica (NF-e) automaticamente para todas as assinaturas. A nota é enviada por email após cada pagamento.',
    },
    {
      question: 'Tem garantia de reembolso?',
      answer: 'Sim! Oferecemos garantia de reembolso de 7 dias em todos os planos pagos. Se não ficar satisfeito, basta solicitar o reembolso integral.',
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
        <h1 className="text-[#1e293b]">Escolha seu Plano</h1>
        <p className="text-lg text-[#64748b]">
          Sem surpresas. Cancele quando quiser.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <Label htmlFor="billing-toggle" className={billingCycle === 'monthly' ? 'text-[#1e293b]' : 'text-[#64748b]'}>
            Mensal
          </Label>
          <Switch
            id="billing-toggle"
            checked={billingCycle === 'annually'}
            onCheckedChange={(checked) => setBillingCycle(checked ? 'annually' : 'monthly')}
          />
          <div className="flex items-center gap-2">
            <Label htmlFor="billing-toggle" className={billingCycle === 'annually' ? 'text-[#1e293b]' : 'text-[#64748b]'}>
              Anual
            </Label>
            <Badge className="bg-[#10b981]">Economize 20%</Badge>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`p-6 flex flex-col ${
              plan.highlight
                ? 'border-2 border-[#2563eb] shadow-lg relative'
                : ''
            }`}
          >
            {plan.highlight && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2563eb]">
                Mais Popular
              </Badge>
            )}

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-[#1e293b]">{plan.name}</h3>
                {plan.name === 'Enterprise' && (
                  <Crown className="h-5 w-5 text-[#f59e0b]" />
                )}
              </div>
              <p className="text-sm text-[#64748b]">{plan.description}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-[#1e293b]">
                  {plan.price[billingCycle]}
                </span>
                {plan.price.monthly !== 'R$ 0' && (
                  <span className="text-sm text-[#64748b]">
                    /{billingCycle === 'monthly' ? 'mês' : 'ano'}
                  </span>
                )}
              </div>
              {billingCycle === 'annually' && plan.price.monthly !== 'R$ 0' && (
                <p className="text-xs text-[#64748b] mt-1">
                  {Math.round(parseInt(plan.price.annually.replace(/\D/g, '')) / 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês
                </p>
              )}
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  {feature.included ? (
                    <Check className="h-4 w-4 text-[#10b981] flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="h-4 w-4 text-[#64748b]/30 flex-shrink-0 mt-0.5" />
                  )}
                  <span className={feature.included ? 'text-[#1e293b]' : 'text-[#64748b]/50'}>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              className={`w-full ${
                plan.highlight
                  ? 'bg-[#2563eb] hover:bg-[#1d4ed8]'
                  : plan.tier === 'free' && user?.plan === 'free'
                  ? 'bg-[#64748b]'
                  : ''
              }`}
              variant={plan.highlight || (plan.tier === 'free' && user?.plan === 'free') ? 'default' : 'outline'}
              onClick={() => {
                if (plan.tier === 'enterprise') {
                  alert('Entre em contato: vendas@maquinadeprocessos.com.br');
                } else {
                  alert(`Assinar plano ${plan.name}...`);
                }
              }}
              disabled={plan.tier === 'free' && user?.plan === 'free'}
            >
              {plan.tier === user?.plan ? 'Plano Atual' : plan.cta}
            </Button>
          </Card>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-[#1e293b] mb-2">Comparação Completa</h2>
          <p className="text-[#64748b]">
            Veja todos os recursos detalhados de cada plano
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-[#f8fafc]">
                  <th className="text-left p-4 text-[#1e293b]">Recurso</th>
                  <th className="text-center p-4 text-[#1e293b]">Gratuito</th>
                  <th className="text-center p-4 text-[#1e293b]">Básico</th>
                  <th className="text-center p-4 text-[#1e293b]">Profissional</th>
                  <th className="text-center p-4 text-[#1e293b]">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((category, categoryIndex) => (
                  <Fragment key={`category-${categoryIndex}`}>
                    <tr className="bg-[#f8fafc]">
                      <td colSpan={5} className="p-4 text-[#1e293b]">
                        {category.category}
                      </td>
                    </tr>
                    {category.features.map((feature, featureIndex) => (
                      <tr key={`feature-${categoryIndex}-${featureIndex}`} className="border-b">
                        <td className="p-4 text-[#64748b]">{feature.name}</td>
                        <td className="p-4 text-center">
                          {typeof feature.free === 'boolean' ? (
                            feature.free ? (
                              <Check className="h-5 w-5 text-[#10b981] mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-[#64748b]/30 mx-auto" />
                            )
                          ) : (
                            <span className="text-[#64748b]">{feature.free}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof feature.basic === 'boolean' ? (
                            feature.basic ? (
                              <Check className="h-5 w-5 text-[#10b981] mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-[#64748b]/30 mx-auto" />
                            )
                          ) : (
                            <span className="text-[#64748b]">{feature.basic}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof feature.professional === 'boolean' ? (
                            feature.professional ? (
                              <Check className="h-5 w-5 text-[#10b981] mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-[#64748b]/30 mx-auto" />
                            )
                          ) : (
                            <span className="text-[#64748b]">{feature.professional}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof feature.enterprise === 'boolean' ? (
                            feature.enterprise ? (
                              <Check className="h-5 w-5 text-[#10b981] mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-[#64748b]/30 mx-auto" />
                            )
                          ) : (
                            <span className="text-[#64748b]">{feature.enterprise}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
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