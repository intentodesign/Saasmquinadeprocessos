# ✅ Checklist de Validação - Drag & Drop

Use este checklist para validar que o sistema de drag-and-drop está funcionando corretamente.

## 🎯 Testes Funcionais

### Teste 1: Edição no Modo Cards → Fluxograma
- [ ] 1. Abra um processo existente
- [ ] 2. No modo "Cards", edite o título de uma etapa
- [ ] 3. Mude para o modo "Fluxograma" > "Drag & Drop"
- [ ] 4. ✅ **Esperado**: O título atualizado aparece no nó do fluxograma

### Teste 2: Drag & Drop → Modo Cards
- [ ] 1. Esteja no modo "Fluxograma" > "Drag & Drop"
- [ ] 2. Arraste o segundo nó (etapa 2) para cima do primeiro nó (etapa 1)
- [ ] 3. Solte o nó
- [ ] 4. Volte para o modo "Cards"
- [ ] 5. ✅ **Esperado**: A ordem das etapas foi invertida

### Teste 3: Adicionar Etapa
- [ ] 1. No modo "Cards", clique em "Adicionar Etapa"
- [ ] 2. Preencha os campos da nova etapa
- [ ] 3. Vá para "Fluxograma" > "Drag & Drop"
- [ ] 4. ✅ **Esperado**: Novo nó aparece no final do fluxograma

### Teste 4: Excluir Etapa
- [ ] 1. No modo "Cards", exclua uma etapa do meio
- [ ] 2. Confirme a exclusão
- [ ] 3. Vá para "Fluxograma" > "Drag & Drop"
- [ ] 4. ✅ **Esperado**: O nó correspondente não existe mais, conexões foram ajustadas

### Teste 5: Responsável e Duração
- [ ] 1. No modo "Cards", adicione responsável e duração a uma etapa
- [ ] 2. Vá para "Fluxograma" > "Drag & Drop"
- [ ] 3. ✅ **Esperado**: 
  - Informações aparecem dentro do nó principal (👤 e ⏱️)
  - Uma nota cinza conectada aparece no lado esquerdo

### Teste 6: Aviso de Segurança
- [ ] 1. No modo "Cards", adicione um aviso de segurança a uma etapa
- [ ] 2. Vá para "Fluxograma" > "Drag & Drop"
- [ ] 3. ✅ **Esperado**: 
  - O nó é um losango laranja
  - O aviso aparece em amarelo dentro do nó

### Teste 7: Detecção Automática de Decisão
- [ ] 1. No modo "Cards", crie uma etapa com título contendo "Verificar"
- [ ] 2. Vá para "Fluxograma" > "Drag & Drop"
- [ ] 3. ✅ **Esperado**: O nó é um losango laranja (mesmo sem aviso)

### Teste 8: Navegação no Fluxograma
- [ ] 1. Esteja no modo "Fluxograma" > "Drag & Drop"
- [ ] 2. Use o scroll do mouse para zoom
- [ ] 3. Clique e arraste no fundo para mover a visualização
- [ ] 4. Clique no minimapa (canto inferior direito)
- [ ] 5. ✅ **Esperado**: Todos os controles funcionam suavemente

### Teste 9: Múltiplas Reorganizações
- [ ] 1. No modo "Fluxograma" > "Drag & Drop"
- [ ] 2. Arraste nó 3 para posição 1
- [ ] 3. Arraste nó 2 para posição 3
- [ ] 4. Arraste nó 1 para posição 2
- [ ] 5. Volte para "Cards"
- [ ] 6. ✅ **Esperado**: A ordem final reflete todas as mudanças (3, 1, 2)

### Teste 10: Persistência
- [ ] 1. Reorganize as etapas no drag & drop
- [ ] 2. Clique em "Salvar"
- [ ] 3. Volte para "Meus Processos"
- [ ] 4. Abra o processo novamente
- [ ] 5. ✅ **Esperado**: A nova ordem foi mantida

## 🎨 Testes Visuais

### Cores dos Nós
- [ ] ✅ Nó "Início" = Verde (#10b981)
- [ ] ✅ Nó "Fim" = Verde (#10b981)
- [ ] ✅ Etapas normais = Azul (#2563eb)
- [ ] ✅ Decisões/Verificações = Laranja (#f59e0b)
- [ ] ✅ Notas = Cinza claro (#f1f5f9)

### Formas dos Nós
- [ ] ✅ Início/Fim = Retângulos arredondados
- [ ] ✅ Etapas normais = Retângulos com bordas arredondadas
- [ ] ✅ Decisões = Losangos (clip-path polygon)
- [ ] ✅ Notas = Retângulos pequenos

### Conexões
- [ ] ✅ Linhas entre etapas = Animadas (azul, tracejado em movimento)
- [ ] ✅ Linhas para notas = Tracejadas estáticas (cinza)
- [ ] ✅ Setas nas pontas = Presentes e visíveis

## 🔧 Testes de Interface

### Controles
- [ ] ✅ Botão "+" para zoom funciona
- [ ] ✅ Botão "-" para zoom funciona
- [ ] ✅ Botão "⊡" para fit view funciona
- [ ] ✅ Botão "🔒" para lock view funciona

### Abas
- [ ] ✅ Aba "Drag & Drop" carrega o React Flow
- [ ] ✅ Aba "Mermaid" carrega a visualização estática
- [ ] ✅ Aba "Código" mostra o código Mermaid

### Botões de Ação
- [ ] ✅ "Atualizar" regenera o fluxograma
- [ ] ✅ "Copiar Código" copia para clipboard
- [ ] ✅ "Exportar .mmd" faz download do arquivo

## 🐛 Testes de Edge Cases

### Processo Vazio
- [ ] 1. Crie um processo sem etapas
- [ ] 2. Vá para "Fluxograma" > "Drag & Drop"
- [ ] 3. ✅ **Esperado**: Apenas nós "Início" e "Fim" conectados

### Uma Única Etapa
- [ ] 1. Crie um processo com apenas 1 etapa
- [ ] 2. Tente arrastar a etapa
- [ ] 3. ✅ **Esperado**: Etapa pode ser arrastada mas volta à posição original

### Muitas Etapas (10+)
- [ ] 1. Crie um processo com 15+ etapas
- [ ] 2. Vá para "Fluxograma" > "Drag & Drop"
- [ ] 3. ✅ **Esperado**: 
  - Todos os nós são renderizados
  - Scroll vertical disponível
  - Minimapa mostra visão completa
  - Performance aceitável

### Textos Longos
- [ ] 1. Crie uma etapa com título muito longo (100+ caracteres)
- [ ] 2. Vá para "Fluxograma" > "Drag & Drop"
- [ ] 3. ✅ **Esperado**: Texto é truncado a 50 caracteres no nó

### Caracteres Especiais
- [ ] 1. Crie etapa com título: `Teste "aspas" e 'apóstrofes' (parênteses)`
- [ ] 2. Vá para "Fluxograma" > "Drag & Drop"
- [ ] 3. ✅ **Esperado**: Caracteres especiais são limpos, não quebram renderização

## 📱 Testes de Responsividade

### Telas Pequenas
- [ ] 1. Redimensione a janela para ~800px de largura
- [ ] 2. Abra "Fluxograma" > "Drag & Drop"
- [ ] 3. ✅ **Esperado**: Fluxograma se adapta, controles acessíveis

### Tablets
- [ ] 1. Teste em viewport de tablet (768px)
- [ ] 2. ✅ **Esperado**: Interface usável, drag funciona com touch

## 🔍 Testes de Desenvolvedor

### Console
- [ ] ✅ Sem erros no console ao carregar
- [ ] ✅ Sem warnings do React sobre keys
- [ ] ✅ Sem erros ao arrastar nós

### Network
- [ ] ✅ React Flow CSS carregado
- [ ] ✅ Mermaid.js carregado sob demanda
- [ ] ✅ Sem requisições falhando

### Performance
- [ ] ✅ Re-renders não excessivos ao arrastar
- [ ] ✅ Transições suaves
- [ ] ✅ Sem lag perceptível

## 📊 Resumo de Resultado

Total de testes: **40**
Passados: **___** / 40
Falhados: **___** / 40

---

## 🚨 Se Algum Teste Falhar

1. Verifique o console do navegador
2. Consulte `/DRAG_DROP_IMPLEMENTATION.md` para detalhes técnicos
3. Revise `/DRAG_DROP_GUIDE.md` para uso correto
4. Teste em navegador diferente
5. Limpe cache e recarregue

## ✅ Critérios de Aceitação

Para considerar a implementação completa e funcional, **todos** os testes das seções "Testes Funcionais" e "Testes Visuais" devem passar.

Os testes de "Edge Cases" e "Responsividade" são importantes mas não bloqueantes para o MVP.
