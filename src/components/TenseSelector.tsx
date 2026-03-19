// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TenseSelector — Seleção de tempos verbais antes de iniciar sessão
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import type { Tense } from "@/types";
import { TENSES } from "@/lib/verbs";

// [DECISÃO] Labels em francês mais curtos e naturais para UI — o nome técnico do tempo é suficiente,
// não precisa de descrição aqui (a descrição aparece no FeedbackPanel quando o usuário erra)
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

interface TenseSelectorProps {
  selected: Tense[];
  onChange: (tenses: Tense[]) => void;
}

// [DECISÃO] TenseSelector é um componente controlado — o estado vive em page.tsx para ser
// passado ao generateDailyExercises no momento de iniciar a sessão
export function TenseSelector({ selected, onChange }: TenseSelectorProps) {
  function toggle(tense: Tense) {
    if (selected.includes(tense)) {
      // [DECISÃO] Impede desmarcar o último tempo — sessão precisa de pelo menos 1 tempo selecionado
      if (selected.length === 1) return;
      onChange(selected.filter((t) => t !== tense));
    } else {
      onChange([...selected, tense]);
    }
  }

  function selectAll() {
    onChange([...TENSES]);
  }

  const allSelected = selected.length === TENSES.length;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-ink-faint uppercase tracking-wider">
          Temps à pratiquer
        </p>
        {/* [DECISÃO] "Tous" — atalho para resetar seleção ao padrão completo */}
        {!allSelected && (
          <button
            onClick={selectAll}
            className="text-xs text-accent hover:text-accent-light transition-colors"
          >
            Tout sélectionner
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {TENSES.map((tense) => {
          const isSelected = selected.includes(tense);
          return (
            <button
              key={tense}
              onClick={() => toggle(tense)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 border
                ${isSelected
                  // [DECISÃO] Selecionado: borda + texto accent, fundo levíssimo — visual secundário.
                  // bg-accent/8 é ~5% opacidade do indigo, suficiente para diferenciar sem peso de botão primário.
                  // Evita competição com o CTA "Commencer" que é o único elemento com fundo sólido escuro.
                  ? "border-accent text-accent bg-accent/[0.07]"
                  : "border-transparent bg-surface-muted text-ink-muted hover:bg-surface-card hover:text-ink"
                }
                ${selected.length === 1 && isSelected
                  ? "opacity-50 cursor-not-allowed"
                  : "active:scale-[0.96]"
                }`}
              aria-pressed={isSelected}
            >
              {TENSE_LABELS[tense]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
