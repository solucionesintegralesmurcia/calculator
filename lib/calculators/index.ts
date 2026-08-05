import { nominaCalculator } from './nomina'
// Cuando desarrollemos la siguiente (finiquito, indemnización...), se importa
// y se añade aquí. Esto es lo único que hay que tocar para "publicar" una
// calculadora nueva en todo el sitio (home, sitemap, categoría, buscador...).

export const calculators = {
  nomina: nominaCalculator,
} as const

export type CalculatorSlug = keyof typeof calculators

export function getCalculator(slug: string) {
  return calculators[slug as CalculatorSlug] ?? null
}

export function getAllCalculatorSlugs(): CalculatorSlug[] {
  return Object.keys(calculators) as CalculatorSlug[]
}

export function getCalculatorsByCategory(categorySlug: string) {
  return Object.values(calculators).filter((c) => c.meta.categorySlug === categorySlug)
}
