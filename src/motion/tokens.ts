// Profiled by .github/workflows/motion-profile.yml and browser-probed after deferred WebGL loads.
// The system separates three frequencies: scroll settles broadly, the pointer leads immediately,
// and light/camera layers trail softly. That phase difference creates liquid depth without inertia.
export const fluidEase: [number, number, number, number] = [0.16, 1, 0.3, 1]
export const appleEase: [number, number, number, number] = [0.2, 0.8, 0.2, 1]
export const appleSpringEase: [number, number, number, number] = [0.22, 1.12, 0.36, 1]
export const appleEaseInOut: [number, number, number, number] = [0.65, 0, 0.35, 1]

const settle = {
  restDelta: 0.0008,
  restSpeed: 0.012,
} as const

export const motionSprings = {
  // Near-critical scroll springs absorb wheel and trackpad stepping without synthetic scroll hijacking.
  world: {
    stiffness: 150,
    damping: 24,
    mass: 0.9,
    ...settle,
  },
  hero: {
    stiffness: 180,
    damping: 26,
    mass: 0.85,
    ...settle,
  },
  spatial: {
    stiffness: 135,
    damping: 23,
    mass: 0.96,
    ...settle,
  },
  gallery: {
    stiffness: 165,
    damping: 25,
    mass: 0.9,
    ...settle,
  },
  // The leading plane stays attached to the hand; trailing light and copy settle one beat later.
  pointerLead: {
    stiffness: 360,
    damping: 30,
    mass: 0.62,
    ...settle,
  },
  pointerTrail: {
    stiffness: 115,
    damping: 19.5,
    mass: 0.88,
    ...settle,
  },
  pointerPresence: {
    stiffness: 220,
    damping: 26,
    mass: 0.75,
    ...settle,
  },
  // Compatibility aliases retained for existing contracts and callers.
  pointer: {
    stiffness: 360,
    damping: 30,
    mass: 0.62,
    ...settle,
  },
  pointerSlow: {
    stiffness: 115,
    damping: 19.5,
    mass: 0.88,
    ...settle,
  },
} as const

export const motionTransitions = {
  micro: { duration: 0.32, ease: appleEase },
  reveal: { duration: 0.72, ease: fluidEase },
  cinematic: { duration: 1.08, ease: appleSpringEase },
  settle: { duration: 0.84, ease: appleEaseInOut },
} as const

export const webglResponse = {
  pointerLead: 14,
  pointerTrail: 6.8,
  world: 8.4,
  camera: 7.4,
  lookAt: 6.2,
  accent: 8.2,
} as const

export const webglMotionBudget = {
  idleWindowMs: 1080,
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
