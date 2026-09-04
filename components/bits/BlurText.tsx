'use client'

/**
 * BlurText — apparition mot à mot, du flou au net.
 * Portage de React Bits (TextAnimations/BlurText, MIT + Commons Clause),
 * adapté à Framer Motion et au respect de prefers-reduced-motion.
 *
 * À réserver aux titres sous la ligne de flottaison : un élément LCP animé
 * depuis l'opacité 0 retarde la métrique.
 */
import { motion, useReducedMotion, type Transition } from 'framer-motion'
import { useEffect, useMemo, useRef, useState, type ElementType } from 'react'

type BlurTextProps = {
  text: string
  delay?: number
  className?: string
  animateBy?: 'words' | 'letters'
  direction?: 'top' | 'bottom'
  threshold?: number
  rootMargin?: string
  stepDuration?: number
  as?: ElementType
  id?: string
  onAnimationComplete?: () => void
}

export function BlurText({
  text,
  delay = 80,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  stepDuration = 0.3,
  as: Tag = 'p',
  id,
  onAnimationComplete,
}: BlurTextProps) {
  const reduced = useReducedMotion()
  const elements = animateBy === 'words' ? text.split(' ') : text.split('')
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  const from = useMemo(
    () => ({ filter: 'blur(10px)', opacity: 0, y: direction === 'top' ? -24 : 24 }),
    [direction],
  )
  const keyframes = useMemo(
    () => ({
      filter: ['blur(10px)', 'blur(4px)', 'blur(0px)'],
      opacity: [0, 0.6, 1],
      y: [direction === 'top' ? -24 : 24, direction === 'top' ? 4 : -4, 0],
    }),
    [direction],
  )

  if (reduced) {
    return <Tag id={id} className={className}>{text}</Tag>
  }

  const MotionTag = motion.create(Tag as 'p')

  return (
    <MotionTag id={id} ref={ref as never} className={`${className} flex flex-wrap`} aria-label={text}>
      {elements.map((segment, index) => {
        const transition: Transition = {
          duration: stepDuration * 2,
          times: [0, 0.5, 1],
          delay: (index * delay) / 1000,
          ease: 'easeOut',
        }
        return (
          <motion.span
            key={index}
            aria-hidden="true"
            initial={from}
            animate={inView ? keyframes : from}
            transition={transition}
            onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
            style={{ display: 'inline-block', willChange: 'transform, filter, opacity' }}
          >
            {segment === ' ' ? ' ' : segment}
            {animateBy === 'words' && index < elements.length - 1 && ' '}
          </motion.span>
        )
      })}
    </MotionTag>
  )
}
