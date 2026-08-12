import { lazy, Suspense, useEffect, useState, type MutableRefObject } from 'react'
import { webglMotionBudget } from '@/motion/tokens'

interface LiquidCurrentCanvasProps {
  progressRef: MutableRefObject<number>
  activeIndexRef: MutableRefObject<number>
  activityRef: MutableRefObject<number>
  palette: string[]
}

type IdleWindow = {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
  cancelIdleCallback?: (handle: number) => void
}

const LazyLiquidCurrentScene = lazy(() => import('./LiquidCurrentScene'))

export function LiquidCurrentCanvas(props: LiquidCurrentCanvasProps) {
  const [enabled, setEnabled] = useState(false)
  const [ready, setReady] = useState(false)
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarsePointer = window.matchMedia('(pointer: coarse)')
    const update = () => {
      const constrainedDevice =
        typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 2
      setCompact(coarsePointer.matches || window.innerWidth < 900)
      setEnabled(!media.matches && !constrainedDevice)
    }

    update()
    media.addEventListener?.('change', update)
    coarsePointer.addEventListener?.('change', update)
    window.addEventListener('resize', update, { passive: true })
    return () => {
      media.removeEventListener?.('change', update)
      coarsePointer.removeEventListener?.('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      setReady(false)
      return undefined
    }

    const idleWindow = window as Window & IdleWindow
    let idleHandle = 0
    let timeoutHandle = 0
    const reveal = () => setReady(true)

    if (idleWindow.requestIdleCallback) {
      idleHandle = idleWindow.requestIdleCallback(reveal, {
        timeout: webglMotionBudget.idleLoadTimeoutMs,
      })
    } else {
      timeoutHandle = window.setTimeout(reveal, webglMotionBudget.fallbackLoadDelayMs)
    }

    return () => {
      if (idleHandle && idleWindow.cancelIdleCallback) idleWindow.cancelIdleCallback(idleHandle)
      if (timeoutHandle) window.clearTimeout(timeoutHandle)
    }
  }, [enabled])

  if (!enabled || !ready) {
    return <div className="h2o-current-fallback" aria-hidden="true" />
  }

  return (
    <Suspense fallback={<div className="h2o-current-fallback" aria-hidden="true" />}>
      <LazyLiquidCurrentScene {...props} compact={compact} />
    </Suspense>
  )
}
