# 🗺️ Mapa de Rotas - Máquina de Processos

## Rotas Públicas

Acessíveis sem autenticação.

### `/` - Landing Page
- **Componente**: `LandingPage`
- **Layout**: Sem layout (controle total)
- **Descrição**: Página inicial do produto
- **Seções**:
  - Hero com CTA
  - Como funciona (3 passos)
  - Funcionalidades (grid 2x3)
  - Pricing (resumido)
  - Footer
- **CTAs principais**:
  - "Começar Grátis" → `/register`
  - "Entrar" → `/login`
  - "Ver Como Funciona" → scroll ou vídeo

### `/login` - Página de Login
- **Componente**: `LoginPage`
- **Layout**: Split screen (imagem + form)
- **Descrição**: Autenticação de usuários
- **Campos**:
  - Email
  - Senha (com toggle show/hide)
  - Checkbox "Lembrar de mim"
  - Link "Esqueceu a senha?"
- **Ações**:
  - Entrar → `/dashboard`
  - Entrar com Google (simulado)
  - "Cadastre-se" → `/register`
- **Comportamento**: Se já autenticado, redireciona para `/dashboard`

### `/register` - Página de Registro
- **Componente**: `RegisterPage`
- **Layout**: Split screen (imagem + form)
- **Descrição**: Criação de nova conta
- **Campos**:
  - Nome completo
  - Email
  - Senha (com indicador de força)
  - Confirmar senha
  - Checkbox termos e privacidade
- **Ações**:
  - Criar conta → `/dashboard`
  - Cadastrar com Google (simulado)
  - "Já tem conta?" → `/login`
- **Comportamento**: Se já autenticado, redireciona para `/dashboard`

### `/pricing` - Planos e Preços
- **Componente**: `PricingPage`
- **Layout**: 
  - Sem auth: Sem layout
  - Com auth: `SimpleAuthLayout` (navbar sem sidebar)
- **Descrição**: Comparação de planos
- **Seções**:
  - Toggle Mensal/Anual
  - Cards dos 4 planos
  - Tabela comparativa completa
  - FAQ (accordion)
  - CTA final
- **Acessível**: Público e autenticado

---

## Rotas Protegidas

Requerem autenticação. Redirecionam para `/login` se não autenticado.

### `/dashboard` - Dashboard Principal
- **Componente**: `DashboardPage`
- **Layout**: `AuthLayout` (navbar + sidebar)
- **Descrição**: Visão geral da conta
- **Seções**:
  - Card de boas-vindas com CTA criar
  - 4 cards de estatísticas
  - Lista de processos recentes (últimos 6)
  - Templates sugeridos (3 cards)
- **Proteção**: `requireAuth()`

### `/process/new` - Criar Processo (Chatbot)
- **Componente**: `CreateProcessPage`
- **Layout**: Fullscreen (sem sidebar)
- **Descrição**: Interface conversacional para criar SOP
- **Fluxo**:
  1. Nome do processo
  2. Categoria (quick replies)
  3. Etapas (textarea multi-linha)
  4. Responsável
  5. Equipamentos
  6. Segurança
  7. Normas
  8. Geração (loading 3s)
  9. Concluído → `/process/:id/view`
- **Features**:
  - Progress bar (pergunta X de 7)
  - Typing indicators
  - Auto-focus em inputs
  - Enter para enviar
  - Botão "Voltar" para editar resposta anterior
- **Proteção**: `requireAuth()`

### `/process/:id/edit` - Editor de Processo
- **Componente**: `ProcessEditorPage`
- **Layout**: Fullscreen com toolbar + sidebar
- **Descrição**: Editor completo de SOP
- **URL Params**: `id` - ID do processo
- **Toolbar**:
  - Breadcrumb
  - Nome editável inline
  - Badge de versão
  - Botões: Salvar, Exportar, Publicar
  - Toggle: Cards / Fluxograma
- **Canvas**:
  - Modo Cards: Lista vertical drag & drop
  - Modo Fluxograma: Visualização Mermaid
- **Sidebar Direita**:
  - Detalhes (categoria, datas)
  - Metadados ISO 9001
  - Tags
- **FAB**: Adicionar etapa (floating action button)
- **Proteção**: `requireAuth()`, redireciona se processo não existe

### `/process/:id/view` - Visualizar SOP
- **Componente**: `ProcessViewPage`
- **Layout**: `AuthLayout`
- **Descrição**: Preview do documento formatado
- **URL Params**: `id` - ID do processo
- **Toolbar**:
  - Breadcrumb
  - Título do processo
  - Botões: Editar, Compartilhar, Exportar PDF
- **Preview**:
  - Documento estilo ISO 9001
  - 8 seções formatadas
  - Com branding aplicado
- **Proteção**: `requireAuth()`, redireciona se processo não existe

### `/processes` - Biblioteca de Processos
- **Componente**: `ProcessLibraryPage`
- **Layout**: `AuthLayout`
- **Descrição**: Lista completa de SOPs
- **Features**:
  - Busca por nome/tags
  - Filtro por status (chips clicáveis)
  - Filtro por categoria (dropdown)
  - Ordenação (dropdown)
  - Grid responsivo (1/2/3 colunas)
- **Cards**:
  - Ações: Ver, Editar
  - Menu: Exportar, Duplicar, Histórico, Arquivar, Excluir
- **Empty State**: Quando não há resultados
- **Proteção**: `requireAuth()`

### `/settings/branding` - Configurações de Branding
- **Componente**: `BrandingSettingsPage`
- **Layout**: `AuthLayout`
- **Descrição**: Personalização visual dos PDFs
- **Tabs**:
  - Branding (ativo)
  - Empresa (placeholder)
  - Segurança (placeholder)
- **Conteúdo**:
  - Card do plano atual
  - Upload de logo (Pro+, com lock)
  - Cores da marca (Básico+, com lock)
  - Nome da empresa (todos)
  - Preview em tempo real
- **Ações**: Salvar, Redefinir
- **Proteção**: `requireAuth()`

---

## Rotas Dinâmicas

### Pattern: `/process/:id/*`

**Parsing**:
```typescript
// View
const viewMatch = currentRoute.match(/^\/process\/(.+)\/view$/);
const processId = viewMatch[1];

// Edit
const editMatch = currentRoute.match(/^\/process\/(.+)\/edit$/);
const processId = editMatch[1];
```

**Validação**:
- Verifica se processo existe
- Se não, redireciona para `/processes`

**Exemplos válidos**:
- `/process/abc123/view`
- `/process/xyz789/edit`

---

## Fluxo de Navegação

### Onboarding (Novo Usuário)

```
/ (Landing)
  → /register
    → /dashboard
      → /process/new
        → /process/:id/view
          → /process/:id/edit
```

### Usuário Retornando

```
/ (Landing)
  → /login
    → /dashboard
      → /processes
        → /process/:id/view
```

### Edição de Processo

```
/processes (ou /dashboard)
  → Click "Editar"
    → /process/:id/edit
      → Click "Salvar" (permanece)
      → Click breadcrumb → /processes
```

### Personalização

```
/dashboard
  → Sidebar "Configurações"
    → /settings/branding
      → Upload logo
      → Escolher cores
      → Salvar
      → Sidebar "Meus Processos"
        → /processes
```

---

## Redirecionamentos

### Automáticos

| De | Para | Condição |
|---|---|---|
| `/login` | `/dashboard` | Já autenticado |
| `/register` | `/dashboard` | Já autenticado |
| Qualquer rota protegida | `/login` | Não autenticado |
| `/process/:id/*` (inválido) | `/processes` | Processo não existe |
| Rota não encontrada (logado) | `/dashboard` | 404 |
| Rota não encontrada (público) | `/` | 404 |

### Manuais (via navegação)

| Origem | Destino | Trigger |
|---|---|---|
| Qualquer | `/dashboard` | Click logo |
| `/process/:id/view` | `/process/:id/edit` | Botão "Editar" |
| `/process/:id/edit` | `/processes` | Breadcrumb |
| Qualquer | `/process/new` | Botão "Criar Novo" |
| Qualquer | `/pricing` | Link "Plano" ou "Upgrade" |

---

## State e Persistência

### Por Rota

| Rota | State Local | localStorage |
|---|---|---|
| `/process/new` | Respostas do chat, step atual | ❌ |
| `/process/:id/edit` | Processo sendo editado | ✅ (ao salvar) |
| `/processes` | Filtros, busca | ❌ |
| `/settings/branding` | Branding editado | ✅ (ao salvar) |
| Todas protegidas | User | ✅ (sempre) |

### Keys no localStorage

- `mp_user` - Usuário autenticado
- `mp_processes` - Array de processos
- `mp_branding` - Configurações de branding

---

## Query Params

**Nota**: Atualmente não utiliza query params, mas poderia ser implementado:

### Sugestões Futuras

```
/processes?status=complete&category=maintenance&search=troca
/pricing?plan=professional&billing=annual
/process/:id/view?preview=true
```

---

## Anchor Links

### Landing Page

```
/#funcionalidades → Scroll para seção
/#precos → Scroll para pricing
```

---

## Proteção de Rotas

### Implementação

```typescript
const requireAuth = (component: React.ReactNode) => {
  if (!user) {
    return <LoginPage onNavigate={navigate} onLogin={handleLogin} />;
  }
  return component;
};
```

### Rotas Públicas
- `/`
- `/login`
- `/register`
- `/pricing` (também acessível logado)

### Rotas Protegidas (requerem auth)
- `/dashboard`
- `/process/new`
- `/process/:id/edit`
- `/process/:id/view`
- `/processes`
- `/settings/branding`

---

## Breadcrumbs

### Padrões por Rota

```
/dashboard
→ Início

/processes
→ Meus Processos

/process/:id/view
→ Meus Processos > [Nome do Processo]

/process/:id/edit
→ Meus Processos > [Nome do Processo]

/settings/branding
→ Configurações > Branding
```

---

## Deep Links

Possíveis URLs para compartilhamento:

```
/process/abc123/view?share=token
  → Visualização pública com token

/pricing?ref=dashboard
  → Pricing com contexto de origem

/register?plan=professional
  → Registro direto em plano específico
```

**Status**: Não implementado (futuro)

---

## SEO e Meta Tags

Cada rota deveria ter (não implementado):

```tsx
<head>
  <title>Criar Processo | Máquina de Processos</title>
  <meta name="description" content="..." />
  <meta property="og:title" content="..." />
  <meta property="og:description" content="..." />
</head>
```

---

**Última atualização**: 2025-10-25
