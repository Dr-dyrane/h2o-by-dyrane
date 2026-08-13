import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')
const fail = (message) => {
  console.error(`Awwwards finish verification failed: ${message}`)
  process.exitCode = 1
}

const entry = read('src/styles/immersive.css')
const finish = read('src/styles/immersive/award-finish.css')
const perceptual = read('src/styles/immersive/perceptual-motion.css')
const portfolio = read('src/components/immersive/ImmersivePortfolio.tsx')
const projects = read('src/data/immersiveProjects.ts')

const imports = entry
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)

const awardImport = "@import './immersive/award-finish.css';"
const spatialImport = "@import './immersive/spatial-interaction.css';"
const archiveHitImport = "@import './immersive/archive-spatial-hit.css';"
const perceptualImport = "@import './immersive/perceptual-motion.css';"
const awardIndex = imports.indexOf(awardImport)
const spatialIndex = imports.indexOf(spatialImport)
const archiveHitIndex = imports.indexOf(archiveHitImport)
const perceptualIndex = imports.indexOf(perceptualImport)

if (awardIndex < 0) fail('award-finish.css must remain in the immersive stylesheet stack')
if (spatialIndex < 0 || spatialIndex <= awardIndex) {
  fail('spatial-interaction.css must follow the authored award finish')
}
if (archiveHitIndex < 0 || archiveHitIndex <= spatialIndex) {
  fail('archive-spatial-hit.css must remain after the stable interaction plane')
}
if (perceptualIndex < 0 || perceptualIndex <= archiveHitIndex) {
  fail('perceptual-motion.css must follow the stable interaction planes')
}
if (imports.at(-1) !== perceptualImport) {
  fail('perceptual-motion.css must remain the last immersive stylesheet import')
}

for (const id of ['ivisit', 'weddings', 'jelocare', 'wetindey', 'aumosaic', 'justurbanwears']) {
  if (!finish.includes(`#${id}`)) fail(`missing authored ${id} treatment`)
}

const requiredContracts = [
  '.h2o-project-proof',
  '.h2o-project-media-link > span',
  '.h2o-hero__sticky',
  '#justurbanwears .h2o-project-media-link > span',
]

for (const contract of requiredContracts) {
  if (!finish.includes(contract)) fail(`missing ${contract} contract`)
}

for (const contract of [
  '--h2o-ease-spring',
  '.h2o-spatial-aura',
  '.h2o-end__name strong',
  '@media (prefers-reduced-motion: reduce)',
]) {
  if (!perceptual.includes(contract)) fail(`missing perceptual ${contract} contract`)
}

if (!portfolio.includes('className="h2o-project-media-link"')) {
  fail('project media must remain a semantic full-surface link')
}

const proofCount = (projects.match(/\bproof:\s*['"]/g) ?? []).length
if (proofCount < 6) fail(`expected six project proof statements, found ${proofCount}`)

for (const [name, stylesheet] of [
  ['award finish', finish],
  ['perceptual finish', perceptual],
]) {
  if (/\bbox-shadow\s*:\s*[^;]*\binset\b/i.test(stylesheet)) {
    fail(`inset rings are forbidden in the ${name}`)
  }

  if (/\bborder(?:-(?:top|right|bottom|left))?\s*:/i.test(stylesheet)) {
    fail(`structural borders are forbidden in the ${name}`)
  }

  let depth = 0
  for (const character of stylesheet) {
    if (character === '{') depth += 1
    if (character === '}') depth -= 1
    if (depth < 0) break
  }
  if (depth !== 0) fail(`${name} stylesheet braces are unbalanced`)
}

if (!process.exitCode) {
  console.log('Awwwards finish contract passed with the spatial and perceptual interaction layers intact.')
}
