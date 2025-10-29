# Máquina de Processos

Um SaaS completo para documentação automatizada de Procedimentos Operacionais Padrão (SOPs) com IA, focado em oficinas automotivas brasileiras.

## 🚀 Funcionalidades

### ✅ Implementado

- **Landing Page** - Página inicial com apresentação do produto, funcionalidades e preços
- **Autenticação** - Sistema de login e registro (mockado com localStorage)
- **Dashboard** - Visão geral com estatísticas, processos recentes e templates sugeridos
- **Criação de Processos via Chatbot** - Interface conversacional estilo Typebot para criar SOPs
- **Editor de Processos** - Editor drag-and-drop com cards para editar etapas
- **Biblioteca de Processos** - Lista completa com filtros, busca e ordenação
- **Visualização de SOP** - Preview do documento formatado conforme ISO 9001
- **Sistema de Fluxogramas com Mermaid** - Geração automática e edição de fluxogramas (📊 [Ver Guia Completo](FLOWCHART_GUIDE.md))
  - Renderização visual de processos
  - Editor interativo com abas Visual/Código
  - Exportação em formato .mmd
  - Detecção inteligente de tipos de nós
  - Cores e estilos personalizados
- **Configurações de Branding** - Personalização de logo e cores (com controle por plano)
- **Página de Preços** - Tabela comparativa de planos com FAQ
- **Sistema de Navegação** - Rotas protegidas e navegação fluida
- **State Management** - Gerenciamento de estado com localStorage

## 🎨 Design System

### Paleta de Cores

- **Primary**: `#2563eb` - Azul profissional (confiança, tecnologia)
- **Secondary**: `#0ea5e9` - Azul claro (inovação)
- **Accent**: `#f59e0b` - Laranja (ação, destaque)
- **Success**: `#10b981` - Verde (aprovação, completo)
- **Danger**: `#ef4444` - Vermelho (alertas)
- **Neutral**: `#64748b` - Cinza (textos secundários)
- **Background**: `#f8fafc` - Cinza muito claro
- **Dark**: `#1e293b` - Textos principais

## 📦 Estrutura de Páginas

1. **/** - Landing Page
2. **/login** - Página de Login
3. **/register** - Página de Registro
4. **/dashboard** - Dashboard Principal
5. **/process/new** - Criar Processo (Chatbot)
6. **/process/:id/edit** - Editor de Processo
7. **/processes** - Biblioteca de Processos
8. **/process/:id/view** - Visualizar SOP
9. **/settings/branding** - Configurações de Branding
10. **/pricing** - Planos e Assinatura

## 🛠️ Tecnologias Utilizadas

- **React** - Framework UI
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Lucide React** - Ícones
- **Sonner** - Notificações toast
- **localStorage** - Persistência de dados (mockado)

## 🎯 Planos Disponíveis

### Gratuito (R$ 0/mês)
- 3 SOPs por mês
- Templates básicos
- Exportar PDF

### Básico (R$ 97/mês)
- 15 SOPs por mês
- Sem marca MP
- Cores personalizadas
- Templates ISO 9001
- Suporte email 48h

### Profissional (R$ 297/mês)
- 50 SOPs por mês
- Logo + cores personalizadas
- Templates completos
- Versionamento automático
- Suporte prioritário 24h

### Enterprise (R$ 997/mês)
- SOPs ilimitados
- White-label completo
- API access
- Usuários ilimitados
- Suporte dedicado
- Onboarding personalizado

## 💾 Dados de Exemplo

O sistema vem pré-populado com:

- **Usuário**: Carlos Eduardo Silva (carlos@autocenterpremium.com.br)
- **Plano**: Profissional
- **5 Processos de exemplo**:
  1. Troca de Óleo Completa (Manutenção, Completo, 6 etapas)
  2. Diagnóstico de Freios (Manutenção, Rascunho, 1 etapa)
  3. Atendimento Inicial ao Cliente (Atendimento, Completo, 1 etapa)
  4. Balanceamento de Rodas (Manutenção, Completo, 1 etapa)
  5. Orçamento de Serviços (Administrativo, Completo, 1 etapa)

## 🚦 Como Usar

### Login
Qualquer email/senha funciona para fazer login (sistema mockado).

### Criar Processo
1. Clique em "Criar Novo Processo"
2. Responda as perguntas do chatbot
3. Aguarde a IA gerar o SOP
4. Visualize ou edite o processo criado

### Editar Processo
1. Vá em "Meus Processos"
2. Clique em "Editar" em qualquer processo
3. Use drag-and-drop para reordenar etapas
4. Adicione, edite ou remova etapas
5. Personalize metadados ISO 9001
6. Salve as alterações

### Exportar PDF
1. Visualize qualquer processo
2. Clique em "Exportar PDF"
3. Escolha o formato desejado
4. (Simulado - mostra alert)

### Personalizar Branding
1. Vá em "Configurações"
2. Faça upload do logo (apenas plano Profissional)
3. Escolha cores primária e secundária (plano Básico+)
4. Digite o nome da empresa
5. Veja preview em tempo real
6. Salve as alterações

## 🔐 Controle de Acesso por Plano

- **Gratuito**: Sem personalização de branding
- **Básico**: Apenas cores personalizadas
- **Profissional**: Cores + Logo
- **Enterprise**: Tudo + White Label

## 📱 Responsividade

O sistema é totalmente responsivo:
- **Mobile** (< 768px): Sidebar vira bottom nav, grid de 1 coluna
- **Tablet** (768px - 1024px): Grid de 2 colunas, sidebar collapsible
- **Desktop** (> 1024px): Layout completo conforme especificado

## 🔄 Estado da Aplicação

Gerenciado via localStorage com os seguintes dados:
- `mp_user` - Dados do usuário logado
- `mp_processes` - Lista de processos
- `mp_branding` - Configurações de branding

## 🎨 Componentes Principais

### Layout
- **Navbar** - Navegação superior com avatar e notificações
- **Sidebar** - Menu lateral com indicador de uso

### Processo
- **ProcessCard** - Card visual do processo com ações
- **ProcessStepCard** - Etapa editável com drag-and-drop

### Páginas
- **LandingPage** - Marketing e apresentação
- **CreateProcessPage** - Chatbot para criação
- **ProcessEditorPage** - Editor completo
- **ProcessViewPage** - Visualização tipo documento
- **BrandingSettingsPage** - Configurações visuais
- **PricingPage** - Comparação de planos

## 🌟 Destaques UX/UI

- Animações suaves em transições
- Loading states com skeleton screens
- Toast notifications com feedback claro
- Progress indicators no chatbot
- Drag-and-drop intuitivo
- Preview em tempo real de branding
- Filtros e busca responsivos
- Empty states informativos

## 🔮 Próximos Passos (Não Implementado)

- Integração com backend real (Node.js/FastAPI)
- Banco de dados PostgreSQL
- Exportação real de PDFs
- Renderização Mermaid de fluxogramas
- Sistema de versionamento funcional
- Colaboração multi-usuário
- API para integrações
- Pagamentos com Stripe
- Email notifications
- Drag-and-drop real com react-dnd

## 📝 Notas Importantes

- **Mock Mode**: Todas as operações de backend são simuladas com localStorage
- **Autenticação**: Qualquer email/senha funciona para login
- **Dados**: São persistidos apenas no navegador (não há backend)
- **Exportação**: Mostra alertas simulando a ação
- **IA**: O chatbot segue um fluxo pré-definido (não usa IA real)

## 🇧🇷 Idioma

Todo o sistema está em **Português Brasileiro (pt-BR)**, incluindo:
- Interface de usuário
- Mensagens de erro/sucesso
- Documentação
- Templates de SOPs
- Labels e placeholders

## 👨‍💻 Desenvolvimento

Este é um MVP funcional que demonstra todo o fluxo do usuário. O código está organizado, componentizado e pronto para ser expandido com funcionalidades de backend real.

---

**Desenvolvido com 💙 para empresários brasileiros**