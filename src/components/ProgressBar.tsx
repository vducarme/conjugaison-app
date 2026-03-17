// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ProgressBar — Indicador de progresso da sessão (ex: 3/10)
// Nível hierárquico: PERIFÉRICO (topo, quase invisível)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    // [DECISÃO] Altura mínima (h-1) e cor faint — periférico no plano, não compete com ExerciseCard
    <div className="w-full" role="progressbar" aria-valuenow={current} aria-valuemax={total}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-ink-faint font-medium tracking-wide">
          {current} / {total}
        </span>
      </div>
      <div className="w-full h-1 bg-surface-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
