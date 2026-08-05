import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const prestamoInputSchema = z.object({
  importePrestamo: z.number().min(1).max(5_000_000),
  tipoInteresAnual: z.number().min(0).max(40),
  plazoMeses: z.number().min(1).max(600),
  comisionAperturaPorcentaje: z.number().min(0).max(10),
})

export type PrestamoInput = z.infer<typeof prestamoInputSchema>

interface PrestamoBreakdown extends Record<string, number> {
  comisionApertura: number
  cuotaMensual: number
  totalPagado: number
  totalIntereses: number
  costeTotalPrestamo: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function calculate(input: PrestamoInput) {
  const parsed = prestamoInputSchema.parse(input)
  const n = parsed.plazoMeses
  const r = parsed.tipoInteresAnual / 100 / 12

  const cuotaMensual =
    r === 0
      ? parsed.importePrestamo / n
      : (parsed.importePrestamo * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1)

  const comisionApertura = parsed.importePrestamo * (parsed.comisionAperturaPorcentaje / 100)
  const totalPagado = cuotaMensual * n
  const totalIntereses = totalPagado - parsed.importePrestamo
  const costeTotalPrestamo = totalIntereses + comisionApertura

  const breakdown: PrestamoBreakdown = {
    comisionApertura: round2(comisionApertura),
    cuotaMensual: round2(cuotaMensual),
    totalPagado: round2(totalPagado),
    totalIntereses: round2(totalIntereses),
    costeTotalPrestamo: round2(costeTotalPrestamo),
  }

  return {
    main: { label: 'Cuota mensual', value: breakdown.cuotaMensual, unit: 'EUR' as const },
    breakdown,
  }
}

export const prestamoCalculator: CalculatorDefinition<PrestamoInput, PrestamoBreakdown> = {
  meta: {
    slug: 'prestamo',
    categorySlug: 'prestamos',
    title: 'Calculadora de Préstamo Personal 2026',
    seoTitle: 'Calculadora de Préstamo Personal 2026: Cuota, Intereses y Comisiones',
    metaDescription:
      'Calcula la cuota mensual de tu préstamo personal, el total de intereses y el coste total incluyendo la comisión de apertura.',
    shortDescription: 'Calcula la cuota, los intereses totales y el coste real de un préstamo.',
    updatedAt: '2026-01-01',
  },
  fields: [
    { key: 'importePrestamo', label: 'Importe del préstamo', type: 'number', suffix: '€' },
    {
      key: 'tipoInteresAnual',
      label: 'TIN (tipo de interés anual)',
      type: 'number',
      suffix: '%',
      step: 0.01,
    },
    { key: 'plazoMeses', label: 'Plazo', type: 'number', suffix: 'meses' },
    {
      key: 'comisionAperturaPorcentaje',
      label: 'Comisión de apertura',
      type: 'number',
      suffix: '%',
      step: 0.01,
    },
  ],
  defaultValues: {
    importePrestamo: 10000,
    tipoInteresAnual: 8,
    plazoMeses: 60,
    comisionAperturaPorcentaje: 1,
  },
  faqs: [
    {
      question: '¿Qué diferencia hay con la calculadora de hipoteca?',
      answer:
        'La lógica financiera es la misma (amortización francesa con cuota constante), pero los préstamos personales suelen tener plazos más cortos, tipos de interés más altos y, a menudo, una comisión de apertura que aquí se incluye en el coste total.',
    },
    {
      question: '¿La comisión de apertura se paga una sola vez?',
      answer:
        'Sí, normalmente se descuenta del capital entregado o se paga junto con la primera cuota, y se calcula como un porcentaje sobre el importe total del préstamo.',
    },
    {
      question: '¿Por qué el coste total del préstamo es mayor que los intereses?',
      answer:
        'Porque además de los intereses generados durante todo el plazo, hay que sumar comisiones como la de apertura, que forman parte del coste real de financiarte.',
    },
  ],
  calculate,
}
