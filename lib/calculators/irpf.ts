import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const irpfInputSchema = z.object({
  rendimientoNetoAnual: z.number().min(0).max(5_000_000),
  aportacionesPlanPensiones: z.number().min(0).max(1_500_000),
  numHijos: z.number().int().min(0).max(10),
  declaracionConjunta: z.boolean(),
})

export type IrpfInput = z.infer<typeof irpfInputSchema>

interface IrpfBreakdown extends Record<string, number> {
  minimoExento: number
  baseLiquidable: number
  cuotaIntegra: number
  tipoMedioEfectivo: number
  cuotaLiquida: number
}

// Tramos aproximados de IRPF estatal + autonómico combinados (orientativos, 2025).
const TRAMOS = [
  { hasta: 12450, tipo: 0.19 },
  { hasta: 20200, tipo: 0.24 },
  { hasta: 35200, tipo: 0.3 },
  { hasta: 60000, tipo: 0.37 },
  { hasta: 300000, tipo: 0.45 },
  { hasta: Infinity, tipo: 0.47 },
]

// Cálculo PROGRESIVO real: cada tramo tributa solo por la parte de renta
// que cae dentro de él (no se aplica el tipo marginal a toda la base).
function calcularCuotaProgresiva(baseLiquidable: number): number {
  let cuota = 0
  let restante = baseLiquidable
  let limiteAnterior = 0

  for (const tramo of TRAMOS) {
    if (restante <= 0) break
    const anchoTramo = tramo.hasta - limiteAnterior
    const importeEnTramo = Math.min(restante, anchoTramo)
    cuota += importeEnTramo * tramo.tipo
    restante -= importeEnTramo
    limiteAnterior = tramo.hasta
  }

  return cuota
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function calculate(input: IrpfInput) {
  const parsed = irpfInputSchema.parse(input)

  const minimoPersonal = parsed.declaracionConjunta ? 5550 + 3400 : 5550
  const minimoPorHijos = parsed.numHijos * 2400
  const minimoExento = minimoPersonal + minimoPorHijos

  const baseImponible = Math.max(
    0,
    parsed.rendimientoNetoAnual - parsed.aportacionesPlanPensiones
  )
  const baseLiquidable = Math.max(0, baseImponible - minimoExento)

  const cuotaIntegra = calcularCuotaProgresiva(baseLiquidable)
  const tipoMedioEfectivo = baseImponible > 0 ? (cuotaIntegra / baseImponible) * 100 : 0

  const breakdown: IrpfBreakdown = {
    minimoExento: round2(minimoExento),
    baseLiquidable: round2(baseLiquidable),
    cuotaIntegra: round2(cuotaIntegra),
    tipoMedioEfectivo: round2(tipoMedioEfectivo),
    cuotaLiquida: round2(cuotaIntegra),
  }

  return {
    main: { label: 'IRPF a pagar (estimado)', value: breakdown.cuotaLiquida, unit: 'EUR' as const },
    breakdown,
  }
}

export const irpfCalculator: CalculatorDefinition<IrpfInput, IrpfBreakdown> = {
  meta: {
    slug: 'irpf',
    categorySlug: 'fiscal',
    title: 'Calculadora de IRPF 2026',
    seoTitle: 'Calculadora de IRPF 2026: Cuánto Pagas de Impuesto sobre la Renta',
    metaDescription:
      'Calcula tu IRPF anual aplicando los tramos progresivos reales, mínimo personal y familiar, aportaciones a plan de pensiones y declaración conjunta.',
    shortDescription: 'Estima tu cuota de IRPF anual con el cálculo progresivo real por tramos.',
    updatedAt: '2026-01-01',
  },
  fields: [
    {
      key: 'rendimientoNetoAnual',
      label: 'Rendimiento neto anual (todas las fuentes)',
      type: 'number',
      suffix: '€',
    },
    {
      key: 'aportacionesPlanPensiones',
      label: 'Aportaciones a plan de pensiones',
      type: 'number',
      suffix: '€',
    },
    { key: 'numHijos', label: 'Número de hijos a cargo', type: 'number' },
    { key: 'declaracionConjunta', label: 'Declaración conjunta', type: 'checkbox' },
  ],
  defaultValues: {
    rendimientoNetoAnual: 30000,
    aportacionesPlanPensiones: 0,
    numHijos: 0,
    declaracionConjunta: false,
  },
  faqs: [
    {
      question: '¿Por qué el cálculo es "progresivo" y no un simple porcentaje fijo?',
      answer:
        'Porque en España el IRPF funciona por tramos: cada euro que ganas tributa según el tramo en el que cae, no se aplica el tipo más alto a toda tu renta. Por eso el tipo medio efectivo siempre es menor que el tipo marginal de tu último tramo.',
    },
    {
      question: '¿Qué es el mínimo personal y familiar?',
      answer:
        'Es la parte de tus ingresos que no tributa, destinada a cubrir tus necesidades básicas. Se incrementa por cada hijo a cargo y, en la declaración conjunta, se suma un mínimo adicional.',
    },
    {
      question: '¿Las aportaciones a plan de pensiones reducen mucho el IRPF?',
      answer:
        'Sí, reducen directamente la base imponible antes de calcular el impuesto, dentro de los límites legales anuales, lo que puede bajarte incluso de tramo.',
    },
  ],
  calculate,
}
