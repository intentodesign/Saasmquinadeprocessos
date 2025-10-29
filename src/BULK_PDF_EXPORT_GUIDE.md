# Guia de Exportação em Massa de PDFs

## Visão Geral

A funcionalidade de exportação em massa permite baixar todos os processos da empresa em um único PDF profissional, organizado por categorias e com formatação ISO 9001.

## Estrutura do PDF Gerado

### 1. Capa
- Logo da empresa (se configurado)
- Título: "Manual de Processos"
- Subtítulo: "Procedimentos Operacionais Padrão"
- Nome da empresa
- Data de geração
- Total de processos incluídos

### 2. Sumário
- Processos organizados por categoria
- Numeração hierárquica (categoria.processo)
- Números de página para fácil navegação

### 3. Divisórias de Categoria
Cada categoria tem uma página divisória com:
- Número da categoria
- Nome da categoria (Manutenção, Atendimento, etc.)
- Quantidade de processos na categoria

### 4. Processos (2 páginas por processo)

#### Página 1: Documento ISO 9001
- Cabeçalho com logo e informações da empresa
- Título do processo
- Seções padronizadas:
  1. Objetivo
  2. Escopo
  3. Responsabilidades
  4. Materiais e Equipamentos
  5. Procedimento (com todas as etapas)
  6. Registros e Controles
  7. Referências
- Alertas e avisos destacados
- Informações de tempo e responsáveis

#### Página 2: Fluxograma Mermaid
- Representação visual do processo
- Fluxograma interativo gerado automaticamente
- Código do documento no rodapé

### 5. Página Final
- Resumo do manual
- Estatísticas (total de processos, categorias)
- Data e hora de geração
- Marca da aplicação

## Como Usar

### Na Interface
1. Acesse "Meus Processos" no menu lateral
2. Clique no botão "Baixar Todos" no canto superior direito
3. Aguarde a geração do PDF
4. O arquivo será baixado automaticamente

### Nome do Arquivo
O arquivo será nomeado automaticamente seguindo o padrão:
```
Manual-Processos-[nome-da-empresa]-[data].pdf
```

Exemplo: `Manual-Processos-auto-center-premium-2025-10-27.pdf`

## Personalização com Branding

O PDF utiliza as configurações de branding definidas em "Configurações > Branding":

### Logo
- Se configurado, aparece na capa e em cada processo
- Caso contrário, usa um ícone padrão

### Cores
- Cor primária: usada em títulos e bordas
- Cor secundária: usada em gradientes
- Aplicadas em toda a capa e divisórias

### Nome da Empresa
- Aparece na capa, rodapés e cabeçalhos

## Processo de Geração

### Etapas Técnicas
1. **Preparação**: Renderização do documento completo em memória
2. **Renderização de Fluxogramas**: Todos os diagramas Mermaid são renderizados
3. **Captura**: O documento HTML é convertido em imagem de alta qualidade
4. **Paginação**: O conteúdo é dividido automaticamente em páginas A4
5. **Download**: O PDF é gerado e baixado

### Tempo de Processamento
- 1-5 processos: ~5-10 segundos
- 6-15 processos: ~10-20 segundos
- 16+ processos: ~20-30 segundos

O tempo varia com:
- Número de processos
- Complexidade dos fluxogramas
- Quantidade de etapas por processo
- Desempenho do navegador

## Feedback Visual

Durante a geração, o sistema exibe:
- Modal com status "Gerando Manual de Processos"
- Indicador de progresso animado
- Toasts informativos em cada etapa:
  - "Preparando X processo(s)..."
  - "Renderizando fluxogramas..."
  - "Aguarde, processando documento..."
  - "Criando arquivo PDF..."
  - "Finalizando download..."
  - "Manual de Processos baixado com sucesso!"

## Limitações e Considerações

### Técnicas
- O PDF é gerado no navegador usando html2canvas + jsPDF
- Documentos muito grandes (50+ processos) podem demorar mais
- A qualidade do PDF depende da resolução configurada (padrão: 1.5x)

### Conteúdo
- Todos os processos são incluídos, independente do status (completo ou rascunho)
- A ordem segue as categorias: Manutenção, Atendimento, Administrativo, Outro
- Dentro de cada categoria, processos mantêm a ordem do sistema

### Navegador
- Requer JavaScript habilitado
- Funciona melhor em navegadores modernos (Chrome, Firefox, Edge)
- Requer memória suficiente para processar documentos grandes

## Casos de Uso

### Auditoria ISO 9001
Gere um manual completo para apresentar em auditorias de certificação.

### Treinamento de Funcionários
Distribua um PDF único com todos os processos para novos colaboradores.

### Backup de Documentação
Mantenha uma cópia offline de todos os processos da empresa.

### Compartilhamento com Stakeholders
Envie o manual completo para gestores, consultores ou parceiros.

## Comparação: PDF Individual vs PDF em Massa

| Característica | PDF Individual | PDF em Massa |
|----------------|----------------|--------------|
| Processos incluídos | 1 | Todos |
| Capa personalizada | Não | Sim |
| Sumário | Não | Sim |
| Organização por categoria | Não | Sim |
| Divisórias | Não | Sim |
| Página final | Não | Sim |
| Tempo de geração | ~3-5s | ~10-30s |
| Tamanho do arquivo | Pequeno | Médio a Grande |

## Troubleshooting

### "Nenhum processo para exportar"
**Problema**: Você não tem processos criados.
**Solução**: Crie pelo menos um processo antes de exportar.

### PDF não baixa
**Problema**: Navegador bloqueou o download ou houve erro na geração.
**Solução**: 
- Verifique se pop-ups estão permitidos
- Tente novamente
- Use outro navegador
- Verifique o console para erros

### Fluxogramas não aparecem
**Problema**: Os fluxogramas Mermaid não foram renderizados.
**Solução**: 
- Aguarde mais tempo (o sistema tem timeout)
- Verifique se os processos têm etapas definidas
- Recarregue a página e tente novamente

### Demora muito para gerar
**Problema**: Muitos processos ou sistema lento.
**Solução**: 
- Seja paciente, o processo pode levar até 30s para 20+ processos
- Feche outras abas do navegador
- Exporte em horários de menos uso do sistema

## Futuras Melhorias

Recursos planejados para versões futuras:
- [ ] Seleção de processos específicos para exportar
- [ ] Opções de formatação (orientação, margens, etc.)
- [ ] Inclusão de anexos e imagens
- [ ] Exportação para outros formatos (DOCX, HTML)
- [ ] Marcas d'água personalizadas
- [ ] Numeração de páginas customizável
- [ ] Índice remissivo
- [ ] Glossário de termos técnicos

## Recursos Relacionados

- [PDF_GUIDE.md](./PDF_GUIDE.md) - Guia de exportação de PDFs individuais
- [FLOWCHART_GUIDE.md](./FLOWCHART_GUIDE.md) - Guia de criação de fluxogramas
- Configurações > Branding - Personalize logo e cores

## Suporte

Para problemas ou sugestões relacionadas à exportação em massa:
1. Verifique este guia primeiro
2. Consulte os logs do console do navegador
3. Entre em contato com o suporte técnico
