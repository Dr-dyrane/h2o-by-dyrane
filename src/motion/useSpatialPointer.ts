import { useMotionValue, useSpring, type MotionValue } from 'framer-motion'
import {
  useCallback,
  useEffect,
  useRef,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { motionSprings } from './tokens'

export type SpatialPointerSnapshot = {
  x: number
  y: number
  presence: number
}

type SpringProfile = (typeof motionSprings)[keyof typeof motionSprings]

type SpatialPointerOptions = {
  enabled?: boolean
  spring?: SpringProfile
}

type SpatialPointerBindings<T extends HTMLElement> = {
  onPointerEnter: (event: ReactPointerEvent<T>) => void
  onPointerMove: (event: ReactPointerEvent<T>) => void
  onPointerLeave: () => void
  onPointerCancel: () => void
}

export type SpatialPointerController<T extends HTMLElement> = {
  x: MotionValue<number>
  y: MotionValue<number>
  presence: MotionValue<number>
  bind: SpatialPointerBindings<T>
}

const clampUnit = (value: number) => Math.max(-1, Math.min(1, value))
const now = () => (typeof performance === 'undefined' ? Date.now() : performance.now())

export function useSpatialPointer<T extends HTMLElement>({
  enabled = true,
  spring = motionSprings.pointer,
}: SpatialPointerOptions = {}): SpatialPointerController<T> {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rawPresence = useMotionValue(0)
  const x = useSpring(rawX, spring)
  const y = useSpring(rawY, spring)
  const presence = useSpring(rawPresence, motionSprings.pointerSlow)

  const reset = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
    rawPresence.set(0)
  }, [rawPresence, rawX, rawY])

  useEffect(() => {
    if (!enabled) reset()
  }, [enabled, reset])

  const update = useCallback(
    (event: ReactPointerEvent<T>) => {
      if (!enabled || event.pointerType === 'touch') return

      const rect = event.currentTarget.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return

      rawX.set(clampUnit(((event.clientX - rect.left) / rect.width) * 2 - 1))
      rawY.set(clampUnit(((event.clientY - rect.top) / rect.height) * 2 - 1))
      rawPresence.set(1)
    },
    [enabled, rawPresence, rawX, rawY],
  )

  return {
    x,
    y,
    presence,
    bind: {
      onPointerEnter: update,
      onPointerMove: update,
      onPointerLeave: reset,
      onPointerCancel: reset,
    },
  }
}

export function useViewportSpatialPointer(
  activityRef: MutableRefObject<number>,
  enabled = true,
) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rawPresence = useMotionValue(0)
  const pointerRef = useRef<SpatialPointerSnapshot>({ x: 0, y: 0, presence: 0 })
  const x = useSpring(rawX, motionSprings.pointerSlow)
  const y = useSpring(rawY, motionSprings.pointerSlow)
  const presence = useSpring(rawPresence, motionSprings.pointerSlow)

  useEffect(() => {
    const sync = (nextX: number, nextY: number, nextPresence: number) => {
      const snapshot = pointerRef.current
      snapshot.x = nextX
      snapshot.y = nextY
      snapshot.presence = nextPresence
      rawX.set(nextX)
      rawY.set(nextY)
      rawPresence.set(nextPresence)
      activityRef.current = now()
    }

    const reset = () => sync(0, 0, 0)

    if (!enabled) {
      reset()
      return undefined
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || window.innerWidth <= 0 || window.innerHeight <= 0) return
      sync(
        clampUnit((event.clientX / window.innerWidth) * 2 - 1),
        clampUnit((event.clientY / window.innerHeight) * 2 - 1),
        1,
      )
    }

    const handlePointerOut = (event: PointerEvent) => {
      if (event.relatedTarget === null) reset()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') reset()
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerout', handlePointerOut, { passive: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerout', handlePointerOut)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [activityRef, enabled, rawPresence, rawX, rawY])

  return { x, y, presence, pointerRef }
}
