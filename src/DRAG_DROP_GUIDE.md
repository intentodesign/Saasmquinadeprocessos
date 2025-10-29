# Guia de Uso - Fluxograma Drag & Drop

## 📋 Visão Geral

O sistema agora possui **sincronização bidirecional** entre o editor de texto e o fluxograma visual. Isso significa:

- ✏️ **Editar no modo Cards** → Atualiza automaticamente o fluxograma
- 🎯 **Arrastar nós no fluxograma** → Reorganiza automaticamente os passos escritos

## 🎨 Interface

### Modos de Visualização

1. **Cards** - Editor de lista com formulários para cada etapa
2. **Fluxograma** - Possui 3 abas:
   - **Drag & Drop** - Editor visual interativo (NOVO!)
   - **Mermaid** - Visualização estática com Mermaid.js
   - **Código** - Código Mermaid para exportação

## 🎯 Usando o Drag & Drop

### Navegação
- **Zoom**: Use o scroll do mouse ou os botões +/- no canto inferior esquerdo
- **Pan**: Clique e arraste no fundo cinza
- **Minimapa**: Visão geral no canto inferior direito

### Reorganizar Passos
1. Clique em um nó de etapa (bloco azul, laranja ou verde)
2. Arraste verticalmente para cima ou para baixo
3. Solte o nó na nova posição
4. Os passos no modo Cards serão automaticamente reorganizados!

### Cores dos Nós

- 🟢 **Verde** = Início/Fim (não podem ser movidos)
- 🔵 **Azul** = Etapas normais (podem ser arrastadas)
- 🟠 **Laranja** (losango) = Decisões/Verificações (podem ser arrastadas)
- ⚪ **Cinza claro** = Notas informativas (responsável/tempo)

### Avisos de Segurança
Aparecerão como alertas amarelos dentro do próprio nó

## 🔄 Sincronização Bidirecional

### Do Editor de Texto para o Fluxograma
1. No modo **Cards**, edite qualquer campo de uma etapa
2. Troque para o modo **Fluxograma**
3. O fluxograma será atualizado automaticamente!

### Do Fluxograma para o Editor de Texto
1. No modo **Fluxograma > Drag & Drop**, arraste um nó
2. Solte na nova posição (os nós se reorganizam pela posição Y)
3. Volte para o modo **Cards**
4. A ordem das etapas foi reorganizada!

## 💡 Dicas de Uso

### Melhor Workflow
1. **Crie** as etapas no modo Cards (mais rápido para adicionar conteúdo)
2. **Organize** a sequência no modo Drag & Drop (mais visual)
3. **Exporte** usando o código Mermaid ou PDF

### Atalhos
- Use o botão **Atualizar** (🔄) para regenerar o fluxograma se houver problemas
- Use **Copiar Código** para pegar o código Mermaid
- Use **Exportar .mmd** para salvar um arquivo Mermaid

### Limitações
- Apenas a posição **vertical (Y)** afeta a ordem das etapas
- A posição **horizontal (X)** é apenas visual e será resetada ao recarregar
- Nós de "Início" e "Fim" não podem ser movidos

## 🔧 Tecnologias

- **React Flow** - Biblioteca de fluxogramas interativos
- **Mermaid.js** - Geração de diagramas a partir de código
- **Sincronização de Estado** - React hooks para manter tudo sincronizado

## 🐛 Problemas Conhecidos

Se o fluxograma não atualizar:
1. Clique no botão "Atualizar" (🔄)
2. Se persistir, mude de aba e volte
3. Em último caso, recarregue a página

## 📚 Próximos Passos

Funcionalidades planejadas:
- Adicionar/remover nós diretamente no fluxograma
- Editar conteúdo inline no fluxograma
- Criar ramificações condicionais
- Exportação de imagem PNG/SVG do fluxograma
