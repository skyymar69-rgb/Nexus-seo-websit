'use client'

/**
 * FadeContent — apparition en fondu et léger glissement à l'entrée dans la
 * fenêtre. Équivalent Framer Motion du FadeContent / AnimatedContent de
 * React Bits (écrits pour GSAP). Une seule fois, court, et neutralisé avec
 * prefers-reduced-motion. Le contenu est rendu côté serveur tel quel.
 */
import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface FadeContentProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  distance?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  blur?: boolean
  once?: boolean
}

export function FadeContent({
  children,
  className,
  delay = 0,
  duration = 0.55,
  distance = 20,
  direction = 'up',
  blur = false,
  once = true,
}: FadeContentProps) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>

  const offset =
    direction === 'up' ? { y: distance } : direction === 'down' ? { y: -distance } : direction === 'left' ? { x: distance } : direction === 'right' ? { x: -distance } : {}

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, filter: blur ? 'blur(8px)' : 'blur(0px)', ...offset }}
      whileInView={{ opacity: 1, filter: 'blur(0px)', x: 0, y: 0 }}
      viewport={{ once, margin: '0px 0px -10% 0px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
