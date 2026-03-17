// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// useProgress — Hook de persistência do progresso
// Lê e salva sessões no Supabase, calcula estatísticas
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { ExerciseResult, SessionResult, UserProgress, Tense, VerbGroup } from "@/types";

// [DECISÃO] Data local YYYY-MM-DD — toISOString() usa UTC, o que causa bugs de timezone
// (ex: usuário em UTC-3 às 22h local salva com data de "amanhã" em UTC).
// Esta função usa getFullYear/getMonth/getDate que respeita o fuso local do navegador.
function getLocalDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// [DECISÃO] Progresso calculado no client a partir das sessões — evita tabela de cache que desincroniza
function calculateProgress(sessions: SessionResult[], userId: string): UserProgress {
  const emptyTenseAccuracy = {} as Record<Tense, { correct: number; total: number }>;
  const emptyGroupAccuracy = {
    1: { correct: 0, total: 0 },
    2: { correct: 0, total: 0 },
    3: { correct: 0, total: 0 },
  } as Record<VerbGroup, { correct: number; total: number }>;

  if (sessions.length === 0) {
    return {
      userId,
      totalSessions: 0,
      totalExercises: 0,
      totalCorrect: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastSessionDate: null,
      accuracyByTense: emptyTenseAccuracy,
      accuracyByGroup: emptyGroupAccuracy,
    };
  }

  let totalExercises = 0;
  let totalCorrect = 0;
  const tenseAcc = { ...emptyTenseAccuracy };
  const groupAcc = { ...emptyGroupAccuracy };

  sessions.forEach((session) => {
    totalExercises += session.totalExercises;
    totalCorrect += session.totalCorrect;

    session.results.forEach((result) => {
      const tense = result.exercise.tense;
      const group = result.exercise.verb.group;

      if (!tenseAcc[tense]) tenseAcc[tense] = { correct: 0, total: 0 };
      tenseAcc[tense].total += 1;
      if (result.isCorrect) tenseAcc[tense].correct += 1;

      if (!groupAcc[group]) groupAcc[group] = { correct: 0, total: 0 };
      groupAcc[group].total += 1;
      if (result.isCorrect) groupAcc[group].correct += 1;
    });
  });

  // [DECISÃO] Streak calculado por datas únicas ordenadas — usa getLocalDateString para evitar bugs UTC
  const sortedDates = Array.from(new Set(sessions.map((s) => s.date))).sort().reverse();
  let currentStreak = 0;
  const today = getLocalDateString();

  for (let i = 0; i < sortedDates.length; i++) {
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);
    const expected = getLocalDateString(expectedDate);

    if (sortedDates[i] === expected || (i === 0 && sortedDates[i] === today)) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Longest streak
  let longestStreak = 0;
  let tempStreak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1]);
    const curr = new Date(sortedDates[i]);
    const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
    if (Math.round(diff) === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

  return {
    userId,
    totalSessions: sessions.length,
    totalExercises,
    totalCorrect,
    currentStreak,
    longestStreak,
    lastSessionDate: sortedDates[0] || null,
    accuracyByTense: tenseAcc,
    accuracyByGroup: groupAcc,
  };
}

export function useProgress(userId: string | undefined) {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("sessions")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false });

      if (fetchError) throw fetchError;

      // [DECISÃO] Mapeia snake_case do DB para camelCase do TypeScript — separação clara DB vs app
      const sessions: SessionResult[] = (data || []).map((row: Record<string, unknown>) => ({
        id: row.id as string,
        userId: row.user_id as string,
        date: row.date as string,
        results: (row.results as ExerciseResult[]) || [],
        totalCorrect: row.total_correct as number,
        totalExercises: row.total_exercises as number,
        aiAnalysis: row.ai_analysis as string | undefined,
        completedAt: row.completed_at as string,
      }));

      setProgress(calculateProgress(sessions, userId));
    } catch {
      setError("Erreur lors du chargement de la progression.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const saveSession = useCallback(
    async (results: ExerciseResult[], aiAnalysis?: string) => {
      if (!userId) return;

      const today = getLocalDateString();
      const totalCorrect = results.filter((r) => r.isCorrect).length;

      try {
        const { error: insertError } = await supabase.from("sessions").insert({
          user_id: userId,
          date: today,
          results,
          total_correct: totalCorrect,
          total_exercises: results.length,
          ai_analysis: aiAnalysis || null,
          completed_at: new Date().toISOString(),
        });

        if (insertError) throw insertError;

        // [DECISÃO] Refetch após salvar — garante que o dashboard reflete a sessão recém-completada
        await fetchProgress();
      } catch {
        console.error("Erreur lors de la sauvegarde de la session");
      }
    },
    [userId, fetchProgress]
  );

  return {
    progress,
    loading,
    error,
    fetchProgress,
    saveSession,
  };
}
