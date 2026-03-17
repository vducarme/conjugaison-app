// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SessionSummary — Resumo pós-sessão com análise por IA
// Peak-End Rule: última memória da sessão, precisa ser recompensadora
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState, useEffect } from "react";
import { Check, X, Loader2, BarChart3, ArrowRight, Home } from "lucide-react";
import type { ExerciseResult } from "@/types";

interface SessionSummaryProps {
  results: ExerciseResult[];
  onViewDashboard: () => void;
  onGoHome: () => void;
}

export function SessionSummary({
  results,
  onViewDashboard,
  onGoHome,
}: SessionSummaryProps) {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalCorrect = results.filter((r) => r.isCorrect).length;
  const totalExercises = results.length;
  const percentage = Math.round((totalCorrect / totalExercises) * 100);

  // [DECISÃO] Análise por IA chamada no mount — sessão acabou, é a hora de refletir
  useEffect(() => {
    fetchAnalysis();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results }),
      });

      if (!response.ok) throw new Error("Erreur");

      const data = await response.json();
      setAiAnalysis(data.analysis);
    } catch {
      setError("Impossible de charger l'analyse. Vos résultats sont sauvegardés.");
      setAiAnalysis(buildLocalAnalysis());
    } finally {
      setLoading(false);
    }
  }

  // [DECISÃO] Fallback local identifica padrões básicos — melhor que nada se a API falhar
  function buildLocalAnalysis(): string {
    const errors = results.filter((r) => !r.isCorrect);
    if (errors.length === 0) return "Parfait ! Aucune erreur aujourd'hui. Continuez comme ça !";

    const tenseErrors: Record<string, number> = {};
    errors.forEach((r) => {
      tenseErrors[r.exercise.tense] = (tenseErrors[r.exercise.tense] || 0) + 1;
    });

    const worstTense = Object.entries(tenseErrors).sort(([, a], [, b]) => b - a)[0];

    return `Vous avez fait ${errors.length} erreur${errors.length > 1 ? "s" : ""} sur ${totalExercises} exercices.\n\nLe temps verbal qui vous pose le plus de difficulté aujourd'hui : ${worstTense[0]} (${worstTense[1]} erreur${worstTense[1] > 1 ? "s" : ""}).\n\nConcentrez-vous sur les terminaisons de ce temps lors de vos prochaines sessions.`;
  }

  // [DECISÃO] Cor do score muda com performance — feedback emocional via cor (sem gamificação pesada)
  const scoreColor =
    percentage >= 80
      ? "text-feedback-success"
      : percentage >= 50
        ? "text-accent"
        : "text-feedback-error";

  return (
    <div className="px-6 py-8 animate-fade-in">
      {/* ── Header de conclusão — Peak-End: momento positivo ── */}
      <div className="text-center mb-8">
        <p className="text-sm text-ink-muted font-medium mb-2">
          Session terminée
        </p>
        <p className={`text-5xl font-bold ${scoreColor}`}>
          {totalCorrect}/{totalExercises}
        </p>
        <p className="text-sm text-ink-faint mt-1">{percentage}% de réussite</p>
      </div>

      {/* ── Lista de resultados ── */}
      <div className="space-y-2 mb-8">
        {results.map((result, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg ${
              result.isCorrect
                ? "bg-feedback-success-light"
                : "bg-feedback-error-light"
            }`}
          >
            {result.isCorrect ? (
              <Check className="w-4 h-4 text-feedback-success flex-shrink-0" strokeWidth={2.5} />
            ) : (
              <X className="w-4 h-4 text-feedback-error flex-shrink-0" strokeWidth={2.5} />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink truncate">
                {result.exercise.verb.infinitive}
                <span className="text-ink-faint font-normal ml-1.5">
                  ({result.exercise.tense})
                </span>
              </p>
              {!result.isCorrect && (
                <p className="text-xs text-ink-muted mt-0.5">
                  <span className="line-through text-feedback-error/60">{result.userAnswer}</span>
                  {" → "}
                  <span className="font-medium">{result.exercise.correctAnswer}</span>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Análise IA ── */}
      <div className="mb-8">
        <h3 className="text-xs font-medium text-ink-faint uppercase tracking-wider mb-3">
          Analyse de votre session
        </h3>
        {loading ? (
          <div className="flex items-center gap-2 py-6 justify-center text-ink-muted">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Analyse en cours...</span>
          </div>
        ) : error && !aiAnalysis ? (
          <div className="p-3 rounded-lg bg-feedback-error-light text-sm text-feedback-error">
            {error}
          </div>
        ) : aiAnalysis ? (
          <div className="p-4 rounded-xl bg-surface-muted">
            <p className="text-sm text-ink leading-relaxed whitespace-pre-line">
              {aiAnalysis}
            </p>
          </div>
        ) : null}
      </div>

      {/* ── Ações ── */}
      <div className="space-y-3">
        <button
          onClick={onViewDashboard}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl
            font-semibold text-white bg-accent
            hover:bg-accent-light active:scale-[0.98]
            transition-all duration-150"
        >
          <BarChart3 className="w-4 h-4" />
          Voir ma progression
          <ArrowRight className="w-4 h-4" />
        </button>
        {/* [DECISÃO] Botão de retour à l'accueil — permet de revenir à l'état neutre après session */}
        <button
          onClick={onGoHome}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl
            font-semibold text-accent bg-accent-faint
            hover:bg-accent/10 active:scale-[0.98]
            transition-all duration-150"
        >
          <Home className="w-4 h-4" />
          Retour à l&apos;accueil
        </button>
      </div>
    </div>
  );
}
