'use client'

import { useState } from 'react'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import { Mail, Phone, MapPin, ArrowRight, Check } from 'lucide-react'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '', subject: 'demo' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Simulate send
    await new Promise((r) => setTimeout(r, 800))
    setSent(true)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-surface-950">
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">

            <div className="text-center mb-16">
              <div className="section-badge mx-auto mb-4">Contact</div>
              <h1 className="text-4xl sm:text-5xl font-black text-surface-900 dark:text-white mb-4">
                Parlons de votre{' '}
                <span className="gradient-text">visibilité IA</span>
              </h1>
              <p className="text-lg text-surface-500 dark:text-surface-400">
                Notre équipe répond sous 24h · Démo personnalisée disponible
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Info */}
              <div className="lg:col-span-2 space-y-6">
                {[
                  { icon: Mail, label: 'Email', value: 'hello@nexus-seo.fr', href: 'mailto:hello@nexus-seo.fr' },
                  { icon: Phone, label: 'Téléphone', value: '+33 1 23 45 67 89', href: 'tel:+33123456789' },
                  { icon: MapPin, label: 'Adresse', value: '15 rue de la Paix, 75001 Paris', href: '#' },
                ].map(({ icon: Icon, label, value, href }) => (
                  <a key={label} href={href} className="flex items-start gap-4 card p-5 hover:ring-1 hover:ring-brand-500/30 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-0.5">{label}</p>
                      <p className="text-sm font-medium text-surface-900 dark:text-white">{value}</p>
                    </div>
                  </a>
                ))}

                <div className="card p-5">
                  <p className="text-sm font-semibold text-surface-900 dark:text-white mb-3">Temps de réponse moyen</p>
                  <div className="space-y-2">
                    {[
                      { type: 'Email', time: '< 4h', color: 'bg-brand-500' },
                      { type: 'Démo', time: 'Même jour', color: 'bg-accent-500' },
                      { type: 'Support', time: '< 2h (pro+)', color: 'bg-violet-500' },
                    ].map((r) => (
                      <div key={r.type} className="flex items-center justify-between text-xs">
                        <span className="text-surface-500 dark:text-surface-400">{r.type}</span>
                        <span className={`px-2 py-0.5 rounded-full font-semibold text-white ${r.color}`}>{r.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-3">
                {sent ? (
                  <div className="card p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center mx-auto mb-5">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-surface-900 dark:text-white mb-3">Message envoyé !</h3>
                    <p className="text-surface-500 dark:text-surface-400">Notre équipe vous répondra dans les 4 heures.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="card p-8 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wide mb-2">Nom *</label>
                        <input
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Jean Dupont"
                          className="w-full px-4 py-2.5 rounded-xl text-sm bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wide mb-2">Email *</label>
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="jean@entreprise.fr"
                          className="w-full px-4 py-2.5 rounded-xl text-sm bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wide mb-2">Entreprise</label>
                      <input
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        placeholder="Ma Société"
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wide mb-2">Sujet</label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                      >
                        <option value="demo">Demander une démo</option>
                        <option value="sales">Question commerciale</option>
                        <option value="support">Support technique</option>
                        <option value="partnership">Partenariat</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wide mb-2">Message *</label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Décrivez votre projet, vos besoins..."
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none"
                      />
                    </div>

                    <button type="submit" className="btn-primary w-full py-3 rounded-xl text-sm font-semibold">
                      Envoyer le message
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-surface-400 text-center">
                      En soumettant ce formulaire, vous acceptez notre politique de confidentialité.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
