# Guia de Exportação de PDF

## Visão Geral

A Máquina de Processos permite exportar POPs (Procedimentos Operacionais Padrão) em formato PDF profissional, mantendo toda a formatação, estilos e fluxogramas.

## Funcionalidades

### 1. Exportação de PDF Completo

A funcionalidade de exportação de PDF está disponível em:

- **Página de Visualização** (`/process/:id`): Botão "Exportar PDF" no canto superior direito
- **Página de Edição** (`/process/:id/edit`): Botão "Exportar" que salva e redireciona para visualização

### 2. Como Funciona

O sistema utiliza duas bibliotecas principais:

- **html2canvas**: Converte o documento HTML renderizado em uma imagem canvas
- **jsPDF**: Converte o canvas em um arquivo PDF de alta qualidade

#### Processo de Geração:

1. O usuário clica no botão "Exportar PDF"
2. O sistema captura o elemento HTML do documento
3. Converte para canvas com alta qualidade (scale: 2)
4. Gera um PDF no formato A4
5. Adiciona páginas extras automaticamente se o conteúdo for longo
6. Faz o download do arquivo

### 3. Formato do PDF

O PDF gerado inclui:

- ✅ Cabeçalho com logo da empresa (se configurado)
- ✅ Informações de metadados (código, revisão, data)
- ✅ Todas as seções do POP:
  - Objetivo
  - Escopo
  - Responsabilidades
  - Materiais e Equipamentos
  - Procedimento (com todas as etapas)
  - Fluxograma do Processo
  - Registros e Controles
  - Referências
- ✅ Rodapé com informações do sistema

### 4. Nome do Arquivo

O arquivo PDF é nomeado automaticamente seguindo o padrão:

```
POP-[nome-do-processo].pdf
```

Exemplos:
- `POP-troca-de-oleo.pdf`
- `POP-alinhamento-e-balanceamento.pdf`

### 5. Feedback ao Usuário

Durante a exportação, o usuário recebe feedback visual:

1. **Botão desabilitado** com texto "Gerando PDF..." e ícone de loading
2. **Toast notifications** informando o progresso:
   - "Preparando documento..."
   - "Gerando PDF..."
   - "PDF [nome] baixado com sucesso!" (ao finalizar)
3. **Mensagens de erro** se algo der errado

## Implementação Técnica

### Arquivo Principal: `/lib/pdf-utils.ts`

```typescript
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function generateProcessPDF(
  elementId: string,
  processName: string,
  onProgress?: (progress: number) => void
): Promise<void>
```

#### Parâmetros:

- `elementId`: ID do elemento HTML a ser convertido (ex: "process-document")
- `processName`: Nome do processo (usado no nome do arquivo)
- `onProgress`: Callback opcional para acompanhar o progresso (0-100)

### Uso nos Componentes

#### ProcessViewPage.tsx

```tsx
import { generateProcessPDF } from '../lib/pdf-utils';

const handleExport = async () => {
  setIsExporting(true);
  try {
    await generateProcessPDF('process-document', process.name, (progress) => {
      if (progress === 10) toast.info('Preparando documento...');
      if (progress === 50) toast.info('Gerando PDF...');
    });
    toast.success(`PDF "${process.name}" baixado com sucesso!`);
  } catch (error) {
    toast.error('Erro ao gerar PDF. Tente novamente.');
  } finally {
    setIsExporting(false);
  }
};
```

## Configurações e Otimização

### Qualidade da Imagem

O PDF é gerado com **scale: 2** para garantir alta qualidade:

```typescript
const canvas = await html2canvas(element, {
  scale: 2, // 2x resolução para melhor qualidade
  useCORS: true,
  logging: false,
  backgroundColor: '#ffffff',
  windowWidth: 1200,
});
```

### Formato do Documento

- **Orientação**: Portrait (retrato)
- **Formato**: A4 (210mm x 297mm)
- **Unidade**: Milímetros

### Múltiplas Páginas

O sistema automaticamente divide o conteúdo em múltiplas páginas se necessário:

```typescript
while (heightLeft > 0) {
  position = heightLeft - imgHeight;
  pdf.addPage();
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;
}
```

## Personalização

### Logo da Empresa

O logo da empresa é automaticamente incluído no PDF se configurado em:
- **Configurações > Branding** (`/settings/branding`)
- O logo aparece no cabeçalho do documento

### Metadados ISO 9001

Os seguintes metadados são incluídos no PDF:
- Código do documento (ex: POP-MAN-001)
- Revisão (ex: Rev. 02)
- Aprovador
- Data de criação

Configuráveis no **Editor de Processo** > Sidebar direita > "Metadados ISO 9001"

## Resolução de Problemas

### PDF não está sendo gerado

**Possíveis causas:**

1. **Elemento não encontrado**: Certifique-se de que o elemento com ID existe
   - Verifique se `id="process-document"` está no elemento correto

2. **Imagens não carregam**: Use `useCORS: true` no html2canvas
   - Já configurado por padrão

3. **Erro de permissão**: Navegador pode bloquear download
   - Verifique configurações de pop-up/download do navegador

### PDF com qualidade baixa

**Solução:**
- Aumente o parâmetro `scale` em `pdf-utils.ts`
- Valor atual: 2 (recomendado)
- Valores maiores aumentam qualidade mas processamento

### PDF muito grande (arquivo)

**Solução:**
- Reduza o `scale` para diminuir o tamanho do arquivo
- Otimize imagens antes de adicionar ao documento

## Compatibilidade

### Navegadores Suportados

- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari
- ⚠️ Internet Explorer (não suportado)

### Bibliotecas Necessárias

```json
{
  "html2canvas": "^1.4.1",
  "jspdf": "^2.5.1"
}
```

## Próximas Melhorias

- [ ] Opção de escolher orientação (portrait/landscape)
- [ ] Incluir cabeçalho/rodapé em todas as páginas
- [ ] Adicionar marca d'água personalizada
- [ ] Exportar apenas o fluxograma como imagem
- [ ] Opção de exportar múltiplos processos em um único PDF
- [ ] Compressão de imagens para reduzir tamanho do arquivo

## Referências

- [html2canvas Documentation](https://html2canvas.hertzen.com/)
- [jsPDF Documentation](https://github.com/parallax/jsPDF)
- [ISO 9001:2015 - Sistemas de gestão da qualidade](https://www.iso.org/iso-9001-quality-management.html)
