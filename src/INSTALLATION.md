# 📦 Instalação e Configuração - Sistema de Fluxogramas

## Dependências

O sistema de fluxogramas usa a biblioteca **Mermaid** para renderização de diagramas.

### Instalação do Mermaid

```bash
npm install mermaid
```

Ou se preferir yarn:

```bash
yarn add mermaid
```

### Versão Recomendada

- **mermaid**: ^10.0.0 ou superior

## Arquivos Necessários

Certifique-se de que os seguintes arquivos estão presentes no projeto:

### 1. Componentes

```
/components
  ├── MermaidFlowchart.tsx      ✅ Componente de renderização
  ├── FlowchartEditor.tsx        ✅ Editor interativo
  └── ...
```

### 2. Páginas Atualizadas

```
/pages
  ├── ProcessViewPage.tsx        ✅ Importa MermaidFlowchart
  ├── ProcessEditorPage.tsx      ✅ Importa FlowchartEditor
  └── ...
```

### 3. Estilos

```
/styles
  └── globals.css                ✅ Estilos Mermaid
```

## Verificação da Instalação

### 1. Verificar Import do Mermaid

Em `/components/MermaidFlowchart.tsx`, deve ter:

```typescript
import mermaid from 'mermaid';
```

Se houver erro de import:

```bash
# Reinstale a dependência
npm uninstall mermaid
npm install mermaid@latest
```

### 2. Verificar Inicialização

O Mermaid deve ser inicializado no `useEffect`:

```typescript
useEffect(() => {
  mermaid.initialize({
    startOnLoad: true,
    theme: 'default',
    securityLevel: 'loose',
    // ... outras configurações
  });
}, []);
```

### 3. Testar Renderização

1. Inicie a aplicação
2. Crie ou abra um processo
3. Vá para o editor
4. Clique em "Fluxograma"
5. Deve renderizar o diagrama

## Configuração Avançada

### Tema Personalizado

Edite em `MermaidFlowchart.tsx`:

```typescript
mermaid.initialize({
  theme: 'default', // Opções: default, dark, forest, neutral
  themeVariables: {
    primaryColor: '#2563eb',      // Sua cor primária
    primaryTextColor: '#fff',
    primaryBorderColor: '#1d4ed8',
    lineColor: '#64748b',
    secondaryColor: '#f59e0b',
    tertiaryColor: '#10b981',
    fontSize: '16px',
  },
});
```

### Segurança

```typescript
securityLevel: 'loose', // Permite HTML nos labels
```

Se precisar de mais segurança:

```typescript
securityLevel: 'strict', // Remove HTML dos labels
```

### Flowchart

```typescript
flowchart: {
  useMaxWidth: true,        // Responsivo
  htmlLabels: true,          // Labels HTML
  curve: 'basis',            // Tipo de curva das linhas
  padding: 15,               // Espaçamento
}
```

## Solução de Problemas

### Erro: "Cannot find module 'mermaid'"

**Solução**:
```bash
npm install mermaid
# ou
yarn add mermaid
```

### Erro: "mermaid.initialize is not a function"

**Possível causa**: Import incorreto

**Solução**:
```typescript
// Correto:
import mermaid from 'mermaid';

// Incorreto:
import { mermaid } from 'mermaid';
```

### Diagrama não renderiza

**Checklist**:
1. ✅ Mermaid está instalado?
2. ✅ Import está correto?
3. ✅ `useEffect` está rodando?
4. ✅ Há steps no processo?
5. ✅ Código Mermaid está válido?

**Debug**:
```typescript
console.log('Steps:', steps);
console.log('Mermaid code:', diagram);
```

### Erro no console: "Syntax error in graph"

**Causa**: Código Mermaid inválido

**Solução**:
1. Copie o código gerado
2. Cole em https://mermaid.live
3. Veja o erro específico
4. Corrija caracteres especiais

### Nós sobrepostos

**Causa**: Títulos muito longos

**Solução**:
```typescript
// Já implementado:
const stepTitle = step.title
  .replace(/[\"\']/g, '')
  .substring(0, 50); // Limita a 50 chars
```

### Performance lenta

**Causa**: Muitos steps (50+)

**Solução**:
1. Otimize o código Mermaid
2. Use paginação
3. Considere renderização server-side

## Configuração do TypeScript

Se usar TypeScript, adicione tipos:

```typescript
// Em types.d.ts ou no topo do arquivo
declare module 'mermaid' {
  export interface MermaidAPI {
    initialize(config: any): void;
    run(config?: any): Promise<void>;
  }
  const mermaid: MermaidAPI;
  export default mermaid;
}
```

## Configuração de Build

### Vite

Se usar Vite, não precisa de configuração extra.

### Webpack

Adicione ao `webpack.config.js`:

```javascript
module.exports = {
  // ...
  externals: {
    mermaid: 'mermaid',
  },
};
```

### Next.js

Se migrar para Next.js:

```javascript
// next.config.js
module.exports = {
  transpilePackages: ['mermaid'],
};
```

## CSS Customizado

### Sobrescrever estilos padrão

Em `globals.css`:

```css
/* Seu tema customizado */
.mermaid-container {
  background: #f8fafc;
  border-radius: 8px;
  padding: 20px;
}

.mermaid .node rect {
  stroke-width: 3px !important;
}

.mermaid text {
  font-family: 'Inter', sans-serif !important;
  font-size: 15px !important;
}
```

## Performance

### Lazy Loading

Para otimizar:

```typescript
import { lazy, Suspense } from 'react';

const MermaidFlowchart = lazy(() => import('./components/MermaidFlowchart'));

// Uso:
<Suspense fallback={<LoadingSpinner />}>
  <MermaidFlowchart steps={steps} />
</Suspense>
```

### Memoization

```typescript
import { memo } from 'react';

export const MermaidFlowchart = memo(({ steps, className }) => {
  // ... código
}, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.steps) === JSON.stringify(nextProps.steps);
});
```

## Testes

### Testar componente

```typescript
import { render, screen } from '@testing-library/react';
import { MermaidFlowchart } from './MermaidFlowchart';

test('renders flowchart', () => {
  const steps = [
    { id: '1', title: 'Step 1', description: 'Test', order: 1 }
  ];
  
  render(<MermaidFlowchart steps={steps} />);
  
  expect(screen.getByText('Step 1')).toBeInTheDocument();
});
```

### Validar código Mermaid

```typescript
import mermaid from 'mermaid';

test('generates valid mermaid code', () => {
  const diagram = generateMermaidDiagram(steps);
  
  expect(diagram).toContain('graph TD');
  expect(diagram).toContain('Start([Início])');
  expect(diagram).toContain('End([Fim])');
});
```

## Documentação Adicional

- 📖 [Documentação Oficial Mermaid](https://mermaid.js.org/)
- 🎨 [Temas e Customização](https://mermaid.js.org/config/theming.html)
- 📊 [Sintaxe de Flowcharts](https://mermaid.js.org/syntax/flowchart.html)
- 🧪 [Mermaid Live Editor](https://mermaid.live)

## Checklist de Instalação

- [ ] Mermaid instalado via npm/yarn
- [ ] Import funciona sem erros
- [ ] Componentes criados em `/components`
- [ ] Páginas atualizadas com imports
- [ ] Estilos CSS adicionados
- [ ] Teste de renderização funciona
- [ ] Exportação .mmd funciona
- [ ] Cores customizadas aplicadas
- [ ] Performance aceitável (< 1s)
- [ ] Console sem erros

## Suporte

Se tiver problemas:

1. Consulte esta documentação
2. Verifique [Issues do Mermaid](https://github.com/mermaid-js/mermaid/issues)
3. Teste no [Mermaid Live](https://mermaid.live)
4. Abra issue no repositório do projeto

---

**Instalação completa! 🎉**

Agora você pode usar o sistema de fluxogramas completo.
