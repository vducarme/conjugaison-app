// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ExerciseCard — O coração do app
// Nível hierárquico: DOMINANTE (centro, tipografia grande, máximo contraste)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useRef, useEffect, useCallback } from "react";
import { Send } from "lucide-react";
import type { Exercise } from "@/types";

interface ExerciseCardProps {
  exercise: Exercise;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  state: "answering" | "feedback-correct" | "feedback-incorrect";
}

// [DECISÃO] Componente simples sem forwardRef — AccentKeyboard foi removido, ref exposto não é mais necessário
export function ExerciseCard({
  exercise,
  value,
  onChange,
  onSubmit,
  disabled = false,
  state,
}: ExerciseCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // [DECISÃO] Auto-focus no mount — Estado padrão = praticar. Zero clique para começar a digitar.
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled, exercise.id]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !disabled && value.trim()) {
        onSubmit();
      }
    },
    [disabled, value, onSubmit]
  );

  // [DECISÃO] Cor do input muda com o estado — feedback visual imediato sem painel adicional
  const inputStateClasses = {
    answering: "border-b-2 border-accent input-cursor-blink",
    "feedback-correct": "border-b-2 border-feedback-success bg-feedback-success-light",
    "feedback-incorrect": "border-b-2 border-feedback-error bg-feedback-error-light",
  };

  const canSubmit = state === "answering" && value.trim().length > 0;

  return (
    <div className="flex flex-col items-center justify-center px-6">
      {/* [DECISÃO] Label do tempo verbal + infinitivo — nível CONTEXTO, menor, menos contraste */}
      <div className="mb-8 text-center">
        {/* [DECISÃO] Pill badge neutre (surface-muted) — ne concurrence pas le Von Restorff de l'input */}
        <span className="inline-block px-3 py-1 rounded-full bg-surface-muted text-ink-muted text-sm font-medium">
          {exercise.tense}
        </span>
        <p className="mt-2 text-ink-muted text-sm">
          {exercise.verb.infinitive}
          {exercise.verb.isIrregular && (
            <span className="ml-1.5 text-xs text-ink-faint">(irrégulier)</span>
          )}
        </p>
      </div>

      {/* [DECISÃO] Frase em serif — reforça sensação de "língua, cultura" conforme Plano Fase 4 */}
      <div className="flex items-baseline flex-wrap justify-center gap-x-1 font-serif text-exercise-mobile md:text-exercise-desktop">
        {/* Prefixo da frase (ex: "Je", "Nous", "J'") */}
        <span className="text-ink whitespace-nowrap">{exercise.sentencePrefix}</span>

        {/* [DECISÃO] Input inline (o blank) — Von Restorff: único elemento com tratamento especial */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="..."
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          className={`
            inline-block font-serif text-exercise-mobile md:text-exercise-desktop
            bg-transparent text-center
            min-w-[120px] max-w-[280px]
            px-1 py-0.5
            outline-none
            transition-all duration-200
            placeholder:text-ink-faint
            ${inputStateClasses[state]}
            ${disabled ? "cursor-not-allowed opacity-60" : ""}
          `}
          // [DECISÃO] Largura dinâmica com min/max — input se adapta ao tamanho da resposta
          style={{
            width: `${Math.max(120, Math.min(280, value.length * 18 + 40))}px`,
          }}
          aria-label={`Conjuguez ${exercise.verb.infinitive} au ${exercise.tense}`}
        />

        {/* Sufixo opcional da frase */}
        {exercise.sentenceSuffix && (
          <span className="text-ink whitespace-nowrap">{exercise.sentenceSuffix}</span>
        )}
      </div>

      {/* [DECISÃO] Botão de submit visível — Fitts's Law: CTA tocável en mobile, pas juste Enter */}
      {canSubmit && (
        <button
          onClick={onSubmit}
          className="mt-6 flex items-center gap-2 py-2.5 px-5 rounded-xl
            font-medium text-white bg-accent
            hover:bg-accent-light active:scale-[0.98]
            transition-all duration-150 animate-fade-in"
          aria-label="Valider la réponse"
        >
          Valider
          <Send className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
