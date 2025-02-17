"use client"

import type React from "react"
import { useEffect, useRef } from "react"

const RippleEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const ripples: { x: number; y: number; radius: number; alpha: number }[] = []

    const createRipple = (x: number, y: number) => {
      ripples.push({ x, y, radius: 0, alpha: 1 })
    }

    const drawRipples = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ripples.forEach((ripple, index) => {
        ctx.beginPath()
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, 2 * Math.PI)
        ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.alpha})`
        ctx.stroke()

        ripple.radius += 2
        ripple.alpha -= 0.02

        if (ripple.alpha <= 0) {
          ripples.splice(index, 1)
        }
      })

      requestAnimationFrame(drawRipples)
    }

    canvas.addEventListener("mousemove", (e) => {
      createRipple(e.clientX, e.clientY)
    })

    drawRipples()

    return () => {
      canvas.removeEventListener("mousemove", createRipple)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
}

export default RippleEffect

