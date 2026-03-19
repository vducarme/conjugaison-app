# PLANO DE DECISÕES — Conjugaison App

---

## FASE 1: INTERPRETAÇÃO DA INTENÇÃO

### O que o usuário pediu (literal)
App de treino de conjugação francesa com missões diárias de 10 verbos, explicações de erro por IA, análise pós-sessão, tracking de progresso e login.

### O que está implícito
- O público é um aprendiz de francês (provavelmente lusófono) que precisa de prática repetitiva e feedback imediato.
- O formato "missão diária" implica gamificação leve (streak, progresso), não um quiz acadêmico.
- "Explicação profunda do erro" implica IA generativa (não regras fixas) — o feedback deve ser contextual ao erro específico.
- Mobile é o dispositivo primário — sessões curtas, em trânsito.
- O app deve ter atrito mínimo entre "abrir" e "conjugar".

### O que foi excluído explicitamente
- Google OAuth: botão existe no código mas está oculto (`{false && (...)}`) até credenciais serem configuradas.
- Limite de uma sessão por dia: removido. Usuário faz quantas sessões quiser.
- Criação de conta social: apenas email/senha por enquanto.

### Perfil do usuário
- Aprendiz intermediário de francês.
- Familiaridade com apps de estudo (Duolingo, Anki).
- Espera feedback instantâneo, não quer esperar.
- Usa primariamente no celular.

---

## FASE 2: ESCOPO MÍNIMO

### Must-have (implementado)
1. **Autenticação** — Email/senha via Supabase Auth.
2. **Tela home neutra** — Estado padrão entre sessões, com CTA para iniciar.
3. **Sessão de 10 exercícios** — Verbos e tempos variados, gerados por seed diária.
4. **Input inline** — Formato "Je .... (avoir au imparfait)" com campo de texto.
5. ~~**Teclado de acentos**~~ — **Removido.** O teclado nativo do dispositivo já fornece acentos franceses. O componente adicionava complexidade (forwardRef, cursor tracking) sem benefício real. Usuário digita acentos pelo próprio teclado.
6. **Botão "Valider"** — Submit visível para mobile (não só Enter).
7. **Feedback imediato** — Correto: mensagem positiva variada + micro-recompensa. Incorreto: resposta correta + estrutura gramatical do tempo + **diagnóstico IA** (1-2 frases identificando a confusão específica do usuário — radical errado, auxiliar errado, confusão de tempo, etc.). A IA não repete a resposta correta nem a regra geral; a UI já exibe ambos. Prompt reescrito com `max_tokens: 120, temperature: 0.5`.
8. **Análise pós-sessão** — IA analisa padrões de erro e dá dicas acionáveis.
9. **Dashboard de progresso** — Precisão por tempo verbal, por grupo, streak.
10. **Múltiplas sessões por dia** — Sem constraint `unique(user_id, date)` no DB.
11. **Persistência** — Sessões salvas no Supabase, progresso calculado no client.
12. **Retomada de sessão** — Sessão em andamento persistida em `localStorage`. Se o usuário sai (fecha aba, navega fora, recarrega) e volta, a home mostra "Reprendre" para retomar do exercício exato onde parou. Opção de descartar e começar nova sessão também disponível.
13. **Seletor de tempos verbais** — Pills na home permitem escolher quais tempos treinar. Todos selecionados por padrão; mínimo de 1 obrigatório (último tempo não pode ser desmarcado). Seleção passada ao `generateDailyExercises` via `allowedTenses`; sessão mantém sempre 10 exercícios.

### Nice-to-have (não implementado ainda)
- Google OAuth (código pronto, oculto).
- Modo revisão (refazer exercícios errados).
- Notificações push / lembretes.
- Leaderboard / social.
- Modo offline (Service Worker + cache).

### Implementado recentemente
- **Ilustração do cão na home** — `dog1.svg`, `dog2.svg`, `dog3.svg` em `public/`. Rotação diária via seed de data (mesma lógica LCG de `engine.ts`, inline em `page.tsx`). Elemento decorativo, `aria-hidden`, `w-40`, acima do bloco de status/CTA.

### Fora de escopo
- App nativo (React Native / Flutter).
- Exercícios além de conjugação (vocabulário, gramática geral).
- Conteúdo gerado inteiramente por IA (verbos e conjugações são banco estático verificado).
- Multi-idioma (apenas francês).
- Painel admin.

---

## FASE 3: ARQUITETURA DE COMPONENTES

### Stack
| Camada | Tecnologia | Decisão |
|--------|-----------|---------|
| Framework | Next.js 14 (App Router) | SSR não necessário para este app, mas App Router dá estrutura de rotas e API routes integradas. |
| Linguagem | TypeScript | Tipos fortes previnem bugs em lógica de conjugação. |
| Estilos | Tailwind CSS | Tokens customizados, sem CSS-in-JS runtime. |
| Auth + DB | Supabase | Auth pronto, Postgres com RLS, SDK leve. |
| IA | OpenAI API (GPT) | Feedback contextual e análise de padrões. Lazy-loaded (`getOpenAI()`) para evitar crash em build. |
| Fonte UI | Jost (geometric sans) | Neutralidade geométrica, boa legibilidade em UI. |
| Fonte francesa | Source Serif 4 | Serifa elegante para frases em francês — diferencia conteúdo de UI. |

### Ordem de build (executada)
1. Tipos (`src/types/index.ts`)
2. Banco de verbos (`src/lib/verbs.ts`) — 60 verbos, 22+ conjugados em 7 tempos
3. Engine de exercícios (`src/lib/engine.ts`) — seed determinística, distribuição equilibrada de tempos
4. Clientes Supabase (`src/lib/supabase.ts`, `supabase-server.ts`)
5. Hooks (`useAuth`, `useProgress`)
6. Componentes UI (ExerciseCard, ProgressBar, FeedbackPanel, SessionSummary, ProgressDashboard, AuthScreen)
7. API routes (`/api/feedback`, `/api/analyze`)
8. Página principal (`page.tsx`) — orquestra todo o fluxo
9. Schema SQL + deploy no Supabase

### Árvore de componentes
```
page.tsx (orquestrador)
├── AuthScreen              # Login/registro
├── Home view               # Estado neutro
│   ├── TenseSelector       # Pills para selecionar tempos a treinar (todos por padrão)
│   ├── "Reprendre"         # CTA primário se há sessão salva (localStorage)
│   ├── "Commencer"         # CTA primário se não há sessão salva
│   ├── BarChart3 → Dashboard
│   └── LogOut → Sign out
├── Exercise view           # Fluxo de 10 exercícios
│   ├── ProgressBar         # Barra de progresso periférica
│   ├── ExerciseCard        # Card central com input
│   └── FeedbackPanel       # Feedback correto/incorreto + IA
├── SessionSummary          # Resumo + análise IA pós-sessão
└── ProgressDashboard       # Estatísticas por tempo/grupo/streak
```

### Decisões de dados
- **Progresso calculado no client** a partir das sessões brutas — evita tabela de cache que desincroniza.
- **Data local (não UTC)** — `getLocalDateString()` usa `getFullYear/getMonth/getDate` do navegador. `toISOString()` causava bugs de timezone.
- **Seed diária** — `YYYYMMDD` como inteiro → Fisher-Yates shuffle. Mesmos 10 verbos ao recarregar no mesmo dia, mas sessões múltiplas são permitidas.
- **Elision francesa** — `h` tratado como vogal (h muet). Trade-off documentado: h aspiré (haïr, heurter) não tem elision mas são raros no banco atual.
- **Sessão em andamento em localStorage** — Persistida a cada mudança de estado (exercício, resposta, índice). Chave inclui `userId` para não misturar contas. Ao restaurar, volta a `"answering"` (não restaura estado de feedback stale). Sessões completas são limpas automaticamente. Falha de localStorage é silenciosa — não quebra o app.
- **Estrutura gramatical por tempo — estática, não gerada por IA** — Cada tempo verbal tem uma fórmula fixa definida no código (ex: passé composé = `avoir/être au présent + participe passé`). Aparece apenas no feedback de erro, acima da explicação da IA. Decisão: dado estático verificado > IA para regras gramaticais (IA pode alucinar terminações; a fórmula estrutural é invariável).
- **Uso de cada tempo verbal — estático, não gerado por IA** — `TENSE_USAGE` no `FeedbackPanel` descreve quando cada tempo é usado na língua real (ex: imparfait = descrições, hábitos passados). Aparece no feedback de erro abaixo da estrutura gramatical. Mesma razão: dado pedagógico verificado > IA para regras invariáveis.
- **Seleção de tempos por sessão** — `generateDailyExercises` aceita `allowedTenses?: Tense[]`. Se fornecido, distribui os 10 exercícios apenas entre os tempos selecionados (mantendo distribuição equilibrada dentro do pool). Se não fornecido, usa todos os tempos. Estado `selectedTenses` vive em `page.tsx` e é inicializado com todos os tempos.

---

## FASE 4: HIERARQUIA VISUAL E PRINCÍPIOS COGNITIVOS

### Paleta
| Token | Valor | Uso |
|-------|-------|-----|
| `bg-surface` | `#FAFAF7` | Fundo principal — off-white quente, reduz fadiga |
| `bg-surface-card` | `#FFFFFF` | Cards — destaque sutil sobre o fundo |
| `bg-surface-muted` | `#F3F2EE` | Elementos periféricos, pills |
| `text-ink` | `#1C1917` | Texto primário |
| `text-ink-muted` | `#78716C` | Texto secundário |
| `text-ink-faint` | `#A8A29E` | Texto terciário (labels, hints) |
| `bg-accent` | `#4F46E5` | Ação primária (indigo) |
| `bg-correct` | `#16A34A` | Feedback positivo |
| `bg-incorrect` | `#DC2626` | Feedback negativo |

### Princípios cognitivos aplicados

**1. Efeito Von Restorff (isolamento)**
- O input de resposta é o único elemento com borda de destaque. Tudo ao redor é neutro.
- Pill do tempo verbal usa `bg-surface-muted text-ink-muted` — informa sem competir com o input.

**2. Lei de Fitts (tamanho/distância do alvo)**
- Botão "Valider" é grande e próximo ao input — acessível com polegar em mobile.
- CTA "Commencer" / "Reprendre" na home é o maior elemento da tela.

**3. Peak-End Rule (pico e fim)**
- **Pico**: Feedback positivo com mensagens variadas + ícone Sparkles (micro-recompensa).
- **Fim**: SessionSummary com análise IA personalizada — o usuário sai com insights, não com um número seco.

**4. Carga cognitiva mínima**
- Uma pergunta por tela. Sem distrações laterais.
- ProgressBar periférica (topo, discreta) — informa progresso sem pressionar.
- Home neutra — sem bombardeio de métricas. Só CTA + info mínima (sessões hoje, precisão).
- Sessão interrompida retomável — "Reprendre" na home. Sem perda de progresso, sem ansiedade.
- **Estrutura gramatical no erro (chunking)** — Mostrar `auxiliaire + participe passé` antes da explicação da IA reduz carga cognitiva: o aprendiz ancora o erro numa regra antes de processar o detalhe contextual. Ordem no erro: estrutura → quando usar → diagnóstico IA.
- **TenseSelector na home (controle sem atrito)** — Pills compactas com todos os tempos selecionados por padrão. Usuário que não quer configurar nada ignora e clica "Commencer". Usuário que quer focar num tempo específico ajusta sem sair da tela.
- **TenseSelector chip — estilo selecionado secundário** — Estado selecionado usa `border-accent text-accent bg-accent/[0.07]` (borda + texto indigo, fundo indigo 7% de opacidade) em vez de `bg-accent text-white` (fundo sólido indigo). Razão: o CTA "Commencer/Reprendre" deve ser o único elemento com fill de cor sólida na home (Von Restorff + hierarquia primário/secundário). Chips selecionados precisam ser distinguíveis mas não competir com o botão principal.
- **"Recommencer" volta à home** — Ao clicar "Recommencer une nouvelle session" no `SessionSummary`, o estado vai para `"home"` (`setView("home")`) em vez de chamar `startNewSession()` diretamente. Razão: permite ao usuário reconfigurar os tempos verbais antes de iniciar a próxima sessão — ciclo mais claro (home → configurar → sessão).

**5. Estado padrão (Default Effect)**
- Home abre com CTA "Commencer" — a ação padrão é começar a sessão, não navegar.
- Após completar sessão, "Retour à l'accueil" leva de volta ao estado neutro — ciclo claro.

### Densidade e espaçamento
- **Spacious**: `px-6`, `pt-6`, `gap-3`, `py-4 px-8` nos CTAs.
- Cards com `p-6 rounded-2xl shadow-sm` — sensação de objeto flutuante.
- `animate-fade-in` em transições — sem pop abrupto.

### Tipografia
- **Jost** (sans-serif geométrica): UI, botões, labels. Peso 400/600.
- **Source Serif 4** (serifa): Frases em francês no ExerciseCard. Peso 400. Cria distinção imediata entre "interface" e "conteúdo".
- Hierarquia: `text-xl` (título), `text-lg` (CTA), `text-base` (conteúdo), `text-sm` (secundário), `text-xs` (terciário).

### 3 estados obrigatórios
Todo elemento interativo implementa:
1. **Empty/Default** — Estado inicial, pronto para interação.
2. **Loading** — Spinner `Loader2` com `animate-spin` onde há fetch assíncrono.
3. **Error** — Mensagem em francês, tom neutro, sem culpabilização.
