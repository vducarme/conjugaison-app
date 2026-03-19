// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AuthScreen — Login/cadastro com Google e email/senha
// Tela limpa, sem fricção. Gate de entrada.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

export function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  // [DECISÃO] Google OAuth via Supabase redirect — fluxo padrão, zero config no client
  async function handleGoogleLogin() {
    setGoogleLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch {
      setError("Erreur lors de la connexion avec Google.");
      setGoogleLoading(false);
    }
  }

  async function handleEmailAuth() {
    setLoading(true);
    setError(null);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
      }
      onAuthSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Une erreur est survenue.";
      // [DECISÃO] Mensagens de erro em francês — coerência linguística com o app
      if (message.includes("Invalid login")) {
        setError("Email ou mot de passe incorrect.");
      } else if (message.includes("already registered")) {
        setError("Cet email est déjà utilisé. Connectez-vous.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-8">
      {/* ── Branding mínimo ── */}
      <div className="text-center mb-10">
        {/* [DECISÃO] Ícone do cachorro/nuvem acima do título — ancoragem visual da marca antes do gate de auth */}
        <div className="flex justify-center mb-4">
          <Image
            src="/home-icon.png"
            alt="Conjugaison"
            width={96}
            height={96}
            priority
          />
        </div>
        {/* [DECISÃO] Tipografia serif para o nome do app — coerente com a direção estética "língua, cultura" */}
        <h1 className="font-serif text-3xl font-semibold text-ink mb-2">
          Conjugaison
        </h1>
        <p className="text-sm text-ink-muted">
          10 verbes par jour. Progressez chaque jour.
        </p>
      </div>

      {/* ── Botão Google — oculto até configuração do OAuth ── */}
      {/* [DECISÃO] Google OAuth escondido — será reativado quando as credenciais Google Cloud forem configuradas */}
      {false && (
      <button
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        className="w-full max-w-sm flex items-center justify-center gap-3
          py-3.5 px-6 rounded-xl
          bg-white border border-surface-muted shadow-sm
          font-medium text-ink
          hover:bg-surface-muted active:scale-[0.98]
          transition-all duration-150
          disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {googleLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          // [DECISÃO] SVG inline para o ícone Google — evita dependência externa para um único ícone
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        Continuer avec Google
      </button>
      )}

      {/* ── Separador — oculto junto com Google ── */}
      {false && (
      <div className="flex items-center gap-4 my-6 w-full max-w-sm">
        <div className="flex-1 h-px bg-surface-muted" />
        <span className="text-xs text-ink-faint">ou</span>
        <div className="flex-1 h-px bg-surface-muted" />
      </div>
      )}

      {/* ── Formulário email/senha ── */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleEmailAuth();
        }}
        className="w-full max-w-sm space-y-3"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full py-3 px-4 rounded-xl border border-surface-muted
            bg-white text-ink text-sm
            placeholder:text-ink-faint
            focus:border-accent focus:ring-1 focus:ring-accent
            outline-none transition-all"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          required
          minLength={6}
          className="w-full py-3 px-4 rounded-xl border border-surface-muted
            bg-white text-ink text-sm
            placeholder:text-ink-faint
            focus:border-accent focus:ring-1 focus:ring-accent
            outline-none transition-all"
        />

        {/* [DECISÃO] Estado de erro inline — evita alert(), mantém o fluxo */}
        {error && (
          <p className="text-sm text-feedback-error bg-feedback-error-light p-3 rounded-lg animate-fade-in">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-accent
            hover:bg-accent-light active:scale-[0.98]
            transition-all duration-150
            disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
          ) : mode === "login" ? (
            "Se connecter"
          ) : (
            "Créer un compte"
          )}
        </button>
      </form>

      {/* ── Toggle login/signup ── */}
      <button
        onClick={() => {
          setMode(mode === "login" ? "signup" : "login");
          setError(null);
        }}
        className="mt-4 text-sm text-ink-muted hover:text-accent transition-colors"
      >
        {mode === "login"
          ? "Pas de compte ? Créer un compte"
          : "Déjà un compte ? Se connecter"}
      </button>
    </div>
  );
}
