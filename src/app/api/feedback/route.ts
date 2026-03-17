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
    const { verb, tense, pronoun, correctAnswer, userAnswer, verbGroup, isIrregular } = body;

    if (!verb || !tense || !pronoun || !correctAnswer || !userAnswer) {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      );
    }

    // [DECISÃO] Prompt estruturado com role de professor — gera explicação pedagógica, não apenas correção
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      // [DECISÃO] gpt-4o-mini — bom equilíbrio custo/qualidade para explicações gramaticais
      messages: [
        {
          role: "system",
          content: `Tu es un professeur de français langue étrangère, spécialisé en conjugaison. 
Tu expliques les erreurs de conjugaison de manière claire, structurée et encourageante.
Tes explications doivent être concises (max 150 mots) mais complètes.
Utilise le français simple et évite le jargon linguistique complexe.
Structure ta réponse en 3 parties :
1. Ce qui était attendu et pourquoi
2. L'erreur spécifique commise et son origine probable  
3. Un truc mnémotechnique ou une règle simple pour s'en souvenir`,
        },
        {
          role: "user",
          content: `L'élève devait conjuguer le verbe "${verb}" (${verbGroup}${verbGroup === 1 ? "er" : "ème"} groupe${isIrregular ? ", irrégulier" : ""}) au ${tense}, avec le pronom "${pronoun}".

Réponse correcte : "${correctAnswer}"
Réponse de l'élève : "${userAnswer}"

Explique l'erreur de manière pédagogique.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
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
