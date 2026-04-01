'use client'

import { useState } from 'react'
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
  Copy,
  Eye,
  EyeOff,
} from 'lucide-react'

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: 'Tarek Belkebli',
    email: 'tarek@nexus.io',
    company: 'Nexus Digital',
    phone: '+33 6 12 34 56 78',
  })

  const [theme, setTheme] = useState('dark')
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    weeklyReports: true,
    newFeatures: true,
    productUpdates: false,
  })

  const [apiKeys, setApiKeys] = useState([
    {
      id: '1',
      name: 'Production API Key',
      key: 'nex_prod_xxxxxxxxxxxxxxxxx',
      created: '15 Jan 2026',
      lastUsed: '31 Mar 2026',
    },
    {
      id: '2',
      name: 'Development API Key',
      key: 'nex_dev_yyyyyyyyyyyyyyyy',
      created: '10 Mar 2026',
      lastUsed: '30 Mar 2026',
    },
  ])

  const [showApiKey, setShowApiKey] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleProfileChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (key: string) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof notifications] }))
  }

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Parametres</h1>
        <p className="text-surface-400 mt-1">Gerez vos parametres et preferences</p>
      </div>

      {/* Profile Section */}
      <div className="rounded-lg border border-surface-800 bg-surface-900 p-6">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
          <User className="h-5 w-5" />
          Profil
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                className="w-full rounded-lg bg-surface-800 border border-surface-700 px-4 py-2 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                className="w-full rounded-lg bg-surface-800 border border-surface-700 px-4 py-2 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Entreprise</label>
              <input
                type="text"
                value={profile.company}
                onChange={(e) => handleProfileChange('company', e.target.value)}
                className="w-full rounded-lg bg-surface-800 border border-surface-700 px-4 py-2 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Telephone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                className="w-full rounded-lg bg-surface-800 border border-surface-700 px-4 py-2 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 text-surface-900 font-medium hover:bg-cyan-400 transition-colors">
            <Save className="h-4 w-4" />
            Enregistrer les modifications
          </button>
        </div>
      </div>

      {/* Theme Section */}
      <div className="rounded-lg border border-surface-800 bg-surface-900 p-6">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Sun className="h-5 w-5" />
          Theme
        </h2>

        <div className="space-y-3">
          <button
            onClick={() => setTheme('light')}
            className={cn(
              'w-full text-left px-4 py-3 rounded-lg border-2 transition-all',
              theme === 'light'
                ? 'border-cyan-500 bg-cyan-500/10'
                : 'border-surface-700 hover:border-surface-600'
            )}
          >
            <div className="flex items-center gap-3">
              <Sun className="h-5 w-5" />
              <div>
                <p className="font-medium">Mode clair</p>
                <p className="text-xs text-surface-400">Interface en couleurs claires</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={cn(
              'w-full text-left px-4 py-3 rounded-lg border-2 transition-all',
              theme === 'dark'
                ? 'border-cyan-500 bg-cyan-500/10'
                : 'border-surface-700 hover:border-surface-600'
            )}
          >
            <div className="flex items-center gap-3">
              <Moon className="h-5 w-5" />
              <div>
                <p className="font-medium">Mode sombre</p>
                <p className="text-xs text-surface-400">Interface en couleurs sombres</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={cn(
              'w-full text-left px-4 py-3 rounded-lg border-2 transition-all',
              theme === 'system'
                ? 'border-cyan-500 bg-cyan-500/10'
                : 'border-surface-700 hover:border-surface-600'
            )}
          >
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5" />
              <div>
                <p className="font-medium">Automatique</p>
                <p className="text-xs text-surface-400">
                  Suit les preferences du systeme
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="rounded-lg border border-surface-800 bg-surface-900 p-6">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </h2>

        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">
                  {key === 'emailAlerts'
                    ? 'Alertes par email'
                    : key === 'weeklyReports'
                      ? 'Rapports hebdomadaires'
                      : key === 'newFeatures'
                        ? 'Nouvelles fonctionnalites'
                        : 'Mises a jour produit'}
                </p>
                <p className="text-xs text-surface-400 mt-1">
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
                  value ? 'bg-cyan-500' : 'bg-surface-700'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-6 w-6 transform rounded-full bg-white transition-transform',
                    value ? 'translate-x-7' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* API Keys Section */}
      <div className="rounded-lg border border-surface-800 bg-surface-900 p-6">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Key className="h-5 w-5" />
          Cles API
        </h2>

        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div
              key={apiKey.id}
              className="rounded-lg border border-surface-800 bg-surface-800/50 p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium">{apiKey.name}</p>
                  <p className="text-xs text-surface-500 mt-1">
                    Creee le {apiKey.created}
                  </p>
                </div>
                <button className="px-3 py-1 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                  Supprimer
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 rounded bg-surface-900 px-3 py-2">
                  <p className="text-sm font-mono text-surface-400">
                    {showApiKey === apiKey.id
                      ? apiKey.key
                      : apiKey.key.replace(/x/g, '•')}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setShowApiKey(
                      showApiKey === apiKey.id ? null : apiKey.id
                    )
                  }
                  className="p-2 rounded-lg hover:bg-surface-700 transition-colors"
                >
                  {showApiKey === apiKey.id ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => copyToClipboard(apiKey.key)}
                  className="p-2 rounded-lg hover:bg-surface-700 transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs text-surface-500 mt-2">
                Derniere utilisation: {apiKey.lastUsed}
              </p>
            </div>
          ))}

          <button className="w-full px-4 py-2 rounded-lg border border-surface-700 bg-surface-800 hover:bg-surface-700 font-medium transition-colors">
            Generer une nouvelle cle
          </button>
        </div>
      </div>

      {/* Plan Section */}
      <div className="rounded-lg border border-surface-800 bg-surface-900 p-6">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Plan et facturation
        </h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-cyan-400">Plan Pro</p>
                <p className="text-sm text-surface-400 mt-1">
                  Deuxieme renouvellement le 15 Avril 2026
                </p>
              </div>
              <span className="px-3 py-1 rounded text-sm font-medium bg-cyan-500/20 text-cyan-400">
                149 €/mois
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-surface-400">Sites/projets</p>
              <p className="font-medium mt-1">5 utilises / 10</p>
            </div>
            <div>
              <p className="text-surface-400">Mots-cles</p>
              <p className="font-medium mt-1">1,247 / 5,000</p>
            </div>
            <div>
              <p className="text-surface-400">Audits/mois</p>
              <p className="font-medium mt-1">8 / 50</p>
            </div>
            <div>
              <p className="text-surface-400">Utilisateurs</p>
              <p className="font-medium mt-1">2 / 5</p>
            </div>
          </div>

          <button className="w-full px-4 py-2 rounded-lg border border-surface-700 bg-surface-800 hover:bg-surface-700 font-medium transition-colors">
            Gerer mon abonnement
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
        <h2 className="text-lg font-bold mb-4 text-red-500">Zone de danger</h2>
        <p className="text-sm text-surface-400 mb-4">
          Ces actions sont irreversibles. Soyez prudent.
        </p>
        <button className="px-4 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 font-medium transition-colors">
          Supprimer mon compte
        </button>
      </div>
    </div>
  )
}
