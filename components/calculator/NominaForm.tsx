'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { nominaInputSchema, type NominaInput } from '@/lib/calculators/nomina'
import { nominaCalculator } from '@/lib/calculators/nomina'

type Result = ReturnType<typeof nominaCalculator.calculate>

export function NominaForm() {
  const [result, setResult] = useState<Result | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NominaInput>({
    resolver: zodResolver(nominaInputSchema),
    defaultValues: {
      salarioBrutoAnual: 24000,
      pagasExtra: 14,
      situacionFamiliar: 'soltero',
      numHijos: 0,
      comunidadAutonoma: 'generico',
      contratoIndefinido: true,
    },
  })

  function onSubmit(data: NominaInput) {
    setResult(nominaCalculator.calculate(data))
  }

  return (
    <div className="card sticky top-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Salario bruto anual (€)</label>
          <input
            type="number"
            step="0.01"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            {...register('salarioBrutoAnual', { valueAsNumber: true })}
          />
          {errors.salarioBrutoAnual && (
            <p className="mt-1 text-xs text-red-500">Introduce un salario válido</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Número de pagas</label>
          <select
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            {...register('pagasExtra', { valueAsNumber: true })}
          >
            <option value={14}>14 pagas</option>
            <option value={12}>12 pagas (prorrateadas)</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Situación familiar</label>
          <select
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            {...register('situacionFamiliar')}
          >
            <option value="soltero">Soltero/a</option>
            <option value="casado_1_ingreso">Casado/a, 1 ingreso</option>
            <option value="casado_2_ingresos">Casado/a, 2 ingresos</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Número de hijos</label>
          <input
            type="number"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            {...register('numHijos', { valueAsNumber: true })}
          />
        </div>

        <button type="submit" className="btn-primary w-full">
          Calcular nómina
        </button>
      </form>

      {result && (
        <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-800">
          <p className="text-sm text-slate-500">{result.main.label}</p>
          <p className="text-3xl font-bold text-brand-600">
            {result.main.value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
          </p>

          <dl className="mt-4 space-y-1 text-sm">
            {Object.entries(result.breakdown).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <dt className="text-slate-500">{formatLabel(key)}</dt>
                <dd>
                  {key.includes('Porcentaje')
                    ? `${value}%`
                    : value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
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

function formatLabel(key: string) {
  const labels: Record<string, string> = {
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
  return labels[key] ?? key
}
