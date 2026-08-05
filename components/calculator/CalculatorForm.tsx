'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { getCalculator } from '@/lib/calculators'

interface Props {
  // Se pasa solo el slug (string, serializable) en vez del objeto calculadora
  // completo: las funciones (como `calculate`) no pueden cruzar el límite
  // Server Component -> Client Component. La calculadora se resuelve aquí,
  // en el propio bundle de cliente, donde sí puede ejecutarse.
  slug: string
}

export function CalculatorForm({ slug }: Props) {
  const calculator = getCalculator(slug)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  if (!calculator) return null

  const { register, handleSubmit } = useForm<any>({
    defaultValues: calculator.defaultValues as any,
  })

  function onSubmit(data: any) {
    try {
      setError(null)
      setResult(calculator.calculate(data))
    } catch {
      setError('Revisa los datos introducidos: algún valor no es válido.')
    }
  }

  return (
    <div className="card sticky top-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {calculator.fields.map((field) => (
          <div key={field.key}>
            <label className="text-sm font-medium">
              {field.label}
              {field.suffix ? ` (${field.suffix})` : ''}
            </label>

            {field.type === 'select' ? (
              <select
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                {...register(field.key, { valueAsNumber: field.valueAsNumber })}
              >
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-slate-300"
                {...register(field.key)}
              />
            ) : (
              <input
                type="number"
                step={field.step ?? 0.01}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                {...register(field.key, { valueAsNumber: true })}
              />
            )}
          </div>
        ))}

        <button type="submit" className="btn-primary w-full">
          Calcular
        </button>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>

      {result && (
        <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-800">
          <p className="text-sm text-slate-500">{result.main.label}</p>
          <p className="text-3xl font-bold text-brand-600">
            {formatValue(result.main.value, result.main.unit)}
          </p>

          <dl className="mt-4 space-y-1 text-sm">
            {Object.entries(result.breakdown).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4">
                <dt className="text-slate-500">{formatLabel(key)}</dt>
                <dd className="text-right">
                  {typeof value === 'number'
                    ? key.toLowerCase().includes('porcentaje') ||
                      key.toLowerCase().includes('tipo')
                      ? `${value}%`
                      : value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
                    : String(value)}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 flex gap-2">
            <button className="btn-primary flex-1 !bg-slate-800 hover:!bg-slate-900">
              Descargar PDF
            </button>
            <button className="btn-primary flex-1 !bg-slate-100 !text-slate-900 hover:!bg-slate-200">
              Compartir
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function formatValue(value: number, unit: string) {
  if (unit === 'EUR') return value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
  if (unit === 'PORCENTAJE') return `${value}%`
  if (unit === 'DIAS') return `${value} días`
  if (unit === 'ANIOS') return `${value} años`
  return String(value)
}

// Convierte camelCase a una etiqueta legible en español (fallback genérico
// para cualquier campo del breakdown que no tenga traducción manual).
const LABELS: Record<string, string> = {
  salarioBrutoMensual: 'Bruto mensual',
  contingenciasComunes: 'Contingencias comunes',
  desempleo: 'Desempleo',
  formacionProfesional: 'Formación profesional',
  totalSegSocialTrabajador: 'Total Seg. Social',
  baseImponibleIrpf: 'Base imponible IRPF',
  retencionIrpfPorcentaje: '% Retención IRPF',
  retencionIrpfEuros: 'Retención IRPF (€)',
  salarioNetoMensual: 'Neto mensual',
  salarioNetoAnual: 'Neto anual',
}

function formatLabel(key: string) {
  if (LABELS[key]) return LABELS[key]
  const withSpaces = key.replace(/([A-Z])/g, ' $1')
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1)
}
