'use client'

/**
 * SpotlightCard — halo qui suit le curseur sur une carte.
 * Portage de React Bits (Components/SpotlightCard, MIT + Commons Clause),
 * réglé pour le design Kayzen : fond blanc, bordure outline-variant, halo
 * terracotta très dilué. Le halo est purement décoratif (pointer-events none).
 */
import { useRef, useState, type ReactNode, type MouseEvent } from 'react'
import { cn } from '@/lib/utils'

interface SpotlightCardProps {
  children: ReactNode
  className?: string
  spotlightColor?: string
  as?: 'div' | 'article' | 'li'
}

export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(183, 72, 49, 0.14)',
  as: Tag = 'div',
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const onMouseMove = (event: MouseEvent<HTMLElement>) => {
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    setPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top })
  }

  return (
    <Tag
      ref={ref as never}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      onFocus={() => setOpacity(1)}
      onBlur={() => setOpacity(0)}
      className={cn(
        'relative overflow-hidden rounded-3xl border border-surface-300 bg-white shadow-elevation-md transition-[box-shadow,background-color] duration-200 ease-out hover:shadow-elevation-lg dark:border-surface-800 dark:bg-surface-900',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out"
        style={{ opacity, background: `radial-gradient(360px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)` }}
      />
      <div className="relative">{children}</div>
    </Tag>
  )
}
