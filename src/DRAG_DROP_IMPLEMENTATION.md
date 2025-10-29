# Implementação do Sistema Drag & Drop Bidirecional

## 🎯 Objetivo

Implementar um sistema de fluxograma interativo com **sincronização bidirecional** entre:
- Editor de texto (lista de etapas)
- Fluxograma visual drag-and-drop

## 📦 Arquivos Criados/Modificados

### Novos Componentes

1. **`/components/DragDropFlowchart.tsx`**
   - Componente principal do fluxograma interativo
   - Usa React Flow para drag-and-drop
   - Converte `ProcessStep[]` em nós e arestas do React Flow
   - Detecta mudanças de posição e atualiza a ordem dos passos
   - Componentes customizados: `StepNode` e `NoteNode`

2. **`/components/ProcessStepsEditor.tsx`**
   - Editor de lista de etapas extraído do ProcessEditorPage
   - Reutilizável e com callback `onStepsChange`
   - Gerencia adição, edição, duplicação e exclusão de passos

### Componentes Modificados

3. **`/components/FlowchartEditor.tsx`**
   - Adicionada aba "Drag & Drop" com o novo componente interativo
   - Mantidas abas "Mermaid" (visualização estática) e "Código"
   - Aceita prop `onStepsChange` para sincronização

4. **`/components/MermaidFlowchart.tsx`**
   - Corrigido método de renderização: `mermaid.render()` ao invés de `mermaid.run()`
   - Removido wrapper HTML `<pre class="mermaid">`, agora retorna código puro
   - Melhor tratamento de erros com fallback visual

5. **`/pages/ProcessEditorPage.tsx`**
   - Simplificado usando `ProcessStepsEditor`
   - Única função `handleStepsChange` para ambos os modos
   - Sincronização automática entre Cards e Fluxograma

### Estilos

6. **`/styles/globals.css`**
   - Adicionados estilos customizados para React Flow
   - Animações para arestas
   - Estilos de seleção e drag
   - Background e controles estilizados

### Documentação

7. **`/DRAG_DROP_GUIDE.md`**
   - Guia completo de uso para o usuário final
   - Explicação de cores, navegação e workflow

8. **`/DRAG_DROP_IMPLEMENTATION.md`** (este arquivo)
   - Documentação técnica da implementação

## 🔄 Fluxo de Sincronização

### Do Editor de Texto → Fluxograma

```
1. Usuário edita etapa no ProcessStepsEditor
2. ProcessStepsEditor chama onStepsChange(newSteps)
3. ProcessEditorPage atualiza editedProcess.steps
4. React re-renderiza FlowchartEditor com novos steps
5. DragDropFlowchart converte steps em nodes/edges
6. Fluxograma é atualizado visualmente
```

### Do Fluxograma → Editor de Texto

```
1. Usuário arrasta um nó no DragDropFlowchart
2. onNodeDragStop detecta a mudança de posição
3. Nós são ordenados por posição Y
4. DragDropFlowchart chama onStepsChange(reorderedSteps)
5. FlowchartEditor propaga para ProcessEditorPage
6. ProcessEditorPage atualiza editedProcess.steps
7. React re-renderiza ProcessStepsEditor com nova ordem
```

## 🎨 Estrutura dos Nós

### Tipos de Nós

1. **Start/End Node** (Verde)
   - `isStartEnd: true`
   - Não podem ser arrastados
   - Formato: Retângulo arredondado

2. **Step Node** (Azul ou Laranja)
   - `isDecision: boolean` - Define se é losango (laranja) ou retângulo (azul)
   - Podem ser arrastados verticalmente
   - Mostram: título, responsável, duração, avisos

3. **Note Node** (Cinza)
   - Informações complementares
   - Conectados por linha tracejada
   - Não podem ser arrastados

### Propriedades dos Nós

```typescript
{
  id: string,           // 'step-0', 'step-1', 'start', 'end'
  type: 'stepNode',     // ou 'noteNode'
  position: { x, y },   // Posição no canvas
  data: {
    label: string,      // Título do passo
    responsible?: string,
    duration?: string,
    warning?: string,
    isDecision?: boolean,
    isStartEnd?: boolean,
    stepIndex: number   // Índice no array original
  },
  draggable: boolean
}
```

## 📊 Conversão de Dados

### ProcessStep → React Flow Node

```typescript
// Input: ProcessStep
{
  id: "abc123",
  title: "Trocar óleo",
  description: "...",
  responsible: "Mecânico",
  duration: "15 min",
  warning: "Use EPI",
  order: 1
}

// Output: Node
{
  id: "step-0",
  type: "stepNode",
  position: { x: 250, y: 150 },
  data: {
    label: "Trocar óleo",
    responsible: "Mecânico",
    duration: "15 min",
    warning: "Use EPI",
    isDecision: false,
    stepIndex: 0
  },
  draggable: true
}
```

### Detecção de Decisões

Um passo é considerado "decisão" (losango laranja) se:
- Tem `warning` definido, OU
- O título contém "verificar", "conferir" ou "checar"

## 🛠️ Tecnologias Utilizadas

### React Flow
- **Versão**: Latest (importado como `reactflow`)
- **Principais hooks**:
  - `useNodesState` - Gerencia estado dos nós
  - `useEdgesState` - Gerencia estado das arestas
- **Componentes**:
  - `ReactFlow` - Componente principal
  - `Background` - Grid de fundo
  - `Controls` - Botões de zoom/pan
  - `MiniMap` - Minimapa de navegação

### Mermaid.js
- **Uso**: Visualização estática e exportação
- **Método**: `mermaid.render(id, code)` 
- **Output**: SVG injetado no DOM

## 🎯 Recursos Implementados

### ✅ Concluído
- [x] Drag & drop de nós para reordenar passos
- [x] Sincronização bidirecional completa
- [x] Visualização em 3 modos (Drag & Drop, Mermaid, Código)
- [x] Cores diferenciadas por tipo de passo
- [x] Avisos de segurança integrados
- [x] Controles de zoom e pan
- [x] Minimapa de navegação
- [x] Animação nas conexões
- [x] Notas informativas (responsável/duração)
- [x] Estilos customizados

### 🚧 Melhorias Futuras
- [ ] Edição inline de nós no fluxograma
- [ ] Adicionar/remover passos diretamente no fluxograma
- [ ] Ramificações condicionais (if/else)
- [ ] Loops/repetições
- [ ] Exportação como imagem PNG/SVG
- [ ] Histórico de undo/redo
- [ ] Temas customizáveis
- [ ] Conexões manuais entre nós
- [ ] Validação de fluxo (caminhos órfãos)

## 🐛 Depuração

### Logs Úteis
```javascript
// No onNodeDragStop
console.log('Nós após drag:', nodes);
console.log('Nova ordem:', newOrder);
console.log('Steps reorganizados:', reorderedSteps);
```

### Problemas Comuns

1. **Fluxograma não atualiza**
   - Verifique se `steps` mudou de referência
   - Use o botão "Atualizar"

2. **Ordem não sincroniza**
   - Verifique `stepIndex` nos nós
   - Confirme que `onStepsChange` está sendo chamado

3. **Mermaid não renderiza**
   - Verifique console para erros de sintaxe
   - Caracteres especiais podem quebrar o código

## 📝 Exemplo de Uso

```tsx
import { DragDropFlowchart } from './components/DragDropFlowchart';

function MyEditor() {
  const [steps, setSteps] = useState<ProcessStep[]>([...]);

  return (
    <DragDropFlowchart 
      steps={steps}
      onStepsChange={setSteps}
    />
  );
}
```

## 🎓 Aprendizados

1. **React Flow é poderoso mas exige cuidado com estado**
   - Sempre use `useNodesState` e `useEdgesState`
   - Evite mutações diretas

2. **Sincronização bidirecional requer design cuidadoso**
   - Uma única fonte de verdade (`editedProcess.steps`)
   - Callbacks bem definidos
   - Re-renderizações controladas

3. **Mermaid.js tem limitações**
   - Não é interativo nativamente
   - Bom para exportação, não para edição
   - Caracteres especiais causam problemas

## 📚 Referências

- [React Flow Docs](https://reactflow.dev/)
- [Mermaid.js Flowchart Syntax](https://mermaid.js.org/syntax/flowchart.html)
- [React Hooks Best Practices](https://react.dev/reference/react)
