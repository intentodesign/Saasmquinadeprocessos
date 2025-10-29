import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Verifica se o elemento está completamente renderizado
 */
async function waitForElementRender(element: HTMLElement, maxWait: number = 3000): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWait) {
    // Verificar se há SVGs do Mermaid
    const svgs = element.querySelectorAll('svg');
    if (svgs.length > 0) {
      // Verificar se os SVGs têm conteúdo
      let allRendered = true;
      svgs.forEach(svg => {
        if (!svg.querySelector('g') && !svg.querySelector('path')) {
          allRendered = false;
        }
      });
      if (allRendered) {
        // Aguardar mais um pouco para garantir
        await new Promise(resolve => setTimeout(resolve, 500));
        return;
      }
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

/**
 * Converte cores oklch/oklab para rgb
 */
function convertModernColorToRgb(color: string): string {
  if (!color || (!color.includes('oklch') && !color.includes('oklab'))) {
    return color;
  }
  
  // Mapa de conversões comuns baseado nas cores do globals.css
  const colorMap: Record<string, string> = {
    // Cores do tema claro
    'oklch(0.145 0 0)': 'rgb(36, 37, 42)',
    'oklch(1 0 0)': 'rgb(255, 255, 255)',
    'oklch(0.985 0 0)': 'rgb(250, 250, 250)',
    'oklch(0.95 0.0058 264.53)': 'rgb(241, 241, 244)',
    'oklch(0.708 0 0)': 'rgb(181, 181, 181)',
    'oklch(0.205 0 0)': 'rgb(52, 53, 57)',
    'oklch(0.269 0 0)': 'rgb(68, 69, 72)',
    'oklch(0.97 0 0)': 'rgb(247, 247, 247)',
    'oklch(0.922 0 0)': 'rgb(235, 235, 235)',
    'oklch(0.439 0 0)': 'rgb(112, 113, 115)',
    
    // Charts
    'oklch(0.646 0.222 41.116)': 'rgb(239, 146, 52)',
    'oklch(0.6 0.118 184.704)': 'rgb(96, 165, 250)',
    'oklch(0.398 0.07 227.392)': 'rgb(79, 70, 229)',
    'oklch(0.828 0.189 84.429)': 'rgb(251, 191, 36)',
    'oklch(0.769 0.188 70.08)': 'rgb(249, 115, 22)',
    
    // Tema escuro
    'oklch(0.488 0.243 264.376)': 'rgb(139, 92, 246)',
    'oklch(0.696 0.17 162.48)': 'rgb(16, 185, 129)',
    'oklch(0.627 0.265 303.9)': 'rgb(236, 72, 153)',
    'oklch(0.645 0.246 16.439)': 'rgb(244, 63, 94)',
    'oklch(0.396 0.141 25.723)': 'rgb(220, 38, 38)',
    'oklch(0.637 0.237 25.331)': 'rgb(252, 165, 165)',
  };
  
  // Tentar match exato primeiro
  for (const [oklch, rgb] of Object.entries(colorMap)) {
    if (color.includes(oklch)) {
      return rgb;
    }
  }
  
  // Fallback para preto/branco dependendo do tipo
  if (color.includes('oklch') || color.includes('oklab')) {
    // Tenta extrair o valor de luminosidade (primeiro número)
    const match = color.match(/okl(?:ch|ab)\(([\d.]+)/);
    if (match) {
      const luminosity = parseFloat(match[1]);
      if (luminosity > 0.5) {
        return 'rgb(255, 255, 255)'; // Cor clara
      } else {
        return 'rgb(0, 0, 0)'; // Cor escura
      }
    }
  }
  
  return color;
}

/**
 * Gera um PDF a partir de um elemento HTML
 * @param elementId - ID do elemento HTML a ser convertido
 * @param filename - Nome do arquivo PDF (sem extensão)
 * @param options - Opções adicionais para geração do PDF
 */
export async function generatePDF(
  elementId: string,
  filename: string,
  options?: {
    orientation?: 'portrait' | 'landscape';
    scale?: number;
    onProgress?: (progress: number) => void;
  }
): Promise<void> {
  try {
    const element = document.getElementById(elementId);
    
    if (!element) {
      throw new Error(`Elemento com ID "${elementId}" não encontrado`);
    }

    // Notificar progresso
    options?.onProgress?.(10);

    // Aguardar renderização completa
    await waitForElementRender(element);

    options?.onProgress?.(30);

    // Configurações para melhor qualidade
    const canvas = await html2canvas(element, {
      scale: options?.scale || 2, // Aumenta a qualidade
      useCORS: true, // Permite carregar imagens de outros domínios
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200, // Largura consistente para o PDF
      imageTimeout: 0,
      onclone: (clonedDoc) => {
        // Garantir que o elemento clonado está visível
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.display = 'block';
          clonedElement.style.position = 'relative';
          
          // Converter cores oklch/oklab para rgb em todos os elementos
          const allElements = clonedElement.querySelectorAll('*');
          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            const computedStyle = window.getComputedStyle(htmlEl);
            
            // Converter cor de fundo
            const bgColor = computedStyle.backgroundColor;
            if (bgColor && (bgColor.includes('oklch') || bgColor.includes('oklab'))) {
              htmlEl.style.backgroundColor = convertModernColorToRgb(bgColor);
            }
            
            // Converter cor de texto
            const textColor = computedStyle.color;
            if (textColor && (textColor.includes('oklch') || textColor.includes('oklab'))) {
              htmlEl.style.color = convertModernColorToRgb(textColor);
            }
            
            // Converter cor de borda
            const borderColor = computedStyle.borderColor;
            if (borderColor && (borderColor.includes('oklch') || borderColor.includes('oklab'))) {
              htmlEl.style.borderColor = convertModernColorToRgb(borderColor);
            }
            
            // Converter fill e stroke em SVGs
            const fill = computedStyle.fill;
            if (fill && (fill.includes('oklch') || fill.includes('oklab'))) {
              htmlEl.style.fill = convertModernColorToRgb(fill);
            }
            
            const stroke = computedStyle.stroke;
            if (stroke && (stroke.includes('oklch') || stroke.includes('oklab'))) {
              htmlEl.style.stroke = convertModernColorToRgb(stroke);
            }
          });
        }
      }
    });

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Falha ao capturar o conteúdo do documento');
    }

    options?.onProgress?.(60);

    // Calcular dimensões para o PDF
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Criar PDF
    const pdf = new jsPDF({
      orientation: options?.orientation || 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    let heightLeft = imgHeight;
    let position = 0;

    // Adicionar imagem ao PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Adicionar páginas extras se necessário
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    options?.onProgress?.(90);

    // Fazer download do PDF
    pdf.save(`${filename}.pdf`);

    options?.onProgress?.(100);
  } catch (error) {
    console.error('Erro detalhado ao gerar PDF:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Não foi possível gerar o PDF. Por favor, tente novamente.');
  }
}

/**
 * Gera um PDF otimizado para documentos de processo
 * @param process - Objeto do processo
 */
export async function generateProcessPDF(
  elementId: string,
  processName: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  // Aguardar renderização do Mermaid (ele renderiza assincronamente)
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const filename = `POP-${processName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
  
  await generatePDF(elementId, filename, {
    orientation: 'portrait',
    scale: 2,
    onProgress,
  });
}

/**
 * Gera um PDF com todos os processos (manual completo)
 * @param elementId - ID do elemento contendo todos os processos
 * @param companyName - Nome da empresa
 * @param processCount - Número total de processos
 * @param onProgress - Callback de progresso
 */
export async function generateAllProcessesPDF(
  elementId: string,
  companyName: string,
  processCount: number,
  onProgress?: (progress: number) => void
): Promise<void> {
  // Aguardar mais tempo para renderizar todos os fluxogramas
  const waitTime = Math.min(3000 + (processCount * 500), 10000);
  await new Promise(resolve => setTimeout(resolve, waitTime));
  
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `Manual-Processos-${companyName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${timestamp}`;
  
  await generatePDF(elementId, filename, {
    orientation: 'portrait',
    scale: 1.5, // Reduzir um pouco a escala para documentos grandes
    onProgress,
  });
}
