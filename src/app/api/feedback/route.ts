// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// API Route: /api/feedback
// Gera explicação detalhada de erro via OpenAI
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

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
    // [DECISÃO] verbGroup e isIrregular não são usados no prompt — a IA diagnostica
    // a partir dos tokens visíveis (verbo, tempo, resposta errada). Extraídos mas ignorados.
    const { verb, tense, pronoun, correctAnswer, userAnswer } = body;

    if (!verb || !tense || !pronoun || !correctAnswer || !userAnswer) {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      );
    }

    // [DECISÃO] Prompt focado exclusivamente no diagnóstico do erro específico —
    // a resposta correta e a estrutura gramatical já aparecem na UI.
    // A IA só precisa responder: "o que o usuário confundiu e por quê".
    // Max 2 frases, sem repetir o que já está visível.
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Tu es un professeur de français langue étrangère. 
L'interface montre déjà la réponse correcte et la structure grammaticale du temps.
Ton rôle : diagnostiquer en 1-2 phrases courtes UNIQUEMENT pourquoi l'élève a fait CETTE erreur spécifique.
Ne répète pas la réponse correcte. Ne rappelle pas la règle générale. 
Identifie la confusion probable (mauvais radical, mauvais auxiliaire, confusion de temps, terminaison incorrecte, etc.).
Sois direct et concis.`,
        },
        {
          role: "user",
          content: `Verbe : "${verb}" au ${tense}, pronom "${pronoun}".
Réponse correcte : "${correctAnswer}"
Réponse de l'élève : "${userAnswer}"

Quel est le diagnostic de cette erreur spécifique ?`,
        },
      ],
      temperature: 0.5,
      max_tokens: 120,
    });

    const explanation = completion.choices[0]?.message?.content || "Explication indisponible.";

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error("Feedback API error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
