# Calculadoras España — Starter

![CI](https://github.com/TU_USUARIO/calculadoras-espana/actions/workflows/ci.yml/badge.svg)

Next.js 15 + TypeScript + Tailwind. **8 calculadoras funcionales**, listado
por categoría, blog con enlazado interno automático, sitemap/robots
generados y JSON-LD en todas las páginas. Sin base de datos por ahora: todo
el contenido vive en código tipado (fácil de auditar, versionar y testear).

## Calculadoras incluidas

| Calculadora | Categoría | Qué calcula |
|---|---|---|
| Nómina | Laboral | Bruto → neto (SS + IRPF por tramos) |
| Finiquito | Laboral | Días trabajados, vacaciones y pagas extra pendientes |
| Indemnización por despido | Laboral | Improcedente (33 días/año) vs objetivo (20 días/año) |
| IRPF | Fiscal | Cuota progresiva real por tramos, mínimo personal/familiar |
| IVA | Fiscal | Añade o desglosa IVA (21/10/4%) en cualquier sentido |
| Hipoteca | Hipotecas | Cuota mensual, sistema de amortización francés |
| Préstamo personal | Préstamos | Cuota + comisión de apertura + coste total |
| Ahorro | Ahorro | Interés compuesto con aportaciones mensuales |

## Arranque local

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Subir a GitHub

```bash
git init
git add .
git commit -m "Scaffold: 8 calculadoras, categorias, blog, SEO, CI"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/calculadoras-espana.git
git push -u origin main
```

## Despliegue en Vercel

1. https://vercel.com/new → Import Project → selecciona el repo
2. Next.js se detecta solo
3. Deploy — no hace falta ninguna variable de entorno para que arranque

## Cómo añadir la siguiente calculadora

1. Copia `lib/calculators/nomina.ts` como plantilla (schema Zod, `fields`,
   `defaultValues`, `calculate`, `meta`, `faqs`).
2. Guárdala como `lib/calculators/tu-slug.ts`.
3. Impórtala y añádela al objeto `calculators` en `lib/calculators/index.ts`.

Con eso ya aparece en: home (agrupada por categoría), su página de
categoría, el sitemap, y su propia página `/calculadora/tu-slug` con
formulario, resultado, FAQ y JSON-LD — automáticamente, gracias al
`<CalculatorForm>` genérico que lee la definición de campos (`fields`) de
cada calculadora.

## Cómo añadir un artículo de blog

Añade un objeto al array `articles` en `lib/articles/index.ts`, incluyendo
`relatedCalculatorSlugs` con los slugs de las calculadoras que quieras
enlazar desde el artículo (enlazado interno automático).

## Arquitectura clave

- **`lib/calculators/*.ts`**: cada archivo es una calculadora completa y
  autocontenida — validación (Zod), lógica de cálculo, metadata SEO, campos
  de formulario y FAQs.
- **`components/calculator/CalculatorForm.tsx`**: componente cliente único
  que renderiza el formulario de CUALQUIER calculadora a partir de su
  `fields`. Recibe solo el `slug` (no el objeto calculadora completo) porque
  las funciones no pueden pasar de Server a Client Components en Next.js.
- **`app/calculadora/[slug]/page.tsx`**: Server Component que genera
  metadata, JSON-LD (`SoftwareApplication`, `FAQPage`, `Breadcrumb`) y
  renderiza el contenido + el formulario cliente.

## Qué falta (siguientes fases)

- Resto de calculadoras (paro, jubilación, autónomos, vehículos...)
- Base de datos (cuando quieras editar contenido sin tocar código ni redeployar)
- Panel Admin
- Generación de PDF de resultados y botón de compartir funcional
- AdSense / newsletter / suscripción
- Rate limiting y PWA

## Estructura

```
app/
  page.tsx                    → Home (agrupa calculadoras por categoría)
  calculadora/[slug]/page.tsx → Página de cada calculadora (ISR)
  categoria/[slug]/page.tsx   → Listado por categoría (ISR)
  blog/page.tsx                → Índice del blog
  blog/[slug]/page.tsx         → Artículo con calculadoras relacionadas
  sitemap.ts / robots.ts      → SEO técnico automático
components/
  calculator/CalculatorForm.tsx → Formulario genérico (sirve para todas)
  calculator/FaqAccordion.tsx
lib/
  calculators/                → Motores de cálculo tipados (una por archivo)
  articles/                    → Contenido del blog
  categories.ts                → Las 12 categorías
  seo/generate.ts              → Generador de metadata y JSON-LD
.github/workflows/ci.yml      → Typecheck + lint + build en cada push
```
