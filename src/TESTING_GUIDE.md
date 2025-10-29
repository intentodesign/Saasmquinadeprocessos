# 🧪 Guia de Testes - Máquina de Processos

## Objetivo
Este guia ajuda você a testar todas as funcionalidades do sistema, incluindo o novo sistema de fluxogramas.

## ✅ Checklist de Testes

### 1. Sistema de Autenticação
- [ ] Acessar landing page (/)
- [ ] Clicar em "Começar Grátis"
- [ ] Preencher formulário de registro
- [ ] Verificar redirect para dashboard
- [ ] Fazer logout
- [ ] Fazer login novamente
- [ ] Verificar persistência no localStorage

**Resultado Esperado**: Login e logout funcionam, dados persistem.

---

### 2. Dashboard
- [ ] Visualizar estatísticas (processos criados)
- [ ] Ver processos recentes (máximo 6)
- [ ] Clicar em template sugerido
- [ ] Clicar em "Criar Novo Processo"
- [ ] Verificar contador de processos vs plano

**Resultado Esperado**: Dashboard mostra dados corretos, botões funcionam.

---

### 3. Criar Processo via Chatbot
- [ ] Clicar em "Criar Novo Processo"
- [ ] Responder: "Troca de Pneu"
- [ ] Selecionar categoria: Manutenção
- [ ] Listar etapas:
  ```
  Elevar o veículo
  Remover pneu antigo
  Instalar pneu novo
  Apertar parafusos
  Baixar veículo
  ```
- [ ] Responsável: "Mecânico"
- [ ] Equipamento: "Macaco hidráulico, Chave de roda"
- [ ] Segurança: "Usar calços nas rodas"
- [ ] Normas: "NR-12"
- [ ] Aguardar geração (3 segundos)
- [ ] Clicar em "Ver Meu Processo"

**Resultado Esperado**: Processo criado com 5 etapas, navegação funciona.

---

### 4. Visualização de Processo ⭐ COM FLUXOGRAMA
- [ ] Acessar processo recém-criado
- [ ] Verificar seções do documento:
  - [ ] Cabeçalho com logo
  - [ ] 1. Objetivo
  - [ ] 2. Escopo
  - [ ] 3. Responsabilidades
  - [ ] 4. Materiais
  - [ ] 5. Procedimento (5 etapas)
  - [ ] 6. Fluxograma **← NOVO!**
  - [ ] 7. Registros
  - [ ] 8. Referências
- [ ] Verificar fluxograma renderizado
  - [ ] Nó verde "Início"
  - [ ] 5 nós azuis (etapas)
  - [ ] Nó verde "Fim"
  - [ ] Conexões entre nós
  - [ ] Notas com responsável
  - [ ] Aviso de segurança em amarelo
- [ ] Testar botão "Editar"
- [ ] Testar botão "Exportar PDF"
- [ ] Testar botão "Compartilhar"

**Resultado Esperado**: Documento completo com fluxograma visual funcional.

---

### 5. Editor de Processos - Modo Cards
- [ ] Clicar em "Editar" no processo
- [ ] Verificar breadcrumb (Meus Processos > Nome)
- [ ] Editar nome do processo
- [ ] Clicar em "Editar" na etapa 1
- [ ] Modificar:
  - [ ] Título
  - [ ] Descrição
  - [ ] Responsável
  - [ ] Tempo estimado
  - [ ] Aviso de segurança
- [ ] Clicar em "Salvar" na etapa
- [ ] Duplicar etapa
- [ ] Excluir etapa duplicada
- [ ] Adicionar nova etapa (botão +)
- [ ] Verificar Floating Action Button
- [ ] Salvar processo

**Resultado Esperado**: Todas as edições funcionam, etapas são atualizadas.

---

### 6. Editor de Processos - Modo Fluxograma ⭐ PRINCIPAL
- [ ] No editor, clicar em "Fluxograma" (toggle)
- [ ] Verificar renderização do diagrama
- [ ] Conferir todas as etapas no fluxograma
- [ ] Verificar cores:
  - [ ] Verde: Início/Fim
  - [ ] Azul: Etapas normais
  - [ ] Laranja: Etapas de verificação (se houver)
  - [ ] Amarelo: Avisos
- [ ] Clicar em aba "Código Mermaid"
- [ ] Visualizar código gerado
- [ ] Copiar código (botão "Copiar Código")
- [ ] Verificar toast de confirmação
- [ ] Exportar como .mmd
- [ ] Verificar download do arquivo
- [ ] Clicar em "Abrir Editor Online"
- [ ] Verificar se abre Mermaid Live
- [ ] Voltar para aba "Visualização"
- [ ] Clicar em "Atualizar"
- [ ] Verificar legenda de cores

**Resultado Esperado**: Fluxograma renderiza corretamente, exportação funciona.

---

### 7. Teste de Tipos de Nós Inteligentes
- [ ] Criar novo processo chamado "Inspeção Veicular"
- [ ] Adicionar etapas:
  ```
  Preparar veículo
  Verificar documentação
  Checar freios
  Inspecionar pneus
  Validar sistemas elétricos
  ```
- [ ] Ir para modo Fluxograma
- [ ] Verificar nós em losango (laranja) para:
  - [ ] "Verificar documentação"
  - [ ] "Checar freios"
  - [ ] "Inspecionar pneus"
  - [ ] "Validar sistemas elétricos"
- [ ] Verificar nós normais (azul) para:
  - [ ] "Preparar veículo"

**Resultado Esperado**: Sistema detecta automaticamente palavras-chave e cria nós de decisão.

---

### 8. Teste de Avisos de Segurança
- [ ] Editar processo
- [ ] Adicionar aviso em uma etapa: "Use EPI obrigatório"
- [ ] Ir para Fluxograma
- [ ] Verificar caixa amarela anexada ao nó
- [ ] Verificar ícone ⚠️
- [ ] Conferir texto do aviso

**Resultado Esperado**: Avisos aparecem como notas amarelas conectadas.

---

### 9. Teste de Responsáveis e Tempos
- [ ] Editar processo
- [ ] Em uma etapa, adicionar:
  - Responsável: "Supervisor de Qualidade"
  - Tempo: "30 min"
- [ ] Ir para Fluxograma
- [ ] Verificar nota com ícone 📋
- [ ] Conferir texto: "Supervisor de Qualidade - 30 min"

**Resultado Esperado**: Metadados aparecem como notas cinzas conectadas.

---

### 10. Biblioteca de Processos
- [ ] Ir para "Meus Processos"
- [ ] Verificar todos os processos listados
- [ ] Usar busca (digitar "troca")
- [ ] Filtrar por categoria
- [ ] Filtrar por status
- [ ] Ordenar por data
- [ ] Ordenar por nome
- [ ] Clicar em "Visualizar" em um processo
- [ ] Voltar e clicar em "Editar"
- [ ] Excluir um processo
- [ ] Confirmar exclusão
- [ ] Verificar toast

**Resultado Esperado**: Filtros e busca funcionam, CRUD completo.

---

### 11. Configurações de Branding
- [ ] Ir para "Configurações"
- [ ] Upload de logo (se plano Profissional)
- [ ] Mudar cor primária
- [ ] Mudar cor secundária
- [ ] Editar nome da empresa
- [ ] Ver preview em tempo real
- [ ] Salvar configurações
- [ ] Verificar toast
- [ ] Criar novo processo
- [ ] Verificar se cores foram aplicadas

**Resultado Esperado**: Branding salva e aplica em processos novos.

---

### 12. Página de Preços
- [ ] Ir para "Planos"
- [ ] Visualizar 4 planos
- [ ] Expandir FAQs
- [ ] Clicar em "Começar" em cada plano
- [ ] Verificar modais/alertas

**Resultado Esperado**: Página mostra planos corretamente.

---

### 13. Testes de Responsividade
#### Mobile (< 768px)
- [ ] Abrir DevTools
- [ ] Mudar para iPhone
- [ ] Verificar layout mobile
- [ ] Testar navegação
- [ ] Criar processo
- [ ] Editar processo

#### Tablet (768px - 1024px)
- [ ] Mudar para iPad
- [ ] Verificar grid 2 colunas
- [ ] Testar sidebar

#### Desktop (> 1024px)
- [ ] Layout completo
- [ ] Sidebar fixa
- [ ] Grid 3 colunas

**Resultado Esperado**: Interface se adapta a todos os tamanhos.

---

### 14. Persistência de Dados
- [ ] Criar processo
- [ ] Recarregar página (F5)
- [ ] Verificar se processo permanece
- [ ] Fazer logout
- [ ] Fazer login
- [ ] Verificar se dados persistem
- [ ] Limpar localStorage
- [ ] Verificar estado inicial

**Resultado Esperado**: Dados persistem entre sessões.

---

### 15. Testes de Fluxograma Avançados ⭐
#### Processo Pequeno (3 etapas)
- [ ] Criar processo com 3 etapas
- [ ] Verificar fluxograma renderiza
- [ ] Conferir tamanho adequado

#### Processo Médio (10 etapas)
- [ ] Criar processo com 10 etapas
- [ ] Verificar scroll horizontal se necessário
- [ ] Testar zoom no navegador

#### Processo Grande (20+ etapas)
- [ ] Criar processo com 20+ etapas
- [ ] Verificar performance
- [ ] Testar renderização

#### Processo Complexo
- [ ] Criar processo com:
  - Múltiplas verificações
  - Vários avisos
  - Responsáveis diferentes
  - Tempos variados
- [ ] Verificar todas as notas aparecem
- [ ] Conferir cores corretas
- [ ] Testar exportação

**Resultado Esperado**: Fluxograma funciona para qualquer tamanho de processo.

---

### 16. Integração Mermaid Live Editor
- [ ] Criar processo no sistema
- [ ] Ir para modo Fluxograma
- [ ] Copiar código Mermaid
- [ ] Abrir https://mermaid.live
- [ ] Colar código
- [ ] Verificar se renderiza identicamente
- [ ] Editar código no Mermaid Live
- [ ] Copiar código editado
- [ ] Colar na aba "Código" do sistema
- [ ] Verificar se atualiza

**Resultado Esperado**: Compatibilidade 100% com Mermaid Live.

---

### 17. Exportação de Fluxograma
- [ ] Criar processo
- [ ] Ir para modo Fluxograma
- [ ] Clicar em "Exportar .mmd"
- [ ] Verificar download
- [ ] Abrir arquivo em editor de texto
- [ ] Conferir conteúdo
- [ ] Copiar conteúdo
- [ ] Colar no Mermaid Live
- [ ] Verificar renderização

**Resultado Esperado**: Arquivo .mmd exporta corretamente.

---

### 18. Testes de Edge Cases
#### Título Muito Longo
- [ ] Criar etapa com título de 100+ caracteres
- [ ] Verificar truncamento no fluxograma
- [ ] Máximo 50 chars

#### Caracteres Especiais
- [ ] Criar etapa com título: "Verificar "óleo" & filtro"
- [ ] Verificar se aspas são removidas
- [ ] Confirmar renderização

#### Processo Vazio
- [ ] Criar processo sem etapas
- [ ] Verificar fluxograma mostra apenas Início → Fim

#### Muitos Avisos
- [ ] Criar processo com 5+ avisos
- [ ] Verificar se todos aparecem
- [ ] Testar sobreposição

**Resultado Esperado**: Sistema lida com casos extremos.

---

## 🎯 Métricas de Sucesso

### Performance
- [ ] Fluxograma renderiza em < 1 segundo
- [ ] Interface não trava com 20+ etapas
- [ ] Exportação instantânea

### Usabilidade
- [ ] Fluxograma é legível
- [ ] Cores facilitam compreensão
- [ ] Navegação intuitiva

### Funcionalidade
- [ ] 100% das etapas aparecem no fluxograma
- [ ] Código Mermaid é válido
- [ ] Exportação funciona

---

## 🐛 Reportar Bugs

Se encontrar algum problema:

1. Abra o Console do Navegador (F12)
2. Reproduza o erro
3. Copie mensagens de erro
4. Anote passos para reproduzir
5. Tire screenshot se visual

---

## ✨ Funcionalidades Extras para Testar

- [ ] Atalhos de teclado (Enter no chatbot)
- [ ] Animações suaves
- [ ] Toasts de feedback
- [ ] Loading states
- [ ] Empty states
- [ ] Confirmações de delete
- [ ] Breadcrumbs funcionais
- [ ] Links internos

---

## 📊 Matriz de Compatibilidade

| Navegador | Versão | Status |
|-----------|--------|--------|
| Chrome    | 120+   | ✅     |
| Firefox   | 120+   | ✅     |
| Safari    | 17+    | ✅     |
| Edge      | 120+   | ✅     |

---

## 🎓 Dicas de Teste

1. **Teste Incremental**: Siga a ordem do checklist
2. **Limpe Dados**: Use localStorage.clear() entre testes
3. **Use Exemplos Reais**: Crie processos da sua oficina
4. **Varie Tamanhos**: Teste com 3, 10 e 20+ etapas
5. **Explore Casos Extremos**: Títulos longos, muitos avisos
6. **Compare Visualmente**: Mermaid Live vs Sistema

---

**Boa sorte nos testes! 🚀**
