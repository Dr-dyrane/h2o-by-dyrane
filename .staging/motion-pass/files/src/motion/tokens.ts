export const fluidEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

export const motionSprings = {
  world: {
    stiffness: 190,
    damping: 30,
    mass: 0.42,
    restDelta: 0.00025,
    restSpeed: 0.001,
  },
  hero: {
    stiffness: 205,
    damping: 31,
    mass: 0.4,
    restDelta: 0.00025,
    restSpeed: 0.001,
  },
  spatial: {
    stiffness: 175,
    damping: 29,
    mass: 0.48,
    restDelta: 0.00025,
    restSpeed: 0.001,
  },
  gallery: {
    stiffness: 220,
    damping: 33,
    mass: 0.4,
    restDelta: 0.00025,
    restSpeed: 0.001,
  },
} as const

export const motionTransitions = {
  micro: { duration: 0.24, ease: fluidEase },
  reveal: { duration: 0.62, ease: fluidEase },
  cinematic: { duration: 0.92, ease: fluidEase },
} as const

export const webglMotionBudget = {
  idleWindowMs: 900,
  idleLoadTimeoutMs: 650,
  fallbackLoadDelayMs: 120,
  maxDpr: 1.35,
  particleCount: 360,
  filamentCount: 4,
  filamentSegments: 72,
  filamentRadialSegments: 4,
  primaryDetail: 4,
  secondaryDetail: 3,
  nodeSegments: 10,
} as const

export function frameBlend(lambda: number, delta: number) {
  return 1 - Math.exp(-lambda * delta)
}
