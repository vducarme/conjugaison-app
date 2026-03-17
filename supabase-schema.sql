-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Schema SQL para Supabase — Conjugaison App
-- Execute este SQL no SQL Editor do Supabase
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- [DECISÃO] Tabela "sessions" — uma linha por sessão, resultados como JSONB
-- Motivo: evita joins complexos; 10 resultados por sessão é pouco dado para normalizar
-- [DECISÃO] Sem constraint unique(user_id, date) — permite múltiplas sessões no mesmo dia
create table if not exists public.sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  results jsonb not null default '[]'::jsonb,
  total_correct integer not null default 0,
  total_exercises integer not null default 10,
  ai_analysis text,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- [DECISÃO] RLS habilitado — cada usuário só vê/edita suas próprias sessões
alter table public.sessions enable row level security;

-- Política: usuários autenticados podem ler suas próprias sessões
create policy "Users can read own sessions"
  on public.sessions for select
  using (auth.uid() = user_id);

-- Política: usuários autenticados podem inserir suas próprias sessões
create policy "Users can insert own sessions"
  on public.sessions for insert
  with check (auth.uid() = user_id);

-- [DECISÃO] Sem política de UPDATE/DELETE — sessões são imutáveis após criação
-- Motivo: integridade do histórico de progresso

-- Índice para queries de progresso
create index if not exists idx_sessions_user_date
  on public.sessions(user_id, date desc);
