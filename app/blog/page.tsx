import Link from 'next/link'
import type { Metadata } from 'next'
import { articles } from '@/lib/articles'

export const revalidate = 43200 // 12h

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artículos sobre nómina, fiscalidad, hipotecas y finanzas personales en España.',
  alternates: { canonical: '/blog' },
}

export default function BlogPage() {
  return (
    <main className="container-page py-12">
      <h1 className="text-3xl font-bold">Blog</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Guías prácticas sobre nómina, despidos, fiscalidad y finanzas personales.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {articles.map((article) => (
          <Link key={article.slug} href={`/blog/${article.slug}`} className="card hover:shadow-md">
            <h2 className="font-semibold">{article.title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{article.excerpt}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
