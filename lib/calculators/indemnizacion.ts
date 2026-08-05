import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const indemnizacionInputSchema = z.object({
  salarioBrutoAnual: z.number().min(0).max(2_000_000),
  aniosAntiguedad: z.number().min(0).max(50),
  tipoDespido: z.enum(['improcedente', 'objetivo']),
})

export type IndemnizacionInput = z.infer<typeof indemnizacionInputSchema>

interface IndemnizacionBreakdown extends Record<string, number> {
  salarioDiario: number
  diasPorAnioTrabajado: number
  diasIndemnizacionSinTope: number
  topeMesesSalario: number
  diasIndemnizacionAplicados: number
  totalIndemnizacion: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function calculate(input: IndemnizacionInput) {
  const parsed = indemnizacionInputSchema.parse(input)
  const salarioDiario = parsed.salarioBrutoAnual / 365

  const diasPorAnioTrabajado = parsed.tipoDespido === 'improcedente' ? 33 : 20
  const topeMesesSalario = parsed.tipoDespido === 'improcedente' ? 24 : 12

  const diasIndemnizacionSinTope = diasPorAnioTrabajado * parsed.aniosAntiguedad
  const diasTope = topeMesesSalario * 30
  const diasIndemnizacionAplicados = Math.min(diasIndemnizacionSinTope, diasTope)

  const totalIndemnizacion = salarioDiario * diasIndemnizacionAplicados

  const breakdown: IndemnizacionBreakdown = {
    salarioDiario: round2(salarioDiario),
    diasPorAnioTrabajado,
    diasIndemnizacionSinTope: round2(diasIndemnizacionSinTope),
    topeMesesSalario,
    diasIndemnizacionAplicados: round2(diasIndemnizacionAplicados),
    totalIndemnizacion: round2(totalIndemnizacion),
  }

  return {
    main: { label: 'Indemnización estimada', value: breakdown.totalIndemnizacion, unit: 'EUR' as const },
    breakdown,
  }
}

export const indemnizacionCalculator: CalculatorDefinition<
  IndemnizacionInput,
  IndemnizacionBreakdown
> = {
  meta: {
    slug: 'indemnizacion',
    categorySlug: 'laboral',
    title: 'Calculadora de Indemnización por Despido 2026',
    seoTitle: 'Calculadora de Indemnización por Despido 2026: Improcedente y Objetivo',
    metaDescription:
      'Calcula tu indemnización por despido improcedente (33 días/año, tope 24 meses) u objetivo (20 días/año, tope 12 meses) según tu antigüedad.',
    shortDescription: 'Estima tu indemnización según antigüedad y tipo de despido.',
    updatedAt: '2026-01-01',
  },
  fields: [
    { key: 'salarioBrutoAnual', label: 'Salario bruto anual', type: 'number', suffix: '€' },
    { key: 'aniosAntiguedad', label: 'Años de antigüedad', type: 'number', suffix: 'años', step: 0.1 },
    {
      key: 'tipoDespido',
      label: 'Tipo de despido',
      type: 'select',
      options: [
        { value: 'improcedente', label: 'Improcedente (33 días/año, tope 24 meses)' },
        { value: 'objetivo', label: 'Objetivo/procedente (20 días/año, tope 12 meses)' },
      ],
    },
  ],
  defaultValues: {
    salarioBrutoAnual: 24000,
    aniosAntiguedad: 5,
    tipoDespido: 'improcedente',
  },
  faqs: [
    {
      question: '¿Cuál es la diferencia entre despido improcedente y objetivo?',
      answer:
        'El despido objetivo se basa en causas económicas, técnicas, organizativas o de producción justificadas, con 20 días de salario por año trabajado. El improcedente es aquel que no cumple los requisitos legales o de forma, con 33 días de salario por año (para contratos posteriores a 2012).',
    },
    {
      question: '¿Cómo se calculan los años de antigüedad si no son exactos?',
      answer:
        'Los periodos de tiempo inferiores a un año se prorratean por meses trabajados. Puedes introducir un valor decimal (por ejemplo, 3.5 años) para reflejarlo en la estimación.',
    },
    {
      question: '¿Esta indemnización tributa en el IRPF?',
      answer:
        'La indemnización está exenta de IRPF hasta los límites que establece la ley (con un máximo de 180.000€); el exceso sobre esos límites sí tributa como rendimiento del trabajo.',
    },
  ],
  calculate,
}
