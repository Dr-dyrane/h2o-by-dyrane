import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { useEffect, useState } from 'react'
import { motionSprings } from '@/motion/tokens'

const clampUnit = (value: number) => Math.max(-1, Math.min(1, value))
const shapePointer = (value: number) => Math.sign(value) * Math.pow(Math.abs(value), 0.78)

function setPointerVariables(
  root: HTMLElement,
  leadX: MotionValue<number>,
  leadY: MotionValue<number>,
  trailX: MotionValue<number>,
  trailY: MotionValue<number>,
  presence: MotionValue<number>,
) {
  const leadXValue = leadX.get()
  const leadYValue = leadY.get()
  const trailXValue = trailX.get()
  const trailYValue = trailY.get()

  root.style.setProperty('--h2o-pointer-lead-x', `${leadXValue * 15}px`)
  root.style.setProperty('--h2o-pointer-lead-y', `${leadYValue * 11}px`)
  root.style.setProperty('--h2o-pointer-trail-x', `${trailXValue * 28}px`)
  root.style.setProperty('--h2o-pointer-trail-y', `${trailYValue * 17}px`)
  root.style.setProperty('--h2o-pointer-counter-x', `${trailXValue * -15}px`)
  root.style.setProperty('--h2o-pointer-counter-y', `${trailYValue * -9}px`)
  root.style.setProperty('--h2o-pointer-rotate-x', `${trailYValue * -2.4}deg`)
  root.style.setProperty('--h2o-pointer-rotate-y', `${trailXValue * 3.6}deg`)
  root.style.setProperty('--h2o-pointer-presence', String(presence.get()))
}

export function PerceptualPointerField() {
  const [enabled, setEnabled] = useState(false)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rawPresence = useMotionValue(0)
  const leadX = useSpring(rawX, motionSprings.pointerLead)
  const leadY = useSpring(rawY, motionSprings.pointerLead)
  const trailX = useSpring(leadX, motionSprings.pointerTrail)
  const trailY = useSpring(leadY, motionSprings.pointerTrail)
  const presence = useSpring(rawPresence, motionSprings.pointerPresence)
  const auraX = useTransform(trailX, [-1, 1], [-320, 320])
  const auraY = useTransform(trailY, [-1, 1], [-210, 210])
  const auraOpacity = useTransform(presence, [0, 1], [0, 0.74])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const primaryCoarsePointer = window.matchMedia('(pointer: coarse)')
    const anyFinePointer = window.matchMedia('(any-pointer: fine)')
    const sync = () => {
      const desktopClassViewport = window.innerWidth > 900
      const canAim = anyFinePointer.matches || !primaryCoarsePointer.matches
      setEnabled(desktopClassViewport && canAim && !reducedMotion.matches)
    }

    sync()
    reducedMotion.addEventListener?.('change', sync)
    primaryCoarsePointer.addEventListener?.('change', sync)
    anyFinePointer.addEventListener?.('change', sync)
    window.addEventListener('resize', sync, { passive: true })
    return () => {
      reducedMotion.removeEventListener?.('change', sync)
      primaryCoarsePointer.removeEventListener?.('change', sync)
      anyFinePointer.removeEventListener?.('change', sync)
      window.removeEventListener('resize', sync)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const syncVariables = () => setPointerVariables(root, leadX, leadY, trailX, trailY, presence)
    const subscriptions = [leadX, leadY, trailX, trailY, presence].map((value) =>
      value.on('change', syncVariables),
    )
    const properties = [
      '--h2o-pointer-lead-x',
      '--h2o-pointer-lead-y',
      '--h2o-pointer-trail-x',
      '--h2o-pointer-trail-y',
      '--h2o-pointer-counter-x',
      '--h2o-pointer-counter-y',
      '--h2o-pointer-rotate-x',
      '--h2o-pointer-rotate-y',
      '--h2o-pointer-presence',
    ]

    syncVariables()
    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe())
      properties.forEach((property) => root.style.removeProperty(property))
    }
  }, [leadX, leadY, presence, trailX, trailY])

  useEffect(() => {
    const reset = () => {
      rawX.set(0)
      rawY.set(0)
      rawPresence.set(0)
    }

    if (!enabled) {
      reset()
      return undefined
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || window.innerWidth <= 0 || window.innerHeight <= 0) return
      rawX.set(shapePointer(clampUnit((event.clientX / window.innerWidth) * 2 - 1)))
      rawY.set(shapePointer(clampUnit((event.clientY / window.innerHeight) * 2 - 1)))
      rawPresence.set(1)
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
  }, [enabled, rawPresence, rawX, rawY])

  return (
    <motion.div
      className="h2o-spatial-aura"
      style={{ x: auraX, y: auraY, opacity: auraOpacity }}
      aria-hidden="true"
    />
  )
}
