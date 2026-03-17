// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AccentKeyboard — Barra auxiliar com teclas de acentos franceses
// Resolve: input de acentos em teclados que não têm teclas francesas
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

// [DECISÃO] Acentos selecionados por frequência de uso real em conjugação — não todos os acentos do francês
const ACCENT_KEYS = ["é", "è", "ê", "ë", "à", "â", "ù", "û", "î", "ï", "ô", "ç", "œ"] as const;

interface AccentKeyboardProps {
  onAccentPress: (accent: string) => void;
  disabled?: boolean;
}

export function AccentKeyboard({ onAccentPress, disabled = false }: AccentKeyboardProps) {
  return (
    // [DECISÃO] Posição fixa no bottom — sempre acessível, não interfere com o exercício
    <div className="safe-bottom bg-surface-raised border-t border-surface-muted">
      <div className="flex flex-wrap justify-center gap-1.5 px-3 py-2.5">
        {ACCENT_KEYS.map((accent) => (
          <button
            key={accent}
            type="button"
            onClick={() => onAccentPress(accent)}
            disabled={disabled}
            className={`
              min-w-[44px] min-h-[44px] px-3 py-2
              rounded-lg text-base font-medium
              transition-all duration-150
              ${disabled
                ? "bg-surface-muted text-ink-faint cursor-not-allowed"
                : "bg-white text-ink border border-surface-muted shadow-sm hover:bg-accent-faint hover:border-accent active:scale-95 active:bg-accent-faint"
              }
            `}
            // [DECISÃO] min-w e min-h de 44px — Fitts's Law: alvo de toque mínimo para mobile
            aria-label={`Inserir ${accent}`}
          >
            {accent}
          </button>
        ))}
      </div>
    </div>
  );
}
