import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tudominio.es'),
  title: {
    default: 'Calculadoras España | Nómina, Hipoteca, IRPF y más',
    template: '%s | Calculadoras España',
  },
  description:
    'La plataforma de calculadoras online más completa de España: nómina, hipoteca, IRPF, jubilación, autónomos y mucho más. Gratis y actualizadas.',
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        {children}
      </body>
    </html>
  )
}
