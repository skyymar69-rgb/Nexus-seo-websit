'use client'

import { useState } from 'react'
import { cn, getScoreColor } from '@/lib/utils'
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  TrendingUp,
} from 'lucide-react'

const recommendations = [
  {
    id: '1',
    type: 'high',
    icon: AlertCircle,
    title: 'Optimisez la structure des titres',
    description: 'H1 et H2 ne sont pas assez descriptifs. Incluez des mots-cles principaux.',
  },
  {
    id: '2',
    type: 'high',
    icon: AlertCircle,
    title: 'Ameliorez la readabilite',
    description:
      'Votre score de lisibilite est de 42/100. Utilisez des phrases plus courtes.',
  },
  {
    id: '3',
    type: 'medium',
    icon: Lightbulb,
    title: 'Ajoutez des liens internes',
    description: 'Ajouter 3-5 liens internes pertinents ameliorera votre SEO.',
  },
  {
    id: '4',
    type: 'medium',
    icon: Lightbulb,
    title: 'Optimisez la meta description',
    description: 'Utilisez 155-160 caracteres et incluez votre mot-cle principal.',
  },
  {
    id: '5',
    type: 'low',
    icon: CheckCircle,
    title: 'Contenu original',
    description: 'Excellent - 0% de contenu duplique detecte.',
  },
  {
    id: '6',
    type: 'low',
    icon: CheckCircle,
    title: 'Longueur du contenu',
    description: '2,450 mots - ideal pour votre mot-cle cible.',
  },
]

export default function ContentOptimizerPage() {
  const [inputType, setInputType] = useState<'url' | 'text'>('url')
  const [urlInput, setUrlInput] = useState('')
  const [textInput, setTextInput] = useState('')
  const [analyzed, setAnalyzed] = useState(false)

  const handleAnalyze = () => {
    if ((inputType === 'url' && urlInput) || (inputType === 'text' && textInput)) {
      setAnalyzed(true)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Optimisation de Contenu</h1>
        <p className="text-surface-400 mt-1">
          Analysez et optimisez le contenu de vos pages
        </p>
      </div>

      {/* Input Section */}
      <div className="rounded-lg border border-surface-800 bg-surface-900 p-6">
        <div className="mb-6">
          <p className="text-sm font-medium mb-4">Choisissez comment analyser</p>
          <div className="flex gap-4">
            <button
              onClick={() => setInputType('url')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
                inputType === 'url'
                  ? 'bg-cyan-500 text-surface-900'
                  : 'bg-surface-800 text-surface-400 hover:bg-surface-700'
              )}
            >
              <FileText className="h-4 w-4" />
              Par URL
            </button>
            <button
              onClick={() => setInputType('text')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
                inputType === 'text'
                  ? 'bg-cyan-500 text-surface-900'
                  : 'bg-surface-800 text-surface-400 hover:bg-surface-700'
              )}
            >
              <FileText className="h-4 w-4" />
              Par texte
            </button>
          </div>
        </div>

        {inputType === 'url' ? (
          <div className="space-y-3">
            <label className="block text-sm font-medium">URL de la page</label>
            <div className="flex gap-3">
              <input
                type="url"
                placeholder="https://exemple.com/page"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 rounded-lg bg-surface-800 border border-surface-700 px-4 py-2 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
              <button
                onClick={handleAnalyze}
                disabled={!urlInput}
                className="px-6 py-2 rounded-lg bg-cyan-500 text-surface-900 font-medium hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Analyser
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="block text-sm font-medium">Collez votre contenu</label>
            <textarea
              placeholder="Collez le texte de votre page ici..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              rows={6}
              className="w-full rounded-lg bg-surface-800 border border-surface-700 px-4 py-2 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none"
            />
            <button
              onClick={handleAnalyze}
              disabled={!textInput}
              className="px-6 py-2 rounded-lg bg-cyan-500 text-surface-900 font-medium hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Analyser
            </button>
          </div>
        )}
      </div>

      {analyzed && (
        <>
          {/* Content Score */}
          <div className="rounded-lg border border-surface-800 bg-surface-900 p-6">
            <div className="flex items-start gap-8">
              <div className="flex-shrink-0">
                <div className="relative w-48 h-48">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 200 200"
                  >
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="8"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="8"
                      strokeDasharray={`${(72 / 100) * 565} 565`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-cyan-400">72</p>
                      <p className="text-sm text-surface-400">/100</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-bold mb-6">Resultats de l'analyse</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Readabilite</span>
                      <span className="text-amber-500 font-bold">42/100</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-700 overflow-hidden">
                      <div
                        className="h-full bg-amber-500"
                        style={{ width: '42%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        Optimisation SEO
                      </span>
                      <span className="text-blue-500 font-bold">78/100</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-700 overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '78%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Longueur</span>
                      <span className="text-emerald-500 font-bold">88/100</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-700 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: '88%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Unicite</span>
                      <span className="text-emerald-500 font-bold">95/100</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-700 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: '95%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Recommandations</h2>

            {/* High Priority */}
            {recommendations
              .filter((r) => r.type === 'high')
              .map((rec) => {
                const Icon = rec.icon
                return (
                  <div
                    key={rec.id}
                    className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 hover:bg-red-500/10 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <Icon className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-medium text-red-500">{rec.title}</h3>
                        <p className="text-sm text-surface-400 mt-1">
                          {rec.description}
                        </p>
                      </div>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-400 flex-shrink-0">
                        Priorite haute
                      </span>
                    </div>
                  </div>
                )
              })}

            {/* Medium Priority */}
            {recommendations
              .filter((r) => r.type === 'medium')
              .map((rec) => {
                const Icon = rec.icon
                return (
                  <div
                    key={rec.id}
                    className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 hover:bg-amber-500/10 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <Icon className="h-5 w-5 text-amber-500 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-medium text-amber-500">
                          {rec.title}
                        </h3>
                        <p className="text-sm text-surface-400 mt-1">
                          {rec.description}
                        </p>
                      </div>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-amber-500/20 text-amber-400 flex-shrink-0">
                        Priorite moyenne
                      </span>
                    </div>
                  </div>
                )
              })}

            {/* Low Priority */}
            {recommendations
              .filter((r) => r.type === 'low')
              .map((rec) => {
                const Icon = rec.icon
                return (
                  <div
                    key={rec.id}
                    className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4"
                  >
                    <div className="flex items-start gap-4">
                      <Icon className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-medium text-emerald-500">
                          {rec.title}
                        </h3>
                        <p className="text-sm text-surface-400 mt-1">
                          {rec.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </>
      )}
    </div>
  )
}
