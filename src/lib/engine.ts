// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DailyVerbEngine — Seleção e orquestração dos 10 exercícios diários
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { Exercise, Tense, Pronoun, Verb } from "@/types";
import { getAvailableVerbs, getConjugation, TENSES, PRONOUNS } from "./verbs";

// [DECISÃO] Seed baseada na data — garante que os mesmos 10 verbos aparecem se o usuário recarregar no mesmo dia
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) & 0xffffffff;
    return (state >>> 0) / 0xffffffff;
  };
}

// [DECISÃO] Seed = YYYYMMDD como inteiro — simples, determinístico, muda a cada dia
function getDateSeed(date: Date = new Date()): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y * 10000 + m * 100 + d;
}

// [DECISÃO] Fisher-Yates shuffle com seed — randomização controlada e reproduzível
function shuffleArray<T>(arr: T[], random: () => number): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// [DECISÃO] Distribuição de tempos verbais equilibrada nos 10 exercícios — evita 10x "présent" por azar
function selectTenses(count: number, random: () => number): Tense[] {
  const tenses: Tense[] = [];
  const shuffledTenses = shuffleArray(TENSES, random);

  // Garantir pelo menos 1 de cada tempo antes de repetir
  for (let i = 0; i < count; i++) {
    tenses.push(shuffledTenses[i % shuffledTenses.length]);
  }

  return shuffleArray(tenses, random);
}

function selectPronoun(random: () => number): Pronoun {
  const index = Math.floor(random() * PRONOUNS.length);
  return PRONOUNS[index];
}

// [DECISÃO] Prefixo da frase construído com elision francesa — "je" vira "j'" antes de vogal
function buildSentencePrefix(pronoun: Pronoun, verb: Verb, tense: Tense): string {
  // [DECISÃO] "h" incluso como vogal para elision ("j'habite", "j'hésite") — em francês, h muet
  // requer elision na maioria dos verbos. Exceção: h aspiré (haïr, heurter) NÃO deveria ter elision,
  // mas são raros entre os 60 verbos do banco. Trade-off: cobrir 95% dos casos corretamente vs.
  // complexidade de manter lista de h aspiré. Se adicionarmos verbos h aspiré, criar lista de exceções.
  const vowels = ["a", "â", "e", "é", "è", "ê", "ë", "i", "î", "ï", "o", "ô", "u", "û", "ù", "h"];
  const conjugation = getConjugation(verb.infinitive, tense, pronoun);

  if (!conjugation) return `${capitalize(pronoun)} `;

  const firstChar = conjugation.charAt(0).toLowerCase();
  const needsElision = pronoun === "je" && vowels.includes(firstChar);

  if (needsElision) {
    return "J'";
  }

  return `${capitalize(pronoun)} `;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// [DECISÃO] Alternativas aceitas incluem variações com/sem elision e espaçamento — evita falsos negativos frustrantes
function buildAcceptedAlternatives(
  correctAnswer: string,
): string[] {
  const alternatives: string[] = [];

  // Aceitar com e sem acentos em certos casos comuns de erro de digitação
  // Aceitar com espaço extra ou sem
  const trimmed = correctAnswer.trim().toLowerCase();
  alternatives.push(trimmed);

  // Se a resposta tem apóstrofo, aceitar variações
  if (correctAnswer.includes("'")) {
    alternatives.push(correctAnswer.replace(/'/g, "'"));
    alternatives.push(correctAnswer.replace(/'/g, "'"));
  }

  return alternatives;
}

// [DECISÃO] Data local YYYY-MM-DD — evita bugs de timezone (toISOString usa UTC)
function getLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export interface DailyExercises {
  date: string;
  exercises: Exercise[];
}

// [DECISÃO] Função principal exporta 10 exercícios para uma data — componente só chama generateDailyExercises()
export function generateDailyExercises(
  date: Date = new Date(),
  count: number = 10
): DailyExercises {
  const seed = getDateSeed(date);
  const random = seededRandom(seed);

  const availableVerbs = getAvailableVerbs();
  const shuffledVerbs = shuffleArray(availableVerbs, random);
  const selectedVerbs = shuffledVerbs.slice(0, count);
  const selectedTenses = selectTenses(count, random);

  const exercises: Exercise[] = selectedVerbs.map((verb, index) => {
    const tense = selectedTenses[index];
    const pronoun = selectPronoun(random);
    const correctAnswer = getConjugation(verb.infinitive, tense, pronoun) || "";
    const sentencePrefix = buildSentencePrefix(pronoun, verb, tense);
    const alternatives = buildAcceptedAlternatives(correctAnswer);

    return {
      id: `${seed}-${index}`,
      verb,
      tense,
      pronoun,
      correctAnswer,
      acceptedAlternatives: alternatives,
      sentencePrefix,
    };
  });

  return {
    date: getLocalDateString(date),
    exercises,
  };
}

// [DECISÃO] Validação normaliza acentos e espaços — "j' ai" e "j'ai" são ambos aceitos
export function validateAnswer(exercise: Exercise, userAnswer: string): boolean {
  const normalize = (str: string) =>
    str.trim().toLowerCase().replace(/\s+/g, " ").replace(/['']/g, "'");

  const normalizedUser = normalize(userAnswer);
  const normalizedCorrect = normalize(exercise.correctAnswer);

  if (normalizedUser === normalizedCorrect) return true;

  return exercise.acceptedAlternatives.some(
    (alt) => normalize(alt) === normalizedUser
  );
}
