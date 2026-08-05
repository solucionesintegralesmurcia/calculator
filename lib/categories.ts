export interface Category {
  slug: string
  name: string
  description: string
}

// Fuente de verdad de las categorías mientras no haya base de datos.
// Coincide 1:1 con el seed que tenía supabase/schema.sql en fases anteriores,
// así que cuando se reincorpore una BD, esto se migra directamente.
export const categories: Category[] = [
  { slug: 'laboral', name: 'Laboral', description: 'Nómina, finiquito, indemnizaciones y más.' },
  { slug: 'fiscal', name: 'Fiscal', description: 'IRPF, IVA y otras obligaciones fiscales.' },
  { slug: 'hipotecas', name: 'Hipotecas', description: 'Cuotas, intereses y amortización de hipotecas.' },
  { slug: 'prestamos', name: 'Préstamos', description: 'Préstamos personales, de coche y de consumo.' },
  { slug: 'vehiculos', name: 'Vehículos', description: 'Gasolina, impuestos y costes de tu vehículo.' },
  { slug: 'empresas', name: 'Empresas', description: 'Cálculos para pymes y sociedades.' },
  { slug: 'autonomos', name: 'Autónomos', description: 'Cuotas y obligaciones del trabajador autónomo.' },
  { slug: 'inversiones', name: 'Inversiones', description: 'Rentabilidad e interés compuesto.' },
  { slug: 'finanzas-personales', name: 'Finanzas Personales', description: 'Presupuesto y planificación financiera.' },
  { slug: 'impuestos', name: 'Impuestos', description: 'Otros impuestos y tasas.' },
  { slug: 'vivienda', name: 'Vivienda', description: 'Costes asociados a la compra o alquiler de vivienda.' },
  { slug: 'ahorro', name: 'Ahorro', description: 'Simuladores de ahorro e interés compuesto.' },
]

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug) ?? null
}
