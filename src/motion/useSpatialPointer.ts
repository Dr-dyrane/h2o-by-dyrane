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
  trailSpring?: SpringProfile
  stableHover?: boolean
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
  trailX: MotionValue<number>
  trailY: MotionValue<number>
  presence: MotionValue<number>
  bind: SpatialPointerBindings<T>
}

const clampUnit = (value: number) => Math.max(-1, Math.min(1, value))
const shapePointer = (value: number) => Math.sign(value) * Math.pow(Math.abs(value), 0.78)
const now = () => (typeof performance === 'undefined' ? Date.now() : performance.now())

export function useSpatialPointer<T extends HTMLElement>({
  enabled = true,
  spring = motionSprings.pointerLead,
  trailSpring = motionSprings.pointerTrail,
  stableHover = true,
}: SpatialPointerOptions = {}): SpatialPointerController<T> {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rawPresence = useMotionValue(0)
  const targetRef = useRef<T | null>(null)
  const x = useSpring(rawX, spring)
  const y = useSpring(rawY, spring)
  const trailX = useSpring(x, trailSpring)
  const trailY = useSpring(y, trailSpring)
  const presence = useSpring(rawPresence, motionSprings.pointerPresence)

  const reset = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
    rawPresence.set(0)
  }, [rawPresence, rawX, rawY])

  const syncPoint = useCallback(
    (clientX: number, clientY: number, rect: DOMRect) => {
      if (rect.width <= 0 || rect.height <= 0) return
      rawX.set(shapePointer(clampUnit(((clientX - rect.left) / rect.width) * 2 - 1)))
      rawY.set(shapePointer(clampUnit(((clientY - rect.top) / rect.height) * 2 - 1)))
      rawPresence.set(1)
    },
    [rawPresence, rawX, rawY],
  )

  useEffect(() => {
    if (!enabled) {
      targetRef.current = null
      reset()
    }
  }, [enabled, reset])

  useEffect(() => {
    if (!enabled || !stableHover) return undefined

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const target = targetRef.current
      if (!target) return

      const rect = target.getBoundingClientRect()
      const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom

      if (!isInside) {
        targetRef.current = null
        reset()
        return
      }

      syncPoint(event.clientX, event.clientY, rect)
    }

    const handlePointerOut = (event: PointerEvent) => {
      if (event.relatedTarget !== null) return
      targetRef.current = null
      reset()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') return
      targetRef.current = null
      reset()
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerout', handlePointerOut, { passive: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerout', handlePointerOut)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [enabled, reset, stableHover, syncPoint])

  const update = useCallback(
    (event: ReactPointerEvent<T>) => {
      if (!enabled || event.pointerType === 'touch') return
      targetRef.current = event.currentTarget
      syncPoint(event.clientX, event.clientY, event.currentTarget.getBoundingClientRect())
    },
    [enabled, syncPoint],
  )

  const handleLeave = useCallback(() => {
    if (stableHover) return
    targetRef.current = null
    reset()
  }, [reset, stableHover])

  const handleCancel = useCallback(() => {
    targetRef.current = null
    reset()
  }, [reset])

  return {
    x,
    y,
    trailX,
    trailY,
    presence,
    bind: {
      onPointerEnter: update,
      onPointerMove: update,
      onPointerLeave: handleLeave,
      onPointerCancel: handleCancel,
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
  const x = useSpring(rawX, motionSprings.pointerLead)
  const y = useSpring(rawY, motionSprings.pointerLead)
  const trailX = useSpring(x, motionSprings.pointerTrail)
  const trailY = useSpring(y, motionSprings.pointerTrail)
  const presence = useSpring(rawPresence, motionSprings.pointerPresence)

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
        shapePointer(clampUnit((event.clientX / window.innerWidth) * 2 - 1)),
        shapePointer(clampUnit((event.clientY / window.innerHeight) * 2 - 1)),
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

  return { x, y, trailX, trailY, presence, pointerRef }
}
