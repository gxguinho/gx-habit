# Workflow Obrigatório - GX-Habit

## Fluxo de Desenvolvimento Mandatório

O Claude principal **DEVE OBRIGATORIAMENTE** seguir este fluxo em todas as tarefas de desenvolvimento:

```
┌─────────────────────────────────────────────────────────────┐
│  FASE 1: PLANEJAMENTO                                       │
│  Comando: /subagent-architect                               │
│  Responsável: Subagent Arquiteto                            │
│  Output: Arquitetura completa e detalhada                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  FASE 2: IMPLEMENTAÇÃO                                      │
│  Responsável: Claude Principal                              │
│  Input: Arquitetura do subagent-architect                   │
│  Output: Código implementado                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  FASE 3: ANÁLISE DE QUALIDADE                               │
│  Comando: /subagent-test                                    │
│  Responsável: Subagent Analista de Testes                   │
│  Output: Plano de testes + Recomendações                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  FASE 4: ANÁLISE DE SEGURANÇA                               │
│  Comando: /subagent-security                                │
│  Responsável: Subagent Especialista em Segurança            │
│  Output: Relatório de segurança + Correções necessárias     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  FASE 5: TESTES & CORREÇÕES (EXECUÇÃO)                      │
│  Responsável: Claude Principal                              │
│  Input: Plano de testes + Relatório de segurança            │
│  Output: Testes executados + Vulnerabilidades corrigidas    │
└─────────────────────────────────────────────────────────────┘
```

## Regras Estritas

### ✅ OBRIGATÓRIO

1. **Sempre iniciar com /subagent-architect**
   - Antes de escrever qualquer código
   - Aguardar o output completo de arquitetura
   - Revisar e entender todo o planejamento

2. **Implementar seguindo o plano**
   - Não desviar da arquitetura planejada
   - Se necessário ajustar, chamar /subagent-architect novamente
   - Documentar decisões de implementação

3. **Sempre chamar /subagent-test após implementação**
   - Não pular esta etapa
   - Aguardar análise completa
   - Revisar todas as recomendações

4. **Sempre chamar /subagent-security após subagent-test**
   - Análise de segurança é OBRIGATÓRIA
   - Aguardar relatório completo de vulnerabilidades
   - Priorizar correções por criticidade

5. **Executar testes e correções baseado nos planos**
   - Implementar os testes recomendados
   - Corrigir vulnerabilidades de segurança identificadas
   - Executar os testes
   - Validar correções de segurança
   - Atingir métricas de qualidade

### ❌ PROIBIDO

1. **Implementar sem planejamento**
   - Nunca codificar antes de chamar /subagent-architect
   - Não "pular" a fase de arquitetura

2. **Subagents executarem código**
   - Subagent-test APENAS analisa e recomenda
   - Subagent-security APENAS analisa e recomenda
   - NUNCA implementam ou executam
   - Apenas o Claude principal executa

3. **Ignorar recomendações**
   - Não ignorar issues de qualidade
   - Não pular testes críticos
   - Não ignorar problemas de acessibilidade
   - Não ignorar vulnerabilidades de segurança (CRÍTICO!)

## Exemplo de Uso

### Tarefa: "Implementar tela principal do water tracker"

#### ✅ CORRETO:

```
1. Claude Principal executa: /subagent-architect
   → Aguarda output com arquitetura completa

2. Claude Principal implementa código baseado no plano
   → Cria componentes
   → Implementa lógica
   → Configura tema

3. Claude Principal executa: /subagent-test
   → Aguarda análise e plano de testes

4. Claude Principal executa: /subagent-security
   → Aguarda relatório de segurança e vulnerabilidades

5. Claude Principal implementa correções e testes
   → Corrige vulnerabilidades CRÍTICAS primeiro
   → Cria arquivos de teste
   → Implementa testes de segurança
   → Executa testes com npx vitest
   → Valida correções de segurança
   → Valida cobertura
```

#### ❌ ERRADO:

```
1. Claude Principal começa a codificar direto
   → ❌ Faltou planejamento!

2. Claude Principal ignora /subagent-test
   → ❌ Faltou análise de qualidade!

3. Claude Principal ignora /subagent-security
   → ❌ Faltou análise de segurança!

4. Subagent-test ou subagent-security executam npx vitest
   → ❌ Subagents não devem executar!

5. Claude Principal implementa sem corrigir vulnerabilidades
   → ❌ Segurança é obrigatória!
```

## Responsabilidades por Agente

### 🏗️ Subagent-Architect
**O que FAZ:**
- ✅ Analisar requisitos
- ✅ Planejar arquitetura
- ✅ Definir componentes shadcn/ui
- ✅ Especificar estrutura de dados
- ✅ Criar design system
- ✅ Mapear fluxos UX
- ✅ Definir estratégia de performance

**O que NÃO FAZ:**
- ❌ Implementar código
- ❌ Criar arquivos
- ❌ Executar comandos
- ❌ Fazer testes

### 🔧 Claude Principal
**O que FAZ:**
- ✅ Chamar subagents no momento certo
- ✅ Implementar código baseado no plano
- ✅ Criar arquivos e componentes
- ✅ Executar comandos (npm, git, etc)
- ✅ Implementar testes
- ✅ Executar testes (npx vitest, etc)
- ✅ Corrigir issues
- ✅ Fazer commits

**O que NÃO FAZ:**
- ❌ Pular fase de planejamento
- ❌ Ignorar recomendações dos subagents
- ❌ Implementar sem arquitetura

### 🧪 Subagent-Test
**O que FAZ:**
- ✅ Analisar código implementado
- ✅ Identificar gaps de qualidade
- ✅ Recomendar estratégia de testes
- ✅ Criar plano de testes detalhado
- ✅ Especificar casos de teste
- ✅ Sugerir melhorias

**O que NÃO FAZ:**
- ❌ Implementar testes
- ❌ Executar testes
- ❌ Modificar código
- ❌ Criar arquivos
- ❌ Executar comandos

### 🔒 Subagent-Security
**O que FAZ:**
- ✅ Auditar código em busca de vulnerabilidades
- ✅ Identificar riscos de segurança (XSS, injection, etc.)
- ✅ Analisar segurança de PWA e service workers
- ✅ Verificar conformidade com privacidade (LGPD/GDPR)
- ✅ Validar tratamento de inputs/outputs
- ✅ Analisar dependências (npm audit)
- ✅ Criar relatório de segurança detalhado
- ✅ Priorizar vulnerabilidades por criticidade
- ✅ Recomendar correções específicas
- ✅ Sugerir testes de segurança

**O que NÃO FAZ:**
- ❌ Implementar correções de segurança
- ❌ Executar comandos (npm audit, etc.)
- ❌ Modificar código
- ❌ Criar arquivos
- ❌ Executar testes

## Checklist de Validação

Antes de considerar uma tarefa completa, verificar:

### Planejamento ✓
- [ ] /subagent-architect foi chamado
- [ ] Arquitetura foi revisada e compreendida
- [ ] Decisões arquiteturais estão documentadas

### Implementação ✓
- [ ] Código segue a arquitetura planejada
- [ ] Componentes shadcn/ui corretos instalados
- [ ] Tema zinc + purple configurado
- [ ] TypeScript sem erros
- [ ] Ultracite check passa sem issues

### Qualidade ✓
- [ ] /subagent-test foi chamado
- [ ] Plano de testes foi recebido
- [ ] Recomendações foram revisadas

### Segurança ✓
- [ ] /subagent-security foi chamado
- [ ] Relatório de segurança foi recebido
- [ ] Vulnerabilidades CRÍTICAS corrigidas
- [ ] Vulnerabilidades ALTAS corrigidas
- [ ] Testes de segurança implementados
- [ ] npm audit sem vulnerabilidades críticas

### Testes ✓
- [ ] Testes implementados (Claude principal)
- [ ] Testes de segurança implementados (Claude principal)
- [ ] Testes executados (Claude principal)
- [ ] Cobertura mínima atingida
- [ ] Testes de acessibilidade passam
- [ ] Performance targets atingidos

## Notas Importantes

1. **Comunicação**: Os subagents retornam outputs em markdown detalhados. Leia-os completamente.

2. **Iteração**: Se necessário ajustar o plano durante implementação:
   - Documente o porquê
   - Considere chamar /subagent-architect novamente
   - Mantenha coerência arquitetural

3. **Qualidade**: Não comprometa qualidade por velocidade. É melhor:
   - Planejar bem
   - Implementar corretamente
   - Testar completamente

4. **Acessibilidade**: Requisito OBRIGATÓRIO do MVP. Não é opcional.

5. **Performance**: TTI < 2s e bundle < 200KB são alvos rigorosos.

6. **Segurança**: CRÍTICO! Vulnerabilidades de segurança devem ser corrigidas antes de deploy:
   - Vulnerabilidades CRÍTICAS: Bloqueiam deploy
   - Vulnerabilidades ALTAS: Devem ser corrigidas
   - Vulnerabilidades MÉDIAS: Planejar correção
   - Vulnerabilidades BAIXAS: Backlog

---

**Lembre-se**: Este workflow existe para garantir qualidade, acessibilidade, performance E segurança desde o início. Seguir o processo é obrigatório!
