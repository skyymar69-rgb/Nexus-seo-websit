'use client'

/**
 * TiltedCard — carte qui s'incline vers le curseur (perspective 3D légère).
 * Portage allégé de React Bits (Components/TiltedCard, MIT + Commons Clause),
 * réglé à 6° maximum pour rester discret, sans effet sur tactile ni en
 * mouvement réduit.
 */
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useRef, type MouseEvent, type ReactNode } from 'react'

interface TiltedCardProps {
  children: ReactNode
  className?: string
  maxTilt?: number
  scaleOnHover?: number
}

export function TiltedCard({ children, className = '', maxTilt = 6, scaleOnHover = 1.02 }: TiltedCardProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const rotateX = useSpring(useMotionValue(0), { damping: 30, stiffness: 120, mass: 1.5 })
  const rotateY = useSpring(useMotionValue(0), { damping: 30, stiffness: 120, mass: 1.5 })
  const scale = useSpring(1, { damping: 30, stiffness: 120 })

  if (reduced) return <div className={className}>{children}</div>

  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const offsetX = event.clientX - rect.left - rect.width / 2
    const offsetY = event.clientY - rect.top - rect.height / 2
    rotateX.set((offsetY / (rect.height / 2)) * -maxTilt)
    rotateY.set((offsetX / (rect.width / 2)) * maxTilt)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, scale, transformStyle: 'preserve-3d', perspective: 800 }}
      onMouseMove={onMouseMove}
      onMouseEnter={() => scale.set(scaleOnHover)}
      onMouseLeave={() => {
        rotateX.set(0)
        rotateY.set(0)
        scale.set(1)
      }}
    >
      {children}
    </motion.div>
  )
}
