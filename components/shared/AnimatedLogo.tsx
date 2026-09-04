import { cn } from '@/lib/utils'

interface AnimatedLogoProps {
  size?: number
  className?: string
  lightText?: boolean
}

/**
 * Logo Nexus — statique et rendu côté serveur (design Kayzen Web).
 * L'ancienne version tapait le nom lettre par lettre côté client : du
 * décalage de mise en page et un logo invisible pour les robots. Le nom du
 * composant est conservé pour ne pas toucher ses appelants.
 */
export function AnimatedLogo({ size = 36, className, lightText = false }: AnimatedLogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span
        aria-hidden="true"
        className="inline-flex shrink-0 items-center justify-center rounded-xl bg-navy-600 text-white font-display font-extrabold shadow-elevation-sm"
        style={{ width: size, height: size, fontSize: size * 0.55 }}
      >
        N
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn('font-display text-lg font-extrabold tracking-tight', lightText ? 'text-white' : 'text-navy-600 dark:text-white')}>
          Nexus SEO
        </span>
        <span className={cn('mt-0.5 text-[10px] font-medium uppercase tracking-widest', lightText ? 'text-white/70' : 'text-ink-muted dark:text-surface-400')}>
          by Kayzen
        </span>
      </span>
    </div>
  )
}
