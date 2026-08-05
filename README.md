# Calculadoras España — Starter

![CI](https://github.com/TU_USUARIO/calculadoras-espana/actions/workflows/ci.yml/badge.svg)

Primer scaffold funcional: home, calculadora de Nómina completa (formulario +
cálculo + FAQ + JSON-LD + metadata SEO), sitemap/robots automáticos y schema
de Supabase con RLS.

## Arranque local

```bash
npm install
cp .env.example .env.local   # rellena las claves de tu proyecto Supabase
npm run dev
```

Abre http://localhost:3000 — la calculadora de nómina está en
`/calculadora/nomina`.

## Subir a GitHub

```bash
git init
git add .
git commit -m "Scaffold inicial: home, calculadora de nómina, schema Supabase, SEO automático"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/calculadoras-espana.git
git push -u origin main
```

Recuerda cambiar `TU_USUARIO` en la URL del badge de arriba y en el remote.
El `.gitignore` ya excluye `node_modules`, `.next` y `.env.local`; comprueba
con `git status` antes del primer commit que no se cuele ninguna clave real.

El repo incluye un workflow de GitHub Actions (`.github/workflows/ci.yml`)
que en cada push a `main` ejecuta typecheck, lint y build automáticamente.

## Despliegue

Conecta el repo directamente en [Vercel](https://vercel.com/new) (Import
Project). Añade ahí las variables de entorno de Supabase — nunca en el
repositorio.

## Base de datos

1. Crea un proyecto en https://supabase.com
2. Ejecuta `supabase/schema.sql` en el SQL Editor (crea tablas, RLS y siembra
   las 12 categorías).
3. Copia URL y claves a `.env.local`.

## Cómo añadir la siguiente calculadora (ej: Finiquito)

1. Crea `lib/calculators/finiquito.ts` copiando la estructura de `nomina.ts`
   (schema Zod, función `calculate`, `meta`, `faqs`).
2. Regístrala en `lib/calculators/index.ts`.
3. Crea su formulario cliente en `components/calculator/FiniquitoForm.tsx`.
4. Añade la condición correspondiente en `app/calculadora/[slug]/page.tsx`.
5. Inserta su fila en la tabla `calculators` de Supabase con los textos SEO.

No hay que tocar nada más: home, sitemap, JSON-LD y buscador la recogen
automáticamente en cuanto está en el índice.

## Qué falta (siguientes fases)

- Resto de las 20 calculadoras iniciales
- Sistema de diseño ampliado (tema dark real con toggle)
- Blog (`/blog`, `/blog/[slug]`)
- Panel Admin (`/admin`) con Server Actions sobre Supabase
- Generación de PDF de resultados
- AdSense / newsletter / suscripción
- Middleware de rate limiting y headers de seguridad avanzados
- PWA (manifest + service worker)

## Estructura

```
app/
  page.tsx                    → Home
  calculadora/[slug]/page.tsx → Página de cada calculadora (ISR)
  categoria/[slug]/           → Listado por categoría (pendiente de implementar)
  sitemap.ts / robots.ts      → SEO técnico automático
components/
  calculator/                 → Formularios y piezas de UI de calculadoras
  ui/                          → Componentes base (pendiente)
  layout/                      → Header/Footer (pendiente)
lib/
  calculators/                → Motores de cálculo tipados (código = fuente de verdad)
  seo/                        → Generador de metadata y JSON-LD
  supabase/                   → Clientes Supabase (browser/server)
supabase/
  schema.sql                  → Esquema completo + RLS + seed de categorías
.github/workflows/ci.yml      → Typecheck + lint + build en cada push
```
