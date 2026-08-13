import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import puppeteer from 'puppeteer-core'

const baseUrl = process.env.H2O_VISUAL_URL || 'http://127.0.0.1:5173'
const outputDirectory = resolve(process.cwd(), '.project-gallery-proof')
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

const projects = ['ivisit', 'myfinance', 'weddings', 'jelocare', 'wetindey', 'aumosaic']
const profiles = {
  desktop: { width: 1440, height: 1000, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  mobile: { width: 430, height: 932, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
}
const sleep = (milliseconds) => new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds))

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

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  executablePath,
  profiles: {},
}

try {
  for (const [profileName, viewport] of Object.entries(profiles)) {
    const page = await browser.newPage()
    const pageErrors = []
    const failedRequests = []

    page.on('pageerror', (error) => pageErrors.push(error.message))
    page.on('requestfailed', (request) => {
      if (request.url().startsWith(baseUrl)) {
        failedRequests.push(`${request.failure()?.errorText || 'unknown failure'}: ${request.url()}`)
      }
    })

    await page.setViewport(viewport)
    await page.emulateMediaFeatures([
      { name: 'prefers-color-scheme', value: 'dark' },
      { name: 'prefers-reduced-motion', value: 'no-preference' },
    ])
    await page.goto(baseUrl, { waitUntil: 'networkidle0', timeout: 60_000 })
    await page.waitForSelector('.h2o-immersive', { timeout: 20_000 })
    await page.waitForSelector('#aumosaic', { timeout: 20_000 })
    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready
      const images = Array.from(document.querySelectorAll('.h2o-project-media img'))
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
    await sleep(900)

    const projectResults = {}
    for (const project of projects) {
      const target = await page.evaluate((projectId) => {
        const element = document.getElementById(projectId)
        if (!element) return { missing: true }
        const rect = element.getBoundingClientRect()
        const documentTop = rect.top + window.scrollY
        const maximumTravel = Math.max(0, rect.height - window.innerHeight)
        window.scrollTo(0, documentTop + maximumTravel * 0.08)
        return { missing: false }
      }, project)

      if (target.missing) throw new Error(`${profileName}: missing #${project}`)
      await sleep(1050)

      const metrics = await page.evaluate((projectId) => {
        const root = document.documentElement
        const chapter = document.getElementById(projectId)
        if (!chapter) return { missing: true }
        const media = chapter.querySelector('.h2o-project-media')
        const copy = chapter.querySelector('.h2o-project-copy')
        const desktopImage = chapter.querySelector('.h2o-project-media__desktop')
        const mobileShell = chapter.querySelector('.h2o-project-media__mobile-shell')
        const clutter = [
          '.h2o-project-description',
          '.h2o-project-proof',
          '.h2o-project-modes',
        ].map((selector) => {
          const element = chapter.querySelector(selector)
          return { selector, display: element ? getComputedStyle(element).display : 'missing' }
        })
        const mediaRect = media?.getBoundingClientRect()
        const copyRect = copy?.getBoundingClientRect()
        const mediaStyle = media ? getComputedStyle(media) : null
        const desktopStyle = desktopImage ? getComputedStyle(desktopImage) : null
        const mobileStyle = mobileShell ? getComputedStyle(mobileShell) : null
        const images = Array.from(chapter.querySelectorAll('.h2o-project-media img'))

        return {
          missing: false,
          title: chapter.querySelector('h3')?.textContent?.trim() || '',
          horizontalOverflow: root.scrollWidth > window.innerWidth + 2,
          mediaIntersects: Boolean(mediaRect && mediaRect.bottom > 0 && mediaRect.top < innerHeight),
          copyIntersects: Boolean(copyRect && copyRect.bottom > 0 && copyRect.top < innerHeight),
          mediaBorderRadius: mediaStyle?.borderRadius || '',
          mediaWidth: Math.round(mediaRect?.width || 0),
          mediaHeight: Math.round(mediaRect?.height || 0),
          desktopDisplay: desktopStyle?.display || '',
          mobileDisplay: mobileStyle?.display || '',
          clutter,
          brokenImages: images
            .filter((image) => !(image instanceof HTMLImageElement) || image.naturalWidth === 0)
            .map((image) => image.getAttribute('alt') || image.getAttribute('src') || 'unknown'),
        }
      }, project)

      const fileName = `${profileName}-${project}.png`
      await page.screenshot({
        path: resolve(outputDirectory, fileName),
        type: 'png',
        captureBeyondViewport: false,
      })
      projectResults[project] = { ...metrics, capture: fileName }
    }

    report.profiles[profileName] = { projects: projectResults, pageErrors, failedRequests }
    await page.close()
  }
} finally {
  await browser.close()
}

await writeFile(resolve(outputDirectory, 'report.json'), JSON.stringify(report, null, 2))

const failures = []
for (const [profileName, profile] of Object.entries(report.profiles)) {
  for (const [project, result] of Object.entries(profile.projects)) {
    if (result.missing) failures.push(`${profileName}/${project}: missing chapter`)
    if (result.horizontalOverflow) failures.push(`${profileName}/${project}: horizontal overflow`)
    if (!result.mediaIntersects) failures.push(`${profileName}/${project}: media outside viewport`)
    if (!result.copyIntersects) failures.push(`${profileName}/${project}: copy outside viewport`)
    if (result.mediaBorderRadius !== '0px') failures.push(`${profileName}/${project}: media radius ${result.mediaBorderRadius}`)
    if (result.brokenImages.length > 0) failures.push(`${profileName}/${project}: broken media ${result.brokenImages.join(', ')}`)
    for (const item of result.clutter) {
      if (item.display !== 'none') failures.push(`${profileName}/${project}: ${item.selector} displays as ${item.display}`)
    }
    if (profileName === 'desktop' && result.mobileDisplay !== 'none') {
      failures.push(`${profileName}/${project}: phone mockup still visible`)
    }
    if (profileName === 'mobile' && result.desktopDisplay !== 'none') {
      failures.push(`${profileName}/${project}: desktop capture still visible`)
    }
    if (profileName === 'mobile' && result.mobileDisplay === 'none') {
      failures.push(`${profileName}/${project}: mobile capture hidden`)
    }
  }
  if (profile.pageErrors.length > 0) failures.push(`${profileName}: page errors ${profile.pageErrors.join(' | ')}`)
  if (profile.failedRequests.length > 0) failures.push(`${profileName}: failed requests ${profile.failedRequests.join(' | ')}`)
}

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Project gallery proof passed. Frames retained in ${outputDirectory}`)
}
