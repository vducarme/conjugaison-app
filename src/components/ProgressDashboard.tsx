// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ProgressDashboard — Tela de progresso histórico
// Calendário de atividade, taxa de acerto por tempo verbal, evolução
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { ArrowLeft, Flame, Target, TrendingUp, Loader2 } from "lucide-react";
import type { UserProgress, Tense } from "@/types";

interface ProgressDashboardProps {
  progress: UserProgress | null;
  loading: boolean;
  error: string | null;
  onBack: () => void;
}

// [DECISÃO] Labels legíveis para cada tempo verbal — UI precisa ser compreensível, não técnica
const TENSE_LABELS: Record<Tense, string> = {
  "présent": "Présent",
  "passé composé": "Passé composé",
  "imparfait": "Imparfait",
  "futur simple": "Futur simple",
  "conditionnel présent": "Conditionnel",
  "subjonctif présent": "Subjonctif",
  "plus-que-parfait": "Plus-que-parfait",
  "impératif": "Impératif",
};

export function ProgressDashboard({
  progress,
  loading,
  error,
  onBack,
}: ProgressDashboardProps) {
  // ── Estado: Carregamento ──
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <Loader2 className="w-6 h-6 text-accent animate-spin" />
        <p className="text-sm text-ink-muted mt-3">Chargement...</p>
      </div>
    );
  }

  // ── Estado: Erro ──
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <p className="text-sm text-feedback-error mb-4">{error}</p>
        <button
          onClick={onBack}
          className="text-sm text-accent font-medium hover:underline"
        >
          Retour
        </button>
      </div>
    );
  }

  // ── Estado: Vazio (primeiro uso) ──
  if (!progress || progress.totalSessions === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-accent-faint flex items-center justify-center mb-4">
          <TrendingUp className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-lg font-semibold text-ink mb-2">
          Pas encore de données
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-xs">
          Complétez votre première session pour voir votre progression ici.
        </p>
        <button
          onClick={onBack}
          className="py-3 px-6 rounded-xl font-semibold text-white bg-accent
            hover:bg-accent-light active:scale-[0.98] transition-all duration-150"
        >
          Commencer
        </button>
      </div>
    );
  }

  const overallAccuracy = progress.totalExercises > 0
    ? Math.round((progress.totalCorrect / progress.totalExercises) * 100)
    : 0;

  // [DECISÃO] Ordena tempos por acurácia crescente — o pior primeiro, ajuda a priorizar estudo
  const tenseStats = Object.entries(progress.accuracyByTense)
    .filter(([, stats]) => stats.total > 0)
    .map(([tense, stats]) => ({
      tense: tense as Tense,
      accuracy: Math.round((stats.correct / stats.total) * 100),
      correct: stats.correct,
      total: stats.total,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);

  return (
    <div className="min-h-screen px-6 py-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full flex items-center justify-center
            hover:bg-surface-muted transition-colors"
          aria-label="Retour"
        >
          <ArrowLeft className="w-5 h-5 text-ink-muted" />
        </button>
        <h1 className="text-lg font-semibold text-ink">Ma progression</h1>
      </div>

      {/* ── Stats cards ── */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {/* Streak */}
        <div className="flex flex-col items-center p-4 rounded-xl bg-surface-raised border border-surface-muted">
          <Flame className="w-5 h-5 text-orange-500 mb-1" />
          <span className="text-2xl font-bold text-ink">{progress.currentStreak}</span>
          <span className="text-xs text-ink-faint">jours</span>
        </div>
        {/* Précision */}
        <div className="flex flex-col items-center p-4 rounded-xl bg-surface-raised border border-surface-muted">
          <Target className="w-5 h-5 text-accent mb-1" />
          <span className="text-2xl font-bold text-ink">{overallAccuracy}%</span>
          <span className="text-xs text-ink-faint">précision</span>
        </div>
        {/* Sessions */}
        <div className="flex flex-col items-center p-4 rounded-xl bg-surface-raised border border-surface-muted">
          <TrendingUp className="w-5 h-5 text-feedback-success mb-1" />
          <span className="text-2xl font-bold text-ink">{progress.totalSessions}</span>
          <span className="text-xs text-ink-faint">sessions</span>
        </div>
      </div>

      {/* ── Acurácia por tempo verbal ── */}
      {tenseStats.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs font-medium text-ink-faint uppercase tracking-wider mb-4">
            Précision par temps verbal
          </h3>
          <div className="space-y-3">
            {tenseStats.map(({ tense, accuracy, correct, total }) => (
              <div key={tense}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-ink font-medium">
                    {TENSE_LABELS[tense] || tense}
                  </span>
                  <span className="text-xs text-ink-muted">
                    {correct}/{total} ({accuracy}%)
                  </span>
                </div>
                {/* [DECISÃO] Barra de progresso com cor dinâmica — verde>70%, accent 40-70%, vermelho <40% */}
                <div className="w-full h-2 bg-surface-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      accuracy >= 70
                        ? "bg-feedback-success"
                        : accuracy >= 40
                          ? "bg-accent"
                          : "bg-feedback-error"
                    }`}
                    style={{ width: `${accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Acurácia por grupo verbal ── */}
      <div className="mb-8">
        <h3 className="text-xs font-medium text-ink-faint uppercase tracking-wider mb-4">
          Précision par groupe verbal
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {([1, 2, 3] as const).map((group) => {
            const stats = progress.accuracyByGroup[group];
            const acc = stats && stats.total > 0
              ? Math.round((stats.correct / stats.total) * 100)
              : 0;
            const hasData = stats && stats.total > 0;

            return (
              <div
                key={group}
                className="flex flex-col items-center p-3 rounded-xl bg-surface-raised border border-surface-muted"
              >
                <span className="text-xs text-ink-faint mb-1">
                  {group === 1 ? "1er" : group === 2 ? "2ème" : "3ème"} groupe
                </span>
                <span className={`text-xl font-bold ${hasData ? "text-ink" : "text-ink-faint"}`}>
                  {hasData ? `${acc}%` : "—"}
                </span>
                {hasData && (
                  <span className="text-xs text-ink-faint">
                    {stats.correct}/{stats.total}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Botão voltar ── */}
      <button
        onClick={onBack}
        className="w-full py-3.5 px-6 rounded-xl font-semibold text-accent
          bg-accent-faint hover:bg-accent/10 active:scale-[0.98]
          transition-all duration-150"
      >
        Retour à l&apos;exercice
      </button>
    </div>
  );
}
