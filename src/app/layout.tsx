import type { Metadata, Viewport } from "next";
import "./globals.css";

// [DECISÃO] Metadata otimizada para PWA-like — mobile-first conforme Plano Fase 1
export const metadata: Metadata = {
  title: "Conjugaison — Treino diário de conjugação francesa",
  description:
    "Pratique conjugação em francês com 10 exercícios diários e feedback inteligente.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // [DECISÃO] Sem maximumScale — zoom acessível para usuários com baixa visão
  themeColor: "#FAFAF7",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      {/* [DECISÃO] lang="fr" — conteúdo principal é em francês, ajuda leitores de tela */}
      <body className="min-h-screen bg-surface text-ink antialiased">
        {/* [DECISÃO] max-w-lg centralizado — mobile-first, em desktop limita largura para manter legibilidade */}
        <main className="mx-auto max-w-lg min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
