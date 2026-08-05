-- =============================================================================
-- SCHEMA INICIAL: Plataforma de Calculadoras España
-- =============================================================================
-- Filosofía: las FÓRMULAS viven en código (lib/calculators/*.ts).
-- Esta base de datos guarda CONTENIDO editable: textos, FAQs, SEO, tablas
-- fiscales y artículos. Así el equipo de contenido edita sin tocar código,
-- y los cálculos siguen siendo auditables y testeables.

create extension if not exists "uuid-ossp";

-- ---------- CATEGORÍAS ----------
create table categories (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  description text,
  icon text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ---------- CALCULADORAS (contenido editable, no la lógica) ----------
create table calculators (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,              -- debe coincidir con el slug del módulo en código
  category_id uuid references categories(id),
  title text not null,
  seo_title text not null,
  meta_description text not null,
  short_description text,
  intro_content text,                     -- HTML/MDX explicando la calculadora
  formula_explanation text,
  examples text,
  is_published boolean default true,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- ---------- FAQs por calculadora ----------
create table faqs (
  id uuid primary key default uuid_generate_v4(),
  calculator_id uuid references calculators(id) on delete cascade,
  question text not null,
  answer text not null,
  sort_order int default 0
);

-- ---------- TABLAS FISCALES (IRPF, Seguridad Social, SMI, etc.) ----------
-- key/value versionado por año para poder consultar históricos y para que
-- el motor de cálculo pida siempre "la tabla vigente" sin romper cálculos pasados.
create table tax_tables (
  id uuid primary key default uuid_generate_v4(),
  table_key text not null,                -- ej: 'irpf_tramos', 'ss_tipos_trabajador'
  year int not null,
  region text default 'ES',               -- 'ES' o código de comunidad autónoma
  data jsonb not null,                    -- estructura libre validada por Zod en la app
  is_active boolean default true,
  updated_at timestamptz default now(),
  unique (table_key, year, region)
);

-- ---------- ARTÍCULOS DE BLOG ----------
create table articles (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  seo_title text,
  meta_description text,
  excerpt text,
  content text not null,                  -- MDX/HTML
  cover_image_url text,
  author_id uuid,
  is_published boolean default false,
  published_at timestamptz,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Relación artículo <-> calculadoras enlazadas (enlazado interno automático)
create table article_calculators (
  article_id uuid references articles(id) on delete cascade,
  calculator_id uuid references calculators(id) on delete cascade,
  primary key (article_id, calculator_id)
);

-- ---------- RESULTADOS COMPARTIBLES ----------
-- Cuando un usuario pulsa "compartir", se guarda un snapshot del cálculo
-- para poder generar una URL /r/[id] y una og:image dinámica.
create table results (
  id uuid primary key default uuid_generate_v4(),
  calculator_slug text not null,
  input jsonb not null,
  output jsonb not null,
  user_id uuid,                           -- null si es un visitante anónimo
  created_at timestamptz default now()
);

-- ---------- USUARIOS (perfil extendido sobre auth.users de Supabase) ----------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'user' check (role in ('user', 'editor', 'admin')),
  newsletter_subscribed boolean default false,
  created_at timestamptz default now()
);

-- ---------- CONFIGURACIÓN GLOBAL (clave/valor para settings del sitio) ----------
create table settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================
alter table categories enable row level security;
alter table calculators enable row level security;
alter table faqs enable row level security;
alter table tax_tables enable row level security;
alter table articles enable row level security;
alter table article_calculators enable row level security;
alter table results enable row level security;
alter table profiles enable row level security;
alter table settings enable row level security;

-- Lectura pública de contenido publicado (rol anon)
create policy "Lectura pública de categorías" on categories for select using (true);
create policy "Lectura pública de calculadoras publicadas" on calculators for select using (is_published = true);
create policy "Lectura pública de FAQs" on faqs for select using (true);
create policy "Lectura pública de tablas fiscales activas" on tax_tables for select using (is_active = true);
create policy "Lectura pública de artículos publicados" on articles for select using (is_published = true);
create policy "Lectura pública de relación artículo-calculadora" on article_calculators for select using (true);

-- Resultados: cualquiera puede crear uno (para compartir), pero solo se lee por id
create policy "Cualquiera puede guardar un resultado" on results for insert with check (true);
create policy "Cualquiera puede leer un resultado por id" on results for select using (true);

-- Perfiles: cada usuario ve y edita solo el suyo
create policy "El usuario ve su propio perfil" on profiles for select using (auth.uid() = id);
create policy "El usuario edita su propio perfil" on profiles for update using (auth.uid() = id);

-- Escritura de contenido: solo editor/admin (vía función auxiliar)
create or replace function is_editor_or_admin()
returns boolean language sql security definer as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('editor', 'admin')
  );
$$;

create policy "Editores gestionan calculadoras" on calculators for all using (is_editor_or_admin());
create policy "Editores gestionan FAQs" on faqs for all using (is_editor_or_admin());
create policy "Editores gestionan artículos" on articles for all using (is_editor_or_admin());
create policy "Solo admin gestiona tablas fiscales" on tax_tables for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Solo admin gestiona settings" on settings for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- =============================================================================
-- SEED mínimo de categorías (las 12 que pediste)
-- =============================================================================
insert into categories (slug, name, sort_order) values
  ('laboral', 'Laboral', 1),
  ('fiscal', 'Fiscal', 2),
  ('hipotecas', 'Hipotecas', 3),
  ('prestamos', 'Préstamos', 4),
  ('vehiculos', 'Vehículos', 5),
  ('empresas', 'Empresas', 6),
  ('autonomos', 'Autónomos', 7),
  ('inversiones', 'Inversiones', 8),
  ('finanzas-personales', 'Finanzas Personales', 9),
  ('impuestos', 'Impuestos', 10),
  ('vivienda', 'Vivienda', 11),
  ('ahorro', 'Ahorro', 12);
