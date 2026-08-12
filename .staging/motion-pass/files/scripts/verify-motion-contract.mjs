import { readFile } from 'node:fs/promises'

const files = {
  portfolio: 'src/components/immersive/ImmersivePortfolio.tsx',
  canvas: 'src/components/immersive/LiquidCurrentCanvas.tsx',
  scene: 'src/components/immersive/LiquidCurrentScene.tsx',
  tokens: 'src/motion/tokens.ts',
  styles: 'src/styles/immersive/motion.css',
  imports: 'src/styles/immersive.css',
}

const source = Object.fromEntries(
  await Promise.all(
    Object.entries(files).map(async ([key, path]) => [key, await readFile(path, 'utf8')]),
  ),
)

const failures = []
const requireText = (file, needle, message) => {
  if (!source[file].includes(needle)) failures.push(message)
}

requireText('portfolio', 'useSpring', 'portfolio: scroll progress is not spring-smoothed')
requireText(
  'portfolio',
  'useMotionValueEvent(smoothPageProgress',
  'portfolio: WebGL is not driven by the smoothed page current',
)
requireText(
  'portfolio',
  "data-active={active ? 'true' : 'false'}",
  'portfolio: active project layer is not identified for compositor budgeting',
)
requireText('tokens', 'motionSprings', 'tokens: shared spring profiles are missing')
requireText('tokens', 'webglMotionBudget', 'tokens: WebGL motion budget is missing')
requireText('scene', 'THREE.MathUtils.damp', 'scene: frame-rate-independent damping is missing')
requireText('scene', 'frameBlend', 'scene: frame-rate-independent color/camera blending is missing')
requireText(
  'scene',
  'webglMotionBudget.idleWindowMs',
  'scene: on-demand render tail is not governed by the motion budget',
)
requireText('styles', '#justurbanwears .h2o-project-copy h3', 'mobile JUW: duplicate title suppression is missing')
requireText('styles', '#justurbanwears .h2o-project-statement', 'mobile JUW: duplicate statement suppression is missing')
requireText('styles', "[data-active='true']", 'styles: active-only will-change budgeting is missing')
requireText('imports', "@import './immersive/motion.css';", 'styles: motion contract is not imported last')

if (source.portfolio.includes('useTransform(scrollYProgress')) {
  failures.push('portfolio: raw section scroll progress still drives transforms directly')
}

if (source.scene.includes("'pointermove'")) {
  failures.push('scene: pointer movement wakes WebGL without changing the scene')
}

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log('Motion contract verified: shared springs, damped WebGL, active-layer budgeting, and JUW mobile preview rules are present.')
}
