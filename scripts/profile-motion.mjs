import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import puppeteer from 'puppeteer-core'

const baseUrl = process.env.H2O_PROFILE_URL || 'http://127.0.0.1:5173'
const outputDirectory = resolve(process.cwd(), '.motion-profile')
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

const profiles = {
  desktop: {
    viewport: { width: 1440, height: 1000, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
    durationMs: 14_000,
  },
  mobile: {
    viewport: { width: 430, height: 932, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    durationMs: 16_000,
  },
}

const percentile = (values, ratio) => {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * ratio) - 1))
  return sorted[index]
}

const round = (value, places = 2) => Number(value.toFixed(places))

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
    '--enable-webgl',
    '--ignore-gpu-blocklist',
  ],
})

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  executablePath,
  profiles: {},
}

try {
  for (const [profileName, profile] of Object.entries(profiles)) {
    const page = await browser.newPage()
    const pageErrors = []
    const failedRequests = []

    page.on('pageerror', (error) => pageErrors.push(error.message))
    page.on('requestfailed', (request) => {
      if (request.url().startsWith(baseUrl)) {
        failedRequests.push(`${request.failure()?.errorText || 'unknown failure'}: ${request.url()}`)
      }
    })

    await page.setViewport(profile.viewport)
    await page.emulateMediaFeatures([
      { name: 'prefers-color-scheme', value: 'dark' },
      { name: 'prefers-reduced-motion', value: 'no-preference' },
    ])
    await page.goto(baseUrl, { waitUntil: 'networkidle0', timeout: 60_000 })
    await page.waitForSelector('.h2o-immersive', { timeout: 20_000 })
    await page.waitForSelector('canvas', { timeout: 20_000 })

    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready
      const images = Array.from(document.images)
      await Promise.all(
        images.map(async (image) => {
          if (image.complete) return
          await new Promise((resolveImage) => {
            const settle = () => resolveImage(undefined)
            image.addEventListener('load', settle, { once: true })
            image.addEventListener('error', settle, { once: true })
            window.setTimeout(settle, 8_000)
          })
        }),
      )
    })

    await new Promise((resolveDelay) => setTimeout(resolveDelay, 900))

    const raw = await page.evaluate(async ({ durationMs }) => {
      document.documentElement.style.scrollBehavior = 'auto'
      window.scrollTo(0, 0)

      const frameIntervals = []
      const longTasks = []
      let observer = null

      if ('PerformanceObserver' in window) {
        const supported = PerformanceObserver.supportedEntryTypes || []
        if (supported.includes('longtask')) {
          observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              longTasks.push({ startTime: entry.startTime, duration: entry.duration })
            }
          })
          observer.observe({ type: 'longtask', buffered: false })
        }
      }

      const maximumScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
      const startCpu = performance.now()

      await new Promise((resolveTrace) => {
        let start = null
        let previous = null

        const frame = (now) => {
          if (start === null) {
            start = now
            previous = now
          } else {
            frameIntervals.push(now - previous)
            previous = now
          }

          const elapsed = now - start
          const progress = Math.min(1, elapsed / durationMs)
          window.scrollTo(0, maximumScroll * progress)

          if (progress < 1) {
            window.requestAnimationFrame(frame)
          } else {
            window.setTimeout(resolveTrace, 450)
          }
        }

        window.requestAnimationFrame(frame)
      })

      observer?.disconnect()

      return {
        frameIntervals,
        longTasks,
        measuredDuration: performance.now() - startCpu,
        maximumScroll,
        scrollHeight: document.documentElement.scrollHeight,
        canvasCount: document.querySelectorAll('canvas').length,
      }
    }, { durationMs: profile.durationMs })

    const intervals = raw.frameIntervals.filter((value) => Number.isFinite(value) && value > 0)
    const meanInterval = intervals.reduce((sum, value) => sum + value, 0) / Math.max(1, intervals.length)
    const framesOver = (threshold) => intervals.filter((value) => value > threshold).length
    const longTaskDurations = raw.longTasks.map((task) => task.duration)

    const metrics = {
      sampleCount: intervals.length,
      measuredDurationMs: round(raw.measuredDuration),
      scrollHeight: raw.scrollHeight,
      maximumScroll: raw.maximumScroll,
      canvasCount: raw.canvasCount,
      meanFrameIntervalMs: round(meanInterval),
      meanFpsEquivalent: round(1000 / Math.max(meanInterval, 0.001), 1),
      p50FrameIntervalMs: round(percentile(intervals, 0.5)),
      p95FrameIntervalMs: round(percentile(intervals, 0.95)),
      p99FrameIntervalMs: round(percentile(intervals, 0.99)),
      maximumFrameIntervalMs: round(Math.max(0, ...intervals)),
      framesOver25ms: framesOver(25),
      framesOver33ms: framesOver(33.34),
      framesOver50ms: framesOver(50),
      shareOver33ms: round(framesOver(33.34) / Math.max(1, intervals.length), 4),
      shareOver50ms: round(framesOver(50) / Math.max(1, intervals.length), 4),
      longTaskCount: longTaskDurations.length,
      longTaskTotalMs: round(longTaskDurations.reduce((sum, value) => sum + value, 0)),
      maximumLongTaskMs: round(Math.max(0, ...longTaskDurations)),
    }

    report.profiles[profileName] = {
      viewport: profile.viewport,
      durationMs: profile.durationMs,
      metrics,
      pageErrors,
      failedRequests,
    }

    await page.close()
  }
} finally {
  await browser.close()
}

await writeFile(resolve(outputDirectory, 'motion-profile.json'), JSON.stringify(report, null, 2))

const failures = []
for (const [profileName, profile] of Object.entries(report.profiles)) {
  const { metrics } = profile
  if (metrics.canvasCount < 1) failures.push(`${profileName}: deferred WebGL canvas did not load`)
  if (metrics.sampleCount < 300) failures.push(`${profileName}: insufficient RAF samples (${metrics.sampleCount})`)
  if (metrics.p95FrameIntervalMs > 45) failures.push(`${profileName}: p95 frame interval ${metrics.p95FrameIntervalMs}ms exceeds 45ms`)
  if (metrics.shareOver50ms > 0.035) failures.push(`${profileName}: ${(metrics.shareOver50ms * 100).toFixed(1)}% of frames exceeded 50ms`)
  if (metrics.longTaskTotalMs > 1_000) failures.push(`${profileName}: long-task total ${metrics.longTaskTotalMs}ms exceeds 1000ms`)
  if (profile.pageErrors.length > 0) failures.push(`${profileName}: page errors ${profile.pageErrors.join(' | ')}`)
  if (profile.failedRequests.length > 0) failures.push(`${profileName}: failed same-origin requests ${profile.failedRequests.join(' | ')}`)
}

console.log(JSON.stringify(report.profiles, null, 2))

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Motion profile passed. Evidence retained in ${outputDirectory}`)
}
