import { useState } from 'react';
import { Download, Edit, Share2, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../components/ui/breadcrumb';
import { Process, BrandingSettings } from '../lib/types';
import { MermaidFlowchart } from '../components/MermaidFlowchart';
import { generateProcessPDF } from '../lib/pdf-utils';
import { toast } from 'sonner@2.0.3';

interface ProcessViewPageProps {
  process: Process;
  onNavigate: (path: string) => void;
  branding?: BrandingSettings;
}

export function ProcessViewPage({ process, onNavigate, branding }: ProcessViewPageProps) {
  const companyName = branding?.companyName || 'Auto Center Premium';
  const logo = branding?.logo;
  const primaryColor = branding?.primaryColor || '#2563eb';
  const secondaryColor = branding?.secondaryColor || '#0ea5e9';
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Verificar se o elemento existe
      const element = document.getElementById('process-document');
      if (!element) {
        throw new Error('Elemento do documento não encontrado');
      }

      toast.info('Preparando documento para exportação...');
      
      // Aguardar um pouco mais para garantir que tudo está renderizado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await generateProcessPDF('process-document', process.name, (progress) => {
        if (progress === 10) toast.info('Capturando documento...');
        if (progress === 50) toast.info('Gerando arquivo PDF...');
        if (progress === 90) toast.info('Finalizando...');
      });
      
      toast.success(`PDF "${process.name}" baixado com sucesso!`);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao gerar PDF';
      toast.error(errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/process/${process.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        toast.success('Link copiado para área de transferência!');
      }).catch(() => {
        toast.error('Erro ao copiar link');
      });
    } else {
      toast.error('Navegador não suporta copiar para área de transferência');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => onNavigate('/processes')} className="cursor-pointer">
                Meus Processos
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{process.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <h1 className="text-[#1e293b]">{process.name}</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onNavigate(`/process/${process.id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>
            <Button 
              onClick={handleExport} 
              className="bg-[#2563eb] hover:bg-[#1d4ed8]"
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando PDF...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Document Preview */}
      <div className="max-w-4xl mx-auto">
        <Card id="process-document" className="bg-white shadow-lg">
          {/* Document Header */}
          <div className="p-8 border-b" style={{ background: `linear-gradient(to right, ${primaryColor}0D, ${secondaryColor}0D)` }}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {logo ? (
                    <img src={logo} alt={companyName} className="h-12 object-contain" />
                  ) : (
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})` }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.5"/>
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-[#64748b]">{companyName}</p>
                  </div>
                </div>
              </div>
              <div className="text-right text-sm text-[#64748b]">
                <p>Código: {process.metadata?.code || 'N/A'}</p>
                <p>Revisão: {process.metadata?.revision || 'N/A'}</p>
                <p>Data: {new Date(process.createdAt).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-[#1e293b] mb-2">PROCEDIMENTO OPERACIONAL PADRÃO</h2>
              <h1 className="text-2xl" style={{ color: primaryColor }}>{process.name}</h1>
            </div>
          </div>

          {/* Document Body */}
          <div className="p-8 space-y-8">
            {/* Objetivo */}
            <section>
              <h3 className="text-[#1e293b] mb-3 pb-2 border-b-2" style={{ borderColor: primaryColor }}>
                1. OBJETIVO
              </h3>
              <p className="text-[#64748b] leading-relaxed">
                Este procedimento tem como objetivo estabelecer as diretrizes e etapas necessárias para a execução do processo "{process.name}", 
                garantindo a padronização, qualidade e conformidade com as normas aplicáveis.
              </p>
            </section>

            {/* Escopo */}
            <section>
              <h3 className="text-[#1e293b] mb-3 pb-2 border-b-2" style={{ borderColor: primaryColor }}>
                2. ESCOPO
              </h3>
              <p className="text-[#64748b] leading-relaxed">
                Este procedimento aplica-se a todos os colaboradores envolvidos na execução do processo "{process.name}" 
                e deve ser seguido em todas as ocorrências relacionadas.
              </p>
            </section>

            {/* Responsabilidades */}
            <section>
              <h3 className="text-[#1e293b] mb-3 pb-2 border-b-2" style={{ borderColor: primaryColor }}>
                3. RESPONSABILIDADES
              </h3>
              <div className="space-y-2">
                {process.steps[0]?.responsible && (
                  <div className="flex items-start gap-2 text-[#64748b]">
                    <span className="font-medium text-[#1e293b] min-w-[120px]">Executante:</span>
                    <span>{process.steps[0].responsible}</span>
                  </div>
                )}
                {process.metadata?.approver && (
                  <div className="flex items-start gap-2 text-[#64748b]">
                    <span className="font-medium text-[#1e293b] min-w-[120px]">Aprovador:</span>
                    <span>{process.metadata.approver}</span>
                  </div>
                )}
              </div>
            </section>

            {/* Materiais e Equipamentos */}
            <section>
              <h3 className="text-[#1e293b] mb-3 pb-2 border-b-2" style={{ borderColor: primaryColor }}>
                4. MATERIAIS E EQUIPAMENTOS
              </h3>
              <ul className="list-disc list-inside space-y-1 text-[#64748b]">
                <li>Equipamentos de Proteção Individual (EPI) adequados</li>
                <li>Ferramentas específicas conforme etapas do procedimento</li>
                <li>Materiais consumíveis necessários</li>
              </ul>
            </section>

            {/* Procedimento */}
            <section>
              <h3 className="text-[#1e293b] mb-4 pb-2 border-b-2" style={{ borderColor: primaryColor }}>
                5. PROCEDIMENTO
              </h3>
              <div className="space-y-6">
                {process.steps.map((step, index) => (
                  <div key={step.id} className="space-y-2">
                    <h4 className="text-[#1e293b]">
                      5.{index + 1}. {step.title}
                    </h4>
                    <p className="text-[#64748b] leading-relaxed pl-6">
                      {step.description}
                    </p>
                    {step.warning && (
                      <div className="ml-6 p-3 bg-[#f59e0b]/10 border-l-4 border-[#f59e0b] rounded">
                        <p className="text-sm text-[#f59e0b] flex items-start gap-2">
                          <span className="font-medium">⚠️ ATENÇÃO:</span>
                          <span>{step.warning}</span>
                        </p>
                      </div>
                    )}
                    {(step.responsible || step.duration) && (
                      <div className="ml-6 text-sm text-[#64748b] space-y-1">
                        {step.responsible && (
                          <p>👤 Responsável: {step.responsible}</p>
                        )}
                        {step.duration && (
                          <p>⏱️ Tempo estimado: {step.duration}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Fluxograma */}
            <section>
              <h3 className="text-[#1e293b] mb-4 pb-2 border-b-2" style={{ borderColor: primaryColor }}>
                6. FLUXOGRAMA DO PROCESSO
              </h3>
              <div className="bg-white p-6 rounded-lg border-2">
                <MermaidFlowchart steps={process.steps} />
              </div>
            </section>

            {/* Registros e Controles */}
            <section>
              <h3 className="text-[#1e293b] mb-3 pb-2 border-b-2" style={{ borderColor: primaryColor }}>
                7. REGISTROS E CONTROLES
              </h3>
              <p className="text-[#64748b] leading-relaxed">
                Todos os procedimentos devem ser registrados em formulário próprio, mantendo a rastreabilidade e histórico das atividades executadas.
              </p>
            </section>

            {/* Referências */}
            <section>
              <h3 className="text-[#1e293b] mb-3 pb-2 border-b-2" style={{ borderColor: primaryColor }}>
                8. REFERÊNCIAS
              </h3>
              <ul className="list-disc list-inside space-y-1 text-[#64748b]">
                <li>ISO 9001:2015 - Sistemas de gestão da qualidade</li>
                <li>Manual do fabricante</li>
                <li>Normas técnicas aplicáveis</li>
              </ul>
            </section>
          </div>

          {/* Document Footer */}
          <div className="p-6 border-t bg-[#f8fafc] text-center">
            <p className="text-sm text-[#64748b]">
              Documento gerado por Máquina de Processos | maquinadeprocessos.com.br
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}