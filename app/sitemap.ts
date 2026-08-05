import type { MetadataRoute } from 'next'
import { calculators } from '@/lib/calculators'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tudominio.es'

export default function sitemap(): MetadataRoute.Sitemap {
  const calculatorUrls = Object.values(calculators).map((calc) => ({
    url: `${SITE_URL}/calculadora/${calc.meta.slug}`,
    lastModified: calc.meta.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...calculatorUrls,
  ]
}
