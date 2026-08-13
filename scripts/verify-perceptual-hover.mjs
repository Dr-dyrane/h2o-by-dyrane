import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import puppeteer from 'puppeteer-core'

const baseUrl = process.env.H2O_PERCEPTUAL_URL || 'http://127.0.0.1:5173'
const outputDirectory = resolve(process.cwd(), '.perceptual-proof')
const candidates = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean)
const executablePath = candidates.find((candidate) => existsSync(candidate))
if (!executablePath) throw new Error(`No Chromium executable found. Checked: ${candidates.join(', ')}`)

const sleep = (milliseconds) => new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds))
const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--hide-scrollbars',
    '--mute-audio',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
  ],
})

await mkdir(outputDirectory, { recursive: true })
const failures = []
const report = { generatedAt: new Date().toISOString(), baseUrl, desktop: {}, reducedMotion: {} }

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
  await page.waitForSelector('.h2o-spatial-aura', { timeout: 20_000 })
  await page.waitForSelector('canvas', { timeout: 20_000 })
  await page.evaluate(async () => document.fonts?.ready)

  await page.mouse.move(180, 220, { steps: 24 })
  await sleep(720)
  const heroLeft = await page.evaluate(() => ({
    title: getComputedStyle(document.querySelector('.h2o-hero h1')).transform,
    aura: getComputedStyle(document.querySelector('.h2o-spatial-aura')).transform,
    auraOpacity: Number.parseFloat(getComputedStyle(document.querySelector('.h2o-spatial-aura')).opacity),
    trailX: getComputedStyle(document.documentElement).getPropertyValue('--h2o-pointer-trail-x').trim(),
  }))
  await page.screenshot({ path: resolve(outputDirectory, 'hero-left.png'), captureBeyondViewport: false })

  await page.mouse.move(1240, 760, { steps: 36 })
  await sleep(720)
  const heroRight = await page.evaluate(() => ({
    title: getComputedStyle(document.querySelector('.h2o-hero h1')).transform,
    aura: getComputedStyle(document.querySelector('.h2o-spatial-aura')).transform,
    auraOpacity: Number.parseFloat(getComputedStyle(document.querySelector('.h2o-spatial-aura')).opacity),
    trailX: getComputedStyle(document.documentElement).getPropertyValue('--h2o-pointer-trail-x').trim(),
  }))
  await page.screenshot({ path: resolve(outputDirectory, 'hero-right.png'), captureBeyondViewport: false })

  await page.evaluate(() => {
    const section = document.getElementById('contact')
    if (!section) throw new Error('Missing #contact')
    const rect = section.getBoundingClientRect()
    const top = rect.top + window.scrollY
    const travel = Math.max(0, rect.height - window.innerHeight)
    window.scrollTo(0, top + travel * 0.86)
  })
  await sleep(1_000)
  await page.mouse.move(210, 360, { steps: 24 })
  await sleep(700)
  const endLeft = await page.$eval('.h2o-end__name strong', (element) => getComputedStyle(element).transform)
  await page.mouse.move(1220, 620, { steps: 36 })
  await sleep(700)
  const endRight = await page.$eval('.h2o-end__name strong', (element) => getComputedStyle(element).transform)
  await page.screenshot({ path: resolve(outputDirectory, 'dyrane-hover.png'), captureBeyondViewport: false })

  report.desktop = { heroLeft, heroRight, endLeft, endRight, pageErrors }
  if (heroLeft.title === heroRight.title) failures.push('desktop: hero typography did not respond spatially')
  if (heroLeft.aura === heroRight.aura) failures.push('desktop: global pointer aura did not travel')
  if (Math.max(heroLeft.auraOpacity, heroRight.auraOpacity) < 0.45) failures.push('desktop: pointer aura did not become visible')
  if (heroLeft.trailX === heroRight.trailX) failures.push('desktop: trailing pointer phase did not change')
  if (endLeft === endRight) failures.push('desktop: DYRANE ending did not react to the pointer')
  if (pageErrors.length) failures.push(`desktop: page errors ${pageErrors.join(' | ')}`)
  await page.close()

  const reducedPage = await browser.newPage()
  await reducedPage.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1, isMobile: false, hasTouch: false })
  await reducedPage.emulateMediaFeatures([
    { name: 'prefers-color-scheme', value: 'dark' },
    { name: 'prefers-reduced-motion', value: 'reduce' },
  ])
  await reducedPage.goto(baseUrl, { waitUntil: 'networkidle0', timeout: 60_000 })
  const reduced = await reducedPage.evaluate(() => ({
    mediaQueryMatches: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    auraDisplay: getComputedStyle(document.querySelector('.h2o-spatial-aura')).display,
    heroTransform: getComputedStyle(document.querySelector('.h2o-hero h1')).transform,
    canvasCount: document.querySelectorAll('canvas').length,
  }))
  report.reducedMotion = reduced
  if (!reduced.mediaQueryMatches) failures.push('reduced motion: browser preference was not applied')
  if (reduced.auraDisplay !== 'none') failures.push('reduced motion: global pointer aura should be hidden')
  if (reduced.heroTransform !== 'none') failures.push('reduced motion: hero pointer transform should be removed')
  if (reduced.canvasCount !== 0) failures.push('reduced motion: WebGL should remain disabled')
  await reducedPage.close()
} finally {
  await browser.close()
}

await writeFile(resolve(outputDirectory, 'report.json'), JSON.stringify(report, null, 2))
if (failures.length) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Perceptual hover proof passed. Evidence retained in ${outputDirectory}`)
}
