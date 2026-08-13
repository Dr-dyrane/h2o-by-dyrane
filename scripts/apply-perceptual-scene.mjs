import { readFile, writeFile } from 'node:fs/promises'

const path = 'src/components/immersive/LiquidCurrentScene.tsx'
let source = await readFile(path, 'utf8')

const replaceOnce = (label, before, after) => {
  const count = source.split(before).length - 1
  if (count !== 1) throw new Error(`${label}: expected one match, found ${count}`)
  source = source.replace(before, after)
}

replaceOnce(
  'scene response import',
  "import { frameBlend, webglMotionBudget } from '@/motion/tokens'",
  "import { frameBlend, webglMotionBudget, webglResponse } from '@/motion/tokens'",
)

replaceOnce(
  'scene vectors',
  `  const cameraTarget = useMemo(() => new THREE.Vector3(), [])
  const cameraPosition = useMemo(() => new THREE.Vector3(), [])
  const pointerPosition = useMemo(() => new THREE.Vector2(), [])`,
  `  const cameraTarget = useMemo(() => new THREE.Vector3(), [])
  const cameraLookAt = useMemo(() => new THREE.Vector3(0, 0, -0.35), [])
  const cameraPosition = useMemo(() => new THREE.Vector3(), [])
  const pointerPosition = useMemo(() => new THREE.Vector2(), [])
  const pointerTrail = useMemo(() => new THREE.Vector2(), [])
  const visualTimeRef = useRef(0)`,
)

replaceOnce(
  'safe resumed frame',
  `  useFrame((state, delta) => {
    const progress = progressRef.current`,
  `  useFrame((state, rawDelta) => {
    // Demand rendering can sleep. Clamp the resumed frame so the liquid never jumps.
    const delta = Math.min(rawDelta, 1 / 30)
    const progress = progressRef.current`,
)

replaceOnce(
  'lead and trail pointer phase',
  `    pointerPosition.x = THREE.MathUtils.damp(
      pointerPosition.x,
      pointer.x * pointer.presence,
      10.5,
      delta,
    )
    pointerPosition.y = THREE.MathUtils.damp(
      pointerPosition.y,
      pointer.y * pointer.presence,
      10.5,
      delta,
    )
    targetAccent.set(palette[activeIndex] ?? palette[0] ?? '#ff4b3e')
    accent.lerp(targetAccent, frameBlend(10, delta))`,
  `    pointerPosition.x = THREE.MathUtils.damp(
      pointerPosition.x,
      pointer.x * pointer.presence,
      webglResponse.pointerLead,
      delta,
    )
    pointerPosition.y = THREE.MathUtils.damp(
      pointerPosition.y,
      pointer.y * pointer.presence,
      webglResponse.pointerLead,
      delta,
    )
    pointerTrail.x = THREE.MathUtils.damp(
      pointerTrail.x,
      pointerPosition.x,
      webglResponse.pointerTrail,
      delta,
    )
    pointerTrail.y = THREE.MathUtils.damp(
      pointerTrail.y,
      pointerPosition.y,
      webglResponse.pointerTrail,
      delta,
    )
    const pointerMomentumX = pointerPosition.x - pointerTrail.x
    const pointerMomentumY = pointerPosition.y - pointerTrail.y
    targetAccent.set(palette[activeIndex] ?? palette[0] ?? '#ff4b3e')
    accent.lerp(targetAccent, frameBlend(webglResponse.accent, delta))`,
)

const expressions = [
  [
    'progress * Math.PI * 2.15 + Math.sin(phase) * 0.22 + pointerPosition.x * 0.18,',
    'progress * Math.PI * 2.15 + Math.sin(phase) * 0.22 + pointerTrail.x * 0.24 + pointerMomentumX * 0.42,',
  ],
  [
    '-0.13 + Math.cos(phase * 0.72) * 0.12 + pointerPosition.y * 0.12,',
    '-0.13 + Math.cos(phase * 0.72) * 0.12 + pointerTrail.y * 0.17 + pointerMomentumY * 0.28,',
  ],
  [
    '1.1 + Math.sin(phase * 0.82) * 0.95 + activeDirection * 0.16 + pointerPosition.x * 0.32,',
    '1.1 + Math.sin(phase * 0.82) * 0.95 + activeDirection * 0.16 + pointerTrail.x * 0.46 + pointerMomentumX * 0.58,',
  ],
  [
    '0.2 + Math.cos(phase * 0.64) * 0.38 - progress * 0.46 - pointerPosition.y * 0.24,',
    '0.2 + Math.cos(phase * 0.64) * 0.38 - progress * 0.46 - pointerTrail.y * 0.34 - pointerMomentumY * 0.42,',
  ],
  [
    '-0.18 + Math.sin(phase * 0.48) * 0.72 + pointerPosition.y * 0.12,',
    '-0.18 + Math.sin(phase * 0.48) * 0.72 + pointerTrail.y * 0.18 + pointerMomentumY * 0.24,',
  ],
]
expressions.forEach(([before, after], index) => replaceOnce(`spatial expression ${index + 1}`, before, after))

replaceOnce(
  'camera and visual clock',
  `    cameraPosition.set(
      Math.sin(phase * 0.42) * 0.62 + pointerPosition.x * 0.28,
      Math.cos(phase * 0.35) * 0.26 - pointerPosition.y * 0.18,
      6.1 + Math.sin(phase * 0.26) * 0.38 + Math.abs(pointerPosition.x) * 0.08,
    )
    state.camera.position.lerp(cameraPosition, frameBlend(9.2, delta))
    cameraTarget.set(
      Math.sin(phase * 0.5) * 0.22 + pointerPosition.x * 0.18,
      -progress * 0.38 - pointerPosition.y * 0.13,
      -0.35,
    )
    state.camera.lookAt(cameraTarget)

    const elapsed = state.clock.elapsedTime`,
  `    cameraPosition.set(
      Math.sin(phase * 0.42) * 0.62 + pointerTrail.x * 0.38 + pointerMomentumX * 0.2,
      Math.cos(phase * 0.35) * 0.26 - pointerTrail.y * 0.26 - pointerMomentumY * 0.14,
      6.1 + Math.sin(phase * 0.26) * 0.38 + Math.abs(pointerTrail.x) * 0.1,
    )
    state.camera.position.lerp(cameraPosition, frameBlend(webglResponse.camera, delta))
    cameraTarget.set(
      Math.sin(phase * 0.5) * 0.22 + pointerTrail.x * 0.25,
      -progress * 0.38 - pointerTrail.y * 0.18,
      -0.35,
    )
    cameraLookAt.lerp(cameraTarget, frameBlend(webglResponse.lookAt, delta))
    state.camera.lookAt(cameraLookAt)

    visualTimeRef.current += delta
    const elapsed = visualTimeRef.current`,
)

await writeFile(path, source)
console.log('Applied the deterministic H₂O perceptual WebGL migration.')
