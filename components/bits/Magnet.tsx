'use client'

/**
 * Magnet — l'élément est attiré par le curseur à son approche.
 * Portage de React Bits (Animations/Magnet, MIT + Commons Clause), réglé
 * doux (force 6) pour rester dans la retenue du design, et désactivé quand
 * l'utilisateur réduit les animations ou sur écran tactile.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'

interface MagnetProps {
  children: ReactNode
  padding?: number
  magnetStrength?: number
  className?: string
  disabled?: boolean
}

export function Magnet({ children, padding = 60, magnetStrength = 6, className = '', disabled = false }: MagnetProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (disabled || reduced) return
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return

    const onMove = (event: globalThis.MouseEvent) => {
      const node = ref.current
      if (!node) return
      const { left, top, width, height } = node.getBoundingClientRect()
      const centerX = left + width / 2
      const centerY = top + height / 2
      const distX = Math.abs(centerX - event.clientX)
      const distY = Math.abs(centerY - event.clientY)
      if (distX < width / 2 + padding && distY < height / 2 + padding) {
        setActive(true)
        setOffset({ x: (event.clientX - centerX) / magnetStrength, y: (event.clientY - centerY) / magnetStrength })
      } else if (active) {
        setActive(false)
        setOffset({ x: 0, y: 0 })
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [padding, magnetStrength, disabled, reduced, active])

  return (
    <div ref={ref} className={className} style={{ position: 'relative', display: 'inline-block' }}>
      <div
        style={{
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
          transition: active ? 'transform 0.25s ease-out' : 'transform 0.5s ease-in-out',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  )
}
