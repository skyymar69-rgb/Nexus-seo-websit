'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useWebsite } from '@/contexts/WebsiteContext'
import { User, Globe, ArrowRight, Check, Loader2, AlertCircle } from 'lucide-react'

type Step = 'profile' | 'website' | 'done'

const DOMAIN_REGEX = /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/

function cleanDomain(input: string): string {
  return input.trim()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '')
    .replace(/^.*@/, '') // Remove email prefix if present
}

function isValidDomain(domain: string): boolean {
  if (!domain) return false
  if (domain.includes('@')) return false
  return DOMAIN_REGEX.test(domain)
}

export default function OnboardingPage() {
  const { data: session, update: updateSession } = useSession()
  const { refreshWebsites } = useWebsite()
  const router = useRouter()

  const [step, setStep] = useState<Step>('profile')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Profile form
  const [name, setName] = useState(session?.user?.name || '')
  const [company, setCompany] = useState('')

  // Website form
  const [domain, setDomain] = useState('')
  const [siteName, setSiteName] = useState('')
  const [domainTouched, setDomainTouched] = useState(false)

  const cleaned = cleanDomain(domain)
  const domainValid = isValidDomain(cleaned)
  const domainHasError = domainTouched && domain.trim().length > 0 && !domainValid

  const handleProfileSubmit = async () => {
    if (!name.trim()) {
      setError('Veuillez renseigner votre nom.')
      return
    }
    setError('')
    setStep('website')
  }

  const handleWebsiteSubmit = async () => {
    setDomainTouched(true)

    if (!domain.trim()) {
      setError('Veuillez renseigner le domaine de votre site.')
      return
    }

    if (domain.includes('@')) {
      setError('Entrez un domaine (ex: monsite.fr), pas une adresse email.')
      return
    }

    if (!domainValid) {
      setError('Format de domaine invalide. Exemple : monsite.fr')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/websites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: cleaned,
          name: siteName || cleaned,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erreur lors de l\'ajout du site')
      }

      await refreshWebsites()
      setStep('done')

      // Redirect to audit with auto-launch after 2s
      setTimeout(() => {
        router.push(`/dashboard/audit?url=${encodeURIComponent('https://' + cleaned)}`)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-surface-950">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(['profile', 'website', 'done'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step === s ? 'bg-brand-600 text-white' :
                (['profile', 'website', 'done'].indexOf(step) > i) ? 'bg-green-500 text-white' :
                'bg-gray-200 dark:bg-surface-700 text-gray-500'
              }`}>
                {(['profile', 'website', 'done'].indexOf(step) > i) ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < 2 && <div className={`w-12 h-0.5 ${(['profile', 'website', 'done'].indexOf(step) > i) ? 'bg-green-500' : 'bg-gray-200 dark:bg-surface-700'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-surface-900 border border-gray-200 dark:border-surface-700 rounded-2xl p-8 shadow-sm">

          {/* Step 1: Profile */}
          {step === 'profile' && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center">
                  <User className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Bienvenue sur Nexus</h1>
                  <p className="text-sm text-gray-500">Commençons par faire connaissance</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-surface-300 mb-1.5">
                    Votre nom *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jean Dupont"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-surface-300 mb-1.5">
                    Entreprise <span className="text-gray-400">(optionnel)</span>
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Mon Entreprise"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  />
                </div>
              </div>

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

              <button
                onClick={handleProfileSubmit}
                className="w-full mt-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                Continuer <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Step 2: Website */}
          {step === 'website' && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-950/30 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Ajoutez votre site</h1>
                  <p className="text-sm text-gray-500">Quel site souhaitez-vous analyser ?</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-surface-300 mb-1.5">
                    Domaine du site *
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={domain}
                      onChange={(e) => { setDomain(e.target.value); setDomainTouched(true) }}
                      onBlur={() => setDomainTouched(true)}
                      placeholder="monsite.fr"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-surface-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                        domainHasError
                          ? 'border-red-400 focus:ring-red-500/50'
                          : domainTouched && domainValid
                          ? 'border-green-400 focus:ring-green-500/50'
                          : 'border-gray-200 dark:border-surface-700 focus:ring-brand-500/50'
                      }`}
                    />
                  </div>
                  {domainHasError ? (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {domain.includes('@')
                        ? 'Entrez un domaine, pas une adresse email. Exemple : monsite.fr'
                        : 'Format invalide. Exemple : monsite.fr ou mon-site.com'}
                    </p>
                  ) : domainTouched && domainValid ? (
                    <p className="mt-1.5 text-xs text-green-600 flex items-center gap-1">
                      <Check className="w-3 h-3" /> {cleaned}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-400">Entrez votre domaine sans https:// — ex: monsite.fr</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-surface-300 mb-1.5">
                    Nom du site <span className="text-gray-400">(optionnel)</span>
                  </label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder="Mon Site"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  />
                </div>
              </div>

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

              <button
                onClick={handleWebsiteSubmit}
                disabled={loading}
                className="w-full mt-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Ajout en cours...</>
                ) : (
                  <>Ajouter et lancer le premier audit <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <button
                onClick={() => { setStep('profile'); setError('') }}
                className="w-full mt-2 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Retour
              </button>
            </>
          )}

          {/* Step 3: Done */}
          {step === 'done' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Tout est pret !</h1>
              <p className="text-gray-500 mb-6">
                Votre site a ete ajoute. Lancement de votre premier audit...
              </p>
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
              </div>
            </div>
          )}
        </div>

        {/* Skip */}
        {step !== 'done' && (
          <p className="text-center mt-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Passer cette etape
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
