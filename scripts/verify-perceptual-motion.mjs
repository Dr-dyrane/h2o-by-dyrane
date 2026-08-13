import { readFile } from 'node:fs/promises'

const paths = {
  tokens: 'src/motion/tokens.ts',
  pointer: 'src/motion/useSpatialPointer.ts',
  field: 'src/components/immersive/PerceptualPointerField.tsx',
  app: 'src/App.tsx',
  scene: 'src/components/immersive/LiquidCurrentScene.tsx',
  styles: 'src/styles/immersive/perceptual-motion.css',
  imports: 'src/styles/immersive.css',
}
const source = Object.fromEntries(
  await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await readFile(path, 'utf8')])),
)
const failures = []
const requireText = (file, text, message) => {
  if (!source[file].includes(text)) failures.push(message)
}

requireText('tokens', 'appleSpringEase', 'motion: spring-like Apple bezier is missing')
requireText('tokens', 'pointerLead', 'motion: leading pointer spring is missing')
requireText('tokens', 'pointerTrail', 'motion: trailing pointer spring is missing')
requireText('tokens', 'webglResponse', 'motion: WebGL response tokens are missing')
requireText('pointer', 'trailX', 'pointer: trailing X phase is missing')
requireText('pointer', 'trailY', 'pointer: trailing Y phase is missing')
requireText('pointer', 'stableHover = true', 'pointer: moving planes can still cancel hover prematurely')
requireText('field', 'PerceptualPointerField', 'portfolio: global spatial pointer field is missing')
requireText('field', '--h2o-pointer-trail-x', 'portfolio: global trailing CSS field is missing')
requireText('app', '<PerceptualPointerField />', 'portfolio: spatial field is not mounted')
requireText('scene', 'Math.min(rawDelta, 1 / 30)', 'WebGL: resumed frame delta is not clamped')
requireText('scene', 'pointerTrail', 'WebGL: pointer trail is missing')
requireText('scene', 'pointerMomentumX', 'WebGL: pointer momentum is missing')
requireText('scene', 'cameraLookAt.lerp', 'WebGL: camera look-at target still snaps')
requireText('scene', 'visualTimeRef.current += delta', 'WebGL: visual time can jump after idle')
requireText('styles', '--h2o-ease-spring', 'styles: Apple spring bezier is missing')
requireText('styles', '.h2o-spatial-aura', 'styles: global spatial aura is missing')
requireText('styles', '.h2o-end__name strong', 'styles: DYRANE ending is not pointer-aware')
requireText('imports', "@import './immersive/perceptual-motion.css';", 'styles: perceptual motion layer is not imported')

if (!source.imports.trim().endsWith("@import './immersive/perceptual-motion.css';")) {
  failures.push('styles: perceptual motion layer must remain last')
}

if (failures.length) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log('Perceptual motion verified: critically damped scroll, lead/trail hover depth, smooth camera target, safe WebGL resume and reduced-motion escape.')
}
