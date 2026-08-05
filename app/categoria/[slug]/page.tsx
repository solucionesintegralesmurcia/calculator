import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCategory, categories } from '@/lib/categories'
import { getCalculatorsByCategory } from '@/lib/calculators'

export const revalidate = 3600

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }))
}

type PageParams = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params
  const category = getCategory(slug)
  if (!category) return {}
  return {
    title: `Calculadoras de ${category.name}`,
    description: category.description,
    alternates: { canonical: `/categoria/${category.slug}` },
  }
}

export default async function CategoriaPage({ params }: PageParams) {
  const { slug } = await params
  const category = getCategory(slug)
  if (!category) notFound()

  const calcs = getCalculatorsByCategory(category.slug)

  return (
    <main className="container-page py-12">
      <nav className="text-sm text-slate-500">
        <Link href="/">Inicio</Link> / <span>{category.name}</span>
      </nav>
      <h1 className="mt-2 text-3xl font-bold">Calculadoras de {category.name}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">{category.description}</p>

      {calcs.length === 0 ? (
        <p className="mt-8 text-slate-500">
          Todavía no hay calculadoras publicadas en esta categoría. Vuelve pronto.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {calcs.map((calc) => (
            <Link
              key={calc.meta.slug}
              href={`/calculadora/${calc.meta.slug}`}
              className="card transition hover:shadow-md"
            >
              <h2 className="font-medium">{calc.meta.title}</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {calc.meta.shortDescription}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
