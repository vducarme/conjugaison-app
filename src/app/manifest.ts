// [DECISÃO] manifest.ts explícito — necessário para declarar purpose: "maskable" no ícone.
// Sem isso, o Android envolve o ícone num círculo branco (comportamento de ícone legado).
// O ícone maskable tem safe zone de 76% para launchers com máscara circular/squircle (ex: Nothing Phone).

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Conjugaison",
    short_name: "Conjugaison",
    description: "Treino diário de conjugação francesa",
    start_url: "/",
    display: "standalone",
    background_color: "#CDE4FF",
    theme_color: "#FAFAF7",
    icons: [
      {
        // [DECISÃO] Ícone maskable — conteúdo dentro de 76% do canvas, fundo azul até as bordas.
        // O Android usa este para adaptive icons (circle, squircle, etc).
        src: "/icon-maskable.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "maskable",
      },
      {
        // [DECISÃO] Ícone any — fallback para browsers e sistemas que não suportam maskable.
        src: "/icon.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
