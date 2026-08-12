import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const outputDirectory = resolve(process.cwd(), '.project-gallery-proof')
const reportPath = resolve(outputDirectory, 'report.json')
const logPath = process.argv[2]
const captureStatus = Number(process.argv[3] ?? 0)
const projects = ['ivisit', 'weddings', 'jelocare', 'wetindey', 'aumosaic', 'justurbanwears']
const profiles = ['desktop', 'mobile']
const failures = []

if (!existsSync(reportPath)) {
  throw new Error('Project gallery report was not generated')
}

const report = JSON.parse(await readFile(reportPath, 'utf8'))
const log = logPath && existsSync(logPath) ? await readFile(logPath, 'utf8') : ''
const expectedLegacyFailure = /^(desktop|mobile)\/(ivisit|weddings|jelocare|wetindey|aumosaic|justurbanwears): \.h2o-project-proof displays as flex$/

const legacyLines = log
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)

const unexpectedLegacyLines = legacyLines.filter((line) => !expectedLegacyFailure.test(line))
if (captureStatus !== 0 && unexpectedLegacyLines.length > 0) {
  failures.push(`unexpected legacy gallery failures: ${unexpectedLegacyLines.join(' | ')}`)
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
    const previewAuthoredMobile = profileName === 'mobile' && project === 'justurbanwears'

    if (!proof) failures.push(`${profileName}/${project}: proof measurement missing`)
    if (previewAuthoredMobile && proof?.display !== 'none') {
      failures.push(`${profileName}/${project}: duplicate H2O proof remains visible`)
    }
    if (!previewAuthoredMobile && (proof?.display === 'none' || proof?.display === 'missing')) {
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

const expectedVisibleProofFailures = projects.length + projects.length - 1
const observedVisibleProofFailures = legacyLines.filter(expectedLegacyFailure.test.bind(expectedLegacyFailure)).length
if (captureStatus !== 0 && observedVisibleProofFailures !== expectedVisibleProofFailures) {
  failures.push(
    `expected ${expectedVisibleProofFailures} intentional proof-visibility notices, found ${observedVisibleProofFailures}`,
  )
}

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log('Awwwards project gallery contract passed.')
}
