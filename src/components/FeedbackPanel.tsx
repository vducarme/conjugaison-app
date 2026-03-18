// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FeedbackPanel — Feedback pós-resposta
// Se correto: confirmação com reforço positivo. Se errado: explicação linguística detalhada.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState, useEffect } from "react";
import { Check, X, Loader2, Sparkles, BookOpen } from "lucide-react";
import type { Exercise, Tense } from "@/types";

interface FeedbackPanelProps {
  exercise: Exercise;
  userAnswer: string;
  isCorrect: boolean;
  onContinue: () => void;
}

// [DECISÃO] Estrutura gramatical estática por tempo — dado verificado, não gerado por IA
// Mostrar a fórmula antes da explicação da IA ancora o erro numa regra antes do detalhe contextual (chunking)
const TENSE_STRUCTURE: Record<Tense, { formula: string; example: string }> = {
  "présent": {
    formula: "radical + terminaisons du groupe",
    example: "parler → je parle, tu parles, il parle...",
  },
  "passé composé": {
    formula: "avoir / être au présent + participe passé",
    example: "j'ai parlé · je suis allé(e)",
  },
  "imparfait": {
    formula: "radical (nous, présent) + -ais, -ais, -ait, -ions, -iez, -aient",
    example: "parler → je parlais, tu parlais, il parlait...",
  },
  "futur simple": {
    formula: "infinitif + -ai, -as, -a, -ons, -ez, -ont",
    example: "parler → je parlerai, tu parleras...",
  },
  "conditionnel présent": {
    formula: "infinitif + -ais, -ais, -ait, -ions, -iez, -aient",
    example: "parler → je parlerais, tu parlerais...",
  },
  "subjonctif présent": {
    formula: "que + radical (ils, présent) + -e, -es, -e, -ions, -iez, -ent",
    example: "parler → que je parle, que tu parles...",
  },
  "plus-que-parfait": {
    formula: "avoir / être à l'imparfait + participe passé",
    example: "j'avais parlé · j'étais allé(e)",
  },
  "impératif": {
    formula: "présent sans pronom (tu / nous / vous) — pas de -s pour -er à tu",
    example: "parle ! · parlons ! · parlez !",
  },
};

// [DECISÃO] Mensagens de reforço positivo variadas — evita repetição monótona de "Correct!"
const POSITIVE_MESSAGES = [
  "Bravo !",
  "Parfait !",
  "Excellent !",
  "Bien joué !",
  "Magnifique !",
  "Très bien !",
  "Impeccable !",
] as const;

function getPositiveMessage(): string {
  return POSITIVE_MESSAGES[Math.floor(Math.random() * POSITIVE_MESSAGES.length)];
}

// [DECISÃO] Feedback de erro busca explicação via API — explicação genérica local seria rasa demais (Peak-End Rule)
export function FeedbackPanel({
  exercise,
  userAnswer,
  isCorrect,
  onContinue,
}: FeedbackPanelProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [positiveMsg] = useState(getPositiveMessage);

  // [DECISÃO] Explicação só é buscada para respostas erradas — corretas não precisam de explicação
  useEffect(() => {
    if (!isCorrect) {
      fetchExplanation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCorrect]);

  async function fetchExplanation() {
    setLoading(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verb: exercise.verb.infinitive,
          tense: exercise.tense,
          pronoun: exercise.pronoun,
          correctAnswer: exercise.correctAnswer,
          userAnswer,
          verbGroup: exercise.verb.group,
          isIrregular: exercise.verb.isIrregular,
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de la récupération");

      const data = await response.json();
      setExplanation(data.explanation);
    } catch {
      // [DECISÃO] Fallback local se a API falhar — nunca deixar o usuário sem feedback
      setExplanation(buildLocalFallback());
    } finally {
      setLoading(false);
    }
  }

  // [DECISÃO] Fallback local estruturado — mesmo sem IA, dá o mínimo: resposta certa + regra básica
  function buildLocalFallback(): string {
    const { verb, tense, pronoun, correctAnswer } = exercise;
    // [DECISÃO] Sufixo ordinal correto: 1er, 2ème, 3ème
    const groupLabel = verb.group === 1 ? "1er" : `${verb.group}ème`;
    return `La forme correcte est : ${pronoun} ${correctAnswer}.\n\nLe verbe "${verb.infinitive}" est un verbe du ${groupLabel} groupe${verb.isIrregular ? " (irrégulier)" : ""}.\n\nAu ${tense}, la conjugaison suit ${verb.isIrregular ? "une forme irrégulière qu'il faut mémoriser" : "la règle standard du groupe"}.`;
  }

  return (
    <div className="animate-slide-up px-6 py-5">
      {/* ── Header: certo ou errado ── */}
      <div
        className={`flex items-center gap-3 mb-4 p-4 rounded-xl ${
          isCorrect
            ? "bg-feedback-success-light"
            : "bg-feedback-error-light"
        }`}
      >
        {isCorrect ? (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-feedback-success flex items-center justify-center">
            <Check className="w-5 h-5 text-white" strokeWidth={3} />
          </div>
        ) : (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-feedback-error flex items-center justify-center">
            <X className="w-5 h-5 text-white" strokeWidth={3} />
          </div>
        )}
        <div>
          <p className={`font-semibold ${isCorrect ? "text-feedback-success" : "text-feedback-error"}`}>
            {isCorrect ? positiveMsg : "Incorrect"}
          </p>
          {/* [DECISÃO] Acerto mostra a frase completa como reforço — Peak-End Rule: micro-reward positivo */}
          {isCorrect && (
            <p className="text-sm text-feedback-success/80 mt-0.5 font-medium">
              {exercise.sentencePrefix}{exercise.correctAnswer}
            </p>
          )}
          {!isCorrect && (
            <p className="text-sm text-ink-muted mt-0.5">
              <span className="line-through text-feedback-error/60">{userAnswer}</span>
              {" → "}
              <span className="font-semibold text-ink">
                {exercise.sentencePrefix}
                {exercise.correctAnswer}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* [DECISÃO] Micro-reward para acerto — ícone + encouragement bref (Peak-End Rule: momento positivo) */}
      {isCorrect && (
        <div className="flex items-center gap-2 mb-5 px-1">
          <Sparkles className="w-4 h-4 text-accent" />
          <p className="text-sm text-ink-muted">
            Continuez comme ça !
          </p>
        </div>
      )}

      {/* ── Estrutura gramatical do tempo (apenas para erros) ── */}
      {/* [DECISÃO] Acima da explicação IA — chunking: fórmula primeiro, detalhe depois */}
      {!isCorrect && (() => {
        const structure = TENSE_STRUCTURE[exercise.tense];
        return structure ? (
          <div className="mb-3 p-4 rounded-xl border border-surface-muted bg-white">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-3.5 h-3.5 text-ink-faint flex-shrink-0" />
              <p className="text-xs font-medium text-ink-faint uppercase tracking-wider">
                Structure — {exercise.tense}
              </p>
            </div>
            <p className="text-sm font-medium text-ink mb-1">{structure.formula}</p>
            <p className="text-xs text-ink-muted font-serif">{structure.example}</p>
          </div>
        ) : null;
      })()}

      {/* ── Explicação detalhada (apenas para erros) ── */}
      {!isCorrect && (
        <div className="mb-5">
          {loading ? (
            // [DECISÃO] Estado de carregamento com spinner — Regra 4: estado de loading explícito
            <div className="flex items-center gap-2 py-4 text-ink-muted">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Diagnostic en cours...</span>
            </div>
          ) : explanation ? (
            <div className="p-4 rounded-xl bg-surface-muted">
              <p className="text-xs font-medium text-ink-faint uppercase tracking-wider mb-2">
                Diagnostic
              </p>
              {/* [DECISÃO] Whitespace pre-line — preserva formatação da explicação da IA */}
              <p className="text-sm text-ink leading-relaxed whitespace-pre-line">
                {explanation}
              </p>
            </div>
          ) : null}
        </div>
      )}

      {/* ── Botão de continuar ── */}
      {/* [DECISÃO] Botão full-width — Fitts's Law: alvo máximo em mobile */}
      <button
        onClick={onContinue}
        className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-accent
          hover:bg-accent-light active:scale-[0.98]
          transition-all duration-150"
        // [DECISÃO] Auto-focus no botão se correto — permite pular com Enter sem mover a mão
        autoFocus={isCorrect}
      >
        {isCorrect ? "Suivant" : "Compris, suivant"}
      </button>
    </div>
  );
}
