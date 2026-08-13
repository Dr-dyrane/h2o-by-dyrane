export type PracticeMode = 'Observe' | 'Build' | 'Operate'

export interface ImmersiveProjectImage {
  src: string
  fallbacks: string[]
  alt: string
}

export interface ImmersiveProject {
  id: string
  sequence: string
  period: string
  title: string
  category: string
  statement: string
  description: string
  proof: string
  modes: PracticeMode[]
  accent: string
  accentSoft: string
  url: string
  secondaryUrl?: string
  secondaryLabel?: string
  desktop: ImmersiveProjectImage
  mobile: ImmersiveProjectImage
}

export interface ArchiveProject {
  title: string
  category: string
  period: string
  image: string
}

const capture = (slug: string, viewport: 'desktop' | 'mobile') =>
  `/showcase/live/${slug}-${viewport}.jpg`

const remoteCapture = (url: string, viewport: 'desktop' | 'mobile') => {
  const width = viewport === 'desktop' ? 1600 : 430
  const crop = viewport === 'desktop' ? 1000 : 932
  return `https://image.thum.io/get/width/${width}/crop/${crop}/noanimate/${url}`
}

export const immersiveProjects: ImmersiveProject[] = [
  {
    id: 'ivisit',
    sequence: '01',
    period: '2024 — now',
    title: 'iVisit',
    category: 'Emergency healthcare coordination',
    statement: 'An emergency should not begin with a waiting room.',
    description:
      'A live patient, provider, and dispatch system for requesting an ambulance, finding capacity, and following response in real time.',
    proof: 'Live on Google Play · Patient experience at app.ivisit.ng',
    modes: ['Observe', 'Build', 'Operate'],
    accent: '#ff4b3e',
    accentSoft: 'rgba(255, 75, 62, 0.24)',
    url: 'https://app.ivisit.ng',
    secondaryUrl: 'https://play.google.com/store/apps/details?id=com.dyrane.ivisit',
    secondaryLabel: 'Google Play',
    desktop: {
      src: capture('ivisit', 'desktop'),
      fallbacks: [
        remoteCapture('https://app.ivisit.ng', 'desktop'),
        '/showcase/ivisit-console-dark.png',
      ],
      alt: 'iVisit live patient and emergency coordination experience on desktop',
    },
    mobile: {
      src: capture('ivisit', 'mobile'),
      fallbacks: [
        remoteCapture('https://app.ivisit.ng', 'mobile'),
        '/showcase/ivisit-mobile-dark.png',
      ],
      alt: 'iVisit live patient experience on mobile',
    },
  },
  {
    id: 'myfinance',
    sequence: '02',
    period: '2025 — now',
    title: 'MyFinance',
    category: 'Personal finance OS and product-story architecture',
    statement: 'A landing page should not describe the product. It should become it.',
    description:
      'A calm personal finance operating system whose public discovery route renders the real product shell, one reconciled financial life, and four responsive views instead of a conventional section-based landing page.',
    proof: 'Production shell · one synthetic fixture · Home, Plan, Accounts and Activity',
    modes: ['Observe', 'Build', 'Operate'],
    accent: '#ff3d96',
    accentSoft: 'rgba(255, 61, 150, 0.24)',
    url: 'https://myfinance.dyrane.tech/discover',
    desktop: {
      src: capture('myfinance', 'desktop'),
      fallbacks: [remoteCapture('https://myfinance.dyrane.tech/discover', 'desktop')],
      alt: 'MyFinance live product-story operating system on desktop',
    },
    mobile: {
      src: capture('myfinance', 'mobile'),
      fallbacks: [remoteCapture('https://myfinance.dyrane.tech/discover', 'mobile')],
      alt: 'MyFinance responsive live product story on mobile',
    },
  },
  {
    id: 'weddings',
    sequence: '03',
    period: '2026 — now',
    title: 'Dyrane Weddings',
    category: 'Spatial publishing and celebration',
    statement: 'An invitation that opens into a world.',
    description:
      'A cinematic invitation carrying story, RSVP, sharing, and accessibility through one continuous guest journey.',
    proof: 'Spatial invitation · truthful RSVP boundary · public event surface',
    modes: ['Observe', 'Build', 'Operate'],
    accent: '#f5ce45',
    accentSoft: 'rgba(245, 206, 69, 0.22)',
    url: 'https://weddings.dyrane.tech/the_ogranyas',
    desktop: {
      src: capture('weddings', 'desktop'),
      fallbacks: [
        remoteCapture('https://weddings.dyrane.tech/the_ogranyas', 'desktop'),
        'https://weddings.dyrane.tech/the_ogranyas/card/3',
      ],
      alt: 'Alexander and Chioma spatial wedding invitation on desktop',
    },
    mobile: {
      src: capture('weddings', 'mobile'),
      fallbacks: [
        remoteCapture('https://weddings.dyrane.tech/the_ogranyas', 'mobile'),
        'https://weddings.dyrane.tech/the_ogranyas/card/3',
      ],
      alt: 'Alexander and Chioma spatial wedding invitation on mobile',
    },
  },
  {
    id: 'jelocare',
    sequence: '04',
    period: '2026 — now',
    title: 'JeloCare',
    category: 'Evidence-led skincare and retail trust',
    statement: 'Trust is the product before the product.',
    description:
      'Nigerian-first skincare guidance that keeps evidence, seller identity, availability, and uncertainty legible through the retailer handoff.',
    proof: 'Concern discovery · evidence boundaries · retailer trust bridge',
    modes: ['Observe', 'Build', 'Operate'],
    accent: '#ff8f9b',
    accentSoft: 'rgba(255, 143, 155, 0.22)',
    url: 'https://jelocare.com',
    desktop: {
      src: capture('jelocare', 'desktop'),
      fallbacks: [remoteCapture('https://jelocare.com', 'desktop')],
      alt: 'JeloCare evidence-led skincare experience on desktop',
    },
    mobile: {
      src: capture('jelocare', 'mobile'),
      fallbacks: [remoteCapture('https://jelocare.com', 'mobile')],
      alt: 'JeloCare evidence-led skincare experience on mobile',
    },
  },
  {
    id: 'wetindey',
    sequence: '05',
    period: '2026 — now',
    title: 'WetinDey',
    category: 'Community-confirmed local availability',
    statement: 'The map knows what is nearby. People know what is actually there.',
    description:
      'A map-first utility for finding essentials through recent community confirmation of availability, freshness, and price.',
    proof: 'Map-first PWA · confirmation freshness · local contribution loop',
    modes: ['Observe', 'Build'],
    accent: '#54f0b3',
    accentSoft: 'rgba(84, 240, 179, 0.20)',
    url: 'https://wetindey.live',
    desktop: {
      src: capture('wetindey', 'desktop'),
      fallbacks: [remoteCapture('https://wetindey.live', 'desktop')],
      alt: 'WetinDey community availability map on desktop',
    },
    mobile: {
      src: capture('wetindey', 'mobile'),
      fallbacks: [remoteCapture('https://wetindey.live', 'mobile')],
      alt: 'WetinDey community availability map on mobile',
    },
  },
  {
    id: 'aumosaic',
    sequence: '06',
    period: '2026 — now',
    title: 'AU Mosaic',
    category: 'Material commerce and visual decision support',
    statement: 'Materials become believable when they enter the room.',
    description:
      'Editorial commerce and a surface visualizer that makes mosaic scale, geometry, and placement tangible before purchase.',
    proof: 'Surface visualizer · geometry-aware placement · editorial commerce',
    modes: ['Observe', 'Build', 'Operate'],
    accent: '#ff9e5f',
    accentSoft: 'rgba(255, 158, 95, 0.22)',
    url: 'https://aumosaic.com',
    desktop: {
      src: capture('aumosaic', 'desktop'),
      fallbacks: [remoteCapture('https://aumosaic.com', 'desktop'), '/showcase/aumosaic-hero-dark.png'],
      alt: 'AU Mosaic editorial commerce and surface visualizer on desktop',
    },
    mobile: {
      src: capture('aumosaic', 'mobile'),
      fallbacks: [remoteCapture('https://aumosaic.com', 'mobile'), '/showcase/aumosaic-backroom-dark.png'],
      alt: 'AU Mosaic material selection experience on mobile',
    },
  },
]

export const archiveProjects: ArchiveProject[] = [
  {
    title: 'Just Urban Wears',
    category: 'Fashion identity, studio, and commerce',
    period: '2026 — now',
    image: capture('justurbanwears', 'desktop'),
  },
  {
    title: 'HOP',
    category: 'Hydration and behaviour',
    period: '2025',
    image: '/showcase/hop-desktop-dark.png',
  },
  {
    title: 'AERO',
    category: 'Financial intelligence',
    period: '2025',
    image: '/showcase/aero-score-dark.png',
  },
  {
    title: 'Kradle',
    category: 'Product experience',
    period: '2025',
    image: '/showcase/kradle-desktop-dark.png',
  },
  {
    title: 'Ablegod Spark',
    category: 'Energy and infrastructure',
    period: '2024',
    image: '/showcase/ablegod-desktop-dark.png',
  },
]

export const liquidPalette = immersiveProjects.map((project) => project.accent)
