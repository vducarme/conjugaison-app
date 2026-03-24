// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Página principal — Orquestra todo o fluxo do app
// Estado padrão: home neutra com CTA para começar sessão
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, LogOut, BarChart3, Play } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import { generateDailyExercises, validateAnswer } from "@/lib/engine";
import { TENSES } from "@/lib/verbs";
import { AuthScreen } from "@/components/AuthScreen";
import { ExerciseCard } from "@/components/ExerciseCard";
import { ProgressBar } from "@/components/ProgressBar";
import { FeedbackPanel } from "@/components/FeedbackPanel";
import { SessionSummary } from "@/components/SessionSummary";
import { ProgressDashboard } from "@/components/ProgressDashboard";
import { TenseSelector } from "@/components/TenseSelector";
import type { Exercise, ExerciseResult, ExerciseFlowState, Tense } from "@/types";

// [DECISÃO] Views do app — "home" é o estado neutro entre sessões, permite voltar a qualquer momento
type AppView = "home" | "exercise" | "dashboard" | "summary";

// ── Session persistence via localStorage ──

// [DECISÃO] Sessão em andamento persistida em localStorage — se o usuário sair (fechar aba, navegar fora,
// recarregar) e voltar, retoma exatamente de onde parou. Evita frustração de perder progresso parcial.
// Chave inclui userId para não misturar sessões entre contas no mesmo navegador.
const SESSION_STORAGE_KEY = "conjugaison_active_session";

interface PersistedSession {
  userId: string;
  exercises: Exercise[];
  currentIndex: number;
  results: ExerciseResult[];
  userAnswer: string;
  flowState: ExerciseFlowState;
}

function saveSessionToStorage(session: PersistedSession) {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // [DECISÃO] Falha silenciosa — localStorage pode estar cheio ou desabilitado. Não quebra o app.
  }
}

function loadSessionFromStorage(userId: string): PersistedSession | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const session: PersistedSession = JSON.parse(raw);
    // [DECISÃO] Valida userId — não restaura sessão de outro usuário
    if (session.userId !== userId) return null;
    // [DECISÃO] Não restaura sessões completas — se já terminou, limpa e mostra home
    if (session.flowState === "session-complete") {
      clearSessionFromStorage();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function clearSessionFromStorage() {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // Falha silenciosa
  }
}

export default function Home() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { progress, loading: progressLoading, error: progressError, fetchProgress, saveSession } = useProgress(user?.id);

  // ── Exercise state ──
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [flowState, setFlowState] = useState<ExerciseFlowState>("answering");
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [view, setView] = useState<AppView>("home");
  const [todaySessions, setTodaySessions] = useState(0);
  const [sessionRestored, setSessionRestored] = useState(false);
  // [DECISÃO] Todos os tempos selecionados por padrão — usuário pode restringir antes de iniciar
  const [selectedTenses, setSelectedTenses] = useState<Tense[]>([...TENSES]);

  // ── Fetch progress on mount + restore session ──
  useEffect(() => {
    if (user) {
      fetchProgress();
      countTodaySessions();

      // [DECISÃO] Restaura sessão em andamento ao montar — usuário vê "Reprendre" na home ou retoma direto
      const persisted = loadSessionFromStorage(user.id);
      if (persisted && persisted.exercises.length > 0) {
        setExercises(persisted.exercises);
        setCurrentIndex(persisted.currentIndex);
        setResults(persisted.results);
        setUserAnswer(persisted.userAnswer);
        // [DECISÃO] Ao restaurar, volta ao estado "answering" mesmo que estivesse em feedback —
        // simplifica o fluxo e evita restaurar estado de feedback com dados stale
        setFlowState("answering");
        setSessionRestored(true);
        // Não muda view para "exercise" automaticamente — mostra na home um botão "Reprendre"
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ── Persist session state on every meaningful change ──
  useEffect(() => {
    if (!user || view !== "exercise" || exercises.length === 0) return;
    if (flowState === "session-complete") {
      clearSessionFromStorage();
      return;
    }
    saveSessionToStorage({
      userId: user.id,
      exercises,
      currentIndex,
      results,
      userAnswer,
      flowState,
    });
  }, [user, view, exercises, currentIndex, results, userAnswer, flowState]);

  // [DECISÃO] Conta sessões do dia — informativo, não bloqueante. Usuário pode fazer quantas quiser.
  async function countTodaySessions() {
    if (!user) return;
    setTodaySessions(0);
  }

  // [DECISÃO] Inicia nova sessão — sempre permite, sem verificação de "já fez hoje"
  function startNewSession() {
    const daily = generateDailyExercises(new Date(), 10, selectedTenses);
    setExercises(daily.exercises);
    setCurrentIndex(0);
    setUserAnswer("");
    setResults([]);
    setFlowState("answering");
    setSessionRestored(false);
    setView("exercise");
  }

  // [DECISÃO] Retoma sessão salva — restaura estado e vai direto para exercício
  function resumeSession() {
    setFlowState("answering");
    setView("exercise");
  }

  const currentExercise = exercises[currentIndex];

  // ── Submit answer ──
  const handleSubmit = useCallback(() => {
    if (!currentExercise || !userAnswer.trim()) return;

    const isCorrect = validateAnswer(currentExercise, userAnswer);

    const result: ExerciseResult = {
      exercise: currentExercise,
      userAnswer: userAnswer.trim(),
      isCorrect,
      timestamp: Date.now(),
    };

    setResults((prev) => [...prev, result]);
    setFlowState(isCorrect ? "feedback-correct" : "feedback-incorrect");
  }, [currentExercise, userAnswer]);

  // ── Continue to next exercise ──
  const handleContinue = useCallback(() => {
    if (currentIndex + 1 >= exercises.length) {
      // [DECISÃO] Sessão completa — salva e mostra summary
      setFlowState("session-complete");
      setView("summary");
      clearSessionFromStorage();
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setUserAnswer("");
    setFlowState("answering");
  }, [currentIndex, exercises.length]);

  // [DECISÃO] saveSession disparado via useEffect em vez de callback direto — garante que
  // results já contém todos os exercícios (setState é assíncrono). Dependency em flowState
  // evita salvar parcialmente se o render não atualizou results ainda.
  useEffect(() => {
    if (flowState === "session-complete" && results.length === exercises.length && exercises.length > 0) {
      saveSession(results);
      setTodaySessions((prev) => prev + 1);
      setSessionRestored(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowState]);

  // [DECISÃO] Voltar à home — estado neutro, preserva sessão em andamento no localStorage
  const goHome = useCallback(() => {
    setView("home");
    fetchProgress();
    // [DECISÃO] Não limpa a sessão ao ir para home — permite retomar depois via "Reprendre"
    if (exercises.length > 0 && flowState !== "session-complete") {
      setSessionRestored(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercises.length, flowState]);

  // ── Loading state (auth) ──
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 text-accent animate-spin" />
      </div>
    );
  }

  // ── Not authenticated ──
  // [DECISÃO] window.location.reload() após auth — garante que useAuth re-avalia o estado da sessão Supabase
  // do zero, evitando edge cases onde o listener onAuthStateChange não dispara corretamente em Safari/mobile
  if (!user) {
    return <AuthScreen onAuthSuccess={() => window.location.reload()} />;
  }

  // ── Dashboard view ──
  if (view === "dashboard") {
    return (
      <ProgressDashboard
        progress={progress}
        loading={progressLoading}
        error={progressError}
        onBack={goHome}
      />
    );
  }

  // ── Session Summary view ──
  if (view === "summary" && flowState === "session-complete") {
    return (
      <SessionSummary
        results={results}
        onViewDashboard={() => {
          fetchProgress();
          setView("dashboard");
        }}
        onGoHome={goHome}
      />
    );
  }

  // ── Home view — état neutre ──
  if (view === "home") {
    const overallAccuracy = progress && progress.totalExercises > 0
      ? Math.round((progress.totalCorrect / progress.totalExercises) * 100)
      : null;

    // [DECISAO] Rotacao diaria com hash da data local - continua estavel por dia,
    // mas evita o viés do primeiro valor do LCG com seeds sequenciais, que estava
    // prendendo quase todas as datas no mesmo cachorro.
    const dogIndex = (() => {
      const now = new Date();
      const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
        now.getDate(),
      ).padStart(2, "0")}`;
      let hash = 0;
      for (let i = 0; i < dateKey.length; i += 1) {
        hash = (hash * 31 + dateKey.charCodeAt(i)) >>> 0;
      }
      return (hash % 3) + 1;
    })();

    return (
      <div className="flex flex-col min-h-screen">
        {/* ── Header com logout ── */}
        <header className="flex items-center justify-between px-6 pt-6 pb-2">
          <h1 className="font-serif text-xl font-semibold text-ink">Conjuju</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchProgress();
                setView("dashboard");
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center
                hover:bg-surface-muted transition-colors"
              aria-label="Voir progression"
            >
              <BarChart3 className="w-4 h-4 text-ink-faint" />
            </button>
            <button
              onClick={signOut}
              className="w-9 h-9 rounded-full flex items-center justify-center
                hover:bg-surface-muted transition-colors"
              aria-label="Se déconnecter"
            >
              <LogOut className="w-4 h-4 text-ink-faint" />
            </button>
          </div>
        </header>

        {/* ── Contenu principal ── */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 animate-fade-in">
          {/* [DECISÃO] Ilustração do cão — decorativa, âncora emocional (Peak-End Rule).
              Rotação diária via seed de data: mesmo cão o dia inteiro, troca à meia-noite.
              w-40 = 160px: visível sem competir com o CTA. <img> em vez de next/image —
              SVGs line-art complexos não precisam de otimização de imagem rasterizada. */}
          <img
            src={`/dog${dogIndex}.svg`}
            alt=""
            aria-hidden="true"
            className="w-40 h-auto mb-6 opacity-90"
          />

          {/* [DECISÃO] Home neutra com CTA claro — Default Effect: ação principal é começar sessão */}
          <div className="mb-8 text-center w-full">
            <p className="text-sm text-ink-muted mb-1">
              {sessionRestored
                ? `Session en cours — ${currentIndex + 1}/${exercises.length}`
                : todaySessions > 0
                  ? `${todaySessions} session${todaySessions > 1 ? "s" : ""} aujourd'hui`
                  : "Prêt pour votre session ?"}
            </p>
            {overallAccuracy !== null && (
              <p className="text-xs text-ink-faint">
                Précision globale : {overallAccuracy}%
                {progress && progress.currentStreak > 0 && (
                  <span className="ml-2">🔥 {progress.currentStreak} jour{progress.currentStreak > 1 ? "s" : ""}</span>
                )}
              </p>
            )}
          </div>

          {/* [DECISÃO] Se há sessão salva, CTA principal é "Reprendre". Nova sessão fica secundário abaixo. */}
          {sessionRestored ? (
            <>
              <button
                onClick={resumeSession}
                className="flex items-center gap-3 py-4 px-8 rounded-2xl
                  font-semibold text-white bg-accent text-lg
                  hover:bg-accent-light active:scale-[0.97]
                  transition-all duration-150 shadow-sm"
              >
                <Play className="w-5 h-5" />
                Reprendre
              </button>
              <button
                onClick={() => {
                  // [DECISÃO] Não inicia sessão direto — volta para home para o usuário
                  // poder reconfigurar os tempos verbais antes de começar nova sessão
                  clearSessionFromStorage();
                  setSessionRestored(false);
                  setView("home");
                }}
                className="mt-4 text-sm text-ink-muted hover:text-ink transition-colors"
              >
                Recommencer une nouvelle session
              </button>
            </>
          ) : (
            <>
              {/* [DECISÃO] TenseSelector acima do CTA — usuário configura a sessão antes de iniciar */}
              <div className="w-full mb-6">
                <TenseSelector
                  selected={selectedTenses}
                  onChange={setSelectedTenses}
                />
              </div>

              <button
                onClick={startNewSession}
                className="flex items-center gap-3 py-4 px-8 rounded-2xl
                  font-semibold text-white bg-accent text-lg
                  hover:bg-accent-light active:scale-[0.97]
                  transition-all duration-150 shadow-sm"
              >
                <Play className="w-5 h-5" />
                {todaySessions > 0 ? "Nouvelle session" : "Commencer"}
              </button>

              {todaySessions > 0 && (
                <p className="mt-4 text-xs text-ink-faint">
                  10 nouveaux verbes à chaque session
                </p>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Exercise flow ──
  const isFeedback = flowState === "feedback-correct" || flowState === "feedback-incorrect";

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Header: periférico ── */}
      <header className="flex items-center justify-between px-6 pt-6 pb-2">
        <ProgressBar current={currentIndex + 1} total={exercises.length} />
        <div className="flex items-center gap-2 ml-4">
          {/* [DECISÃO] Botão home durante exercício — permite abandonar e voltar ao estado neutro */}
          <button
            onClick={goHome}
            className="w-9 h-9 rounded-full flex items-center justify-center
              hover:bg-surface-muted transition-colors"
            aria-label="Retour à l'accueil"
          >
            <svg className="w-4 h-4 text-ink-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </button>
          <button
            onClick={signOut}
            className="w-9 h-9 rounded-full flex items-center justify-center
              hover:bg-surface-muted transition-colors"
            aria-label="Se déconnecter"
          >
            <LogOut className="w-4 h-4 text-ink-faint" />
          </button>
        </div>
      </header>

      {/* ── Exercise area: dominante ── */}
      {/* [DECISÃO] flex-1 + justify-center — card sempre centralizado verticalmente */}
      <div className="flex-1 flex items-center justify-center">
        {currentExercise ? (
          <ExerciseCard
            exercise={currentExercise}
            value={userAnswer}
            onChange={setUserAnswer}
            onSubmit={handleSubmit}
            disabled={isFeedback}
            state={isFeedback ? flowState as "feedback-correct" | "feedback-incorrect" : "answering"}
          />
        ) : (
          <Loader2 className="w-6 h-6 text-accent animate-spin" />
        )}
      </div>

      {/* ── Feedback panel ── */}
      {isFeedback && (
        <FeedbackPanel
          exercise={currentExercise}
          userAnswer={userAnswer}
          isCorrect={flowState === "feedback-correct"}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
}
