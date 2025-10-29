# Guia de Contribuição

## 📁 Estrutura do Projeto

```
/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes shadcn/ui
│   ├── Navbar.tsx      # Navegação superior
│   ├── Sidebar.tsx     # Menu lateral
│   ├── ProcessCard.tsx # Card de processo
│   ├── EmptyState.tsx  # Estado vazio
│   └── ConfirmDialog.tsx # Diálogo de confirmação
│
├── pages/              # Páginas da aplicação
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── CreateProcessPage.tsx
│   ├── ProcessEditorPage.tsx
│   ├── ProcessLibraryPage.tsx
│   ├── ProcessViewPage.tsx
│   ├── BrandingSettingsPage.tsx
│   └── PricingPage.tsx
│
├── lib/                # Utilitários e tipos
│   ├── types.ts        # Tipos TypeScript
│   ├── store.ts        # Gerenciamento de estado (localStorage)
│   └── utils.ts        # Funções auxiliares
│
├── styles/             # Estilos globais
│   └── globals.css     # CSS global com Tailwind
│
└── App.tsx             # Componente raiz com rotas
```

## 🎨 Padrões de Código

### Componentes

```tsx
// Sempre use TypeScript com interfaces para props
interface MyComponentProps {
  title: string;
  onAction: () => void;
  optional?: boolean;
}

export function MyComponent({ title, onAction, optional }: MyComponentProps) {
  return (
    <div className="p-4">
      <h2>{title}</h2>
      {/* ... */}
    </div>
  );
}
```

### Cores

Use sempre as cores do design system definidas:

```tsx
// ❌ Não fazer
<div className="bg-blue-500">

// ✅ Fazer  
<div className="bg-[#2563eb]">
```

Cores principais:
- Primary: `#2563eb`
- Secondary: `#0ea5e9`
- Accent: `#f59e0b`
- Success: `#10b981`
- Danger: `#ef4444`
- Neutral: `#64748b`
- Background: `#f8fafc`
- Dark: `#1e293b`

### Navegação

```tsx
// Use a prop onNavigate passada
<Button onClick={() => onNavigate('/dashboard')}>
  Ir para Dashboard
</Button>
```

### Estado

```tsx
// Para persistência, use o store
import { store } from '../lib/store';

// Adicionar processo
store.addProcess(newProcess);

// Atualizar
store.updateProcess(id, updates);

// Deletar
store.deleteProcess(id);
```

## 🧩 Criando Novos Componentes

### 1. Componente UI Simples

```tsx
// /components/MyComponent.tsx
import { LucideIcon } from 'lucide-react';
import { Card } from './ui/card';

interface MyComponentProps {
  title: string;
  icon: LucideIcon;
}

export function MyComponent({ title, icon: Icon }: MyComponentProps) {
  return (
    <Card className="p-6">
      <Icon className="h-6 w-6 text-[#2563eb]" />
      <h3 className="text-[#1e293b]">{title}</h3>
    </Card>
  );
}
```

### 2. Nova Página

```tsx
// /pages/MyPage.tsx
import { Button } from '../components/ui/button';

interface MyPageProps {
  onNavigate: (path: string) => void;
}

export function MyPage({ onNavigate }: MyPageProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-[#1e293b]">Minha Página</h1>
      {/* Conteúdo */}
    </div>
  );
}
```

Adicione a rota no App.tsx:

```tsx
// Em App.tsx
import { MyPage } from './pages/MyPage';

// No renderRoute()
if (currentRoute === '/my-page') {
  return requireAuth(
    <AuthLayout>
      <MyPage onNavigate={navigate} />
    </AuthLayout>
  );
}
```

## 🎭 Layouts

### Com Sidebar (páginas internas)

```tsx
<AuthLayout>
  <YourPage />
</AuthLayout>
```

### Sem Sidebar

```tsx
<SimpleAuthLayout>
  <YourPage />
</SimpleAuthLayout>
```

### Fullscreen (ex: chatbot)

```tsx
// Sem wrapper, controle total do layout
<YourPage />
```

## 🔔 Notificações

```tsx
import { toast } from 'sonner@2.0.3';

// Sucesso
toast.success('Processo criado!');

// Erro
toast.error('Algo deu errado');

// Info
toast.info('Informação importante');
```

## 📝 Boas Práticas

### 1. Responsividade

Sempre use classes responsivas do Tailwind:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Mobile: 1 coluna, Tablet: 2, Desktop: 3 */}
</div>
```

### 2. Acessibilidade

```tsx
// Use labels em inputs
<Label htmlFor="name">Nome</Label>
<Input id="name" />

// Alt text em imagens
<img src={url} alt="Descrição" />

// ARIA labels quando necessário
<button aria-label="Fechar">
  <X />
</button>
```

### 3. Loading States

```tsx
{isLoading ? (
  <Skeleton className="h-20 w-full" />
) : (
  <div>Conteúdo</div>
)}
```

### 4. Empty States

```tsx
import { EmptyState } from '../components/EmptyState';
import { FileText } from 'lucide-react';

{items.length === 0 && (
  <EmptyState
    icon={FileText}
    title="Nenhum item"
    description="Crie seu primeiro item"
    actionLabel="Criar Item"
    onAction={() => handleCreate()}
  />
)}
```

## 🧪 Testando Mudanças

1. Teste em diferentes tamanhos de tela
2. Verifique navegação entre páginas
3. Teste fluxos completos (ex: criar → editar → visualizar)
4. Confira se localStorage está persistindo
5. Verifique se as cores estão corretas

## 🚀 Próximos Passos Sugeridos

### Backend Integration
- [ ] Substituir localStorage por API calls
- [ ] Implementar autenticação JWT real
- [ ] Criar endpoints REST/GraphQL

### Features
- [ ] Drag-and-drop real com react-dnd
- [ ] Geração de PDFs com bibliotecas (jsPDF, Puppeteer)
- [ ] Renderização Mermaid real
- [ ] Sistema de colaboração em tempo real
- [ ] Upload de imagens para S3
- [ ] Integração com IA (OpenAI) para geração real

### UX Improvements
- [ ] Skeleton loaders mais detalhados
- [ ] Animações de transição com Motion
- [ ] Undo/Redo no editor
- [ ] Atalhos de teclado
- [ ] Tour guiado para novos usuários

## 📚 Recursos Úteis

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 💬 Dúvidas?

Para dúvidas sobre a estrutura do código ou implementação de novas features, consulte:
- README.md para visão geral
- Este arquivo para padrões de código
- Código existente como exemplo
