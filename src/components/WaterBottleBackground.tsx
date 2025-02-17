"use client"

import type React from "react"
import { useEffect, useRef } from "react"

const WaterBottleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const bottles: { x: number; y: number; size: number; speed: number }[] = []

    for (let i = 0; i < 20; i++) {
      bottles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 30 + 20,
        speed: Math.random() * 2 + 1,
      })
    }

    const drawBottle = (x: number, y: number, size: number) => {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x - size / 4, y + size / 2)
      ctx.lineTo(x - size / 4, y + size)
      ctx.lineTo(x + size / 4, y + size)
      ctx.lineTo(x + size / 4, y + size / 2)
      ctx.closePath()
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
      ctx.fill()
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
      ctx.stroke()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      bottles.forEach((bottle) => {
        drawBottle(bottle.x, bottle.y, bottle.size)
        bottle.y += bottle.speed

        if (bottle.y > canvas.height + bottle.size) {
          bottle.y = -bottle.size
          bottle.x = Math.random() * canvas.width
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0" />
}

export default WaterBottleBackground

