-- ============================================================================
-- FitTrainer — Schema SQL (incremental)
-- Fase 1 · Auth. Ejecutar en el SQL Editor de Supabase.
--
-- NOTA: el backend accede con la SERVICE ROLE key (bypasea RLS) y valida
-- ownership/rol en la capa Service. Las políticas RLS se agregarán cuando
-- web/mobile consuman Supabase directamente (tarea de la capa DB).
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── trainers ────────────────────────────────────────────────────────────────
-- Agrega password_hash respecto del DER original: el modelo de datos no
-- contemplaba credenciales y la autenticación por email/password lo requiere.
create table if not exists trainers (
  id            uuid primary key default gen_random_uuid(),
  name          varchar(100) not null,
  email         varchar(255) not null unique,
  password_hash varchar(255) not null,
  specialty     varchar(255),
  avatar_url    text,
  created_at    timestamptz not null default now()
);

create index if not exists idx_trainers_email on trainers (email);

-- ── refresh_tokens ───────────────────────────────────────────────────────────
-- Tabla nueva (no estaba en el DER). Permite revocar refresh tokens en el
-- logout y rotarlos. Se persiste solo el hash SHA-256 del token, nunca el valor.
-- user_id referencia a trainers o students según 'role' (no hay FK dura porque
-- apunta a dos tablas distintas).
create table if not exists refresh_tokens (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null,
  role       varchar(20) not null check (role in ('trainer', 'student')),
  token_hash varchar(64) not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_refresh_tokens_hash on refresh_tokens (token_hash);
create index if not exists idx_refresh_tokens_user on refresh_tokens (user_id);

-- ── students ─────────────────────────────────────────────────────────────────
-- Agrega password_hash respecto del DER (igual que trainers: el login del
-- alumno por email/password lo requiere). Se crea acá porque es el destino del
-- onboarding (CU-02) y el target del chequeo de email de las invitaciones.
create table if not exists students (
  id            uuid primary key default gen_random_uuid(),
  trainer_id    uuid not null references trainers (id) on delete cascade,
  name          varchar(100) not null,
  email         varchar(255) not null unique,
  password_hash varchar(255),
  goal          varchar(20) check (goal in ('tonify', 'weight_loss', 'hypertrophy', 'strength')),
  birth_date    date,
  avatar_url    text,
  active        boolean not null default true,
  gym_equipment text[],
  injuries      text,
  level         varchar(20) check (level in ('beginner', 'intermediate', 'advanced')),
  created_at    timestamptz not null default now()
);

create index if not exists idx_students_trainer on students (trainer_id);
create index if not exists idx_students_email on students (email);

-- ── invitations ──────────────────────────────────────────────────────────────
-- Agrega student_email respecto del DER: el contrato de API lo requiere
-- (POST /invitations lo recibe y GET /invitations/:token lo devuelve).
create table if not exists invitations (
  id               uuid primary key default gen_random_uuid(),
  trainer_id       uuid not null references trainers (id) on delete cascade,
  token            varchar(64) not null unique,
  student_name     varchar(100) not null,
  student_email    varchar(255) not null,
  student_phone    varchar(30),
  student_goal     varchar(20) check (student_goal in ('tonify', 'weight_loss', 'hypertrophy', 'strength')),
  delivery_channel varchar(20) not null check (delivery_channel in ('whatsapp', 'qr', 'both')),
  expires_at       timestamptz not null,
  used_at          timestamptz,
  created_at       timestamptz not null default now()
);

create index if not exists idx_invitations_token on invitations (token);
create index if not exists idx_invitations_trainer on invitations (trainer_id);

-- ── exercises (Fase 2) ───────────────────────────────────────────────────────
-- trainer_id null = ejercicio global (disponible para todos). muscle_group no
-- estaba enumerado en el DER; se define el set por CHECK.
create table if not exists exercises (
  id           uuid primary key default gen_random_uuid(),
  trainer_id   uuid references trainers (id) on delete cascade,
  name         varchar(120) not null,
  muscle_group varchar(20) check (muscle_group in (
    'chest', 'back', 'shoulders', 'legs', 'glutes', 'biceps',
    'triceps', 'core', 'calves', 'full_body', 'cardio'
  )),
  equipment    varchar(60),
  description  text,
  video_url    text,
  is_global    boolean not null default false
);

create index if not exists idx_exercises_trainer on exercises (trainer_id);
create index if not exists idx_exercises_muscle on exercises (muscle_group);

-- ── routines (Fase 2) ────────────────────────────────────────────────────────
create table if not exists routines (
  id          uuid primary key default gen_random_uuid(),
  trainer_id  uuid not null references trainers (id) on delete cascade,
  student_id  uuid not null references students (id) on delete cascade,
  template_id uuid,  -- FK a routine_templates (tabla de fases posteriores)
  name        varchar(120) not null,
  goal        varchar(20) check (goal in ('tonify', 'weight_loss', 'hypertrophy', 'strength')),
  days        text[] not null default '{}',
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists idx_routines_student on routines (student_id);
create index if not exists idx_routines_trainer on routines (trainer_id);

-- ── routine_exercises (pivote N:M routines ↔ exercises) ───────────────────────
-- El DER llama 'order' a la columna de orden, pero es palabra reservada en SQL;
-- se renombra a order_index.
create table if not exists routine_exercises (
  id           uuid primary key default gen_random_uuid(),
  routine_id   uuid not null references routines (id) on delete cascade,
  exercise_id  uuid not null references exercises (id),
  sets         int,
  reps         int,
  rest_seconds int,
  suggested_kg numeric,
  tempo        varchar(20),
  notes        text,
  order_index  int not null default 0
);

create index if not exists idx_routine_exercises_routine on routine_exercises (routine_id);
