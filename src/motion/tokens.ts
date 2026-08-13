// Profiled by .github/workflows/motion-profile.yml and runtime-probed after WebGL loads.
// The curves mirror Apple's interaction character: decisive acceleration, long soft deceleration,
// and a spring tail that settles once instead of vibrating around the destination.
// Scroll choreography and pointer response remain separate so neither transform fights the other.
export const fluidEase: [number, number, number, number] = [0.16, 1, 0.3, 1]
export const appleEase: [number, number, number, number] = [0.32, 0.72, 0, 1]
export const appleEaseInOut: [number, number, number, number] = [0.65, 0, 0.35, 1]

const settle = {
  restDelta: 0.001,
  restSpeed: 0.015,
} as const

// Scroll springs are deliberately slower than the old near-instant profiles. They absorb wheel
// and trackpad steps without introducing the floaty lag of a synthetic smooth-scroll engine.
export const motionSprings = {
  world: {
    stiffness: 210,
    damping: 28,
    mass: 0.82,
    ...settle,
  },
  hero: {
    stiffness: 240,
    damping: 27,
    mass: 0.78,
    ...settle,
  },
  spatial: {
    stiffness: 185,
    damping: 27,
    mass: 0.88,
    ...settle,
  },
  gallery: {
    stiffness: 225,
    damping: 28,
    mass: 0.8,
    ...settle,
  },
  pointer: {
    stiffness: 260,
    damping: 24,
    mass: 0.7,
    ...settle,
  },
  pointerSlow: {
    stiffness: 170,
    damping: 23,
    mass: 0.82,
    ...settle,
  },
} as const

export const motionTransitions = {
  micro: { duration: 0.26, ease: appleEase },
  reveal: { duration: 0.64, ease: fluidEase },
  cinematic: { duration: 0.98, ease: appleEase },
  settle: { duration: 0.78, ease: appleEaseInOut },
} as const

export const webglMotionBudget = {
  idleWindowMs: 720,
  idleLoadTimeoutMs: 560,
  fallbackLoadDelayMs: 90,
  full: {
    dpr: 1,
    particleCount: 220,
    filamentCount: 3,
    filamentSegments: 48,
    filamentRadialSegments: 3,
    primaryDetail: 3,
    secondaryDetail: 2,
    nodeSegments: 8,
  },
  compact: {
    dpr: 0.85,
    particleCount: 120,
    filamentCount: 1,
    filamentSegments: 28,
    filamentRadialSegments: 3,
    primaryDetail: 2,
    secondaryDetail: 1,
    nodeSegments: 6,
  },
} as const

export function frameBlend(lambda: number, delta: number) {
  return 1 - Math.exp(-lambda * delta)
}
