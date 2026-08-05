import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllCalculatorSlugs, getCalculator } from '@/lib/calculators'
import {
  generateCalculatorMetadata,
  buildCalculatorSchema,
  buildFaqSchema,
  buildBreadcrumbSchema,
} from '@/lib/seo/generate'
import { NominaForm } from '@/components/calculator/NominaForm'
import { FaqAccordion } from '@/components/calculator/FaqAccordion'

export const revalidate = 21600 // ISR: 6 horas

export function generateStaticParams() {
  return getAllCalculatorSlugs().map((slug) => ({ slug }))
}

type PageParams = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params
  const calc = getCalculator(slug)
  if (!calc) return {}
  return generateCalculatorMetadata(calc.meta)
}

export default async function CalculadoraPage({ params }: PageParams) {
  const { slug } = await params
  const calc = getCalculator(slug)
  if (!calc) notFound()

  const { meta, faqs } = calc

  const jsonLd = [
    buildCalculatorSchema(meta),
    buildFaqSchema(faqs),
    buildBreadcrumbSchema([
      { name: 'Inicio', url: '/' },
      { name: meta.title, url: `/calculadora/${meta.slug}` },
    ]),
  ]

  return (
    <main className="container-page py-12">
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <nav className="text-sm text-slate-500">
        <a href="/">Inicio</a> / <span>{meta.title}</span>
      </nav>

      <h1 className="mt-2 text-3xl font-bold">{meta.title}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">{meta.metaDescription}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <article className="prose dark:prose-invert max-w-none">
          <h2>¿Cómo funciona esta calculadora?</h2>
          <p>
            Introduce tu salario bruto anual y el resto de datos en el
            formulario para obtener una estimación de tu salario neto mensual,
            con el desglose completo de Seguridad Social e IRPF.
          </p>

          <h2>Preguntas frecuentes</h2>
          <FaqAccordion faqs={faqs} />
        </article>

        <aside>
          {/* Solo cableado para 'nomina' de momento; el resto de calculadoras
              tendrán su propio <XxxForm /> siguiendo el mismo patrón. */}
          {meta.slug === 'nomina' && <NominaForm />}
        </aside>
      </div>
    </main>
  )
}
