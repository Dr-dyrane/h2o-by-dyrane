import { createHash } from 'node:crypto'
import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import puppeteer from 'puppeteer-core'

const root = process.cwd()
const baseUrl = process.env.H2O_OG_URL || 'http://127.0.0.1:5173'
const outputPath = resolve(root, 'public/og-image-live.png')
const temporaryPath = resolve(root, 'public/og-image-live.next.png')
const indexPath = resolve(root, 'index.html')
const width = 1200
const height = 630

const candidates = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  process.env.CHROME_BIN,
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean)
const executablePath = candidates.find((candidate) => existsSync(candidate))

if (!executablePath) {
  throw new Error(`No Chromium executable found. Checked: ${candidates.join(', ')}`)
}

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

try {
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: false, hasTouch: false })
  await page.emulateMediaFeatures([
    { name: 'prefers-color-scheme', value: 'dark' },
    { name: 'prefers-reduced-motion', value: 'no-preference' },
  ])
  await page.goto(`${baseUrl}/?og-live=${Date.now()}`, { waitUntil: 'networkidle0', timeout: 60_000 })
  await page.waitForSelector('.h2o-hero__spatial', { timeout: 20_000 })
  await page.evaluate(async () => {
    await document.fonts?.ready
    window.scrollTo(0, 0)
  })

  // Preserve the real hero and current; only lock its viewport into the social-card crop.
  await page.addStyleTag({ content: `
    html, body, #root { width: 1200px !important; height: 630px !important; overflow: hidden !important; }
    .h2o-immersive { min-height: 630px !important; }
    .h2o-hero { height: 630px !important; }
    .h2o-hero__sticky { min-height: 630px !important; padding: 72px 58px 28px !important; align-items: center !important; }
    .h2o-hero__copy { width: min(920px, 82vw) !important; }
    .h2o-hero h1 { margin-top: 18px !important; font-size: 112px !important; line-height: 0.74 !important; }
    .h2o-hero__footer { margin-top: 28px !important; margin-left: 150px !important; }
    .h2o-hero__footer p { font-size: 17px !important; }
    .h2o-hero__count { right: 40px !important; bottom: 28px !important; }
    .h2o-nav { top: 12px !important; right: 48px !important; left: 48px !important; }
    .h2o-practice, .h2o-work, .h2o-archive, .h2o-end { display: none !important; }
    .h2o-current-canvas { opacity: 0.92 !important; }
  ` })

  let canvasReady = false
  try {
    await page.waitForSelector('canvas', { timeout: 8_000 })
    canvasReady = true
  } catch {
    // The semantic live hero and its authored fallback remain a truthful social image.
  }

  await page.mouse.move(120, 520)
  await page.mouse.move(930, 150, { steps: 36 })
  await new Promise((resolvePromise) => setTimeout(resolvePromise, canvasReady ? 1_300 : 550))
  await page.screenshot({ path: temporaryPath, type: 'png', captureBeyondViewport: false })
} finally {
  await browser.close()
}

const png = readFileSync(temporaryPath)
const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
if (!png.subarray(0, 8).equals(signature)) throw new Error('Generated OG asset is not a PNG')
if (png.readUInt32BE(16) !== width || png.readUInt32BE(20) !== height) {
  throw new Error(`Generated OG asset is not ${width}x${height}`)
}
if (png.byteLength < 90_000) throw new Error(`Generated OG asset is unexpectedly small: ${png.byteLength}`)

renameSync(temporaryPath, outputPath)
const digest = createHash('sha256').update(png).digest('hex').slice(0, 12)
const imageUrl = `https://dyrane.tech/og-image-live.png?v=${digest}`
const index = readFileSync(indexPath, 'utf8')
const nextIndex = index.replace(
  /https:\/\/dyrane\.tech\/og-image(?:-live)?\.png(?:\?v=[^"']*)?/g,
  imageUrl,
)
if (nextIndex === index && !index.includes(imageUrl)) {
  throw new Error('No H₂O OG/Twitter image URL was updated in index.html')
}
writeFileSync(indexPath, nextIndex)
console.log(`Captured the live H₂O hero as public/og-image-live.png (${digest})`)
