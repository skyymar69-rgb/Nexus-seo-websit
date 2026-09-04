'use client'

/**
 * ClickSpark — éclats au clic, dessinés sur un canvas superposé.
 * Portage de React Bits (Animations/ClickSpark, MIT + Commons Clause).
 * La boucle de rendu ne tourne que pendant qu'il reste des éclats à dessiner.
 */
import { useCallback, useEffect, useRef, type MouseEvent, type ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'

interface ClickSparkProps {
  children: ReactNode
  sparkColor?: string
  sparkSize?: number
  sparkRadius?: number
  sparkCount?: number
  duration?: number
  className?: string
}

interface Spark {
  x: number
  y: number
  angle: number
  startTime: number
}

export function ClickSpark({
  children,
  sparkColor = '#b74831',
  sparkSize = 10,
  sparkRadius = 18,
  sparkCount = 8,
  duration = 400,
  className = '',
}: ClickSparkProps) {
  const reduced = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sparks = useRef<Spark[]>([])
  const frame = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    if (!canvas || !parent) return
    const resize = () => {
      const { width, height } = parent.getBoundingClientRect()
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }
    }
    const observer = new ResizeObserver(resize)
    observer.observe(parent)
    resize()
    return () => observer.disconnect()
  }, [])

  const draw = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      sparks.current = sparks.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime
        if (elapsed >= duration) return false
        const progress = elapsed / duration
        const eased = progress * (2 - progress)
        const distance = eased * sparkRadius
        const lineLength = sparkSize * (1 - eased)
        ctx.strokeStyle = sparkColor
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(spark.x + distance * Math.cos(spark.angle), spark.y + distance * Math.sin(spark.angle))
        ctx.lineTo(spark.x + (distance + lineLength) * Math.cos(spark.angle), spark.y + (distance + lineLength) * Math.sin(spark.angle))
        ctx.stroke()
        return true
      })
      frame.current = sparks.current.length > 0 ? requestAnimationFrame(draw) : null
    },
    [duration, sparkColor, sparkRadius, sparkSize],
  )

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current)
  }, [])

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const now = performance.now()
    for (let i = 0; i < sparkCount; i++) {
      sparks.current.push({ x: event.clientX - rect.left, y: event.clientY - rect.top, angle: (2 * Math.PI * i) / sparkCount, startTime: now })
    }
    if (frame.current === null) frame.current = requestAnimationFrame(draw)
  }

  return (
    <div className={`relative ${className}`} onClick={onClick}>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />
      {children}
    </div>
  )
}
