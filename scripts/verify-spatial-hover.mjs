import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import puppeteer from 'puppeteer-core'

const baseUrl = process.env.H2O_SPATIAL_URL || 'http://127.0.0.1:5173'
const outputDirectory = resolve(process.cwd(), '.spatial-proof')
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

const sleep = (milliseconds) => new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds))
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
    '--enable-webgl',
    '--ignore-gpu-blocklist',
  ],
})

await mkdir(outputDirectory, { recursive: true })
const report = { generatedAt: new Date().toISOString(), baseUrl, desktop: {}, reducedMotion: {} }
const failures = []

try {
  const page = await browser.newPage()
  const pageErrors = []
  page.on('pageerror', (error) => pageErrors.push(error.message))
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1, isMobile: false, hasTouch: false })
  await page.emulateMediaFeatures([
    { name: 'prefers-color-scheme', value: 'dark' },
    { name: 'prefers-reduced-motion', value: 'no-preference' },
  ])
  await page.goto(baseUrl, { waitUntil: 'networkidle0', timeout: 60_000 })
  await page.waitForSelector('.h2o-immersive[data-spatial-input="enabled"]', { timeout: 20_000 })
  await page.waitForSelector('canvas', { timeout: 20_000 })
  await page.evaluate(async () => document.fonts?.ready)

  await page.evaluate(() => {
    const project = document.getElementById('ivisit')
    if (!project) throw new Error('Missing #ivisit')
    const rect = project.getBoundingClientRect()
    const top = rect.top + window.scrollY
    const travel = Math.max(0, rect.height - window.innerHeight)
    window.scrollTo(0, top + travel * 0.46)
  })
  await sleep(1000)

  const mediaBox = await page.$eval('#ivisit .h2o-project-media', (element) => {
    const rect = element.getBoundingClientRect()
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
  })

  await page.mouse.move(mediaBox.x + mediaBox.width * 0.18, mediaBox.y + mediaBox.height * 0.2)
  await sleep(620)
  const left = await page.$eval('#ivisit', (project) => ({
    mediaTransform: getComputedStyle(project.querySelector('.h2o-project-media__spatial')).transform,
    copyTransform: getComputedStyle(project.querySelector('.h2o-project-copy__spatial')).transform,
    lightOpacity: Number.parseFloat(getComputedStyle(project.querySelector('.h2o-project-pointer-light')).opacity),
  }))
  await page.screenshot({ path: resolve(outputDirectory, 'desktop-project-left.png'), captureBeyondViewport: false })

  await page.mouse.move(mediaBox.x + mediaBox.width * 0.82, mediaBox.y + mediaBox.height * 0.78)
  await sleep(620)
  const right = await page.$eval('#ivisit', (project) => ({
    mediaTransform: getComputedStyle(project.querySelector('.h2o-project-media__spatial')).transform,
    copyTransform: getComputedStyle(project.querySelector('.h2o-project-copy__spatial')).transform,
    lightOpacity: Number.parseFloat(getComputedStyle(project.querySelector('.h2o-project-pointer-light')).opacity),
  }))
  await page.screenshot({ path: resolve(outputDirectory, 'desktop-project-right.png'), captureBeyondViewport: false })

  await page.evaluate(() => {
    const archive = document.getElementById('archive')
    if (!archive) throw new Error('Missing #archive')
    const rect = archive.getBoundingClientRect()
    const top = rect.top + window.scrollY
    const travel = Math.max(0, rect.height - window.innerHeight)
    window.scrollTo(0, top + travel * 0.56)
  })
  await sleep(1000)
  const archiveBox = await page.$eval('.h2o-archive-card', (element) => {
    const rect = element.getBoundingClientRect()
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
  })
  await page.mouse.move(archiveBox.x + archiveBox.width * 0.74, archiveBox.y + archiveBox.height * 0.26)
  await sleep(620)
  const archive = await page.$eval('.h2o-archive-card', (card) => ({
    transform: getComputedStyle(card.querySelector('.h2o-archive-card__spatial')).transform,
    lightOpacity: Number.parseFloat(getComputedStyle(card.querySelector('.h2o-archive-pointer-light')).opacity),
  }))
  await page.screenshot({ path: resolve(outputDirectory, 'desktop-archive-hover.png'), captureBeyondViewport: false })

  report.desktop = { left, right, archive, pageErrors }
  if (left.mediaTransform === right.mediaTransform) failures.push('desktop: project plane did not react to cursor position')
  if (left.copyTransform === right.copyTransform) failures.push('desktop: project copy did not counter-parallax')
  if (Math.max(left.lightOpacity, right.lightOpacity) < 0.25) failures.push('desktop: project pointer light did not become visible')
  if (archive.transform === 'none') failures.push('desktop: archive card did not acquire spatial depth')
  if (archive.lightOpacity < 0.2) failures.push('desktop: archive pointer light did not become visible')
  if (pageErrors.length > 0) failures.push(`desktop: page errors ${pageErrors.join(' | ')}`)
  await page.close()

  const reducedPage = await browser.newPage()
  await reducedPage.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1, isMobile: false, hasTouch: false })
  await reducedPage.emulateMediaFeatures([
    { name: 'prefers-color-scheme', value: 'dark' },
    { name: 'prefers-reduced-motion', value: 'reduce' },
  ])
  await reducedPage.goto(baseUrl, { waitUntil: 'networkidle0', timeout: 60_000 })
  await reducedPage.waitForSelector('.h2o-immersive[data-spatial-input="reduced"]', { timeout: 20_000 })
  const reduced = await reducedPage.evaluate(() => ({
    mediaQueryMatches: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    canvasCount: document.querySelectorAll('canvas').length,
    lightDisplay: getComputedStyle(document.querySelector('.h2o-hero__pointer-light')).display,
    heroTransform: getComputedStyle(document.querySelector('.h2o-hero__spatial')).transform,
  }))
  report.reducedMotion = reduced
  if (!reduced.mediaQueryMatches) failures.push('reduced motion: browser media preference was not applied')
  if (reduced.canvasCount !== 0) failures.push('reduced motion: WebGL canvas should remain disabled')
  if (reduced.lightDisplay !== 'none') failures.push('reduced motion: pointer lights should be hidden')
  await reducedPage.close()
} finally {
  await browser.close()
}

await writeFile(resolve(outputDirectory, 'report.json'), JSON.stringify(report, null, 2))

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Spatial hover proof passed. Evidence retained in ${outputDirectory}`)
}
