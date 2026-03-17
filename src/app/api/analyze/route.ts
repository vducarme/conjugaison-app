// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// API Route: /api/analyze
// Análise pós-sessão via OpenAI — identifica padrões e dá dicas
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { ExerciseResult } from "@/types";

// [DECISÃO] Lazy init — evita crash no build time quando OPENAI_API_KEY não existe
function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function POST(request: NextRequest) {
  try {
    const openai = getOpenAI();
    const body = await request.json();
    const { results } = body as { results: ExerciseResult[] };

    if (!results || !Array.isArray(results) || results.length === 0) {
      return NextResponse.json(
        { error: "Résultats manquants" },
        { status: 400 }
      );
    }

    // [DECISÃO] Formata resultados como texto para o prompt — mais legível que JSON bruto para o modelo
    const formattedResults = results
      .map((r, i) => {
        const status = r.isCorrect ? "CORRECT" : "INCORRECT";
        return `${i + 1}. [${status}] ${r.exercise.verb.infinitive} (${r.exercise.tense}, ${r.exercise.pronoun}) — Réponse: "${r.userAnswer}" ${!r.isCorrect ? `→ Correct: "${r.exercise.correctAnswer}"` : ""}`;
      })
      .join("\n");

    const errors = results.filter((r) => !r.isCorrect);
    const correct = results.filter((r) => r.isCorrect);

    // [DECISÃO] Prompt pede análise acionável — "voce errou 4" não ajuda, padrões e dicas ajudam
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Tu es un coach de français langue étrangère spécialisé en conjugaison.
Analyse les résultats d'une session d'entraînement et fournis un feedback utile et encourageant.
Ta réponse doit être en français, concise (max 200 mots), et structurée ainsi :

1. **Résumé** : Performance globale en une phrase
2. **Patterns identifiés** : Quelles sont les tendances dans les erreurs ? (temps verbal problématique, groupe de verbe, type de terminaison)
3. **Conseil concret** : Une recommandation actionnable pour la prochaine session
4. **Encouragement** : Un mot positif et sincère (pas générique)

Si tout est correct, félicite et suggère d'augmenter la difficulté.`,
        },
        {
          role: "user",
          content: `Résultats de la session (${correct.length} correct, ${errors.length} erreur${errors.length > 1 ? "s" : ""} sur ${results.length}) :

${formattedResults}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    const analysis = completion.choices[0]?.message?.content || "Analyse indisponible.";

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Analyze API error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
