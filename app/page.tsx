import Link from 'next/link'
import { calculators, getCalculatorsByCategory } from '@/lib/calculators'
import { categories } from '@/lib/categories'
import { articles } from '@/lib/articles'

export const revalidate = 3600

export default function HomePage() {
  const activeCategories = categories.filter((cat) => getCalculatorsByCategory(cat.slug).length > 0)

  return (
    <main>
      <section className="border-b border-slate-200 py-20 dark:border-slate-800">
        <div className="container-page text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Todas las calculadoras que necesitas, en un solo sitio
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Nómina, hipoteca, IRPF, préstamos, ahorro y mucho más. Gratis,
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

      <section className="py-16">
        <div className="container-page">
          <h2 className="text-2xl font-semibold">Categorías</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-800"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {activeCategories.map((cat) => {
        const calcs = getCalculatorsByCategory(cat.slug)
        return (
          <section key={cat.slug} className="border-t border-slate-200 py-12 dark:border-slate-800">
            <div className="container-page">
              <div className="flex items-baseline justify-between">
                <h2 className="text-2xl font-semibold">{cat.name}</h2>
                <Link href={`/categoria/${cat.slug}`} className="text-sm text-brand-600 hover:underline">
                  Ver todas
                </Link>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {calcs.map((calc) => (
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
        )
      })}

      <section className="border-t border-slate-200 py-16 dark:border-slate-800">
        <div className="container-page">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-semibold">Últimos artículos</h2>
            <Link href="/blog" className="text-sm text-brand-600 hover:underline">
              Ver blog
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {articles.map((article) => (
              <Link key={article.slug} href={`/blog/${article.slug}`} className="card hover:shadow-md">
                <h3 className="font-medium">{article.title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{article.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <p className="sr-only">
        {Object.values(calculators).length} calculadoras disponibles y creciendo cada semana.
      </p>
    </main>
  )
}
