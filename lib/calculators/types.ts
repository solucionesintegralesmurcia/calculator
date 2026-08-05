// Tipos base que toda calculadora debe respetar.
// Cada calculadora implementa esta interfaz -> un único <CalculatorForm>
// genérico sabe renderizarlas todas sin código repetido por calculadora.

export interface CalculatorMeta {
  slug: string
  categorySlug: string
  title: string
  seoTitle: string
  metaDescription: string
  shortDescription: string
  updatedAt: string
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

export interface FieldOption {
  value: string
  label: string
}

export interface FieldDef {
  key: string
  label: string
  type: 'number' | 'select' | 'checkbox'
  options?: FieldOption[]
  suffix?: string
  step?: number
  /** Para 'select' con opciones numéricas (ej: 12/14 pagas, 21/10/4 % IVA) */
  valueAsNumber?: boolean
}

export interface CalculatorDefinition<TInput, TBreakdown> {
  meta: CalculatorMeta
  faqs: FaqItem[]
  fields: FieldDef[]
  defaultValues: TInput
  calculate: (input: TInput) => CalculationResult<TBreakdown>
}
