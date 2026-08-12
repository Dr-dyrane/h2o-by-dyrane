import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import puppeteer from 'puppeteer-core'

const baseUrl = process.env.H2O_PROBE_URL || 'http://127.0.0.1:5173'
const outputDirectory = resolve(process.cwd(), '.runtime-probe')
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
    '--hide-scrollbars',
    '--mute-audio',
    '--no-first-run',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
  ],
})

const page = await browser.newPage()
const consoleMessages = []
const pageErrors = []
const failedRequests = []
const responses = []

page.on('console', (message) => {
  consoleMessages.push({
    type: message.type(),
    text: message.text(),
    location: message.location(),
  })
})
page.on('pageerror', (error) => {
  pageErrors.push({ name: error.name, message: error.message, stack: error.stack })
})
page.on('requestfailed', (request) => {
  failedRequests.push({
    url: request.url(),
    resourceType: request.resourceType(),
    failure: request.failure()?.errorText || 'unknown failure',
  })
})
page.on('response', (response) => {
  const url = response.url()
  if (url.startsWith(baseUrl)) {
    responses.push({ url, status: response.status(), contentType: response.headers()['content-type'] || '' })
  }
})

let navigationStatus = null
let navigationError = null

try {
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 })
  await page.emulateMediaFeatures([
    { name: 'prefers-color-scheme', value: 'dark' },
    { name: 'prefers-reduced-motion', value: 'no-preference' },
  ])

  try {
    const response = await page.goto(baseUrl, { waitUntil: 'networkidle0', timeout: 60_000 })
    navigationStatus = response?.status() ?? null
  } catch (error) {
    navigationError = error instanceof Error ? { message: error.message, stack: error.stack } : String(error)
  }

  await new Promise((resolveDelay) => setTimeout(resolveDelay, 5_000))

  const documentState = await page.evaluate(() => {
    const root = document.getElementById('root')
    return {
      url: window.location.href,
      title: document.title,
      readyState: document.readyState,
      bodyText: document.body?.innerText?.slice(0, 1_500) || '',
      bodyHtml: document.body?.innerHTML?.slice(0, 4_000) || '',
      rootExists: Boolean(root),
      rootChildCount: root?.childElementCount ?? null,
      rootHtml: root?.innerHTML?.slice(0, 4_000) || '',
      immersiveCount: document.querySelectorAll('.h2o-immersive').length,
      scriptSources: Array.from(document.scripts).map((script) => script.src || '[inline]'),
      serviceWorkerController: navigator.serviceWorker?.controller?.scriptURL || null,
    }
  })

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    executablePath,
    navigationStatus,
    navigationError,
    documentState,
    consoleMessages,
    pageErrors,
    failedRequests,
    responses,
  }

  await writeFile(resolve(outputDirectory, 'runtime-report.json'), JSON.stringify(report, null, 2))
  await page.screenshot({
    path: resolve(outputDirectory, 'runtime-screen.png'),
    type: 'png',
    captureBeyondViewport: false,
  })

  console.log(JSON.stringify(report, null, 2))

  if (documentState.immersiveCount !== 1 || pageErrors.length > 0) {
    process.exitCode = 1
  }
} finally {
  await page.close()
  await browser.close()
}
