import type { Config } from "tailwindcss";

// [DECISÃO] Paleta definida no Plano de Decisões Fase 4 — cores com intenção emocional específica
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // [DECISÃO] Off-white quente — reduz fadiga visual em uso diário vs branco puro
        surface: {
          DEFAULT: "#FAFAF7",
          raised: "#FFFFFF",
          muted: "#F5F5F0",
        },
        // [DECISÃO] Cinza escuro em vez de preto — menor contraste agressivo, mais confortável para leitura
        ink: {
          DEFAULT: "#1A1A1A",
          muted: "#6B7280",
          faint: "#9CA3AF",
        },
        // [DECISÃO] Azul-indigo como cor de destaque única — transmite confiança e foco (Von Restorff: um só elemento especial)
        accent: {
          DEFAULT: "#4F46E5",
          light: "#818CF8",
          faint: "#EEF2FF",
        },
        // [DECISÃO] Vermelho e verde usados com parcimônia — apenas em feedback, nunca decoração
        feedback: {
          error: "#DC2626",
          "error-light": "#FEF2F2",
          success: "#16A34A",
          "success-light": "#F0FDF4",
        },
      },
      fontFamily: {
        // [DECISÃO] Sans geométrica (Jost) para UI, serif para frases em francês — reforça sensação de "língua, cultura"
        sans: ["Jost", "system-ui", "sans-serif"],
        serif: ["'Source Serif 4'", "'Georgia'", "serif"],
      },
      fontSize: {
        // [DECISÃO] Escala grande para frase (dominante) vs pequena para UI — hierarquia por contraste de escala
        "exercise-mobile": ["1.5rem", { lineHeight: "2.25rem" }],
        "exercise-desktop": ["1.75rem", { lineHeight: "2.5rem" }],
      },
      // [DECISÃO] Animações sutis — reforçam feedback sem distrair
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "pulse-soft": "pulse-soft 1.5s ease-in-out infinite",
        "slide-up": "slide-up 0.4s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
