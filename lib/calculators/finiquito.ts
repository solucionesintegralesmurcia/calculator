import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const finiquitoInputSchema = z.object({
  salarioBrutoAnual: z.number().min(0).max(2_000_000),
  diasTrabajadosMesActual: z.number().int().min(0).max(31),
  diasVacacionesPendientes: z.number().min(0).max(30),
  pagasExtraPendientesProporcion: z.number().min(0).max(100),
})

export type FiniquitoInput = z.infer<typeof finiquitoInputSchema>

interface FiniquitoBreakdown extends Record<string, number> {
  salarioDiario: number
  importeDiasTrabajados: number
  importeVacacionesPendientes: number
  importePagasExtraProporcional: number
  totalFiniquito: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function calculate(input: FiniquitoInput) {
  const parsed = finiquitoInputSchema.parse(input)
  const salarioDiario = parsed.salarioBrutoAnual / 365

  const importeDiasTrabajados = salarioDiario * parsed.diasTrabajadosMesActual
  const importeVacacionesPendientes = salarioDiario * parsed.diasVacacionesPendientes
  const pagaExtraAnual = (parsed.salarioBrutoAnual / 14) * 2
  const importePagasExtraProporcional =
    pagaExtraAnual * (parsed.pagasExtraPendientesProporcion / 100)

  const totalFiniquito =
    importeDiasTrabajados + importeVacacionesPendientes + importePagasExtraProporcional

  const breakdown: FiniquitoBreakdown = {
    salarioDiario: round2(salarioDiario),
    importeDiasTrabajados: round2(importeDiasTrabajados),
    importeVacacionesPendientes: round2(importeVacacionesPendientes),
    importePagasExtraProporcional: round2(importePagasExtraProporcional),
    totalFiniquito: round2(totalFiniquito),
  }

  return {
    main: { label: 'Total finiquito estimado', value: breakdown.totalFiniquito, unit: 'EUR' as const },
    breakdown,
  }
}

export const finiquitoCalculator: CalculatorDefinition<FiniquitoInput, FiniquitoBreakdown> = {
  meta: {
    slug: 'finiquito',
    categorySlug: 'laboral',
    title: 'Calculadora de Finiquito 2026',
    seoTitle: 'Calculadora de Finiquito 2026: Cuánto Me Corresponde al Dejar el Trabajo',
    metaDescription:
      'Calcula tu finiquito al terminar la relación laboral: días trabajados del último mes, vacaciones no disfrutadas y parte proporcional de pagas extra.',
    shortDescription: 'Estima el finiquito por días trabajados, vacaciones y pagas extra pendientes.',
    updatedAt: '2026-01-01',
  },
  fields: [
    { key: 'salarioBrutoAnual', label: 'Salario bruto anual', type: 'number', suffix: '€' },
    {
      key: 'diasTrabajadosMesActual',
      label: 'Días trabajados en el último mes',
      type: 'number',
      suffix: 'días',
    },
    {
      key: 'diasVacacionesPendientes',
      label: 'Días de vacaciones no disfrutadas',
      type: 'number',
      suffix: 'días',
    },
    {
      key: 'pagasExtraPendientesProporcion',
      label: '% de paga extra devengada y no cobrada',
      type: 'number',
      suffix: '%',
    },
  ],
  defaultValues: {
    salarioBrutoAnual: 24000,
    diasTrabajadosMesActual: 15,
    diasVacacionesPendientes: 5,
    pagasExtraPendientesProporcion: 50,
  },
  faqs: [
    {
      question: '¿Qué conceptos incluye el finiquito?',
      answer:
        'Normalmente incluye el salario de los días trabajados y no cobrados, las vacaciones generadas y no disfrutadas, y la parte proporcional de las pagas extra pendientes de devengo.',
    },
    {
      question: '¿El finiquito tributa igual que el salario normal?',
      answer:
        'Sí, el finiquito tributa como rendimiento del trabajo en el IRPF, salvo la parte que corresponda a indemnización por despido dentro de los límites exentos.',
    },
    {
      question: '¿Puedo reclamar si no estoy de acuerdo con el finiquito?',
      answer:
        'Sí. Puedes firmar el finiquito "no conforme" o no firmarlo y reclamar la diferencia ante el Servicio de Mediación (SMAC) o la jurisdicción social en un plazo de un año.',
    },
  ],
  calculate,
}
