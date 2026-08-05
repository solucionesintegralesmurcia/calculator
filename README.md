# Calculadoras España — Starter

![CI](https://github.com/TU_USUARIO/calculadoras-espana/actions/workflows/ci.yml/badge.svg)

Scaffold funcional en Next.js 15 + TypeScript + Tailwind: home, calculadora
de Nómina completa (formulario + cálculo + FAQ + JSON-LD + metadata SEO) y
sitemap/robots automáticos. Sin base de datos por ahora: el contenido de la
calculadora vive en código (`lib/calculators/nomina.ts`).

## Arranque local

```bash
npm install
npm run dev
```

Abre http://localhost:3000 — la calculadora de nómina está en
`/calculadora/nomina`.

## Subir a GitHub

```bash
git init
git add .
git commit -m "Scaffold inicial: home, calculadora de nomina, SEO, CI"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/calculadoras-espana.git
git push -u origin main
```

Cambia `TU_USUARIO` en el README (badge) y en el remote.

## Despliegue en Vercel

1. https://vercel.com/new → Import Project → selecciona el repo
2. Next.js se detecta solo, no toques nada del build
3. (Opcional) añade `NEXT_PUBLIC_SITE_URL` con tu dominio real en Environment Variables
4. Deploy

## Cómo añadir la siguiente calculadora (ej: Finiquito)

1. Crea `lib/calculators/finiquito.ts` copiando la estructura de `nomina.ts`
   (schema Zod, función `calculate`, `meta`, `faqs`).
2. Regístrala en `lib/calculators/index.ts`.
3. Crea su formulario cliente en `components/calculator/FiniquitoForm.tsx`.
4. Añade la condición correspondiente en `app/calculadora/[slug]/page.tsx`.

No hay que tocar nada más: home, sitemap y JSON-LD la recogen
automáticamente en cuanto está en el índice.

## Qué falta (siguientes fases)

- Resto de las 20 calculadoras iniciales
- Base de datos (cuando quieras editar contenido sin tocar código)
- Blog, Panel Admin, PDF de resultados, AdSense/newsletter
- Rate limiting y PWA

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
.github/workflows/ci.yml      → Typecheck + lint + build en cada push
```
