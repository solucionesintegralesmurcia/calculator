import Link from 'next/link'
import { calculators } from '@/lib/calculators'

export const revalidate = 3600 // ISR: 1 hora

export default function HomePage() {
  const destacadas = Object.values(calculators)

  return (
    <main>
      {/* HERO */}
      <section className="border-b border-slate-200 py-20 dark:border-slate-800">
        <div className="container-page text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Todas las calculadoras que necesitas, en un solo sitio
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Nómina, hipoteca, IRPF, jubilación, autónomos y mucho más. Gratis,
            rápidas y siempre actualizadas.
          </p>
          <div className="mt-8">
            <input
              type="search"
              placeholder="Busca tu calculadora (ej: nómina, hipoteca, IVA...)"
              className="w-full max-w-lg rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
        </div>
      </section>

      {/* CALCULADORAS DESTACADAS */}
      <section className="py-16">
        <div className="container-page">
          <h2 className="text-2xl font-semibold">Calculadoras destacadas</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {destacadas.map((calc) => (
              <Link
                key={calc.meta.slug}
                href={`/calculadora/${calc.meta.slug}`}
                className="card transition hover:shadow-md"
              >
                <h3 className="font-medium">{calc.meta.title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {calc.meta.shortDescription}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
