import { Process, BrandingSettings } from '../lib/types';
import { MermaidFlowchart } from './MermaidFlowchart';
import { getCategoryLabel } from '../lib/utils';

interface AllProcessesDocumentProps {
  processes: Process[];
  branding: BrandingSettings;
}

export function AllProcessesDocument({ processes, branding }: AllProcessesDocumentProps) {
  const companyName = branding.companyName || 'Auto Center Premium';
  const logo = branding.logo;
  const primaryColor = branding.primaryColor || '#2563eb';
  const secondaryColor = branding.secondaryColor || '#0ea5e9';

  // Agrupar processos por categoria
  const groupedProcesses = processes.reduce((acc, process) => {
    if (!acc[process.category]) {
      acc[process.category] = [];
    }
    acc[process.category].push(process);
    return acc;
  }, {} as Record<string, Process[]>);

  // Ordenar categorias
  const categoryOrder = ['maintenance', 'service', 'administrative', 'other'];
  const sortedCategories = categoryOrder.filter(cat => groupedProcesses[cat]);

  return (
    <div className="bg-white">
      {/* CAPA */}
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-12 text-center"
        style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}
      >
        {logo ? (
          <img src={logo} alt={companyName} className="h-24 mb-8 object-contain" />
        ) : (
          <div className="w-24 h-24 mb-8 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.5"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
        
        <h1 className="text-5xl font-bold text-white mb-4">
          Manual de Processos
        </h1>
        <h2 className="text-2xl text-white/90 mb-8">
          Procedimentos Operacionais Padrão
        </h2>
        
        <div className="w-32 h-1 bg-white/40 mb-8 rounded-full" />
        
        <p className="text-xl text-white/90 mb-2">{companyName}</p>
        <p className="text-lg text-white/80">
          {new Date().toLocaleDateString('pt-BR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
        
        <div className="mt-12 text-white/70">
          <p className="text-sm">Total de Processos: {processes.length}</p>
        </div>
      </div>

      {/* SUMÁRIO */}
      <div className="min-h-screen p-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl text-[#1e293b] mb-8 pb-4 border-b-2" style={{ borderColor: primaryColor }}>
            Sumário
          </h2>
          
          <div className="space-y-8">
            {sortedCategories.map((category, catIndex) => (
              <div key={category}>
                <h3 className="text-xl mb-4" style={{ color: primaryColor }}>
                  {catIndex + 1}. {getCategoryLabel(category as any)}
                </h3>
                <div className="space-y-2 pl-6">
                  {groupedProcesses[category].map((process, procIndex) => (
                    <div key={process.id} className="flex justify-between items-center py-2 border-b border-[#e2e8f0]">
                      <div className="flex-1">
                        <span className="text-[#64748b] mr-2">
                          {catIndex + 1}.{procIndex + 1}
                        </span>
                        <span className="text-[#1e293b]">{process.name}</span>
                      </div>
                      <div className="text-[#64748b] text-sm">
                        Pág. {2 + sortedCategories.slice(0, catIndex).reduce((sum, cat) => 
                          sum + groupedProcesses[cat].length * 2, 0) + (procIndex * 2) + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PROCESSOS */}
      {sortedCategories.map((category, catIndex) => (
        <div key={category}>
          {/* Divisória de Categoria */}
          <div 
            className="min-h-[200px] flex items-center justify-center p-12"
            style={{ background: `linear-gradient(to right, ${primaryColor}10, ${secondaryColor}10)` }}
          >
            <div className="text-center">
              <div className="text-6xl mb-4" style={{ color: primaryColor }}>
                {catIndex + 1}
              </div>
              <h2 className="text-3xl text-[#1e293b]">
                {getCategoryLabel(category as any)}
              </h2>
              <p className="text-[#64748b] mt-2">
                {groupedProcesses[category].length} processo(s)
              </p>
            </div>
          </div>

          {/* Processos da Categoria */}
          {groupedProcesses[category].map((process, procIndex) => (
            <div key={process.id}>
              {/* Página 1: Documento ISO 9001 */}
              <div className="min-h-screen p-12">
                <div className="max-w-4xl mx-auto">
                  {/* Header do Processo */}
                  <div className="mb-8 pb-6 border-b-2" style={{ borderColor: primaryColor }}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
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
                      <div className="text-right text-sm text-[#64748b]">
                        <p>Código: {process.metadata?.code || `${catIndex + 1}.${procIndex + 1}`}</p>
                        <p>Revisão: {process.metadata?.revision || 'Rev. 01'}</p>
                        <p>Data: {new Date(process.createdAt).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="text-[#1e293b] mb-2">PROCEDIMENTO OPERACIONAL PADRÃO</h3>
                      <h2 className="text-2xl" style={{ color: primaryColor }}>{process.name}</h2>
                    </div>
                  </div>

                  {/* Conteúdo do Documento */}
                  <div className="space-y-6">
                    {/* Objetivo */}
                    <section>
                      <h4 className="text-[#1e293b] mb-3 pb-2 border-b" style={{ borderColor: primaryColor }}>
                        1. OBJETIVO
                      </h4>
                      <p className="text-[#64748b] leading-relaxed text-sm">
                        Este procedimento tem como objetivo estabelecer as diretrizes e etapas necessárias para a execução do processo "{process.name}", 
                        garantindo a padronização, qualidade e conformidade com as normas aplicáveis.
                      </p>
                    </section>

                    {/* Escopo */}
                    <section>
                      <h4 className="text-[#1e293b] mb-3 pb-2 border-b" style={{ borderColor: primaryColor }}>
                        2. ESCOPO
                      </h4>
                      <p className="text-[#64748b] leading-relaxed text-sm">
                        Este procedimento aplica-se a todos os colaboradores envolvidos na execução do processo "{process.name}" 
                        e deve ser seguido em todas as ocorrências relacionadas.
                      </p>
                    </section>

                    {/* Responsabilidades */}
                    <section>
                      <h4 className="text-[#1e293b] mb-3 pb-2 border-b" style={{ borderColor: primaryColor }}>
                        3. RESPONSABILIDADES
                      </h4>
                      <div className="space-y-2">
                        {process.steps[0]?.responsible && (
                          <div className="flex items-start gap-2 text-[#64748b] text-sm">
                            <span className="font-medium text-[#1e293b] min-w-[100px]">Executante:</span>
                            <span>{process.steps[0].responsible}</span>
                          </div>
                        )}
                        {process.metadata?.approver && (
                          <div className="flex items-start gap-2 text-[#64748b] text-sm">
                            <span className="font-medium text-[#1e293b] min-w-[100px]">Aprovador:</span>
                            <span>{process.metadata.approver}</span>
                          </div>
                        )}
                      </div>
                    </section>

                    {/* Materiais e Equipamentos */}
                    <section>
                      <h4 className="text-[#1e293b] mb-3 pb-2 border-b" style={{ borderColor: primaryColor }}>
                        4. MATERIAIS E EQUIPAMENTOS
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-[#64748b] text-sm">
                        <li>Equipamentos de Proteção Individual (EPI) adequados</li>
                        <li>Ferramentas específicas conforme etapas do procedimento</li>
                        <li>Materiais consumíveis necessários</li>
                      </ul>
                    </section>

                    {/* Procedimento */}
                    <section>
                      <h4 className="text-[#1e293b] mb-4 pb-2 border-b" style={{ borderColor: primaryColor }}>
                        5. PROCEDIMENTO
                      </h4>
                      <div className="space-y-4">
                        {process.steps.map((step, index) => (
                          <div key={step.id} className="space-y-2">
                            <p className="text-[#1e293b] text-sm">
                              5.{index + 1}. {step.title}
                            </p>
                            <p className="text-[#64748b] leading-relaxed pl-4 text-sm">
                              {step.description}
                            </p>
                            {step.warning && (
                              <div className="ml-4 p-2 bg-[#f59e0b]/10 border-l-4 border-[#f59e0b] rounded">
                                <p className="text-xs text-[#f59e0b] flex items-start gap-2">
                                  <span className="font-medium">⚠️ ATENÇÃO:</span>
                                  <span>{step.warning}</span>
                                </p>
                              </div>
                            )}
                            {(step.responsible || step.duration) && (
                              <div className="ml-4 text-xs text-[#64748b] space-y-1">
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

                    {/* Registros e Controles */}
                    <section>
                      <h4 className="text-[#1e293b] mb-3 pb-2 border-b" style={{ borderColor: primaryColor }}>
                        6. REGISTROS E CONTROLES
                      </h4>
                      <p className="text-[#64748b] leading-relaxed text-sm">
                        Todos os procedimentos devem ser registrados em formulário próprio, mantendo a rastreabilidade e histórico das atividades executadas.
                      </p>
                    </section>

                    {/* Referências */}
                    <section>
                      <h4 className="text-[#1e293b] mb-3 pb-2 border-b" style={{ borderColor: primaryColor }}>
                        7. REFERÊNCIAS
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-[#64748b] text-sm">
                        <li>ISO 9001:2015 - Sistemas de gestão da qualidade</li>
                        <li>Manual do fabricante</li>
                        <li>Normas técnicas aplicáveis</li>
                      </ul>
                    </section>
                  </div>

                  {/* Footer */}
                  <div className="mt-8 pt-4 border-t text-center text-xs text-[#64748b]">
                    <p>Documento gerado por Máquina de Processos | maquinadeprocessos.com.br</p>
                  </div>
                </div>
              </div>

              {/* Página 2: Fluxograma */}
              <div className="min-h-screen p-12 bg-[#f8fafc]">
                <div className="max-w-5xl mx-auto">
                  <div className="mb-8">
                    <h3 className="text-2xl text-[#1e293b] mb-2">Fluxograma do Processo</h3>
                    <p className="text-[#64748b]">{process.name}</p>
                  </div>

                  <div className="bg-white p-8 rounded-lg border-2 shadow-lg">
                    <MermaidFlowchart steps={process.steps} />
                  </div>

                  {/* Footer */}
                  <div className="mt-8 text-center text-xs text-[#64748b]">
                    <p>Código: {process.metadata?.code || `${catIndex + 1}.${procIndex + 1}`} | {companyName}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* PÁGINA FINAL */}
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-12 text-center"
        style={{ background: `linear-gradient(135deg, ${secondaryColor} 0%, ${primaryColor} 100%)` }}
      >
        <div className="w-24 h-24 mb-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <h2 className="text-3xl text-white mb-4">
          Manual de Processos Completo
        </h2>
        <p className="text-xl text-white/90 mb-8">
          {companyName}
        </p>
        
        <div className="w-32 h-1 bg-white/40 mb-8 rounded-full" />
        
        <div className="text-white/80 space-y-2">
          <p>Total de Processos: {processes.length}</p>
          <p>Categorias: {sortedCategories.length}</p>
          <p>
            Gerado em: {new Date().toLocaleDateString('pt-BR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        
        <div className="mt-12 text-white/60 text-sm">
          <p>Máquina de Processos</p>
          <p>maquinadeprocessos.com.br</p>
        </div>
      </div>
    </div>
  );
}
