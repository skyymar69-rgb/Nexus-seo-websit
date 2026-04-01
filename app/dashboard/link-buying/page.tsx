'use client';

import { useState } from 'react';
import { cn, formatNumber } from '@/lib/utils';
import {
  Search,
  ChevronDown,
  ShoppingCart,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Star,
  Globe,
  Filter,
  X,
} from 'lucide-react';

interface LinkOpportunity {
  id: string;
  name: string;
  url: string;
  da: number;
  dr: number;
  traffic: number;
  price: number;
  niche: string;
  tld: string;
  trustScore: number;
  spamScore: number;
  trustFlow: number;
  citationFlow: number;
}

interface CartItem extends LinkOpportunity {
  addedAt: Date;
}

interface PurchaseHistory {
  id: string;
  date: string;
  site: string;
  da: number;
  status: 'en_cours' | 'publie' | 'rejete';
  linkUrl: string;
}

const mockLinks: LinkOpportunity[] = [
  {
    id: '1',
    name: 'Journal Tech France',
    url: 'journaltechfrance.fr',
    da: 78,
    dr: 72,
    traffic: 15000,
    price: 150,
    niche: 'Tech',
    tld: '.fr',
    trustScore: 92,
    spamScore: 2,
    trustFlow: 45,
    citationFlow: 52,
  },
  {
    id: '2',
    name: 'Finance Insights',
    url: 'financeinsights.fr',
    da: 82,
    dr: 76,
    traffic: 22000,
    price: 200,
    niche: 'Finance',
    tld: '.fr',
    trustScore: 95,
    spamScore: 1,
    trustFlow: 52,
    citationFlow: 58,
  },
  {
    id: '3',
    name: 'Santé Plus',
    url: 'santeplus.com',
    da: 65,
    dr: 58,
    traffic: 8500,
    price: 85,
    niche: 'Santé',
    tld: '.com',
    trustScore: 88,
    spamScore: 3,
    trustFlow: 38,
    citationFlow: 42,
  },
  {
    id: '4',
    name: 'Mode & Style',
    url: 'modestyle.fr',
    da: 71,
    dr: 65,
    traffic: 18000,
    price: 120,
    niche: 'Mode',
    tld: '.fr',
    trustScore: 87,
    spamScore: 4,
    trustFlow: 40,
    citationFlow: 46,
  },
  {
    id: '5',
    name: 'Voyages Explorer',
    url: 'voyagesexplorer.com',
    da: 68,
    dr: 61,
    traffic: 12000,
    price: 95,
    niche: 'Voyages',
    tld: '.com',
    trustScore: 85,
    spamScore: 5,
    trustFlow: 36,
    citationFlow: 41,
  },
  {
    id: '6',
    name: 'Business Daily',
    url: 'businessdaily.fr',
    da: 88,
    dr: 82,
    traffic: 35000,
    price: 280,
    niche: 'Business',
    tld: '.fr',
    trustScore: 96,
    spamScore: 1,
    trustFlow: 58,
    citationFlow: 65,
  },
  {
    id: '7',
    name: 'Lifestyle Hub',
    url: 'lifestylehub.co.uk',
    da: 72,
    dr: 67,
    traffic: 16000,
    price: 130,
    niche: 'Lifestyle',
    tld: '.co.uk',
    trustScore: 89,
    spamScore: 2,
    trustFlow: 42,
    citationFlow: 49,
  },
  {
    id: '8',
    name: 'Tech Trends',
    url: 'techtrends.fr',
    da: 75,
    dr: 69,
    traffic: 14000,
    price: 140,
    niche: 'Tech',
    tld: '.fr',
    trustScore: 90,
    spamScore: 3,
    trustFlow: 44,
    citationFlow: 50,
  },
  {
    id: '9',
    name: 'Éducation Webinaire',
    url: 'educationwebinaire.fr',
    da: 62,
    dr: 55,
    traffic: 7000,
    price: 75,
    niche: 'Éducation',
    tld: '.fr',
    trustScore: 82,
    spamScore: 6,
    trustFlow: 32,
    citationFlow: 38,
  },
  {
    id: '10',
    name: 'Immobilier Premium',
    url: 'immobilierpremium.com',
    da: 79,
    dr: 73,
    traffic: 20000,
    price: 175,
    niche: 'Immobilier',
    tld: '.com',
    trustScore: 93,
    spamScore: 2,
    trustFlow: 48,
    citationFlow: 55,
  },
  {
    id: '11',
    name: 'Cuisine Gourmand',
    url: 'cuisinegourmand.fr',
    da: 66,
    dr: 59,
    traffic: 11000,
    price: 90,
    niche: 'Gastronomie',
    tld: '.fr',
    trustScore: 84,
    spamScore: 5,
    trustFlow: 37,
    citationFlow: 44,
  },
  {
    id: '12',
    name: 'Sport Excellence',
    url: 'sportexcellence.com',
    da: 73,
    dr: 68,
    traffic: 19000,
    price: 135,
    niche: 'Sport',
    tld: '.com',
    trustScore: 88,
    spamScore: 3,
    trustFlow: 41,
    citationFlow: 48,
  },
];

const mockHistory: PurchaseHistory[] = [
  {
    id: '1',
    date: '2026-03-28',
    site: 'Journal Tech France',
    da: 78,
    status: 'publie',
    linkUrl: 'journaltechfrance.fr/article-2026-03',
  },
  {
    id: '2',
    date: '2026-03-25',
    site: 'Finance Insights',
    da: 82,
    status: 'publie',
    linkUrl: 'financeinsights.fr/blog/market-trends',
  },
  {
    id: '3',
    date: '2026-03-20',
    site: 'Business Daily',
    da: 88,
    status: 'en_cours',
    linkUrl: 'businessdaily.fr/pending',
  },
  {
    id: '4',
    date: '2026-03-15',
    site: 'Mode & Style',
    da: 71,
    status: 'rejete',
    linkUrl: 'modestyle.fr/rejected',
  },
];

const getDAAColor = (da: number) => {
  if (da >= 80) return 'bg-green-500/20 text-green-400';
  if (da >= 60) return 'bg-blue-500/20 text-blue-400';
  if (da >= 40) return 'bg-yellow-500/20 text-yellow-400';
  return 'bg-red-500/20 text-red-400';
};

const getNicheColor = (niche: string) => {
  const colors: Record<string, string> = {
    Tech: 'bg-brand-600/20 text-brand-400',
    Finance: 'bg-purple-500/20 text-purple-400',
    Santé: 'bg-red-500/20 text-red-400',
    Mode: 'bg-pink-500/20 text-pink-400',
    Voyages: 'bg-cyan-500/20 text-cyan-400',
    Business: 'bg-indigo-500/20 text-indigo-400',
    Lifestyle: 'bg-amber-500/20 text-amber-400',
    Éducation: 'bg-emerald-500/20 text-emerald-400',
    Immobilier: 'bg-orange-500/20 text-orange-400',
    Gastronomie: 'bg-rose-500/20 text-rose-400',
    Sport: 'bg-lime-500/20 text-lime-400',
  };
  return colors[niche] || 'bg-surface-700 text-surface-300';
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'publie':
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    case 'rejete':
      return <AlertCircle className="w-4 h-4 text-red-400" />;
    default:
      return <Clock className="w-4 h-4 text-yellow-400" />;
  }
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    publie: 'Publié',
    rejete: 'Rejeté',
    en_cours: 'En cours',
  };
  return labels[status] || status;
};

export default function LinkBuyingPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState<string>('');
  const [daMin, setDaMin] = useState(0);
  const [priceMax, setPriceMax] = useState(300);
  const [selectedTld, setSelectedTld] = useState<string>('');
  const [doFollowOnly, setDoFollowOnly] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const niches = ['Tech', 'Finance', 'Santé', 'Mode', 'Voyages', 'Business', 'Lifestyle', 'Éducation', 'Immobilier', 'Gastronomie', 'Sport'];
  const tlds = ['.fr', '.com', '.co.uk'];

  const filteredLinks = mockLinks.filter((link) => {
    const matchesSearch = link.name.toLowerCase().includes(searchQuery.toLowerCase()) || link.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesNiche = !selectedNiche || link.niche === selectedNiche;
    const matchesDa = link.da >= daMin;
    const matchesPrice = link.price <= priceMax;
    const matchesTld = !selectedTld || link.tld === selectedTld;
    return matchesSearch && matchesNiche && matchesDa && matchesPrice && matchesTld;
  });

  const addToCart = (link: LinkOpportunity) => {
    if (!cart.find((item) => item.id === link.id)) {
      setCart([...cart, { ...link, addedAt: new Date() }]);
    }
  };

  const removeFromCart = (linkId: string) => {
    setCart(cart.filter((item) => item.id !== linkId));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  const totalLinks = cart.length;
  const avgDA = totalLinks > 0 ? Math.round(cart.reduce((sum, item) => sum + item.da, 0) / totalLinks) : 0;

  const stats = {
    totalSpent: '2,850€',
    linksPurchased: 24,
    avgDA: 74,
    successRate: 92,
  };

  return (
    <div className="min-h-screen bg-surface-950 text-surface-100">
      {/* Header */}
      <div className="border-b border-surface-800 bg-surface-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-brand-400">Achats de Liens</h1>
              <p className="text-surface-400 mt-1">Trouvez et achetez des backlinks de qualité</p>
            </div>
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="relative p-3 rounded-lg bg-brand-600/20 text-brand-400 hover:bg-brand-600/30 transition"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Dépensé', value: stats.totalSpent, icon: TrendingUp },
                { label: 'Liens Achetés', value: stats.linksPurchased, icon: Globe },
                { label: 'DA Moyen', value: stats.avgDA, icon: Star },
                { label: 'Taux Réussite', value: `${stats.successRate}%`, icon: CheckCircle },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-surface-900 border border-surface-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-surface-400 text-sm">{stat.label}</p>
                        <p className="text-xl font-bold text-brand-400 mt-1">{stat.value}</p>
                      </div>
                      <Icon className="w-5 h-5 text-brand-600" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Search & Filters */}
            <div className="bg-surface-900 border border-surface-800 rounded-lg p-6 mb-8">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-surface-500" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom ou domaine..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-surface-800 border border-surface-700 rounded-lg text-surface-100 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Niche Filter */}
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-2">Niche</label>
                  <select
                    value={selectedNiche}
                    onChange={(e) => setSelectedNiche(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-800 border border-surface-700 rounded-lg text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">Tous</option>
                    {niches.map((niche) => (
                      <option key={niche} value={niche}>
                        {niche}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DA Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-2">DA Minimum: {daMin}</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={daMin}
                    onChange={(e) => setDaMin(Number(e.target.value))}
                    className="w-full h-2 bg-surface-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-2">Prix Max: {priceMax}€</label>
                  <input
                    type="range"
                    min="50"
                    max="300"
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full h-2 bg-surface-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                </div>

                {/* TLD Filter */}
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-2">Domaine</label>
                  <select
                    value={selectedTld}
                    onChange={(e) => setSelectedTld(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-800 border border-surface-700 rounded-lg text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">Tous</option>
                    {tlds.map((tld) => (
                      <option key={tld} value={tld}>
                        {tld}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Advanced Filters */}
              <div className="mt-4 pt-4 border-t border-surface-700">
                <label className="flex items-center gap-2 text-sm text-surface-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={doFollowOnly}
                    onChange={(e) => setDoFollowOnly(e.target.checked)}
                    className="rounded border-surface-600 bg-surface-800 text-brand-500 focus:ring-brand-500"
                  />
                  Do-follow uniquement
                </label>
              </div>
            </div>

            {/* Links Grid */}
            <div>
              <h2 className="text-xl font-bold text-surface-100 mb-4">{filteredLinks.length} liens disponibles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {filteredLinks.map((link) => (
                  <div key={link.id} className="bg-surface-900 border border-surface-800 rounded-lg p-5 hover:border-brand-500 transition">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-surface-100">{link.name}</h3>
                        <p className="text-sm text-surface-400">{link.url}</p>
                      </div>
                      <span className={cn('px-2 py-1 rounded text-xs font-semibold', getNicheColor(link.niche))}>
                        {link.niche}
                      </span>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className={cn('px-3 py-2 rounded-lg text-center', getDAAColor(link.da))}>
                        <p className="text-xs text-surface-400">DA</p>
                        <p className="text-lg font-bold">{link.da}</p>
                      </div>
                      <div className="bg-surface-800 px-3 py-2 rounded-lg text-center">
                        <p className="text-xs text-surface-400">DR</p>
                        <p className="text-lg font-bold text-surface-100">{link.dr}</p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div className="bg-surface-800 rounded p-2">
                        <p className="text-surface-400">Trafic</p>
                        <p className="text-surface-100 font-semibold">{formatNumber(link.traffic)}/mois</p>
                      </div>
                      <div className="bg-surface-800 rounded p-2">
                        <p className="text-surface-400">Score Confiance</p>
                        <p className="text-green-400 font-semibold">{link.trustScore}%</p>
                      </div>
                    </div>

                    {/* Quality Scores */}
                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                      <div className="bg-surface-800 rounded p-2">
                        <p className="text-surface-400">Spam Score: {link.spamScore}%</p>
                      </div>
                      <div className="bg-surface-800 rounded p-2">
                        <p className="text-surface-400">Trust Flow: {link.trustFlow}</p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-surface-800">
                      <div>
                        <p className="text-xs text-surface-400">Prix</p>
                        <p className="text-lg font-bold text-brand-400">{link.price}€</p>
                      </div>
                      <button
                        onClick={() => addToCart(link)}
                        disabled={cart.some((item) => item.id === link.id)}
                        className={cn(
                          'px-4 py-2 rounded-lg font-semibold text-sm transition',
                          cart.some((item) => item.id === link.id)
                            ? 'bg-surface-700 text-surface-500 cursor-not-allowed'
                            : 'bg-brand-600 text-white hover:bg-brand-700'
                        )}
                      >
                        {cart.some((item) => item.id === link.id) ? 'Au panier' : 'Commander'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order History */}
            <div className="bg-surface-900 border border-surface-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-surface-100 mb-4">Historique des Achats</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-800">
                      <th className="text-left py-3 px-4 text-surface-400 font-semibold">Date</th>
                      <th className="text-left py-3 px-4 text-surface-400 font-semibold">Site</th>
                      <th className="text-left py-3 px-4 text-surface-400 font-semibold">DA</th>
                      <th className="text-left py-3 px-4 text-surface-400 font-semibold">Statut</th>
                      <th className="text-left py-3 px-4 text-surface-400 font-semibold">URL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockHistory.map((item) => (
                      <tr key={item.id} className="border-b border-surface-800 hover:bg-surface-800/50 transition">
                        <td className="py-3 px-4 text-surface-300">{item.date}</td>
                        <td className="py-3 px-4 text-surface-100 font-medium">{item.site}</td>
                        <td className="py-3 px-4">
                          <span className={cn('px-2 py-1 rounded text-xs font-bold', getDAAColor(item.da))}>
                            {item.da}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(item.status)}
                            <span className="text-surface-300">{getStatusLabel(item.status)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-surface-400 truncate text-xs">{item.linkUrl}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar - Cart */}
          <div className={cn('fixed inset-0 bg-black/50 lg:relative lg:bg-transparent z-40 transition-opacity', cartOpen ? 'opacity-100' : 'pointer-events-none opacity-0 lg:opacity-100 lg:pointer-events-auto')}>
            <div
              className={cn(
                'fixed right-0 top-0 h-full w-80 bg-surface-900 border-l border-surface-800 overflow-y-auto lg:relative lg:right-auto lg:top-auto lg:h-auto lg:w-auto lg:border-l-0 transition-transform lg:transition-none',
                cartOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <h2 className="text-xl font-bold text-surface-100">Panier</h2>
                  <button onClick={() => setCartOpen(false)} className="p-1 hover:bg-surface-800 rounded">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-surface-700 mx-auto mb-3" />
                    <p className="text-surface-400">Panier vide</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-6">
                      {cart.map((item) => (
                        <div key={item.id} className="bg-surface-800 rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-surface-100">{item.name}</p>
                              <p className="text-xs text-surface-400">{item.url}</p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 hover:bg-red-500/20 text-red-400 rounded transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-surface-400">DA: {item.da}</span>
                            <span className="text-brand-400 font-semibold">{item.price}€</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Summary */}
                    <div className="bg-surface-800 rounded-lg p-4 mb-6">
                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex justify-between text-surface-300">
                          <span>Liens</span>
                          <span className="font-semibold">{totalLinks}</span>
                        </div>
                        <div className="flex justify-between text-surface-300">
                          <span>DA Moyen</span>
                          <span className="font-semibold">{avgDA}</span>
                        </div>
                        <div className="border-t border-surface-700 pt-2 flex justify-between text-surface-100 font-bold">
                          <span>Total</span>
                          <span className="text-brand-400">{totalPrice}€</span>
                        </div>
                      </div>
                      <button className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2 rounded-lg transition">
                        Procéder au paiement
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
