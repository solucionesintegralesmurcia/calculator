import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const ivaInputSchema = z.object({
  importe: z.number().min(0).max(100_000_000),
  tipoIva: z.union([z.literal(21), z.literal(10), z.literal(4)]),
  direccion: z.enum(['sin_iva_a_con_iva', 'con_iva_a_sin_iva']),
})

export type IvaInput = z.infer<typeof ivaInputSchema>

interface IvaBreakdown extends Record<string, number> {
  baseImponible: number
  cuotaIva: number
  totalConIva: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function calculate(input: IvaInput) {
  const parsed = ivaInputSchema.parse(input)
  const tipo = parsed.tipoIva / 100

  let baseImponible: number
  let cuotaIva: number
  let totalConIva: number

  if (parsed.direccion === 'sin_iva_a_con_iva') {
    baseImponible = parsed.importe
    cuotaIva = baseImponible * tipo
    totalConIva = baseImponible + cuotaIva
  } else {
    totalConIva = parsed.importe
    baseImponible = totalConIva / (1 + tipo)
    cuotaIva = totalConIva - baseImponible
  }

  const breakdown: IvaBreakdown = {
    baseImponible: round2(baseImponible),
    cuotaIva: round2(cuotaIva),
    totalConIva: round2(totalConIva),
  }

  return {
    main: { label: 'Precio final con IVA', value: breakdown.totalConIva, unit: 'EUR' as const },
    breakdown,
  }
}

export const ivaCalculator: CalculatorDefinition<IvaInput, IvaBreakdown> = {
  meta: {
    slug: 'iva',
    categorySlug: 'fiscal',
    title: 'Calculadora de IVA 2026',
    seoTitle: 'Calculadora de IVA 2026: Calcula el IVA al 21%, 10% o 4%',
    metaDescription:
      'Calcula el IVA de cualquier importe, tanto para añadir el IVA a un precio sin impuestos como para desglosar el IVA incluido en un precio final.',
    shortDescription: 'Añade o desglosa el IVA (21%, 10%, 4%) de cualquier importe al instante.',
    updatedAt: '2026-01-01',
  },
  fields: [
    { key: 'importe', label: 'Importe', type: 'number', suffix: '€' },
    {
      key: 'tipoIva',
      label: 'Tipo de IVA',
      type: 'select',
      valueAsNumber: true,
      options: [
        { value: '21', label: '21% (General)' },
        { value: '10', label: '10% (Reducido)' },
        { value: '4', label: '4% (Superreducido)' },
      ],
    },
    {
      key: 'direccion',
      label: '¿Qué importe has introducido?',
      type: 'select',
      options: [
        { value: 'sin_iva_a_con_iva', label: 'Precio sin IVA (quiero añadirlo)' },
        { value: 'con_iva_a_sin_iva', label: 'Precio con IVA (quiero desglosarlo)' },
      ],
    },
  ],
  defaultValues: {
    importe: 100,
    tipoIva: 21,
    direccion: 'sin_iva_a_con_iva',
  },
  faqs: [
    {
      question: '¿Qué productos llevan el IVA reducido del 10%?',
      answer:
        'Se aplica, entre otros, a alimentos en general, transporte de viajeros, hostelería y restauración, y determinados servicios de reforma de vivienda.',
    },
    {
      question: '¿Qué productos llevan el IVA superreducido del 4%?',
      answer:
        'Se aplica a productos de primera necesidad como pan, leche, frutas, verduras, libros, periódicos y medicamentos.',
    },
    {
      question: '¿Cómo se calcula la base imponible a partir de un precio con IVA?',
      answer:
        'Se divide el precio final entre (1 + tipo de IVA en decimal). Por ejemplo, con IVA del 21%, se divide entre 1,21.',
    },
  ],
  calculate,
}
