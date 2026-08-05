import { z } from 'zod'
import type { CalculatorDefinition } from './types'

// -----------------------------------------------------------------------------
// CALCULADORA DE NÓMINA — plantilla de referencia para el resto de calculadoras
// -----------------------------------------------------------------------------
// Los tipos de cotización y tramos de IRPF cambian cada año. Por eso NO están
// hardcodeados "a fuego" en producción: en la versión final vienen de la tabla
// `tax_tables` de Supabase (editable desde el admin), y esta función recibe la
// tabla vigente como parámetro. Aquí se dejan unos valores 2025 por defecto
// para que el motor sea funcional y testeable desde ya.

export const nominaInputSchema = z.object({
  salarioBrutoAnual: z.number().min(0).max(2_000_000),
  pagasExtra: z.union([z.literal(12), z.literal(14)]).default(14),
  situacionFamiliar: z
    .enum(['soltero', 'casado_1_ingreso', 'casado_2_ingresos'])
    .default('soltero'),
  numHijos: z.number().int().min(0).max(10).default(0),
  comunidadAutonoma: z.string().default('generico'),
  contratoIndefinido: z.boolean().default(true),
})

export type NominaInput = z.infer<typeof nominaInputSchema>

interface NominaBreakdown extends Record<string, number> {
  salarioBrutoMensual: number
  contingenciasComunes: number
  desempleo: number
  formacionProfesional: number
  totalSegSocialTrabajador: number
  baseImponibleIrpf: number
  retencionIrpfPorcentaje: number
  retencionIrpfEuros: number
  salarioNetoMensual: number
  salarioNetoAnual: number
}

// Tipos de cotización del trabajador (Régimen General, valores 2025 de referencia)
const TIPOS_SS_TRABAJADOR = {
  contingenciasComunes: 0.047,
  desempleo: 0.0155, // indefinido; temporal sería 0.0160
  formacionProfesional: 0.001,
}

// Estimación simplificada de retención IRPF por tramos de renta (orientativa;
// no sustituye el cálculo oficial de la AEAT, que incorpora más variables).
function estimarPorcentajeIrpf(baseAnual: number, hijos: number, situacion: string): number {
  let base = baseAnual - hijos * 1200
  if (situacion === 'casado_1_ingreso') base -= 3400

  const tramos = [
    { hasta: 12450, tipo: 0.02 },
    { hasta: 20200, tipo: 0.06 },
    { hasta: 35200, tipo: 0.11 },
    { hasta: 60000, tipo: 0.18 },
    { hasta: 300000, tipo: 0.24 },
    { hasta: Infinity, tipo: 0.3 },
  ]

  const tramo = tramos.find((t) => base <= t.hasta) ?? tramos[tramos.length - 1]
  return Math.max(tramo.tipo, 0)
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function calculate(input: NominaInput) {
  const parsed = nominaInputSchema.parse(input)
  const numPagas = parsed.pagasExtra
  const salarioBrutoMensual = parsed.salarioBrutoAnual / numPagas

  const contingenciasComunes = salarioBrutoMensual * TIPOS_SS_TRABAJADOR.contingenciasComunes
  const desempleo = salarioBrutoMensual * TIPOS_SS_TRABAJADOR.desempleo
  const formacionProfesional = salarioBrutoMensual * TIPOS_SS_TRABAJADOR.formacionProfesional
  const totalSegSocialTrabajador = contingenciasComunes + desempleo + formacionProfesional

  const baseImponibleIrpf = parsed.salarioBrutoAnual - totalSegSocialTrabajador * numPagas
  const retencionIrpfPorcentaje = estimarPorcentajeIrpf(
    baseImponibleIrpf,
    parsed.numHijos,
    parsed.situacionFamiliar
  )
  const retencionIrpfEuros = salarioBrutoMensual * retencionIrpfPorcentaje

  const salarioNetoMensual = salarioBrutoMensual - totalSegSocialTrabajador - retencionIrpfEuros
  const salarioNetoAnual = salarioNetoMensual * numPagas

  const breakdown: NominaBreakdown = {
    salarioBrutoMensual: round2(salarioBrutoMensual),
    contingenciasComunes: round2(contingenciasComunes),
    desempleo: round2(desempleo),
    formacionProfesional: round2(formacionProfesional),
    totalSegSocialTrabajador: round2(totalSegSocialTrabajador),
    baseImponibleIrpf: round2(baseImponibleIrpf),
    retencionIrpfPorcentaje: round2(retencionIrpfPorcentaje * 100),
    retencionIrpfEuros: round2(retencionIrpfEuros),
    salarioNetoMensual: round2(salarioNetoMensual),
    salarioNetoAnual: round2(salarioNetoAnual),
  }

  return {
    main: {
      label: 'Salario neto mensual',
      value: breakdown.salarioNetoMensual,
      unit: 'EUR' as const,
    },
    breakdown,
  }
}

export const nominaCalculator: CalculatorDefinition<NominaInput, NominaBreakdown> = {
  meta: {
    slug: 'nomina',
    categorySlug: 'laboral',
    title: 'Calculadora de Nómina 2026',
    seoTitle: 'Calculadora de Nómina 2026: Salario Bruto a Neto Online Gratis',
    metaDescription:
      'Calcula tu nómina neta a partir del salario bruto anual. Incluye Seguridad Social, IRPF, pagas extra y situación familiar. Actualizada 2026.',
    shortDescription: 'Convierte tu salario bruto en neto mensual, con desglose de SS e IRPF.',
    updatedAt: '2026-01-01',
  },
  faqs: [
    {
      question: '¿Cómo se calcula el salario neto a partir del bruto?',
      answer:
        'Al salario bruto se le restan las cotizaciones a la Seguridad Social del trabajador (contingencias comunes, desempleo y formación profesional) y la retención de IRPF correspondiente a tu tramo de renta y situación familiar.',
    },
    {
      question: '¿Qué diferencia hay entre 12 y 14 pagas?',
      answer:
        'Con 14 pagas, las dos extras se cobran aparte en verano y Navidad. Con 12 pagas, el importe de las extras se prorratea entre los 12 meses, por lo que la nómina mensual es más alta pero no hay pagas adicionales.',
    },
    {
      question: '¿Este cálculo es exacto o solo orientativo?',
      answer:
        'Es una estimación fiable para la mayoría de casos del Régimen General, pero no sustituye el cálculo oficial de tu empresa o la Agencia Tributaria, que puede incluir variables adicionales (convenio colectivo, complementos, comunidad autónoma, etc.).',
    },
  ],
  calculate,
}
