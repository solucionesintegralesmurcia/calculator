// Tipos base que toda calculadora debe respetar.
// Cada calculadora nueva implementa esta interfaz -> consistencia total en el sitio.

export interface CalculatorMeta {
  slug: string                // 'nomina'
  categorySlug: string        // 'laboral'
  title: string                // Título H1
  seoTitle: string             // <title> optimizado (puede diferir del H1)
  metaDescription: string
  shortDescription: string     // usado en cards de listado/relacionadas
  updatedAt: string            // ISO date, para mostrar "Actualizado el..." (E-E-A-T)
}

export interface FaqItem {
  question: string
  answer: string
}

export interface CalculationResult<T = Record<string, number>> {
  main: {
    label: string
    value: number
    unit: 'EUR' | 'PORCENTAJE' | 'DIAS' | 'ANIOS'
  }
  breakdown: T
}

export interface CalculatorDefinition<TInput, TBreakdown> {
  meta: CalculatorMeta
  faqs: FaqItem[]
  calculate: (input: TInput) => CalculationResult<TBreakdown>
}
