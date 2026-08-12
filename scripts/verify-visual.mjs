import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import puppeteer from 'puppeteer-core'

const baseUrl = process.env.H2O_VISUAL_URL || 'http://127.0.0.1:5173'
const outputDirectory = resolve(process.cwd(), '.visual-proof')
const executableCandidates = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean)

const executablePath = executableCandidates.find((candidate) => existsSync(candidate))
if (!executablePath) {
  throw new Error(`No Chromium executable found. Checked: ${executableCandidates.join(', ')}`)
}

await mkdir(outputDirectory, { recursive: true })

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--hide-scrollbars',
    '--mute-audio',
    '--no-first-run',
  ],
})

const frame = (name, id = null, progress = 0) => ({ name, id, progress })

const profiles = {
  desktop: {
    viewport: { width: 1440, height: 1000, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
    sections: [
      frame('top'),
      frame('practice-observe', 'practice', 0.12),
      frame('practice-build', 'practice', 0.5),
      frame('practice-operate', 'practice', 0.84),
      frame('ivisit', 'ivisit', 0.08),
      frame('weddings', 'weddings', 0.08),
      frame('archive', 'archive', 0.57),
      frame('contact', 'contact', 0.16),
      frame('signature', 'contact', 0.9),
    ],
  },
  mobile: {
    viewport: { width: 430, height: 932, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    sections: [
      frame('top'),
      frame('practice-build', 'practice', 0.5),
      frame('ivisit', 'ivisit', 0.08),
      frame('weddings', 'weddings', 0.08),
      frame('archive', 'archive', 0.57),
      frame('signature', 'contact', 0.9),
    ],
  },
}

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  executablePath,
  profiles: {},
}

const sleep = (milliseconds) => new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds))

async function captureProfile(name, profile) {
  const page = await browser.newPage()
  const consoleErrors = []
  const pageErrors = []
  const failedRequests = []

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', (error) => pageErrors.push(error.message))
  page.on('requestfailed', (request) => {
    const failure = request.failure()?.errorText || 'unknown failure'
    const url = request.url()
    if (url.startsWith(baseUrl)) failedRequests.push(`${failure}: ${url}`)
  })

  try {
    await page.setViewport(profile.viewport)
    await page.emulateMediaFeatures([
      { name: 'prefers-color-scheme', value: 'dark' },
      { name: 'prefers-reduced-motion', value: 'no-preference' },
    ])
    await page.goto(baseUrl, { waitUntil: 'networkidle0', timeout: 60_000 })
    await page.waitForSelector('.h2o-immersive', { timeout: 20_000 })
    await page.waitForSelector('#ivisit', { timeout: 20_000 })
    await page.waitForSelector('#signature', { timeout: 20_000 })
    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready

      const images = Array.from(
        document.querySelectorAll('.h2o-project-media img, .h2o-archive-card img'),
      )
      images.forEach((image) => {
        if (!(image instanceof HTMLImageElement)) return
        image.loading = 'eager'
        image.fetchPriority = 'high'
      })

      await Promise.all(
        images.map(
          (image) =>
            new Promise((resolveImage) => {
              if (image instanceof HTMLImageElement && image.complete) {
                resolveImage(undefined)
                return
              }
              const settle = () => resolveImage(undefined)
              image.addEventListener('load', settle, { once: true })
              image.addEventListener('error', settle, { once: true })
              window.setTimeout(settle, 12_000)
            }),
        ),
      )
    })
    await sleep(1200)

    const layout = await page.evaluate(() => {
      const root = document.documentElement
      const mediaImages = Array.from(
        document.querySelectorAll('.h2o-project-media img, .h2o-archive-card img'),
      )
      const brokenImages = mediaImages
        .filter((image) => !(image instanceof HTMLImageElement) || image.naturalWidth === 0)
        .map((image) => image.getAttribute('alt') || image.getAttribute('src') || 'unknown image')

      const borderSelectors = [
        '.h2o-nav',
        '.h2o-nav__status',
        '.h2o-project-proof',
        '.h2o-project-actions__secondary',
        '.h2o-project-media',
        '.h2o-project-media__mobile-shell',
        '.h2o-contact__actions a:last-child',
      ]
      const borderLeaks = borderSelectors.flatMap((selector) =>
        Array.from(document.querySelectorAll(selector)).flatMap((element, index) => {
          const style = window.getComputedStyle(element)
          const borderWidths = [
            style.borderTopWidth,
            style.borderRightWidth,
            style.borderBottomWidth,
            style.borderLeftWidth,
          ].map((value) => Number.parseFloat(value) || 0)
          const hasBorder = borderWidths.some((value) => value > 0)
          const hasInsetRing = style.boxShadow.includes('inset')
          return hasBorder || hasInsetRing
            ? [`${selector}[${index}] border=${borderWidths.join('/')} shadow=${style.boxShadow}`]
            : []
        }),
      )

      const descriptionWordCounts = Array.from(
        document.querySelectorAll('.h2o-project-description'),
      ).map((element) => ({
        project: element.closest('.h2o-project-chapter')?.id || 'unknown',
        words: (element.textContent || '').trim().split(/\s+/).filter(Boolean).length,
      }))

      return {
        title: document.title,
        headingCount: document.querySelectorAll('h1').length,
        projectCount: document.querySelectorAll('.h2o-project-chapter').length,
        practiceCount: document.querySelectorAll('.h2o-practice__stage').length,
        archiveCount: document.querySelectorAll('.h2o-archive-card').length,
        signatureCount: document.querySelectorAll('#signature').length,
        canvasCount: document.querySelectorAll('canvas').length,
        horizontalOverflow: root.scrollWidth > window.innerWidth + 2,
        documentWidth: root.scrollWidth,
        viewportWidth: window.innerWidth,
        brokenImages,
        borderLeaks,
        descriptionWordCounts,
      }
    })

    const captures = []
    for (const section of profile.sections) {
      await page.evaluate(({ id, progress }) => {
        if (!id) {
          window.scrollTo(0, 0)
          return
        }

        const element = document.getElementById(id)
        if (!element) return
        const maximumTravel = Math.max(0, element.offsetHeight - window.innerHeight)
        window.scrollTo(0, element.offsetTop + maximumTravel * progress)
      }, section)
      await sleep(section.name === 'top' ? 800 : 1150)
      const fileName = `${name}-${section.name}.png`
      await page.screenshot({
        path: resolve(outputDirectory, fileName),
        type: 'png',
        captureBeyondViewport: false,
      })
      captures.push(fileName)
    }

    report.profiles[name] = {
      layout,
      captures,
      consoleErrors,
      pageErrors,
      failedRequests,
    }
  } finally {
    await page.close()
  }
}

try {
  for (const [name, profile] of Object.entries(profiles)) {
    await captureProfile(name, profile)
  }
} finally {
  await browser.close()
}

await writeFile(resolve(outputDirectory, 'report.json'), JSON.stringify(report, null, 2))

const failures = []
for (const [name, result] of Object.entries(report.profiles)) {
  if (result.layout.headingCount !== 1) failures.push(`${name}: expected one h1, received ${result.layout.headingCount}`)
  if (result.layout.projectCount !== 6) failures.push(`${name}: expected six project chapters, received ${result.layout.projectCount}`)
  if (result.layout.practiceCount !== 3) failures.push(`${name}: expected three spatial practice stages, received ${result.layout.practiceCount}`)
  if (result.layout.archiveCount !== 4) failures.push(`${name}: expected four archive projects, received ${result.layout.archiveCount}`)
  if (result.layout.signatureCount !== 1) failures.push(`${name}: expected one Dyrane signature, received ${result.layout.signatureCount}`)
  if (result.layout.canvasCount < 1) failures.push(`${name}: expected the deferred WebGL current to load`)
  if (result.layout.horizontalOverflow) {
    failures.push(`${name}: horizontal overflow (${result.layout.documentWidth}px document / ${result.layout.viewportWidth}px viewport)`)
  }
  if (result.layout.brokenImages.length > 0) failures.push(`${name}: broken project images: ${result.layout.brokenImages.join(', ')}`)
  if (result.layout.borderLeaks.length > 0) failures.push(`${name}: visual border leaks: ${result.layout.borderLeaks.join(' | ')}`)
  const denseDescriptions = result.layout.descriptionWordCounts.filter(({ words }) => words > 24)
  if (denseDescriptions.length > 0) {
    failures.push(`${name}: project copy exceeds 24 words: ${denseDescriptions.map(({ project, words }) => `${project}=${words}`).join(', ')}`)
  }
  if (result.pageErrors.length > 0) failures.push(`${name}: page errors: ${result.pageErrors.join(' | ')}`)
  if (result.failedRequests.length > 0) failures.push(`${name}: failed same-origin requests: ${result.failedRequests.join(' | ')}`)
}

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Visual proof passed. Frames retained in ${outputDirectory}`)
}
