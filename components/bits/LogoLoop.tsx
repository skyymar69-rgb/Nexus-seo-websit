'use client'

/**
 * LogoLoop — défilement continu d'une liste de logos ou de noms, avec
 * ralenti au survol et fondu sur les bords.
 * Portage allégé de React Bits (Animations/LogoLoop, MIT + Commons Clause) :
 * boucle requestAnimationFrame lissée, copies calculées selon la largeur,
 * immobile quand l'utilisateur réduit les animations.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type LogoItem = { node: ReactNode; href?: string; title?: string }

interface LogoLoopProps {
  logos: LogoItem[]
  speed?: number
  gap?: number
  pauseOnHover?: boolean
  fadeOut?: boolean
  fadeOutColor?: string
  className?: string
  ariaLabel?: string
}

export function LogoLoop({
  logos,
  speed = 60,
  gap = 48,
  pauseOnHover = true,
  fadeOut = true,
  fadeOutColor = '#ffffff',
  className,
  ariaLabel = 'Logos partenaires',
}: LogoLoopProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const seqRef = useRef<HTMLUListElement>(null)
  const [seqWidth, setSeqWidth] = useState(0)
  const [copies, setCopies] = useState(2)
  const [hovered, setHovered] = useState(false)

  const measure = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0
    const width = seqRef.current?.getBoundingClientRect().width ?? 0
    if (width > 0) {
      setSeqWidth(Math.ceil(width))
      setCopies(Math.max(2, Math.ceil(containerWidth / width) + 2))
    }
  }, [])

  useEffect(() => {
    const observer = new ResizeObserver(measure)
    if (containerRef.current) observer.observe(containerRef.current)
    if (seqRef.current) observer.observe(seqRef.current)
    measure()
    return () => observer.disconnect()
  }, [measure, logos, gap])

  useEffect(() => {
    const track = trackRef.current
    if (!track || seqWidth === 0) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let last: number | null = null
    let offset = 0
    let velocity = 0
    const tick = (now: number) => {
      if (last === null) last = now
      const dt = Math.max(0, now - last) / 1000
      last = now
      const target = hovered && pauseOnHover ? 0 : speed
      velocity += (target - velocity) * (1 - Math.exp(-dt / 0.25))
      offset = (((offset + velocity * dt) % seqWidth) + seqWidth) % seqWidth
      track.style.transform = `translate3d(${-offset}px, 0, 0)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seqWidth, speed, hovered, pauseOnHover])

  const lists = useMemo(
    () =>
      Array.from({ length: copies }, (_, copy) => (
        <ul key={copy} role="list" aria-hidden={copy > 0} ref={copy === 0 ? seqRef : undefined} className="flex items-center">
          {logos.map((item, index) => (
            <li key={`${copy}-${index}`} className="flex-none" style={{ marginRight: gap }}>
              {item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" title={item.title} className="inline-flex items-center rounded transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
                  {item.node}
                </a>
              ) : (
                <span className="inline-flex items-center">{item.node}</span>
              )}
            </li>
          ))}
        </ul>
      )),
    [copies, logos, gap],
  )

  return (
    <div ref={containerRef} role="region" aria-label={ariaLabel} className={cn('relative overflow-x-hidden', className)}>
      {fadeOut && (
        <>
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[clamp(24px,8%,120px)]" style={{ background: `linear-gradient(to right, ${fadeOutColor} 0%, rgba(255,255,255,0) 100%)` }} />
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[clamp(24px,8%,120px)]" style={{ background: `linear-gradient(to left, ${fadeOutColor} 0%, rgba(255,255,255,0) 100%)` }} />
        </>
      )}
      <div ref={trackRef} className="relative z-0 flex w-max select-none will-change-transform motion-reduce:transform-none" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        {lists}
      </div>
    </div>
  )
}
