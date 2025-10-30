# 📋 HANDOFF - Máquina de Processos

**Data:** 30 de Outubro de 2025 (Última atualização: 19:30 UTC)
**Desenvolvido por:** Claude (Sonnet 4.5)
**Para:** Próxima IA que continuar o projeto

---

## ✅ PROBLEMA RESOLVIDO - 30/10/2025 18:45

### ✅ BUILD ATUALIZADO E DEPLOYADO COM SUCESSO

**O QUE FOI FEITO:**
1. ✅ Build limpo regenerado do zero (removido build antigo completamente)
2. ✅ Comprimido e enviado via SCP para Digital Ocean
3. ✅ Substituído no servidor (`/var/www/maquina-processos/build/`)
4. ✅ Container do Caddy reiniciado (`docker restart n8n-docker-caddy-caddy-1`)
5. ✅ Cache HTTP limpo - site servindo versão atualizada

**SOLUÇÃO DO CACHE:**
- `pkill -HUP caddy` apenas recarrega config, **NÃO limpa cache HTTP**
- `docker restart n8n-docker-caddy-caddy-1` foi necessário para limpar cache de assets estáticos
- Hash dos arquivos JS mudou de `index-D7qyqbqj.js` → `index-DkVyFTt8.js`

---

## 🎨 NOVA FUNCIONALIDADE - Fluxograma V3 (30/10/2025 19:30)

### ✨ EDITOR DE FLUXOGRAMA COMPLETAMENTE REFATORADO

**O QUE FOI IMPLEMENTADO:**

#### Visual Limpo e Profissional:
- ✅ Cores fixas e consistentes:
  - **Verde (#10b981):** Início e Fim
  - **Azul (#3b82f6):** Processos
  - **Laranja (#f97316):** Decisões
  - **Roxo (#8b5cf6):** Entrada/Saída
  - **Cinza (#9ca3af):** Documentos
- ✅ Bordas finas (1.5px), sem sombras excessivas
- ✅ Fundo branco com grid sutil
- ✅ Início/Fim como retângulos arredondados verdes (não mais círculos)
- ✅ Indicação visual de seleção (borda azul de 3px)

#### Funcionalidades Avançadas:
1. **Conexões Editáveis:**
   - Arraste dos handles (bolinhas) para criar conexões customizadas
   - Suporte a ramificações múltiplas em decisões
   - Losangos de decisão com 2 handles de saída (Sim/Não)
   - Conexões preservadas ao arrastar etapas

2. **Painel de Edição Lateral:**
   - Clique em qualquer etapa para abrir painel de edição
   - Edite: nome, tipo, descrição, responsável, duração, avisos
   - Animação suave de slide-in
   - Salvar sincroniza com processo

3. **Sistema de Undo/Redo:**
   - Histórico de até 50 estados
   - Botões de desfazer (Ctrl+Z) e refazer (Ctrl+Y)
   - Funciona para edições, conexões e remoções

4. **Usabilidade:**
   - Snap to grid (15x15px) para alinhamento
   - Botão de remover etapa selecionada
   - Minimapa mostrando todas conexões
   - Tooltips e instruções em português
   - Controles de zoom e pan

**Arquivo Criado:**
- `src/components/DragDropFlowchartV3.tsx` (novo componente)
- `src/components/FlowchartEditor.tsx` (atualizado para usar V3)

**Commit:**
- Hash: `4a9eae1c`
- Mensagem: "feat: Implementar fluxograma V3 com visual limpo e funcionalidades avançadas"

**Deploy:**
- ✅ Build gerado e deployado
- ✅ Hash atualizado: `index-DxEgcx_s.js`
- ✅ Site em produção com nova versão

---

## 🚨 PROBLEMA ANTERIOR - 30/10/2025 17:10 (RESOLVIDO)

### ❌ PROBLEMA: BUILD NÃO DEPLOYADO CORRETAMENTE

**O QUE ACONTECEU:**
1. ✅ Implementei correções no onboarding e chat (código fonte correto)
2. ✅ Fiz commits no GitHub (branch main)
3. ❌ Build enviado pro Digital Ocean estava DESATUALIZADO
4. ❌ Usuário continuava vendo versão antiga (problema de cache)
5. ❌ Tentei resolver via GitHub Actions mas site DEVE ficar no Digital Ocean

**CÓDIGO FONTE:**
- **Localização:** `C:\Users\bielg\AppData\Local\Temp\Saasmquinadeprocessos\`
- **GitHub:** `https://github.com/intentodesign/Saasmquinadeprocessos.git`
- **Branch:** main
- **Último commit:** `c877b555` - "fix: Adicionar chmod para vite no workflow"
- **Status:** ✅ CÓDIGO CORRETO COM TODAS AS ALTERAÇÕES

**SERVIDOR (Digital Ocean - 157.245.227.227):**
- **Caminho:** `/var/www/maquina-processos/build/`
- **Status:** ✅ BUILD ATUALIZADO (COM todas as correções do onboarding)
- **Cache:** ✅ LIMPO (Caddy servindo versão correta)

### 🔧 PROCESSO DE DEPLOY UTILIZADO (PARA REFERÊNCIA FUTURA):

```bash
# 1. Ir pro diretório do projeto
cd "C:\Users\bielg\AppData\Local\Temp\Saasmquinadeprocessos"

# 2. Limpar build antigo
rm -rf build

# 3. Fazer novo build
npm run build

# 4. Comprimir
tar -czf build.tar.gz build/

# 5. Enviar pro Digital Ocean
scp build.tar.gz root@157.245.227.227:/var/www/maquina-processos/

# 6. Conectar no servidor e descomprimir
ssh root@157.245.227.227
cd /var/www/maquina-processos
rm -rf build
tar -xzf build.tar.gz
rm build.tar.gz

# 7. CRÍTICO: Reiniciar container do Caddy (limpa cache HTTP)
docker restart n8n-docker-caddy-caddy-1
# NOTA: pkill -HUP apenas recarrega config, NÃO limpa cache!
```

**IMPORTANTE:**
- ❌ NÃO usar GitHub Actions pra deploy
- ❌ NÃO deployar no GitHub Pages
- ✅ Deploy é MANUAL no Digital Ocean via SCP
- ✅ Site em produção: https://maquina.intentomarcas.com.br

### 📝 ALTERAÇÕES IMPLEMENTADAS (30/10/2025):

1. **Onboarding melhorado:**
   - Bot pergunta "Primeiro, me conta: qual é o seu nome?" como mensagem
   - Botões grandes "✓ Sim, quero adicionar!" / "Pular esta etapa"
   - Botões de cores "✓ Sim, personalizar!" / "Usar cores padrão"
   - Janela de cores fecha corretamente após confirmação

2. **Chat do Rô Bot personalizado:**
   - Apresentação: `"Olá, [NOME]! 👋 Sou o Rô Bot, assistente da [EMPRESA]!"`
   - Envia `userName` e `companyName` pro N8N em cada mensagem

3. **Tour de interface corrigido:**
   - Z-index aumentado (99998/99999/100000)
   - Popup sempre visível sobre outros elementos

4. **Editor de processos:**
   - Dropdown de tipos (Processo, Decisão, Entrada/Saída, Documento)
   - Badge visual colorido mostrando tipo de cada etapa
   - Tipo `subprocess` agora renderiza como processo normal

5. **Fluxograma:**
   - Labels "Sim" nos conectores que saem de decisões
   - Botão "Exportar PNG" com html2canvas

6. **Performance:**
   - Code splitting otimizado (7 chunks de vendors)
   - Bundle dividido: react, flow, mermaid, ui, motion, pdf, utils

**Arquivos modificados:**
- `src/pages/OnboardingPage.tsx` - Mensagens e botões
- `src/pages/CreateProcessPage.tsx` - Apresentação personalizada
- `src/components/TutorialTour.tsx` - Z-index corrigido
- `src/components/ProcessStepsEditor.tsx` - Dropdown de tipos
- `src/components/DragDropFlowchartV2.tsx` - Labels e remoção subprocess
- `src/components/FlowchartEditor.tsx` - Exportação PNG
- `vite.config.ts` - Code splitting
- `src/App.tsx` - Props user e branding no CreateProcessPage

---

## 🎯 RESUMO DO QUE FOI FEITO

### Nova Interface Drag-and-Drop Estilo Mermaid

Implementamos uma interface visual de fluxograma com formas diferentes para cada tipo de etapa:

**Tipos de Etapa Implementados:**
- 🔵 **process** (Processo Normal) → Retângulo azul
- 🔶 **decision** (Decisão) → Losango laranja (rotacionado 45°)
- 🟣 **io** (Entrada/Saída) → Paralelogramo roxo (skewed)
- 🟢 **document** (Documento) → Forma de papel verde (com curva embaixo)
- 🔷 **subprocess** (Subprocesso) → Retângulo com borda dupla ciano
- ⚪ **start/end** → Círculos verdes

### Arquivos Criados/Modificados:

1. **`src/components/DragDropFlowchartV2.tsx`** (NOVO - 647 linhas)
   - Componente principal com ReactFlow
   - Implementa todas as formas visuais
   - Sistema de tooltips para detalhes
   - Blocos limpos (só ícone + nome)
   - Setas conectando etapas

2. **`src/lib/types.ts`** (MODIFICADO)
   ```typescript
   export type StepType = 'process' | 'decision' | 'io' | 'document' | 'subprocess';

   export interface ProcessStep {
     id: string;
     title: string;
     description: string;
     type?: StepType; // NOVO CAMPO
     responsible?: string;
     duration?: string;
     warning?: string;
     order: number;
   }
   ```

3. **`src/components/FlowchartEditor.tsx`** (MODIFICADO)
   - Atualizado import para usar DragDropFlowchartV2
   ```typescript
   import { DragDropFlowchartV2 as DragDropFlowchart } from './DragDropFlowchartV2';
   ```

4. **`PROMPT_RO_BOT_COM_TIPOS.md`** (NOVO)
   - Prompt atualizado do Rô Bot
   - Ensina identificação automática de tipos de etapa
   - Baseado em palavras-chave

5. **`vite.config.ts`** (MODIFICADO)
   - Corrigido `base: '/'` para deploy em domínio dedicado

---

## 🔴 TAREFA PENDENTE CRÍTICA

### ⚠️ ATUALIZAR PROMPT DO RÔ BOT NO N8N

**STATUS:** ❌ NÃO FEITO - PRECISA SER FEITO MANUALMENTE

**O que fazer:**

1. Acessar: https://n8n.intentomarcas.com.br
2. Abrir o workflow do Rô Bot (chatbot de documentação de processos)
3. Encontrar o nó "Agent" ou "AI Agent"
4. Editar o campo **"System Message"** ou **"System Prompt"**
5. Substituir o prompt antigo pelo conteúdo do arquivo: `PROMPT_RO_BOT_COM_TIPOS.md`
6. Salvar e ativar o workflow

**Por que é importante:**
Sem essa atualização, o Rô Bot não vai identificar os tipos de etapa automaticamente no JSON retornado. Os fluxogramas continuarão funcionando, mas todas as etapas serão renderizadas como retângulos azuis (tipo padrão).

**Localização do prompt:** `/tmp/Saasmquinadeprocessos/PROMPT_RO_BOT_COM_TIPOS.md`

---

## 🏗️ ARQUITETURA DO COMPONENTE

### DragDropFlowchartV2.tsx

**Estrutura de Dados:**

```typescript
const STEP_STYLES = {
  process: {
    gradient: 'from-blue-500 to-blue-600',
    icon: Settings,
    shape: 'rectangle',
    color: '#3b82f6'
  },
  decision: {
    gradient: 'from-orange-500 to-orange-600',
    icon: AlertTriangle,
    shape: 'diamond',
    color: '#f97316'
  },
  // ... outros tipos
};
```

**Como as Formas São Renderizadas:**

1. **Losango (Decision):**
   - CSS: `transform: rotate(45deg)`
   - Conteúdo interno: `transform: -rotate(45deg)` (contra-rotação)

2. **Paralelogramo (IO):**
   - CSS: `clipPath: polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)`

3. **Documento (Document):**
   - CSS: `borderRadius` no topo + curva no bottom usando clip-path

4. **Retângulo Duplo (Subprocess):**
   - CSS: `border-4 border-double`

**Tooltips:**
- Aparecem ao passar mouse sobre os blocos
- Mostram: responsável, duração, avisos
- Mantém interface limpa

**ReactFlow:**
- Biblioteca: `@xyflow/react`
- Controles de zoom/pan incluídos
- Drag-and-drop para reordenar etapas
- Atualiza `onStepsChange` callback

---

## 📊 COMO O RÔ BOT IDENTIFICA TIPOS

### Palavras-Chave por Tipo:

**decision (Decisão):**
- verificar, conferir, checar, validar, avaliar, inspecionar, revisar, analisar
- Exemplo: "Verificar nível do óleo" → `type: "decision"`

**io (Entrada/Saída):**
- receber, enviar, registrar, anotar, preencher, consultar, buscar
- Exemplo: "Receber ordem de serviço" → `type: "io"`

**document (Documento):**
- gerar, emitir, assinar, arquivar, imprimir, escanear
- Exemplo: "Gerar relatório" → `type: "document"`

**subprocess (Subprocesso):**
- executar processo de, seguir POP, realizar procedimento
- Exemplo: "Executar processo de calibração" → `type: "subprocess"`

**process (Padrão):**
- Qualquer ação que não se encaixe nas categorias acima
- Exemplo: "Apertar parafuso" → `type: "process"`

---

## 🚀 ESTADO DO DEPLOY

### ✅ Funcionando:
- Site no ar: https://maquina.intentomarcas.com.br
- Build completo atualizado
- Base path corrigido (`/` ao invés de `/Saasmquinadeprocessos/`)
- Caddy servindo arquivos corretamente

### Configuração do Servidor:

**Servidor:** Digital Ocean Droplet
**IP:** 157.245.227.227
**Usuário:** root
**Caminho:** `/var/www/maquina-processos`

**Caddy Config:**
```caddyfile
maquina.intentomarcas.com.br {
    root * /var/www/maquina-processos/build
    encode gzip
    file_server
    try_files {path} /index.html
}
```

**Como fazer deploy:**
```bash
ssh root@157.245.227.227
cd /var/www/maquina-processos
git pull origin main
npm run build
docker restart n8n-docker-caddy-caddy-1
```

---

## 🔧 COMO CONTINUAR O DESENVOLVIMENTO

### Setup Local:

```bash
cd /tmp/Saasmquinadeprocessos
npm install
npm run dev  # Abre em http://localhost:3000
```

### Estrutura de Pastas:

```
/tmp/Saasmquinadeprocessos/
├── src/
│   ├── components/
│   │   ├── DragDropFlowchartV2.tsx    # Novo componente visual
│   │   ├── FlowchartEditor.tsx         # Container do editor
│   │   └── MermaidFlowchart.tsx        # Visualização estática
│   └── lib/
│       └── types.ts                    # Definições de tipos
├── DOCS_PROJETO/                       # Esta pasta de docs
├── PROMPT_RO_BOT_COM_TIPOS.md         # Prompt do bot
└── vite.config.ts                      # Config do Vite
```

### Git:

- **Repositório:** https://github.com/intentodesign/Saasmquinadeprocessos
- **Branch:** main
- **Último commit:** `ebfca299` (fix: Corrigir base path)

---

## 🎨 MELHORIAS SUGERIDAS

### Curto Prazo:

1. **Adicionar tipos de etapa na UI do editor**
   - Dropdown para escolher tipo manualmente
   - Localização: Formulário de adição/edição de etapa

2. **Validação de tipos**
   - Garantir que tipos inválidos caiam para 'process'
   - Adicionar fallback no componente

3. **Testes automatizados**
   - Testar renderização de cada tipo de forma
   - Testar identificação automática de tipos

### Médio Prazo:

1. **Conectores condicionais**
   - Decisões com duas saídas (Sim/Não)
   - Implementar ramificações

2. **Exportar como imagem**
   - PNG/SVG do fluxograma
   - Usar html2canvas ou similar

3. **Templates de processo**
   - Processos pré-definidos comuns
   - Sistema de bibliotecas

### Longo Prazo:

1. **Subprocessos aninhados**
   - Clicar em subprocess abre outro fluxo
   - Navegação hierárquica

2. **Versionamento de processos**
   - Histórico de alterações
   - Diff visual entre versões

3. **Colaboração em tempo real**
   - WebSockets
   - Múltiplos usuários editando

---

## 🐛 PROBLEMAS CONHECIDOS

### 1. Node.js v18 no servidor (warning)
**Problema:** Pacote `marked@16.4.1` requer Node.js >= 20
**Impacto:** Apenas warning, não quebra funcionalidade
**Solução futura:** Atualizar Node.js no servidor

### 2. Chunks grandes (warning)
**Problema:** `index-xxx.js` tem 1.3MB (> 500KB)
**Impacto:** Carregamento inicial mais lento
**Solução futura:** Code splitting com dynamic imports

### 3. Permissões do Vite no servidor
**Problema:** `vite: Permission denied` no build
**Solução aplicada:** `chmod +x node_modules/.bin/vite`
**Nota:** Pode precisar repetir após `npm install`

---

## 📚 DOCUMENTAÇÃO TÉCNICA

### Dependências Principais:

```json
{
  "@xyflow/react": "^12.3.5",      // ReactFlow para fluxogramas
  "react": "^19.0.0",              // Framework
  "lucide-react": "^0.487.0",      // Ícones
  "tailwindcss": "^4.0.0",         // CSS
  "framer-motion": "^12.0.0",      // Animações
  "mermaid": "^11.4.1"             // Visualização alternativa
}
```

### APIs Importantes:

**ReactFlow:**
- `<ReactFlow nodes={nodes} edges={edges} />` - Componente principal
- `useNodesState`, `useEdgesState` - Hooks de estado
- `Controls`, `Background` - Componentes auxiliares

**Tipos TypeScript:**
```typescript
Node<{
  label: string;
  type: StepType;
  step: ProcessStep;
}>
```

---

## 💬 CONTEXTO DO USUÁRIO

### Preferências de Comunicação:
- Tom informal e direto
- Sem enrolação ou elogios excessivos
- Respostas objetivas e práticas
- Documentação concisa, não extensa

### O que o Usuário Valoriza:
- Eficiência (não desperdiçar tokens)
- Clareza técnica
- Soluções que funcionam na primeira tentativa
- Código limpo e bem estruturado

### O que Evitar:
- Documentação excessiva não solicitada
- Explicações muito detalhadas quando não pedidas
- Assumir coisas que o usuário não confirmou
- Elogios ou suavizações desnecessárias

---

## ✅ CHECKLIST DE CONTINUAÇÃO

Quando retomar o projeto, verifique:

- [ ] Prompt do Rô Bot atualizado no N8N?
- [ ] Servidor acessível via SSH?
- [ ] Build funcionando localmente?
- [ ] Git pull funcionando sem conflitos?
- [ ] Tipos de etapa sendo identificados corretamente no chat?

---

## 📞 INFORMAÇÕES DE ACESSO

### Servidor:
- **Host:** 157.245.227.227
- **Usuário:** root
- **Senha:** (usuário sabe)

### Domínios:
- **App:** https://maquina.intentomarcas.com.br
- **N8N:** https://n8n.intentomarcas.com.br

### GitHub:
- **Repo:** https://github.com/intentodesign/Saasmquinadeprocessos
- **Branch principal:** main

---

## 🎓 APRENDIZADOS DESTA SESSÃO

### O que funcionou bem:
1. Implementação de formas CSS com transform/clip-path
2. Sistema de tipos automático baseado em palavras-chave
3. Interface limpa com tooltips para detalhes
4. Deploy automatizado via git pull + build

### Desafios superados:
1. Base path incorreto do Vite quebrava módulos
2. Permissões do vite no servidor
3. Estrutura de 24k+ arquivos no git (incluindo node_modules)

### Decisões de Design:
1. **Por que ReactFlow?** Robusto, bem mantido, drag-and-drop nativo
2. **Por que não Cytoscape?** Mais pesado, API mais complexa
3. **Por que CSS transforms?** Mais performático que SVG para shapes simples
4. **Por que tooltips?** Mantém interface limpa sem sacrificar informação

---

## 🔥 INÍCIO RÁPIDO PARA PRÓXIMA IA

```bash
# 1. Acesse o projeto
cd /tmp/Saasmquinadeprocessos

# 2. Veja últimos commits
git log --oneline -5

# 3. Rode localmente
npm run dev

# 4. Leia este arquivo completo
cat DOCS_PROJETO/README_HANDOFF.md

# 5. Verifique o prompt do bot
cat PROMPT_RO_BOT_COM_TIPOS.md

# 6. Abra o componente principal
# Arquivo: src/components/DragDropFlowchartV2.tsx

# 7. TAREFA PRINCIPAL PENDENTE:
# Atualizar prompt no N8N manualmente
# (não pode ser feito via código)
```

---

**Última atualização:** 30 de Outubro de 2025, 19:30 UTC
**Versão do código:** commit `4a9eae1c`
**Deploy:** ✅ Funcionando em produção com Fluxograma V3

**Boa sorte! 🚀**
