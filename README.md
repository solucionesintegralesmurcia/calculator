# Calculadoras España — Starter

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

## Base de datos

1. Crea un proyecto en https://supabase.com
2. Ejecuta `supabase/schema.sql` en el SQL Editor de Supabase (crea tablas,
   RLS y siembra las 12 categorías).
3. Copia la URL y las claves anon/service_role a `.env.local`.

## Cómo añadir la siguiente calculadora (ej: Finiquito)

1. Crea `lib/calculators/finiquito.ts` copiando la estructura de `nomina.ts`
   (schema Zod, función `calculate`, `meta`, `faqs`).
2. Regístrala en `lib/calculators/index.ts`.
3. Crea su formulario cliente en `components/calculator/FiniquitoForm.tsx`
   (copia `NominaForm.tsx` como base).
4. Añade la condición correspondiente en
   `app/calculadora/[slug]/page.tsx` (`meta.slug === 'finiquito'`).
5. Inserta su fila en la tabla `calculators` de Supabase con los textos SEO.

No hay que tocar nada más: home, sitemap, JSON-LD y buscador la recogen
automáticamente en cuanto está en el índice.

## Qué falta (siguientes fases, según lo acordado)

- Resto de las 20 calculadoras iniciales
- Sistema de diseño ampliado (componentes UI, tema dark real con toggle)
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
  sitemap.ts / robots.ts      → SEO técnico automático
components/
  calculator/                 → Formularios y piezas de UI de calculadoras
lib/
  calculators/                → Motores de cálculo tipados (código = fuente de verdad)
  seo/                        → Generador de metadata y JSON-LD
  supabase/                   → Clientes Supabase (browser/server)
supabase/
  schema.sql                  → Esquema completo + RLS + seed de categorías
```
