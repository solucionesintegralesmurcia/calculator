import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const ahorroInputSchema = z.object({
  aportacionInicial: z.number().min(0).max(50_000_000),
  aportacionMensual: z.number().min(0).max(1_000_000),
  interesAnual: z.number().min(0).max(50),
  anios: z.number().min(1).max(80),
})

export type AhorroInput = z.infer<typeof ahorroInputSchema>

interface AhorroBreakdown extends Record<string, number> {
  totalAportado: number
  interesesGanados: number
  capitalFinal: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

// Interés compuesto con aportaciones mensuales constantes:
// FV = P(1+r)^n + PMT * (((1+r)^n - 1) / r)
function calculate(input: AhorroInput) {
  const parsed = ahorroInputSchema.parse(input)
  const n = parsed.anios * 12
  const r = parsed.interesAnual / 100 / 12

  const fvInicial = parsed.aportacionInicial * Math.pow(1 + r, n)
  const fvAportaciones =
    r === 0
      ? parsed.aportacionMensual * n
      : parsed.aportacionMensual * ((Math.pow(1 + r, n) - 1) / r)

  const capitalFinal = fvInicial + fvAportaciones
  const totalAportado = parsed.aportacionInicial + parsed.aportacionMensual * n
  const interesesGanados = capitalFinal - totalAportado

  const breakdown: AhorroBreakdown = {
    totalAportado: round2(totalAportado),
    interesesGanados: round2(interesesGanados),
    capitalFinal: round2(capitalFinal),
  }

  return {
    main: { label: 'Capital final estimado', value: breakdown.capitalFinal, unit: 'EUR' as const },
    breakdown,
  }
}

export const ahorroCalculator: CalculatorDefinition<AhorroInput, AhorroBreakdown> = {
  meta: {
    slug: 'ahorro',
    categorySlug: 'ahorro',
    title: 'Calculadora de Ahorro 2026',
    seoTitle: 'Calculadora de Ahorro 2026: Cuánto Crecerá tu Dinero con Interés Compuesto',
    metaDescription:
      'Calcula cuánto dinero tendrás ahorrado en el futuro con aportaciones mensuales e interés compuesto, y cuánto proviene de intereses frente a tus propias aportaciones.',
    shortDescription: 'Simula tu ahorro futuro con aportaciones mensuales e interés compuesto.',
    updatedAt: '2026-01-01',
  },
  fields: [
    { key: 'aportacionInicial', label: 'Aportación inicial', type: 'number', suffix: '€' },
    { key: 'aportacionMensual', label: 'Aportación mensual', type: 'number', suffix: '€' },
    {
      key: 'interesAnual',
      label: 'Rentabilidad anual esperada',
      type: 'number',
      suffix: '%',
      step: 0.01,
    },
    { key: 'anios', label: 'Horizonte temporal', type: 'number', suffix: 'años' },
  ],
  defaultValues: {
    aportacionInicial: 1000,
    aportacionMensual: 100,
    interesAnual: 6,
    anios: 20,
  },
  faqs: [
    {
      question: '¿Qué es el interés compuesto?',
      answer:
        'Es el interés que se calcula no solo sobre el capital inicial, sino también sobre los intereses ya ganados en periodos anteriores. Por eso el crecimiento se acelera con el tiempo, especialmente en horizontes largos.',
    },
    {
      question: '¿Qué rentabilidad anual es razonable usar?',
      answer:
        'Depende del tipo de producto: una cuenta de ahorro suele rondar el 1-3%, mientras que un fondo indexado diversificado a largo plazo históricamente ha rondado el 6-8% anual, aunque no hay rentabilidad garantizada.',
    },
    {
      question: '¿Esta calculadora tiene en cuenta la inflación?',
      answer:
        'No, el resultado es en términos nominales. Para saber el poder adquisitivo real de ese capital futuro, tendrías que descontarle la inflación media esperada durante esos años.',
    },
  ],
  calculate,
}
