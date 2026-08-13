import { readFile } from 'node:fs/promises'

const files = {
  portfolio: 'src/components/immersive/ImmersivePortfolio.tsx',
  canvas: 'src/components/immersive/LiquidCurrentCanvas.tsx',
  scene: 'src/components/immersive/LiquidCurrentScene.tsx',
  pointer: 'src/motion/useSpatialPointer.ts',
  tokens: 'src/motion/tokens.ts',
  styles: 'src/styles/immersive/motion.css',
  spatialStyles: 'src/styles/immersive/spatial-interaction.css',
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
requireText(
  'portfolio',
  'useViewportSpatialPointer',
  'portfolio: viewport pointer field is not connected',
)
requireText(
  'portfolio',
  'h2o-project-media__spatial',
  'portfolio: project planes do not have an independent spatial layer',
)
requireText(
  'portfolio',
  'h2o-project-pointer-light',
  'portfolio: project pointer light is missing',
)
requireText('pointer', 'useMotionValue', 'pointer: transient pointer position is not stored in MotionValues')
requireText('pointer', 'useSpring', 'pointer: pointer position is not spring-smoothed')
requireText('pointer', "event.pointerType === 'touch'", 'pointer: touch input is not excluded')
requireText('tokens', 'motionSprings', 'tokens: shared spring profiles are missing')
requireText('tokens', 'pointerSlow', 'tokens: slow pointer spring profile is missing')
requireText('tokens', 'appleEase', 'tokens: Apple-like timing curve is missing')
requireText('tokens', 'webglMotionBudget', 'tokens: WebGL motion budget is missing')
requireText('canvas', 'pointerRef', 'canvas: pointer field is not passed into WebGL')
requireText('scene', 'THREE.MathUtils.damp', 'scene: frame-rate-independent damping is missing')
requireText('scene', 'frameBlend', 'scene: frame-rate-independent color/camera blending is missing')
requireText('scene', 'pointerRef.current', 'scene: pointer position does not influence the WebGL current')
requireText('scene', "'pointermove'", 'scene: pointer movement does not wake demand rendering')
requireText(
  'scene',
  'webglMotionBudget.idleWindowMs',
  'scene: on-demand render tail is not governed by the motion budget',
)
requireText('styles', '#justurbanwears .h2o-project-copy h3', 'mobile JUW: duplicate title suppression is missing')
requireText('styles', '#justurbanwears .h2o-project-statement', 'mobile JUW: duplicate statement suppression is missing')
requireText('styles', "[data-active='true']", 'styles: active-only will-change budgeting is missing')
requireText('spatialStyles', '--h2o-ease-apple', 'styles: Apple-like cubic-bezier curve is missing')
requireText('spatialStyles', '.h2o-project-media__spatial', 'styles: project spatial plane is missing')
requireText('spatialStyles', '.h2o-archive-card__spatial', 'styles: archive spatial plane is missing')
requireText('spatialStyles', '@media (pointer: coarse)', 'styles: coarse-pointer fallback is missing')
requireText('spatialStyles', '@media (prefers-reduced-motion: reduce)', 'styles: reduced-motion fallback is missing')
requireText(
  'imports',
  "@import './immersive/spatial-interaction.css';",
  'styles: spatial interaction finish is not imported last',
)

if (source.portfolio.includes('useTransform(scrollYProgress')) {
  failures.push('portfolio: raw section scroll progress still drives transforms directly')
}

if (source.scene.includes("'pointermove'") && !source.scene.includes('pointerRef.current')) {
  failures.push('scene: pointer movement wakes WebGL without changing the scene')
}

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log('Motion contract verified: slower springs, Apple-like easing, pointer-aware DOM depth, damped WebGL, active-layer budgeting, and accessibility fallbacks are present.')
}
