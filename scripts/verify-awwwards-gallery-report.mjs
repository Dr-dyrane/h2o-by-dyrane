import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const outputDirectory = resolve(process.cwd(), '.project-gallery-proof')
const reportPath = resolve(outputDirectory, 'report.json')
const logPath = process.argv[2]
const captureStatus = Number(process.argv[3] ?? 0)
const projects = ['ivisit', 'myfinance', 'weddings', 'jelocare', 'wetindey', 'aumosaic']
const profiles = ['desktop', 'mobile']
const failures = []

if (!existsSync(reportPath)) {
  throw new Error('Project gallery report was not generated')
}

const report = JSON.parse(await readFile(reportPath, 'utf8'))
const log = logPath && existsSync(logPath) ? await readFile(logPath, 'utf8') : ''
const expectedProofNotice = /^(desktop|mobile)\/(ivisit|myfinance|weddings|jelocare|wetindey|aumosaic): \.h2o-project-proof displays as flex$/

const captureLines = log
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)

const unexpectedCaptureLines = captureLines.filter((line) => !expectedProofNotice.test(line))
if (captureStatus !== 0 && unexpectedCaptureLines.length > 0) {
  failures.push(`unexpected gallery failures: ${unexpectedCaptureLines.join(' | ')}`)
}

for (const profileName of profiles) {
  const profile = report.profiles?.[profileName]
  if (!profile) {
    failures.push(`${profileName}: profile missing`)
    continue
  }

  for (const project of projects) {
    const result = profile.projects?.[project]
    if (!result) {
      failures.push(`${profileName}/${project}: result missing`)
      continue
    }

    const proof = result.clutter?.find((item) => item.selector === '.h2o-project-proof')
    const description = result.clutter?.find((item) => item.selector === '.h2o-project-description')
    const modes = result.clutter?.find((item) => item.selector === '.h2o-project-modes')

    if (!proof) failures.push(`${profileName}/${project}: proof measurement missing`)
    if (proof?.display === 'none' || proof?.display === 'missing') {
      failures.push(`${profileName}/${project}: proof line is not visible`)
    }
    if (description?.display !== 'none') {
      failures.push(`${profileName}/${project}: description displays as ${description?.display ?? 'missing'}`)
    }
    if (modes?.display !== 'none') {
      failures.push(`${profileName}/${project}: modes display as ${modes?.display ?? 'missing'}`)
    }
    if (!existsSync(resolve(outputDirectory, result.capture))) {
      failures.push(`${profileName}/${project}: capture missing`)
    }
  }

  if ((profile.pageErrors ?? []).length > 0) {
    failures.push(`${profileName}: page errors ${(profile.pageErrors ?? []).join(' | ')}`)
  }
  if ((profile.failedRequests ?? []).length > 0) {
    failures.push(`${profileName}: failed requests ${(profile.failedRequests ?? []).join(' | ')}`)
  }
}

const expectedProofNotices = projects.length * profiles.length
const observedProofNotices = captureLines.filter(expectedProofNotice.test.bind(expectedProofNotice)).length
if (captureStatus !== 0 && observedProofNotices !== expectedProofNotices) {
  failures.push(
    `expected ${expectedProofNotices} intentional proof-visibility notices, found ${observedProofNotices}`,
  )
}

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log('Awwwards project gallery contract passed.')
}
