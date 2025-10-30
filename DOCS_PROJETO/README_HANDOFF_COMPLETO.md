# 📋 HANDOFF COMPLETO - Máquina de Processos

**Data:** 30 de Outubro de 2025
**Desenvolvido por:** Claude (Sonnet 4.5)
**Última atualização:** 30 de Outubro de 2025 - 18:45 UTC

---

## ✅ PROBLEMA DE DEPLOY RESOLVIDO (30/10/2025 18:45)

### O Problema:
- Código-fonte estava correto no GitHub (commit `c877b555`)
- Build no servidor Digital Ocean estava **desatualizado**
- Cache HTTP do Caddy servia versão antiga mesmo após upload
- Usuário via interface antiga sem as correções do onboarding

### A Solução (passo a passo):

```bash
# 1. Limpeza completa do build local
cd "/c/Users/bielg/AppData/Local/Temp/Saasmquinadeprocessos"
rm -rf build build.tar.gz

# 2. Build novo e limpo
npm run build

# 3. Comprimir e enviar
tar -czf build.tar.gz build/
scp build.tar.gz root@157.245.227.227:/var/www/maquina-processos/

# 4. Substituir no servidor
ssh root@157.245.227.227 "cd /var/www/maquina-processos && \
  rm -rf build && \
  tar -xzf build.tar.gz && \
  rm build.tar.gz"

# 5. CRÍTICO: Reiniciar container do Caddy (limpa cache HTTP)
ssh root@157.245.227.227 "docker restart n8n-docker-caddy-caddy-1"
```

### Por que `pkill -HUP caddy` não funcionou?
- Apenas recarrega a configuração do Caddy
- **NÃO limpa o cache HTTP** de assets estáticos
- O restart completo do container é necessário para zerar o cache

### Evidência da Correção:
**Antes:**
```html
<script src="/assets/index-D7qyqbqj.js"></script>  <!-- versão antiga -->
```

**Depois:**
```html
<script src="/assets/index-DkVyFTt8.js"></script>  <!-- versão nova -->
<link rel="modulepreload" href="/assets/react-vendor-Depg2-eh.js">
<!-- Code splitting implementado corretamente -->
```

### Status Atual:
- ✅ Site atualizado: https://maquina.intentomarcas.com.br
- ✅ Cache limpo e servindo versão correta
- ✅ Build com todas as melhorias do onboarding
- ⚠️ Prompt do Rô Bot no N8N ainda precisa ser atualizado manualmente

### Lições Aprendidas:
1. **Deploy correto**: SCP manual para Digital Ocean (não GitHub Actions)
2. **Cache do Caddy**: `pkill -HUP` não basta, precisa `docker restart`
3. **Verificação**: Sempre comparar hash dos arquivos JS entre local e produção
4. **Build limpo**: Apagar `build/` completamente antes de regenerar

---

## 🎯 RESUMO EXECUTIVO (2 min)

### O QUE FOI FEITO:
✅ Interface drag-and-drop estilo Mermaid com 5 formas diferentes
✅ Tipos de etapa: process, decision, io, document, subprocess
✅ Identificação automática via palavras-chave
✅ Deploy em produção: https://maquina.intentomarcas.com.br

### ⚠️ TAREFA CRÍTICA PENDENTE:
**Atualizar prompt do Rô Bot no N8N (5 min):**
1. Acesse: https://n8n.intentomarcas.com.br
2. Abra workflow do Rô Bot
3. Edite System Message do Agent
4. Cole conteúdo de: `PROMPT_RO_BOT_COM_TIPOS.md`
5. Salve e ative

**Por quê:** Sem isso, bot não identifica tipos automaticamente.

---

## 📂 ARQUIVOS PRINCIPAIS

### Código:
- `src/components/DragDropFlowchartV2.tsx` - Componente principal (647 linhas)
- `src/lib/types.ts` - Adicionado StepType
- `src/components/FlowchartEditor.tsx` - Import atualizado
- `vite.config.ts` - base: '/' (corrigido)

### Documentação:
- `DOCS_PROJETO/PROMPT_RO_BOT_COM_TIPOS.md` - Prompt do bot
- `DOCS_PROJETO/README_HANDOFF_COMPLETO.md` - Este arquivo

---

## 🎨 FORMAS IMPLEMENTADAS

```
process      → Retângulo azul (#3b82f6)
decision     → Losango laranja (#f97316)
io           → Paralelogramo roxo (#a855f7)
document     → Papel verde (#22c55e)
subprocess   → Retângulo duplo ciano (#06b6d4)
start/end    → Círculo verde (#10b981)
```

### Palavras-Chave para Identificação:
- **decision:** verificar, conferir, checar, validar, avaliar, inspecionar
- **io:** receber, enviar, registrar, anotar, preencher, consultar
- **document:** gerar, emitir, assinar, arquivar, imprimir
- **subprocess:** executar processo de, seguir POP, realizar procedimento
- **process:** (padrão) todas as outras ações

---

## 🏗️ IMPLEMENTAÇÃO TÉCNICA

### Schema TypeScript:
```typescript
export type StepType = 'process' | 'decision' | 'io' | 'document' | 'subprocess';

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  type?: StepType;  // NOVO CAMPO
  responsible?: string;
  duration?: string;
  warning?: string;
  order: number;
}
```

### Formas CSS:
```typescript
// Losango (Decision)
transform: rotate(45deg);  // Container
  transform: rotate(-45deg);  // Conteúdo (contra-rotação)

// Paralelogramo (IO)
clipPath: polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%);

// Documento (Document)
clip-path com curva ondulada embaixo

// Retângulo Duplo (Subprocess)
border: 4px double;
```

---

## 🚀 DEPLOY

### Servidor:
- **Host:** root@157.245.227.227
- **Caminho:** /var/www/maquina-processos
- **Domínio:** https://maquina.intentomarcas.com.br
- **Status:** ✅ Funcionando

### Comando de Deploy:
```bash
ssh root@157.245.227.227 "cd /var/www/maquina-processos && git pull origin main && npm run build && docker restart n8n-docker-caddy-caddy-1"
```

### Último Commit:
- **ID:** 87fd364a
- **Mensagem:** docs: Adicionar documentação completa de handoff

---

## 🔧 PRÓXIMOS PASSOS

### Imediato:
1. ⚠️ Atualizar prompt no N8N (CRÍTICO)
2. Testar identificação de tipos
3. Verificar formas no navegador

### Esta Semana:
4. Adicionar dropdown manual de tipos na UI
5. Implementar exportação como PNG/SVG
6. Testes automatizados

### Próximas Sprints:
7. Conectores condicionais (Sim/Não em decisões)
8. Subprocessos aninhados (click para expandir)
9. Templates de processos comuns
10. Colaboração em tempo real

---

## 🧪 COMO TESTAR

### Local:
```bash
cd /tmp/Saasmquinadeprocessos
npm run dev
# Acesse: http://localhost:3000
```

### Produção:
```
Acesse: maquina.intentomarcas.com.br
Crie processo
Adicione etapas com palavras-chave
Veja formas mudarem automaticamente
```

### Testar Bot (após atualizar prompt):
```
1. Converse com Rô Bot
2. Diga: "Preciso documentar troca de óleo"
3. Bot pergunta primeira etapa
4. Responda: "Verificar nível do óleo"
5. Bot deve retornar: "type": "decision"
```

---

## 📊 EXEMPLO DE JSON

```json
{
  "complete": true,
  "process": {
    "name": "Troca de Óleo",
    "steps": [
      {
        "order": 1,
        "title": "Receber veículo",
        "type": "io",
        "duration": "5 min"
      },
      {
        "order": 2,
        "title": "Verificar nível de óleo",
        "type": "decision",
        "duration": "3 min"
      },
      {
        "order": 3,
        "title": "Drenar óleo usado",
        "type": "process",
        "duration": "10 min"
      },
      {
        "order": 4,
        "title": "Gerar checklist",
        "type": "document",
        "duration": "5 min"
      }
    ]
  }
}
```

---

## ⚠️ PROBLEMAS CONHECIDOS

### 1. Node.js v18 (warning)
- **Problema:** Pacote `marked@16.4.1` requer Node >= 20
- **Impacto:** Apenas warning, não quebra nada
- **Solução futura:** Atualizar Node.js no servidor

### 2. Bundle grande (warning)
- **Problema:** index.js com 1.3MB (> 500KB)
- **Impacto:** Carregamento inicial mais lento
- **Solução futura:** Code splitting com dynamic imports

### 3. Permissões vite (resolvido)
- **Problema:** `vite: Permission denied`
- **Solução:** `chmod +x node_modules/.bin/vite`

---

## 🆘 AJUDA RÁPIDA

### Site não carrega?
```bash
# 1. Verificar build
ssh root@157.245.227.227 "ls /var/www/maquina-processos/build"

# 2. Restart Caddy
ssh root@157.245.227.227 "docker restart n8n-docker-caddy-caddy-1"

# 3. Ver logs
ssh root@157.245.227.227 "docker logs n8n-docker-caddy-caddy-1 --tail 50"
```

### Formas não aparecem?
1. Limpar cache (Ctrl+Shift+R)
2. Verificar console (F12)
3. Conferir se `type` está no JSON

### Bot não identifica tipos?
1. Verificar se prompt foi atualizado no N8N
2. Testar palavras-chave: "verificar", "receber", "gerar"
3. Ver JSON retornado pelo bot

---

## 📞 COMANDOS ÚTEIS

### Git:
```bash
git pull origin main
git add .
git commit -m "Sua mensagem"
git push origin main
```

### Deploy:
```bash
ssh root@157.245.227.227 "cd /var/www/maquina-processos && git pull && npm run build && docker restart n8n-docker-caddy-caddy-1"
```

### Build Local:
```bash
npm run build
```

### Ver Logs:
```bash
ssh root@157.245.227.227 "docker logs n8n-docker-caddy-caddy-1 --tail 50"
```

---

## 💡 DECISÕES DE DESIGN

### Por que ReactFlow?
- Robusto, bem mantido
- Drag-and-drop nativo
- Comunidade ativa

### Por que CSS transforms?
- Mais performático que SVG
- Controle fino sobre formas
- Fácil de customizar

### Por que tooltips?
- Interface limpa
- Não sacrifica informação
- Padrão UX moderno

---

## 📚 REFERÊNCIAS

### Dependências:
- `@xyflow/react` - ReactFlow
- `lucide-react` - Ícones
- `tailwindcss` - Estilos
- `framer-motion` - Animações

### Links:
- **App:** https://maquina.intentomarcas.com.br
- **N8N:** https://n8n.intentomarcas.com.br
- **GitHub:** https://github.com/intentodesign/Saasmquinadeprocessos

---

## ✅ CHECKLIST DE CONTINUAÇÃO

```
[ ] Atualizou prompt no N8N?
[ ] Testou identificação de tipos?
[ ] Verificou formas no navegador?
[ ] Leu este arquivo completo?
[ ] Consegue fazer deploy?
```

---

## 🎯 OBJETIVO ALCANÇADO

**Meta:** Interface visual de fluxogramas com tipos automáticos
**Status:** 95% COMPLETO
**Falta:** Atualizar prompt no N8N (manual, 5 min)

---

**BOA SORTE! 🚀**

_Última atualização: 30 Out 2025_
_Commit: 87fd364a_
