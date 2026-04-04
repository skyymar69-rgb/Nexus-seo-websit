'use client'

import { useState } from 'react'
import { useSession } from '@/hooks/useSession'
import { usePlan } from '@/hooks/usePlan'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import {
  Save,
  Key,
  Bell,
  CreditCard,
  User,
  Sun,
  Moon,
  Zap,
  Loader2,
  Info,
} from 'lucide-react'

const PLAN_LABELS: Record<string, { label: string; price: string }> = {
  free: { label: 'Gratuit', price: '0 €/mois' },
  pro: { label: 'Pro', price: '49,99 €/mois' },
  expert: { label: 'Expert', price: '99,99 €/mois' },
}

export default function SettingsPage() {
  const { user, isLoading: sessionLoading } = useSession()
  const { currentPlan } = usePlan()
  const { theme, setTheme } = useTheme()

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    weeklyReports: true,
    newFeatures: true,
    productUpdates: false,
  })

  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const handleNotificationChange = (key: string) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof notifications] }))
  }

  const handleSave = () => {
    setSaveMessage('Contactez-nous pour modifier votre profil.')
    setTimeout(() => setSaveMessage(null), 4000)
  }

  const planInfo = PLAN_LABELS[currentPlan] || PLAN_LABELS.free

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Parametres</h1>
        <p className="text-gray-500 mt-1">Gerez vos parametres et preferences</p>
      </div>

      {/* Profile Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
          <User className="h-5 w-5" />
          Profil
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Nom</label>
              <input
                type="text"
                value={user?.name || ''}
                readOnly
                className="w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-2 text-gray-700 outline-none cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className="w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-2 text-gray-700 outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {saveMessage && (
            <div className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-700">
              <Info className="h-4 w-4 flex-shrink-0" />
              {saveMessage}
            </div>
          )}

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            Enregistrer les modifications
          </button>
        </div>
      </div>

      {/* Theme Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
          <Sun className="h-5 w-5" />
          Theme
        </h2>

        <div className="space-y-3">
          <button
            onClick={() => setTheme('light')}
            className={cn(
              'w-full text-left px-4 py-3 rounded-lg border-2 transition-all',
              theme === 'light'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <div className="flex items-center gap-3">
              <Sun className="h-5 w-5 text-gray-700" />
              <div>
                <p className="font-medium text-gray-900">Mode clair</p>
                <p className="text-xs text-gray-500">Interface en couleurs claires</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={cn(
              'w-full text-left px-4 py-3 rounded-lg border-2 transition-all',
              theme === 'dark'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <div className="flex items-center gap-3">
              <Moon className="h-5 w-5 text-gray-700" />
              <div>
                <p className="font-medium text-gray-900">Mode sombre</p>
                <p className="text-xs text-gray-500">Interface en couleurs sombres</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={cn(
              'w-full text-left px-4 py-3 rounded-lg border-2 transition-all',
              theme === 'system'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-gray-700" />
              <div>
                <p className="font-medium text-gray-900">Automatique</p>
                <p className="text-xs text-gray-500">
                  Suit les preferences du systeme
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
          <Bell className="h-5 w-5" />
          Notifications
        </h2>

        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-gray-900">
                  {key === 'emailAlerts'
                    ? 'Alertes par email'
                    : key === 'weeklyReports'
                      ? 'Rapports hebdomadaires'
                      : key === 'newFeatures'
                        ? 'Nouvelles fonctionnalites'
                        : 'Mises a jour produit'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {key === 'emailAlerts'
                    ? 'Recevez des alertes importantes par email'
                    : key === 'weeklyReports'
                      ? 'Rapport resume chaque semaine'
                      : key === 'newFeatures'
                        ? 'Soyez informe des nouvelles fonctionnalites'
                        : 'Recevez les informations sur les mises a jour'}
                </p>
              </div>
              <button
                onClick={() => handleNotificationChange(key)}
                className={cn(
                  'relative inline-flex h-8 w-14 items-center rounded-full transition-colors',
                  value ? 'bg-blue-600' : 'bg-gray-300'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow',
                    value ? 'translate-x-7' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* API Keys Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
          <Key className="h-5 w-5" />
          Cle API
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          Utilisez une cle API pour integrer Nexus dans vos outils.
        </p>

        <button
          disabled={currentPlan === 'free'}
          className={cn(
            'w-full px-4 py-3 rounded-lg border font-medium transition-colors',
            currentPlan === 'free'
              ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
              : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
          )}
        >
          {currentPlan === 'free'
            ? 'Passez a un plan superieur pour generer une cle API'
            : 'Generer une cle API'}
        </button>
      </div>

      {/* Plan Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
          <CreditCard className="h-5 w-5" />
          Plan et facturation
        </h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-blue-700">Plan {planInfo.label}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Votre plan actuel
                </p>
              </div>
              <span className="px-3 py-1 rounded text-sm font-medium bg-blue-100 text-blue-700">
                {planInfo.price}
              </span>
            </div>
          </div>

          <button className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 font-medium text-gray-700 transition-colors">
            Gerer mon abonnement
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-bold mb-4 text-red-600">Zone de danger</h2>
        <p className="text-sm text-gray-500 mb-4">
          Ces actions sont irreversibles. Soyez prudent.
        </p>
        <button className="px-4 py-2 rounded-lg border border-red-300 bg-white text-red-600 hover:bg-red-50 font-medium transition-colors">
          Supprimer mon compte
        </button>
      </div>
    </div>
  )
}
