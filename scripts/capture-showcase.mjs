import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import puppeteer from 'puppeteer-core'

const projects = [
  {
    slug: 'ivisit',
    url: 'https://app.ivisit.ng',
    waitMs: 6500,
    geolocation: { latitude: 6.5244, longitude: 3.3792 },
  },
  {
    slug: 'myfinance',
    url: 'https://myfinance.dyrane.tech/discover',
    waitMs: 6500,
    waitFor: '[data-discovery-live-stage="bounded"]',
  },
  {
    slug: 'weddings',
    url: 'https://weddings.dyrane.tech/the_ogranyas',
    waitMs: 5500,
    enter: ['play', 'open invitation', 'open', 'enter', 'begin'],
    afterEnterMs: 5000,
  },
  { slug: 'jelocare', url: 'https://jelocare.com', waitMs: 5500 },
  {
    slug: 'wetindey',
    url: 'https://wetindey.live',
    waitMs: 6000,
    geolocation: { latitude: 6.5244, longitude: 3.3792 },
  },
  { slug: 'aumosaic', url: 'https://aumosaic.com', waitMs: 5000 },
  { slug: 'justurbanwears', url: 'https://justurbanwears.com', waitMs: 5500 },
]

const viewports = {
  desktop: { width: 1600, height: 1000, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  mobile: { width: 430, height: 932, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
}

const browserCandidates = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean)

const executablePath = browserCandidates.find((candidate) => existsSync(candidate))
if (!executablePath) {
  throw new Error(`No Chromium executable found. Checked: ${browserCandidates.join(', ')}`)
}

const outputDirectory = resolve(process.cwd(), 'public/showcase/live')
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

const sleep = (milliseconds) => new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds))

async function clickFirstMatching(page, labels) {
  if (!labels?.length) return false
  return page.evaluate((candidates) => {
    const normalized = candidates.map((candidate) => candidate.toLowerCase())
    const elements = Array.from(document.querySelectorAll('button, a, [role="button"]'))
    const target = elements.find((element) => {
      const text = (element.textContent || '').trim().toLowerCase()
      const label = (element.getAttribute('aria-label') || '').trim().toLowerCase()
      return normalized.some((candidate) => text === candidate || label === candidate)
    })
    if (!(target instanceof HTMLElement)) return false
    target.click()
    return true
  }, labels)
}

async function dismissCookieNotice(page) {
  await page.evaluate(() => {
    const labels = ['accept all', 'accept cookies', 'allow all cookies', 'got it']
    const elements = Array.from(document.querySelectorAll('button, a, [role="button"]'))
    const target = elements.find((element) =>
      labels.includes((element.textContent || '').trim().toLowerCase()),
    )
    if (target instanceof HTMLElement) target.click()
  })
}

async function capture(project, viewportName) {
  const page = await browser.newPage()
  const viewport = viewports[viewportName]

  try {
    await page.setViewport(viewport)
    await page.setUserAgent(
      viewportName === 'mobile'
        ? 'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36'
        : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    )
    await page.emulateMediaFeatures([
      { name: 'prefers-color-scheme', value: 'dark' },
      { name: 'prefers-reduced-motion', value: 'no-preference' },
    ])
    await page.evaluateOnNewDocument(() => {
      try {
        localStorage.setItem('theme', 'dark')
        localStorage.setItem('color-scheme', 'dark')
      } catch {
        // Storage is not guaranteed before an origin exists.
      }
    })

    if (project.geolocation) {
      await browser.defaultBrowserContext().overridePermissions(new URL(project.url).origin, ['geolocation'])
      await page.setGeolocation(project.geolocation)
    }

    await page.goto(project.url, { waitUntil: 'domcontentloaded', timeout: 60_000 })
    await page.waitForNetworkIdle({ idleTime: 900, timeout: 15_000 }).catch(() => undefined)
    if (project.waitFor) {
      await page.waitForSelector(project.waitFor, { visible: true, timeout: 20_000 })
    }
    await dismissCookieNotice(page).catch(() => undefined)
    await sleep(project.waitMs ?? 4500)

    if (project.enter) {
      const entered = await clickFirstMatching(page, project.enter).catch(() => false)
      if (entered) await sleep(project.afterEnterMs ?? 4000)
    }

    await page.addStyleTag({
      content: `
        [data-vercel-toolbar], [data-testid="vercel-toolbar"], #vercel-live-feedback,
        vercel-live-feedback, .vercel-toolbar, [class*="cookie-banner" i],
        [id*="cookie-banner" i] { display: none !important; }
        html { scroll-behavior: auto !important; }
      `,
    })
    await page.evaluate(async () => {
      window.scrollTo(0, 0)
      if (document.fonts?.ready) await document.fonts.ready
    })
    await sleep(900)

    const output = resolve(outputDirectory, `${project.slug}-${viewportName}.jpg`)
    await page.screenshot({
      path: output,
      type: 'jpeg',
      quality: 86,
      fullPage: false,
      captureBeyondViewport: false,
    })
    console.log(`captured ${project.slug} ${viewportName} -> ${output}`)
  } finally {
    await page.close()
  }
}

try {
  for (const project of projects) {
    for (const viewportName of Object.keys(viewports)) {
      try {
        await capture(project, viewportName)
      } catch (error) {
        console.error(`capture failed for ${project.slug} ${viewportName}`, error)
        process.exitCode = 1
      }
    }
  }
} finally {
  await browser.close()
}
