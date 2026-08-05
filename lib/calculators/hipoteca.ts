import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const hipotecaInputSchema = z.object({
  importePrestamo: z.number().min(1).max(50_000_000),
  tipoInteresAnual: z.number().min(0).max(30),
  plazoAnios: z.number().min(1).max(50),
})

export type HipotecaInput = z.infer<typeof hipotecaInputSchema>

interface HipotecaBreakdown extends Record<string, number> {
  cuotaMensual: number
  totalPagado: number
  totalIntereses: number
  numeroCuotas: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

// Sistema de amortización francés: cuota constante, la parte de interés
// baja y la de capital sube a lo largo del préstamo.
function calculate(input: HipotecaInput) {
  const parsed = hipotecaInputSchema.parse(input)
  const n = parsed.plazoAnios * 12
  const r = parsed.tipoInteresAnual / 100 / 12

  const cuotaMensual =
    r === 0
      ? parsed.importePrestamo / n
      : (parsed.importePrestamo * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1)

  const totalPagado = cuotaMensual * n
  const totalIntereses = totalPagado - parsed.importePrestamo

  const breakdown: HipotecaBreakdown = {
    cuotaMensual: round2(cuotaMensual),
    totalPagado: round2(totalPagado),
    totalIntereses: round2(totalIntereses),
    numeroCuotas: n,
  }

  return {
    main: { label: 'Cuota mensual', value: breakdown.cuotaMensual, unit: 'EUR' as const },
    breakdown,
  }
}

export const hipotecaCalculator: CalculatorDefinition<HipotecaInput, HipotecaBreakdown> = {
  meta: {
    slug: 'hipoteca',
    categorySlug: 'hipotecas',
    title: 'Calculadora de Hipoteca 2026',
    seoTitle: 'Calculadora de Hipoteca 2026: Cuota Mensual y Total de Intereses',
    metaDescription:
      'Calcula la cuota mensual de tu hipoteca, el total de intereses y el importe total a devolver según el capital, el tipo de interés y el plazo.',
    shortDescription: 'Calcula la cuota mensual y el total de intereses de tu hipoteca.',
    updatedAt: '2026-01-01',
  },
  fields: [
    { key: 'importePrestamo', label: 'Importe del préstamo', type: 'number', suffix: '€' },
    {
      key: 'tipoInteresAnual',
      label: 'Tipo de interés (TIN) anual',
      type: 'number',
      suffix: '%',
      step: 0.01,
    },
    { key: 'plazoAnios', label: 'Plazo', type: 'number', suffix: 'años' },
  ],
  defaultValues: {
    importePrestamo: 150000,
    tipoInteresAnual: 3.2,
    plazoAnios: 25,
  },
  faqs: [
    {
      question: '¿Cómo se calcula la cuota mensual de una hipoteca?',
      answer:
        'La mayoría de hipotecas en España usan el sistema de amortización francés: la cuota es constante durante todo el préstamo, pero al principio se paga más interés y menos capital, y esa proporción se invierte con el tiempo.',
    },
    {
      question: '¿Qué diferencia hay entre TIN y TAE?',
      answer:
        'El TIN (Tipo de Interés Nominal) es el interés puro del préstamo, usado en este cálculo. La TAE incluye además comisiones y gastos asociados, por lo que suele ser algo más alta que el TIN.',
    },
    {
      question: '¿Esta calculadora sirve para hipotecas a tipo variable?',
      answer:
        'Sirve para estimar la cuota en un momento dado. En una hipoteca variable, el tipo de interés (y por tanto la cuota) puede cambiar en cada revisión según el índice de referencia (normalmente el Euríbor).',
    },
  ],
  calculate,
}
