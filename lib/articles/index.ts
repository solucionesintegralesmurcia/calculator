export interface Article {
  slug: string
  title: string
  seoTitle: string
  metaDescription: string
  excerpt: string
  content: string[]           // párrafos, para poder mapearlos sin dangerouslySetInnerHTML
  relatedCalculatorSlugs: string[]
  updatedAt: string
}

export const articles: Article[] = [
  {
    slug: 'como-leer-tu-nomina',
    title: 'Cómo leer tu nómina: guía completa 2026',
    seoTitle: 'Cómo Leer tu Nómina Paso a Paso (Guía 2026)',
    metaDescription:
      'Aprende a interpretar cada apartado de tu nómina: devengos, deducciones, bases de cotización y retención de IRPF, con ejemplos reales.',
    excerpt:
      'Tu nómina tiene tres bloques clave: devengos, deducciones y bases de cotización. Te explicamos qué significa cada línea.',
    content: [
      'Una nómina en España se divide siempre en tres grandes bloques: los devengos (todo lo que la empresa te paga), las deducciones (lo que se te resta) y las bases de cotización (sobre las que se calculan esas deducciones).',
      'En los devengos encontrarás el salario base, los complementos (antigüedad, puesto, idiomas...) y, si corresponde ese mes, la parte proporcional de las pagas extra.',
      'En las deducciones aparecen las cotizaciones a la Seguridad Social a cargo del trabajador (contingencias comunes, desempleo y formación profesional) y la retención a cuenta del IRPF, que varía según tu salario y tu situación familiar.',
      'Si quieres ver estos cálculos aplicados a tu caso concreto, puedes usar la calculadora de nómina para obtener tu salario neto estimado a partir del bruto.',
      'Y si tu relación laboral termina, esos mismos conceptos (salario pendiente, vacaciones no disfrutadas y parte proporcional de pagas extra) forman la base de tu finiquito.',
    ],
    relatedCalculatorSlugs: ['nomina', 'finiquito'],
    updatedAt: '2026-01-05',
  },
  {
    slug: 'diferencia-despido-improcedente-objetivo',
    title: 'Despido improcedente vs. objetivo: diferencias y qué indemnización te corresponde',
    seoTitle: 'Despido Improcedente vs Objetivo: Diferencias e Indemnización 2026',
    metaDescription:
      'Entiende la diferencia entre despido improcedente y objetivo, y cuánta indemnización corresponde en cada caso según tu antigüedad.',
    excerpt:
      'No todos los despidos se indemnizan igual. La diferencia entre 20 y 33 días por año puede suponer miles de euros.',
    content: [
      'El despido objetivo se produce por causas económicas, técnicas, organizativas o de producción debidamente justificadas por la empresa, y da derecho a una indemnización de 20 días de salario por año trabajado, con un máximo de 12 mensualidades.',
      'El despido improcedente ocurre cuando el despido no cumple los requisitos legales o de forma, o cuando la empresa no logra justificar la causa alegada. En ese caso, la indemnización sube a 33 días de salario por año trabajado (para contratos posteriores a 2012), con un tope de 24 mensualidades.',
      'La diferencia entre ambos escenarios puede ser muy significativa en términos económicos, especialmente con antigüedades largas, por lo que conviene entender bien en qué categoría cae tu situación.',
      'Puedes estimar el importe exacto que te correspondería en cada escenario con la calculadora de indemnización por despido.',
    ],
    relatedCalculatorSlugs: ['indemnizacion', 'nomina'],
    updatedAt: '2026-01-08',
  },
]

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug) ?? null
}

export function getAllArticleSlugs() {
  return articles.map((a) => a.slug)
}
