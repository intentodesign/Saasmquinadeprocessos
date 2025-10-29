# Guia de Onboarding - Máquina de Processos

## Visão Geral

O sistema de onboarding foi projetado para dar boas-vindas calorosas aos novos usuários através de uma experiência interativa e personalizada com o Rô Bot, o assistente virtual da Máquina de Processos.

## Fluxo de Onboarding

### 1. Registro
Quando um usuário se registra pela primeira vez, ele é automaticamente redirecionado para a página de onboarding.

### 2. Entrevista com o Rô Bot

O Rô Bot conduz uma conversa amigável para coletar informações essenciais:

**Passo 1: Nome do Usuário**
- O Rô Bot se apresenta de forma amigável
- Solicita o nome do usuário
- Usa o nome nas mensagens seguintes para personalização

**Passo 2: Nome da Empresa**
- Pergunta o nome da oficina/empresa
- Armazena para uso no branding

**Passo 3: Logotipo (Opcional)**
- Oferece a opção de fazer upload do logotipo
- Permite pular esta etapa
- Preview do logo antes de confirmar
- Opção de remover e escolher outro

**Passo 4: Cores da Marca (Opcional)**
- Pergunta se o usuário quer personalizar as cores
- Oferece seletores de cor para:
  - Cor Primária (padrão: #2563eb)
  - Cor Secundária (padrão: #0ea5e9)
- Permite usar cores padrão

### 3. Tutorial Interativo

Após completar a entrevista, o usuário é conduzido por um tour guiado que destaca:

1. **Boas-vindas** - Apresentação do sistema
2. **Menu Lateral** - Navegação principal
3. **Criar Processo** - Botão para novo POP
4. **Biblioteca** - Onde ficam os processos
5. **Configurações** - Personalização
6. **Começar** - Incentivo para criar o primeiro processo

O tutorial usa:
- Spotlight visual destacando elementos
- Tooltips animados com Motion
- Barra de progresso
- Opção de pular a qualquer momento

## Atributos Data-Tour

Para o tutorial funcionar, os seguintes elementos têm atributos `data-tour`:

- `data-tour="sidebar"` - Menu lateral completo
- `data-tour="create-button"` - Botão "Criar Novo"
- `data-tour="processes-section"` - Seção de processos
- `data-tour="settings"` - Configurações

## Arquivos Criados/Modificados

### Novos Arquivos
- `/pages/OnboardingPage.tsx` - Página de entrevista com Rô Bot
- `/components/TutorialTour.tsx` - Componente de tour guiado
- `/ONBOARDING_GUIDE.md` - Este guia

### Arquivos Modificados
- `/lib/types.ts` - Adicionados campos `onboardingCompleted` e `tutorialCompleted`
- `/lib/store.ts` - Funções para atualizar status de onboarding/tutorial
- `/App.tsx` - Integração do fluxo de onboarding
- `/components/Sidebar.tsx` - Adicionados atributos `data-tour`
- `/pages/DashboardPage.tsx` - Adicionado atributo `data-tour`

## Personalização do Rô Bot

O Rô Bot tem uma personalidade amigável e prestativa:
- Usa emojis para ser mais expressivo
- Fala de forma casual e acolhedora
- É paciente e oferece opções de pular etapas
- Celebra conquistas do usuário

### Avatar do Rô Bot
- Imagem localizada em: `figma:asset/3ce1fcf49c42071cc6f620793c7f8efc928aef2c.png`
- Aparece na entrevista e pode ser usado em outras interações

## Como Testar

1. **Novo Registro:**
   - Crie uma nova conta
   - Será redirecionado automaticamente para onboarding
   - Complete ou pule etapas conforme desejado

2. **Forçar Onboarding:**
   - Navegue para `/onboarding` manualmente
   - Apenas usuários logados podem acessar

3. **Usuário Existente:**
   - Usuários com `onboardingCompleted: true` não veem o onboarding novamente
   - Tutorial só aparece se `tutorialCompleted: false`

## Armazenamento

Todas as informações coletadas são salvas em:
- **User:** Nome, empresa, flags de onboarding/tutorial
- **Branding:** Logo, cores primária e secundária, nome da empresa

## Funcionalidades Futuras

Quando integrado com Supabase:
- Salvar progresso do onboarding
- Permitir refazer tutorial
- Analytics de conclusão
- Personalização de mensagens do Rô Bot
- RAG para contexto personalizado do chatbot

## Suporte

Para questões sobre o onboarding, consulte:
- Este guia
- `/lib/store.ts` para lógica de dados
- `/pages/OnboardingPage.tsx` para fluxo de entrevista
- `/components/TutorialTour.tsx` para tour guiado
