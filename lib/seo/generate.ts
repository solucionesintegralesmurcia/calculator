import type { Metadata } from 'next'
import type { CalculatorMeta, FaqItem } from '@/lib/calculators/types'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tudominio.es'
const SITE_NAME = 'Calculadoras España'

export function generateCalculatorMetadata(meta: CalculatorMeta): Metadata {
  const url = `${SITE_URL}/calculadora/${meta.slug}`
  return {
    title: meta.seoTitle,
    description: meta.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: meta.seoTitle,
      description: meta.metaDescription,
      url,
      siteName: SITE_NAME,
      locale: 'es_ES',
      type: 'website',
      images: [`${SITE_URL}/api/og?slug=${meta.slug}`],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.seoTitle,
      description: meta.metaDescription,
    },
  }
}

// JSON-LD: SoftwareApplication (la calculadora como herramienta)
export function buildCalculatorSchema(meta: CalculatorMeta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: meta.title,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: `${SITE_URL}/calculadora/${meta.slug}`,
    dateModified: meta.updatedAt,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  }
}

// JSON-LD: FAQPage
export function buildFaqSchema(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

// JSON-LD: BreadcrumbList
export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  }
}
