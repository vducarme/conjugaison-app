// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Tipos centrais do app — Conjugaison
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// [DECISÃO] Tempos verbais limitados a A2-B2 — perfil do Plano Fase 1
export type Tense =
  | "présent"
  | "passé composé"
  | "imparfait"
  | "futur simple"
  | "conditionnel présent"
  | "subjonctif présent"
  | "plus-que-parfait"
  | "impératif";

export type Pronoun = "je" | "tu" | "il/elle" | "nous" | "vous" | "ils/elles";

// [DECISÃO] Grupo verbal explícito — necessário para o FeedbackPanel explicar regras por grupo
export type VerbGroup = 1 | 2 | 3;

export interface Verb {
  infinitive: string;
  group: VerbGroup;
  auxiliary: "avoir" | "être";
  // [DECISÃO] Irregularidades armazenadas como flag — permite feedback específico sobre exceções
  isIrregular: boolean;
}

export interface Exercise {
  id: string;
  verb: Verb;
  tense: Tense;
  pronoun: Pronoun;
  correctAnswer: string;
  // [DECISÃO] Alternativas aceitas para variações válidas (ex: j'ai vs je ai) — evita falsos negativos
  acceptedAlternatives: string[];
  sentencePrefix: string;
  sentenceSuffix?: string;
}

export interface ExerciseResult {
  exercise: Exercise;
  userAnswer: string;
  isCorrect: boolean;
  timestamp: number;
}

export interface SessionResult {
  id: string;
  userId: string;
  date: string; // ISO date string YYYY-MM-DD
  results: ExerciseResult[];
  totalCorrect: number;
  totalExercises: number;
  // [DECISÃO] Análise de IA salva com a sessão — evita re-chamar a API ao revisitar
  aiAnalysis?: string;
  completedAt: string;
}

export interface UserProgress {
  userId: string;
  totalSessions: number;
  totalExercises: number;
  totalCorrect: number;
  currentStreak: number;
  longestStreak: number;
  lastSessionDate: string | null;
  // [DECISÃO] Taxa de acerto por tempo verbal — permite IA identificar padrões de fraqueza
  accuracyByTense: Record<Tense, { correct: number; total: number }>;
  accuracyByGroup: Record<VerbGroup, { correct: number; total: number }>;
}

// Estados da UI — Regra 4 do brief
export type ExerciseFlowState =
  | "loading"
  | "answering"
  | "feedback-correct"
  | "feedback-incorrect"
  | "session-complete"
  | "error";
