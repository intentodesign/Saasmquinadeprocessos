# 🚀 Guia Rápido - Máquina de Processos

## Primeiros Passos

### 1. Acessar a Aplicação

Ao abrir a aplicação, você verá a **Landing Page** com:
- Apresentação do produto
- Como funciona (3 passos)
- Funcionalidades principais
- Preços e planos

### 2. Criar uma Conta

Clique em **"Começar Grátis"** ou **"Cadastre-se"**

**Nota**: Sistema está em modo demo - qualquer email/senha funciona!

### 3. Fazer Login

Use qualquer credencial:
- Email: `carlos@autocenterpremium.com.br`
- Senha: qualquer senha

Ou crie uma nova conta - será direcionado automaticamente para o Dashboard.

---

## 📊 Dashboard

Após o login, você verá:

### Estatísticas Principais
- **SOPs Criados**: Total de processos
- **Exportações**: Quantidade de PDFs gerados
- **Tokens IA**: Créditos restantes
- **Plano Atual**: Seu tier de assinatura

### Processos Recentes
- Cards dos últimos 6 processos criados
- Ações rápidas: Ver, Editar, Exportar

### Templates Sugeridos
- Templates pré-configurados para oficinas
- Clique para iniciar criação com base no template

---

## ✨ Criar Processo (Chatbot)

### Fluxo Conversacional

O chatbot te guia por 7 perguntas:

1. **Nome do Processo**
   - Exemplo: "Troca de Óleo Completa"

2. **Categoria**
   - Manutenção / Atendimento / Administrativo / Outro
   - Use os botões rápidos

3. **Etapas Principais**
   - Liste uma etapa por linha
   - Exemplo:
     ```
     Elevar o veículo
     Drenar óleo usado
     Substituir filtro
     Adicionar óleo novo
     ```

4. **Responsável**
   - Exemplo: "Mecânico"

5. **Equipamentos**
   - Exemplo: "Chave de roda, Macaco hidráulico"
   - Digite "não" se não precisar

6. **Requisitos de Segurança**
   - Exemplo: "Use cavaletes de segurança"
   - Digite "não" se não houver

7. **Normas**
   - Exemplo: "ISO 9001"
   - Digite "não" se não houver

### Geração

Aguarde ~10 segundos enquanto a IA:
- Analisa suas respostas
- Gera o diagrama
- Formata o documento

Clique em **"Ver Meu Processo"** quando pronto!

---

## ✏️ Editar Processo

### Toolbar Superior

- **Campo de Nome**: Edite inline
- **Badge de Versão**: Mostra versão atual
- **Salvar**: Auto-save ativo
- **Exportar**: Gera PDF
- **Publicar**: Muda status para "Completo"

### Modos de Visualização

**Cards** (padrão)
- Lista vertical de etapas
- Drag vertical para reordenar
- Editar inline

**Fluxograma** ⭐ NOVO!
- Visualização com Mermaid
- Renderização automática de diagramas
- Editor interativo com 2 abas:
  - **Visual**: Diagrama renderizado
  - **Código**: Editor Mermaid
- Detecção inteligente de tipos de nós:
  - 🟢 Verde: Início/Fim
  - 🔵 Azul: Etapas normais
  - 🟠 Laranja: Decisões (verificar, conferir, checar)
  - 🟡 Amarelo: Avisos de segurança
- Exportação como arquivo .mmd
- Cópia do código para clipboard
- Link para Mermaid Live Editor
- Legenda explicativa com cores

### Editar Etapa

1. Clique em **"Editar"** em qualquer card
2. Preencha:
   - Título
   - Descrição
   - Responsável
   - Tempo estimado
   - Aviso de segurança
3. **"Salvar"** ou **"Cancelar"**

### Ações nas Etapas

- **Duplicar**: Cria cópia da etapa
- **Excluir**: Remove a etapa (confirma antes)
- **Drag & Drop**: Reordena visualmente

### Adicionar Nova Etapa

- Botão **"+"** entre cards
- FAB (botão flutuante) no canto inferior direito

### Sidebar Direita

**Detalhes**
- Categoria (dropdown)
- Data de criação
- Última modificação

**Metadados ISO 9001**
- Código do documento (ex: POP-MAN-001)
- Revisão (ex: Rev. 02)
- Data de vigência
- Aprovador

**Tags**
- Lista de tags do processo

---

## 📚 Biblioteca de Processos

### Filtros

**Busca**
- Pesquise por nome ou tags

**Status**
- Todos
- Completos
- Rascunhos

**Categoria**
- Todas / Manutenção / Atendimento / Administrativo / Outro

**Ordenação**
- Mais recentes / Mais antigos / A-Z / Z-A

### Ações nos Cards

**Principais**
- **Ver**: Visualiza documento formatado
- **Editar**: Abre editor

**Menu "⋮"**
- Exportar PDF
- Duplicar
- Ver Histórico
- Arquivar
- Excluir

---

## 👁️ Visualizar SOP

Preview completo do documento formatado conforme ISO 9001:

### Seções do Documento

1. **Cabeçalho**
   - Logo da empresa (se configurado)
   - Nome da empresa
   - Código, revisão, data

2. **Título**
   - "PROCEDIMENTO OPERACIONAL PADRÃO"
   - Nome do processo

3. **Corpo**
   - 1. Objetivo
   - 2. Escopo
   - 3. Responsabilidades
   - 4. Materiais e Equipamentos
   - 5. Procedimento (etapas numeradas)
   - 6. Fluxograma
   - 7. Registros e Controles
   - 8. Referências

4. **Rodapé**
   - "Documento gerado por Máquina de Processos"

### Ações

- **Editar**: Volta para o editor
- **Compartilhar**: Copia link (simulado)
- **Exportar PDF**: Gera arquivo (simulado)

---

## ⚙️ Configurações de Branding

### Acesso

Dashboard → Configurações (menu lateral)

### Tabs Disponíveis

1. **Branding** (principal)
2. Empresa (em breve)
3. Segurança (em breve)

### Personalização por Plano

**Gratuito**
- ❌ Sem acesso a branding
- Mostra lock e CTA para upgrade

**Básico** (R$ 97/mês)
- ✅ Cores primária e secundária
- Color pickers interativos
- Preview em tempo real

**Profissional** (R$ 297/mês)
- ✅ Tudo do Básico
- ✅ Upload de logo (PNG/SVG, máx 2MB)
- ✅ Preview com logo

**Enterprise** (R$ 997/mês)
- ✅ Tudo do Profissional
- ✅ White-label completo (remove marca MP)

### Upload de Logo

1. Clique na área de upload ou arraste arquivo
2. Formatos aceitos: PNG, SVG
3. Tamanho máximo: 2MB
4. Fundo transparente recomendado
5. Preview aparece instantaneamente
6. Botão X para remover

### Cores da Marca

1. Use color picker ou digite HEX
2. Cor Primária: Headers, títulos
3. Cor Secundária: Destaques
4. Preview mostra como ficará no PDF

### Nome da Empresa

- Aparece no cabeçalho dos PDFs
- Todos os planos têm acesso

### Salvar

Clique em **"Salvar Alterações"**
- Toast de confirmação
- Preview atualizado instantaneamente

---

## 💰 Planos e Preços

### Ver Planos

Dashboard → Plano (menu lateral) ou footer da landing page

### Planos Disponíveis

#### Gratuito (R$ 0)
- 3 SOPs/mês
- Templates básicos
- Exportar PDF
- **Ideal para**: Testar o produto

#### Básico (R$ 97/mês)
- 15 SOPs/mês
- Sem marca MP
- Cores personalizadas
- Templates ISO 9001
- Suporte 48h
- **Ideal para**: Pequenas oficinas

#### Profissional (R$ 297/mês) ⭐ Mais Popular
- 50 SOPs/mês
- Logo + cores
- Templates completos
- Versionamento
- Suporte 24h
- **Ideal para**: Oficinas estabelecidas

#### Enterprise (R$ 997/mês)
- SOPs ilimitados
- White-label
- API access
- Usuários ilimitados
- Suporte dedicado
- Onboarding
- **Ideal para**: Redes e grandes operações

### Toggle Mensal/Anual

- Anual economiza 20%
- Preços atualizados automaticamente

### Comparação Completa

- Tabela com todos os recursos
- Checkmarks verde = incluído
- X cinza = não incluído

### FAQ

Accordion com perguntas frequentes:
- Trocar de plano?
- Limite de SOPs?
- Nota fiscal?
- Garantia de reembolso?
- Dados seguros?
- Cancelar?

---

## 💡 Dicas e Atalhos

### Navegação Rápida

- **Logo**: Volta para Dashboard
- **Breadcrumbs**: Navega hierarquia
- **Avatar**: Acessa menu de usuário

### Atalhos de Teclado

- `Enter`: Envia mensagem no chatbot
- `Esc`: Fecha modals/dialogs
- `Tab`: Navega entre campos

### Dados Persistidos

Tudo é salvo automaticamente no navegador:
- Processos criados
- Configurações de branding
- Dados do usuário

**Atenção**: Limpar cache do navegador apaga tudo!

---

## 🐛 Solução de Problemas

### Página em Branco

- Recarregue (F5)
- Limpe o localStorage
- Verifique console do navegador

### Processo Não Salva

- Já está auto-salvando
- Verifique toast de confirmação

### Logo Não Aparece

- Confirme que plano é Profissional+
- Verifique formato (PNG/SVG)
- Tamanho máximo: 2MB

### Não Recebe Email

- Sistema está em modo demo
- Emails não são enviados (ainda)

---

## 🎯 Próximos Passos

Agora que você sabe usar:

1. **Crie seu primeiro SOP** via chatbot
2. **Personalize o branding** (se plano permite)
3. **Explore os templates** sugeridos
4. **Organize sua biblioteca** com tags
5. **Exporte PDFs** profissionais

---

## 📞 Suporte

- **Email**: suporte@maquinadeprocessos.com.br
- **Chat**: Disponível em planos Pro+
- **WhatsApp**: (11) 99999-9999

---

**Feito com 💙 para empresários brasileiros**