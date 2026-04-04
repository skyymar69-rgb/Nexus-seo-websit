'use client'

import { ShoppingCart, Bell } from 'lucide-react'

export default function LinkBuyingPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white dark:bg-surface-900 border border-gray-200 dark:border-surface-700 rounded-2xl p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-8 h-8 text-brand-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Marketplace de Liens
        </h1>

        <p className="text-gray-500 dark:text-surface-400 mb-8 max-w-md mx-auto leading-relaxed">
          Accédez à une marketplace de liens de qualité pour renforcer votre profil de backlinks.
          Cette fonctionnalité est en cours de développement.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-sm font-medium border border-amber-200 dark:border-amber-800">
          <Bell className="w-4 h-4" />
          Lancement prévu T3 2026
        </div>
      </div>
    </div>
  )
}
