import type { FaqItem } from '@/lib/calculators/types'

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  return (
    <div className="not-prose divide-y divide-slate-200 dark:divide-slate-800">
      {faqs.map((faq, i) => (
        <details key={i} className="group py-4">
          <summary className="cursor-pointer list-none font-medium marker:content-none">
            {faq.question}
          </summary>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{faq.answer}</p>
        </details>
      ))}
    </div>
  )
}
