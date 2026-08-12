// Profiled by .github/workflows/motion-profile.yml and runtime-probed after WebGL loads.
export const fluidEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

const settle = {
  restDelta: 0.0005,
  restSpeed: 0.008,
} as const

// Near-critical damping follows the hand without bounce or a delayed tail.
export const motionSprings = {
  world: {
    stiffness: 520,
    damping: 36,
    mass: 0.62,
    ...settle,
  },
  hero: {
    stiffness: 430,
    damping: 34,
    mass: 0.66,
    ...settle,
  },
  spatial: {
    stiffness: 380,
    damping: 32,
    mass: 0.68,
    ...settle,
  },
  gallery: {
    stiffness: 460,
    damping: 34,
    mass: 0.62,
    ...settle,
  },
} as const

export const motionTransitions = {
  micro: { duration: 0.22, ease: fluidEase },
  reveal: { duration: 0.58, ease: fluidEase },
  cinematic: { duration: 0.86, ease: fluidEase },
} as const

export const webglMotionBudget = {
  idleWindowMs: 620,
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
