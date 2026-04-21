'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  QrCode,
  X,
  Download,
  Phone,
  Mail,
  MapPin,
  Star,
  Globe,
  Share2,
  Check,
  Copy,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type QRTab = 'site' | 'maps' | 'reviews' | 'vcard'

const TABS: Array<{
  id: QRTab
  label: string
  icon: React.ComponentType<{ className?: string }>
  src: string
  deepLink: string
  caption: string
  accent: string
}> = [
  {
    id: 'site',
    label: 'Site',
    icon: Globe,
    src: '/qr/site.svg',
    deepLink: 'https://nexus-seo.app',
    caption: 'Ouvrir le site Nexus SEO',
    accent: 'from-brand-500 to-cyan-500',
  },
  {
    id: 'maps',
    label: 'Maps',
    icon: MapPin,
    src: '/qr/maps.svg',
    deepLink: 'https://maps.google.com/?q=6+rue+Pierre+Termier+69009+Lyon',
    caption: 'Itinéraire vers nos bureaux',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'reviews',
    label: 'Avis',
    icon: Star,
    src: '/qr/reviews.svg',
    deepLink:
      'https://www.google.com/search?q=Kayzen+Lyon+6+rue+Pierre+Termier+avis&hl=fr',
    caption: 'Consulter ou laisser un avis Google',
    accent: 'from-amber-500 to-orange-500',
  },
  {
    id: 'vcard',
    label: 'Contact',
    icon: Download,
    src: '/qr/vcard.svg',
    deepLink: '/kayzen-lyon.vcf',
    caption: 'Ajouter à vos contacts (vCard)',
    accent: 'from-violet-500 to-fuchsia-500',
  },
]

export default function DigitalContactCard() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<QRTab>('site')
  const [copied, setCopied] = useState<string | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open && triggerRef.current) triggerRef.current.focus()
    if (open && dialogRef.current) {
      const focusable = dialogRef.current.querySelector<HTMLElement>(
        'button, a[href], [tabindex]:not([tabindex="-1"])'
      )
      focusable?.focus()
    }
  }, [open])

  const active = TABS.find((t) => t.id === tab)!

  async function copyToClipboard(value: string, id: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(id)
      setTimeout(() => setCopied(null), 1800)
    } catch {
      /* noop */
    }
  }

  async function handleShare() {
    const shareData = {
      title: 'Kayzen Lyon — Nexus SEO',
      text: 'Agence SEO · GEO · AEO · LLMO — +33 4 87 77 68 61',
      url: 'https://nexus-seo.app',
    }
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share(shareData)
        return
      } catch {
        /* user cancelled */
      }
    }
    copyToClipboard(shareData.url, 'share')
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir la carte de contact numérique"
        className="relative p-2 rounded-xl text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 group"
      >
        <QrCode
          className="w-4.5 h-4.5 transition-transform group-hover:rotate-6"
          style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.08))' }}
        />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-gradient-to-br from-brand-500 to-violet-500 animate-pulse" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="digital-contact-title"
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false)
          }}
        >
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/60 to-black/70 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Dialog */}
          <div
            ref={dialogRef}
            className="relative w-full max-w-md bg-white dark:bg-surface-900 rounded-3xl shadow-2xl shadow-brand-900/30 dark:shadow-black/60 ring-1 ring-surface-200/80 dark:ring-surface-800 overflow-hidden animate-scale-in"
          >
            {/* Header strip with accent gradient */}
            <div
              className={cn(
                'relative h-24 bg-gradient-to-br flex items-end p-5 overflow-hidden',
                active.accent
              )}
            >
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 20% 120%, rgba(255,255,255,0.45) 0%, transparent 55%), radial-gradient(circle at 80% -20%, rgba(255,255,255,0.35) 0%, transparent 50%)',
                }}
                aria-hidden="true"
              />
              <div className="relative flex items-end justify-between w-full">
                <div>
                  <p className="text-white/80 text-[10px] font-semibold tracking-[0.2em] uppercase">
                    Carte numérique
                  </p>
                  <h2
                    id="digital-contact-title"
                    className="text-white font-heading font-black text-xl leading-tight"
                  >
                    Kayzen Lyon
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Fermer"
                  className="text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div
              role="tablist"
              aria-label="Choix du QR code"
              className="flex border-b border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-950/50"
            >
              {TABS.map((t) => {
                const Icon = t.icon
                const isActive = t.id === tab
                return (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`qr-panel-${t.id}`}
                    id={`qr-tab-${t.id}`}
                    onClick={() => setTab(t.id)}
                    className={cn(
                      'flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-all relative',
                      isActive
                        ? 'text-surface-900 dark:text-white'
                        : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {t.label}
                    {isActive && (
                      <span
                        className={cn(
                          'absolute bottom-0 inset-x-3 h-[2px] rounded-full bg-gradient-to-r',
                          t.accent
                        )}
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {/* QR display */}
            <div
              role="tabpanel"
              id={`qr-panel-${active.id}`}
              aria-labelledby={`qr-tab-${active.id}`}
              className="p-6"
            >
              <div className="relative mx-auto mb-4 w-56 h-56 flex items-center justify-center rounded-2xl bg-white ring-1 ring-surface-200 shadow-lg shadow-surface-900/5 p-3">
                <div
                  className="absolute -inset-1 rounded-3xl opacity-40 blur-xl pointer-events-none"
                  style={{
                    background:
                      'conic-gradient(from 0deg, rgba(59,130,246,0.4), rgba(139,92,246,0.3), rgba(236,72,153,0.3), rgba(59,130,246,0.4))',
                  }}
                  aria-hidden="true"
                />
                <Image
                  key={active.id}
                  src={active.src}
                  alt={`QR code — ${active.caption}`}
                  width={224}
                  height={224}
                  priority
                  className="relative w-full h-full animate-fade-in"
                />
              </div>

              <p className="text-center text-sm font-medium text-surface-700 dark:text-surface-200 mb-1">
                {active.caption}
              </p>
              <p className="text-center text-xs text-surface-400 dark:text-surface-500 mb-5 truncate px-4">
                {active.deepLink.replace(/^https?:\/\//, '')}
              </p>

              {/* Primary actions */}
              <div className="flex gap-2">
                <a
                  href={active.deepLink}
                  target={active.id === 'vcard' ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  download={active.id === 'vcard' ? 'kayzen-lyon.vcf' : undefined}
                  className={cn(
                    'flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all active:scale-[0.98] bg-gradient-to-br',
                    active.accent
                  )}
                >
                  {active.id === 'vcard' ? (
                    <>
                      <Download className="w-4 h-4" /> Télécharger vCard
                    </>
                  ) : (
                    <>
                      Ouvrir
                    </>
                  )}
                </a>
                <button
                  type="button"
                  onClick={() => copyToClipboard(active.deepLink, active.id)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-surface-700 dark:text-surface-200 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all"
                  aria-label="Copier le lien"
                >
                  {copied === active.id ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-surface-700 dark:text-surface-200 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all"
                  aria-label="Partager"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick contact row */}
            <div className="border-t border-surface-200 dark:border-surface-800 bg-surface-50/70 dark:bg-surface-950/50 px-5 py-4 grid grid-cols-3 gap-2">
              <a
                href="tel:+33487776861"
                className="group flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-white dark:hover:bg-surface-900 transition-all"
                aria-label="Appeler Kayzen Lyon"
              >
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Phone className="w-4 h-4 text-white" />
                </span>
                <span className="text-[10px] font-semibold text-surface-600 dark:text-surface-300">
                  Appeler
                </span>
              </a>
              <a
                href="mailto:contact@kayzen-lyon.fr"
                className="group flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-white dark:hover:bg-surface-900 transition-all"
                aria-label="Envoyer un email"
              >
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Mail className="w-4 h-4 text-white" />
                </span>
                <span className="text-[10px] font-semibold text-surface-600 dark:text-surface-300">
                  Écrire
                </span>
              </a>
              <a
                href="https://maps.google.com/?q=6+rue+Pierre+Termier+69009+Lyon"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-white dark:hover:bg-surface-900 transition-all"
                aria-label="Itinéraire"
              >
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <MapPin className="w-4 h-4 text-white" />
                </span>
                <span className="text-[10px] font-semibold text-surface-600 dark:text-surface-300">
                  Itinéraire
                </span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
