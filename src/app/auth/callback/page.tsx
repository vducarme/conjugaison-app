// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Auth callback — processa redirect do OAuth (Google)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// [DECISÃO] Callback como client component — precisa processar hash da URL no browser
export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const { error } = await supabase.auth.getSession();
      if (error) {
        console.error("Auth callback error:", error);
      }
      // [DECISÃO] Redirect para / após auth — Estado padrão = exercício, zero fricção
      router.replace("/");
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-sm text-ink-muted">Connexion en cours...</p>
    </div>
  );
}
