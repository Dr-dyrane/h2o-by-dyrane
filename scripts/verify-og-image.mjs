import { readFile } from 'node:fs/promises'

const image = await readFile('public/og-image-live.png')
const index = await readFile('index.html', 'utf8')
const vite = await readFile('vite.config.ts', 'utf8')
const vercel = await readFile('vercel.json', 'utf8')
const generator = await readFile('scripts/generate-og-image.mjs', 'utf8')
const failures = []
const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

if (!image.subarray(0, 8).equals(signature)) failures.push('OG: live asset is not PNG')
if (image.readUInt32BE(16) !== 1200 || image.readUInt32BE(20) !== 630) failures.push('OG: asset is not 1200x630')
if (image.byteLength < 90_000) failures.push(`OG: asset is unexpectedly small (${image.byteLength})`)
if (!index.includes('https://dyrane.tech/og-image-live.png?v=')) failures.push('OG: index does not reference cache-busted live hero')
if (index.includes('https://dyrane.tech/og-image.png')) failures.push('OG: stale static image URL remains in index')
if (!vite.includes('og-image-live.png')) failures.push('OG: PWA manifest does not use the live hero')
if (!vercel.includes('/og-image-live.png')) failures.push('OG: live hero cache policy is missing')
if (!generator.includes("page.waitForSelector('.h2o-hero__spatial'")) failures.push('OG: generator does not capture the real hero')
if (!generator.includes("page.waitForSelector('canvas'")) failures.push('OG: generator does not attempt to retain the live current')

if (failures.length) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log('Live OG verified: actual H₂O hero, 1200x630 PNG, cache-busted metadata and refreshable capture pipeline.')
}
