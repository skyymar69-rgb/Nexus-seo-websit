'use client'

/**
 * CountUp — compteur à ressort déclenché à l'entrée dans la fenêtre.
 * Portage de React Bits (TextAnimations/CountUp, MIT + Commons Clause),
 * adapté à Framer Motion, format français, valeur finale rendue côté serveur
 * (le chiffre est lisible sans JavaScript et par les robots).
 */
import { useInView, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useCallback, useEffect, useRef } from 'react'

interface CountUpProps {
  to: number
  from?: number
  delay?: number
  duration?: number
  className?: string
  separator?: string
  suffix?: string
  prefix?: string
  decimals?: number
}

export function CountUp({
  to,
  from = 0,
  delay = 0,
  duration = 1.6,
  className = '',
  separator = ' ',
  suffix = '',
  prefix = '',
  decimals,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  const motionValue = useMotionValue(from)
  const spring = useSpring(motionValue, { damping: 20 + 40 * (1 / duration), stiffness: 100 * (1 / duration) })
  const isInView = useInView(ref, { once: true, margin: '0px' })

  const fractionDigits = decimals ?? Math.max(decimalPlaces(from), decimalPlaces(to))
  const format = useCallback(
    (value: number) => {
      const formatted = new Intl.NumberFormat('fr-FR', {
        useGrouping: !!separator,
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      }).format(value)
      return `${prefix}${separator ? formatted.replace(/ | | /g, separator) : formatted}${suffix}`
    },
    [fractionDigits, separator, prefix, suffix],
  )

  useEffect(() => {
    if (!isInView || reduced) return
    const node = ref.current
    if (node) node.textContent = format(from)
    const timer = setTimeout(() => motionValue.set(to), delay * 1000)
    return () => clearTimeout(timer)
  }, [isInView, reduced, motionValue, from, to, delay, format])

  useEffect(() => {
    if (reduced) return
    return spring.on('change', (latest: number) => {
      if (ref.current) ref.current.textContent = format(latest)
    })
  }, [spring, format, reduced])

  // Rendu initial : la valeur finale, pour le HTML statique et les lecteurs d'écran.
  return (
    <span ref={ref} className={className} aria-label={format(to)}>
      {format(to)}
    </span>
  )
}

function decimalPlaces(value: number): number {
  const text = value.toString()
  if (!text.includes('.')) return 0
  const decimals = text.split('.')[1]
  return parseInt(decimals, 10) !== 0 ? decimals.length : 0
}
