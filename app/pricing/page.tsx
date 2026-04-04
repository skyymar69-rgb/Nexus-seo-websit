import { Metadata } from 'next'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import { Pricing } from '@/components/landing/Pricing'
import { Check, X, ArrowRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { Breadcrumb } from '@/components/shared/Breadcrumb'

export const metadata: Metadata = {
  title: 'Tarifs — Nexus SEO',
  description:
    'Decouvrez les tarifs Nexus SEO : plan gratuit, Pro a 49,99 EUR/mois et Expert a 99,99 EUR/mois. Comparez les fonctionnalites et choisissez le plan adapte a vos besoins.',
}

const comparisonFeatures = [
  {
    category: 'Audits & Analyses',
    features: [
      { name: 'Audits SEO', free: '5 / mois', pro: 'Illimites', expert: 'Illimites' },
      { name: 'Mots-cles suivis', free: '10', pro: '100', expert: 'Illimite' },
      { name: 'Sites web', free: '1', pro: '5', expert: 'Illimite' },
      { name: 'Analyse concurrents', free: false, pro: '10', expert: 'Illimite' },
    ],
  },
  {
    category: 'Visibilite IA',
    features: [
      { name: 'Score GEO', free: true, pro: true, expert: true },
      { name: 'Score AEO', free: true, pro: true, expert: true },
      { name: 'Rapports LLMO complets', free: false, pro: true, expert: true },
      { name: 'Monitoring LLMs', free: '2 LLMs', pro: '4 LLMs', expert: '10+ LLMs' },
    ],
  },
  {
    category: 'Export & Integration',
    features: [
      { name: 'Export PDF', free: false, pro: true, expert: true },
      { name: 'Export JSON / Markdown', free: false, pro: false, expert: true },
      { name: 'Acces API', free: false, pro: false, expert: true },
      { name: 'White label', free: false, pro: false, expert: true },
    ],
  },
  {
    category: 'Support & Extras',
    features: [
      { name: 'Chat IA integre', free: true, pro: true, expert: true },
      { name: 'Support email prioritaire', free: false, pro: true, expert: true },
      { name: 'Support dedie', free: false, pro: false, expert: true },
      { name: 'Dashboard personnalise', free: false, pro: false, expert: true },
      { name: 'Acces Agence Kayzen', free: false, pro: false, expert: true },
    ],
  },
]

const faqs = [
  {
    q: 'Le plan gratuit est-il vraiment gratuit ?',
    a: 'Oui, 100 %. Aucune carte bancaire requise. Vous pouvez utiliser Nexus SEO gratuitement avec 5 audits par mois, 10 mots-cles suivis et un acces complet aux scores GEO et AEO.',
  },
  {
    q: 'Puis-je changer de plan a tout moment ?',
    a: 'Absolument. Vous pouvez upgrader ou downgrader a tout moment depuis votre tableau de bord. Le changement prend effet immediatement et le montant est calcule au prorata.',
  },
  {
    q: 'Y a-t-il un essai gratuit pour les plans payants ?',
    a: 'Oui, le plan Pro inclut 14 jours d\'essai gratuit. Vous ne serez facture qu\'a la fin de la periode d\'essai. Annulation en un clic.',
  },
  {
    q: 'Comment fonctionne la facturation annuelle ?',
    a: 'La facturation annuelle vous offre 20 % de reduction. Vous etes facture une fois par an au tarif reduit. Le montant n\'est pas remboursable mais vous pouvez annuler le renouvellement automatique.',
  },
  {
    q: 'Quels moyens de paiement acceptez-vous ?',
    a: 'Nous acceptons les cartes Visa, Mastercard, American Express et les virements SEPA via Stripe. Toutes les transactions sont securisees et conformes PCI DSS.',
  },
  {
    q: 'Puis-je obtenir une facture avec TVA ?',
    a: 'Oui, une facture conforme avec TVA est generee automatiquement pour chaque paiement. Vous pouvez la telecharger depuis votre espace de facturation.',
  },
  {
    q: 'Que se passe-t-il si j\'annule mon abonnement ?',
    a: 'Vous conservez l\'acces a toutes les fonctionnalites jusqu\'a la fin de votre periode de facturation. Ensuite, votre compte repasse automatiquement au plan gratuit. Aucune donnee n\'est supprimee.',
  },
  {
    q: 'Qu\'est-ce que l\'acces Agence Kayzen ?',
    a: 'Le plan Expert inclut un acces prioritaire aux services de l\'agence web Kayzen Lyon : creation de sites optimises SEO, strategie digitale et accompagnement sur mesure.',
  },
]

function CellValue({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <div className="flex justify-center">
        <div className="w-5 h-5 rounded-full bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center">
          <Check className="w-3 h-3 text-brand-600 dark:text-brand-400" />
        </div>
      </div>
    )
  }
  if (value === false) {
    return (
      <div className="flex justify-center">
        <X className="w-4 h-4 text-surface-300 dark:text-surface-600" />
      </div>
    )
  }
  return <span className="text-sm text-surface-700 dark:text-surface-300 font-medium">{value}</span>
}

export default function PricingPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="bg-white dark:bg-surface-950">
        {/* Hero */}
        <section className="pt-32 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Breadcrumb items={[{ label: 'Accueil', href: '/' }, { label: 'Tarifs' }]} />
            <div className="text-center">
            <div className="section-badge mx-auto mb-4">Tarifs</div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-surface-900 dark:text-white mb-6">
              Le bon plan pour{' '}
              <span className="gradient-text">chaque ambition</span>
            </h1>
            <p className="text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
              Commencez gratuitement, evoluez quand vous etes pret. Tous les plans incluent l&apos;acces aux scores GEO et AEO.
            </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <Pricing />

        {/* Comparison Table */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
                Comparaison detaillee
              </h2>
              <p className="text-surface-500 dark:text-surface-400">
                Toutes les fonctionnalites, plan par plan.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-200 dark:border-surface-800">
                    <th className="text-left py-4 pr-4 text-sm font-medium text-surface-500 dark:text-surface-400 w-1/3">
                      Fonctionnalite
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-bold text-surface-900 dark:text-white">
                      Gratuit
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-bold text-brand-600 dark:text-brand-400">
                      Pro
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-bold text-amber-600 dark:text-amber-400">
                      Expert
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((group) => (
                    <>
                      <tr key={`cat-${group.category}`}>
                        <td
                          colSpan={4}
                          className="pt-8 pb-3 text-xs font-bold uppercase tracking-wider text-surface-400 dark:text-surface-500"
                        >
                          {group.category}
                        </td>
                      </tr>
                      {group.features.map((feat) => (
                        <tr
                          key={feat.name}
                          className="border-b border-surface-100 dark:border-surface-800/50"
                        >
                          <td className="py-3 pr-4 text-sm text-surface-700 dark:text-surface-300">
                            {feat.name}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <CellValue value={feat.free} />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <CellValue value={feat.pro} />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <CellValue value={feat.expert} />
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Price row below table */}
            <div className="mt-8 grid grid-cols-4 gap-4">
              <div />
              <div className="text-center">
                <p className="text-2xl font-black text-surface-900 dark:text-white">0&euro;</p>
                <p className="text-xs text-surface-400">/mois</p>
                <Link
                  href="/signup"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  Commencer <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-brand-600 dark:text-brand-400">49,99&euro;</p>
                <p className="text-xs text-surface-400">/mois</p>
                <Link
                  href="/signup?plan=pro"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  Essai gratuit <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-amber-600 dark:text-amber-400">99,99&euro;</p>
                <p className="text-xs text-surface-400">/mois</p>
                <a
                  href="https://internet.kayzen-lyon.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  Agence Kayzen <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface-50 dark:bg-surface-900/50 border-t border-surface-200 dark:border-surface-800">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
                Questions frequentes
              </h2>
              <p className="text-surface-500 dark:text-surface-400">
                Tout ce que vous devez savoir sur nos tarifs.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group card rounded-2xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between cursor-pointer px-6 py-5 text-left text-surface-900 dark:text-white font-semibold text-sm hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors list-none [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span className="ml-4 text-surface-400 group-open:rotate-45 transition-transform text-xl leading-none flex-shrink-0">
                      +
                    </span>
                  </summary>
                  <div className="px-6 pb-5 text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-surface-200 dark:border-surface-800">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-4">
              Pret a booster votre visibilite IA ?
            </h2>
            <p className="text-surface-500 dark:text-surface-400 mb-6">
              Commencez avec le plan gratuit. Aucune carte bancaire requise.
            </p>
            <Link
              href="/signup"
              className="btn-primary px-8 py-3 rounded-xl inline-flex items-center gap-2"
            >
              Demarrer gratuitement
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
