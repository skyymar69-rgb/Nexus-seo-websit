'use client'

/**
 * ShinyText — reflet qui traverse un texte.
 * Portage de React Bits (TextAnimations/ShinyText, MIT + Commons Clause),
 * réécrit en CSS pur : aucune boucle d'animation JavaScript, et
 * prefers-reduced-motion l'arrête via la règle globale.
 */
import type { CSSProperties } from 'react'

interface ShinyTextProps {
  text: string
  className?: string
  color?: string
  shineColor?: string
  speed?: number
  disabled?: boolean
}

export function ShinyText({
  text,
  className = '',
  color = 'currentColor',
  shineColor = 'rgba(255,255,255,0.85)',
  speed = 3,
  disabled = false,
}: ShinyTextProps) {
  const style: CSSProperties = {
    backgroundImage: `linear-gradient(120deg, ${color} 0%, ${color} 40%, ${shineColor} 50%, ${color} 60%, ${color} 100%)`,
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: disabled ? undefined : `bits-shine ${speed}s linear infinite`,
  }
  return (
    <span className={`inline-block ${className}`} style={style}>
      {text}
    </span>
  )
}
