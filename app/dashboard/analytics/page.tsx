'use client';

import { useState } from 'react';
import { cn, formatNumber, formatPercent } from '@/lib/utils';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Zap,
  Clock,
  Calendar,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Search,
  Target,
  ArrowRight,
} from 'lucide-react';

// Mock Data
const trafficData = Array.from({ length: 30 }, (_, i) => ({
  date: `${i + 1} mar`,
  organic: Math.floor(Math.random() * 8000) + 4000,
  direct: Math.floor(Math.random() * 3000) + 1500,
  referral: Math.floor(Math.random() * 2500) + 1000,
  social: Math.floor(Math.random() * 2000) + 800,
}));

const trafficSources = [
  { name: 'Organic Search', value: 52, color: '#3b82f6' },
  { name: 'Direct', value: 18, color: '#10b981' },
  { name: 'Referral', value: 15, color: '#f59e0b' },
  { name: 'Social', value: 10, color: '#8b5cf6' },
  { name: 'Email', value: 5, color: '#ec4899' },
];

const topPages = [
  { url: '/blog/seo-tips-2024', views: 12543, unique: 9234, time: '4:32', bounce: '32.1%', entrances: 8765 },
  { url: '/', views: 11234, unique: 8645, time: '3:45', bounce: '38.2%', entrances: 7234 },
  { url: '/services/audit', views: 9876, unique: 7234, time: '5:12', bounce: '28.5%', entrances: 6543 },
  { url: '/blog/backlinks-guide', views: 8765, unique: 6234, time: '4:18', bounce: '35.7%', entrances: 5432 },
  { url: '/pricing', views: 7654, unique: 5123, time: '3:21', bounce: '42.3%', entrances: 4321 },
  { url: '/about', views: 6543, unique: 4567, time: '2:54', bounce: '45.1%', entrances: 3876 },
  { url: '/blog/keywords-research', views: 5432, unique: 3987, time: '4:07', bounce: '31.2%', entrances: 3245 },
  { url: '/contact', views: 4321, unique: 2876, time: '2:33', bounce: '51.3%', entrances: 2134 },
  { url: '/blog/content-strategy', views: 3876, unique: 2654, time: '5:43', bounce: '29.8%', entrances: 1987 },
  { url: '/faq', views: 3234, unique: 2345, time: '3:15', bounce: '48.2%', entrances: 1654 },
];

const countries = [
  { name: 'France', percentage: 45, sessions: 57234, flag: '🇫🇷' },
  { name: 'Belgique', percentage: 12, sessions: 15276, flag: '🇧🇪' },
  { name: 'Canada', percentage: 10, sessions: 12730, flag: '🇨🇦' },
  { name: 'Suisse', percentage: 8, sessions: 10184, flag: '🇨🇭' },
  { name: 'Allemagne', percentage: 7, sessions: 8911, flag: '🇩🇪' },
  { name: 'Pays-Bas', percentage: 6, sessions: 7638, flag: '🇳🇱' },
  { name: 'Espagne', percentage: 5, sessions: 6365, flag: '🇪🇸' },
  { name: 'Italie', percentage: 4, sessions: 5092, flag: '🇮🇹' },
  { name: 'Autriche', percentage: 2, sessions: 2546, flag: '🇦🇹' },
  { name: 'Luxembourg', percentage: 1, sessions: 1273, flag: '🇱🇺' },
];

const keywords = [
  { keyword: 'audit SEO gratuit', sessions: 3456, bounce: '22.3%', conversion: '8.5%', position: 1 },
  { keyword: 'outils SEO', sessions: 2987, bounce: '28.1%', conversion: '6.2%', position: 2 },
  { keyword: 'backlinks de qualité', sessions: 2654, bounce: '31.5%', conversion: '5.8%', position: 3 },
  { keyword: 'stratégie de contenu', sessions: 2345, bounce: '25.7%', conversion: '7.1%', position: 5 },
  { keyword: 'mots-clés recherche', sessions: 2123, bounce: '33.2%', conversion: '4.9%', position: 4 },
  { keyword: 'optimisation SEO on-page', sessions: 1876, bounce: '29.8%', conversion: '6.5%', position: 6 },
  { keyword: 'analyse de concurrence', sessions: 1654, bounce: '26.4%', conversion: '7.8%', position: 3 },
  { keyword: 'ranking checker', sessions: 1432, bounce: '35.1%', conversion: '4.2%', position: 7 },
];

const goals = [
  { name: 'Inscriptions Newsletter', value: 1234, target: 2000, completion: 61.7 },
  { name: 'Téléchargements Guides', value: 876, target: 1000, completion: 87.6 },
  { name: 'Demandes Essai Gratuit', value: 543, target: 500, completion: 108.6 },
];

const deviceData = [
  { device: 'Desktop', value: 65, icon: Monitor },
  { device: 'Mobile', value: 28, icon: Smartphone },
  { device: 'Tablet', value: 7, icon: Tablet },
];

const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

function MetricCard({
  icon: Icon,
  label,
  value,
  change,
  isPositive,
}: {
  icon: React.ComponentType<any>;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}) {
  return (
    <div className="rounded-lg border border-surface-200 bg-surface-50 p-6 dark:border-surface-700 dark:bg-surface-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-surface-600 dark:text-surface-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-surface-900 dark:text-surface-50">
            {value}
          </p>
        </div>
        <div className="rounded-lg bg-brand-100 p-3 dark:bg-brand-900">
          <Icon className="h-6 w-6 text-brand-600 dark:text-brand-400" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        {isPositive ? (
          <TrendingUp className="h-4 w-4 text-green-600" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-600" />
        )}
        <span
          className={cn(
            'text-sm font-medium',
            isPositive ? 'text-green-600' : 'text-red-600'
          )}
        >
          {change}
        </span>
        <span className="text-sm text-surface-500 dark:text-surface-400">
          vs. période précédente
        </span>
      </div>
    </div>
  );
}

function DateRangeButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
        selected
          ? 'bg-brand-600 text-white dark:bg-brand-500'
          : 'bg-surface-100 text-surface-700 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700'
      )}
    >
      {label}
    </button>
  );
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '12m'>('30d');

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      {/* Header */}
      <div className="border-b border-surface-200 bg-white px-8 py-6 dark:border-surface-800 dark:bg-surface-900">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-50">
              Analytics
            </h1>
            <p className="mt-1 text-surface-600 dark:text-surface-400">
              Analyse complète de votre trafic et performances
            </p>
          </div>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="border-b border-surface-200 bg-white px-8 py-4 dark:border-surface-800 dark:bg-surface-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <DateRangeButton
              label="7 jours"
              selected={dateRange === '7d'}
              onClick={() => setDateRange('7d')}
            />
            <DateRangeButton
              label="30 jours"
              selected={dateRange === '30d'}
              onClick={() => setDateRange('30d')}
            />
            <DateRangeButton
              label="90 jours"
              selected={dateRange === '90d'}
              onClick={() => setDateRange('90d')}
            />
            <DateRangeButton
              label="12 mois"
              selected={dateRange === '12m'}
              onClick={() => setDateRange('12m')}
            />
          </div>
          <div className="flex gap-3">
            <input
              type="date"
              className="rounded-lg border border-surface-300 bg-surface-50 px-4 py-2 dark:border-surface-600 dark:bg-surface-800 dark:text-surface-50"
            />
            <input
              type="date"
              className="rounded-lg border border-surface-300 bg-surface-50 px-4 py-2 dark:border-surface-600 dark:bg-surface-800 dark:text-surface-50"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Key Metrics */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={Users}
            label="Visiteurs"
            value="45,234"
            change="+12.5%"
            isPositive={true}
          />
          <MetricCard
            icon={Eye}
            label="Pages vues"
            value="128,547"
            change="+8.3%"
            isPositive={true}
          />
          <MetricCard
            icon={Zap}
            label="Taux de rebond"
            value="42.3%"
            change="-3.2%"
            isPositive={true}
          />
          <MetricCard
            icon={Clock}
            label="Durée moyenne"
            value="3:24"
            change="+15.1%"
            isPositive={true}
          />
        </div>

        {/* Traffic Overview */}
        <div className="mb-8 rounded-lg border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900">
          <h2 className="mb-6 text-lg font-semibold text-surface-900 dark:text-surface-50">
            Aperçu du trafic
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDirect" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorReferral" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSocial" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-surface-700" />
              <XAxis dataKey="date" stroke="#6b7280" className="dark:stroke-surface-500" />
              <YAxis stroke="#6b7280" className="dark:stroke-surface-500" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="organic"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorOrganic)"
                name="Organic"
              />
              <Area
                type="monotone"
                dataKey="direct"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorDirect)"
                name="Direct"
              />
              <Area
                type="monotone"
                dataKey="referral"
                stroke="#f59e0b"
                fillOpacity={1}
                fill="url(#colorReferral)"
                name="Referral"
              />
              <Area
                type="monotone"
                dataKey="social"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#colorSocial)"
                name="Social"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Two Column Layout */}
        <div className="mb-8 grid gap-8 lg:grid-cols-2">
          {/* Traffic Sources */}
          <div className="rounded-lg border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900">
            <h2 className="mb-6 text-lg font-semibold text-surface-900 dark:text-surface-50">
              Sources de trafic
            </h2>
            <div className="flex flex-col items-center gap-8 sm:flex-row">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={trafficSources}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {trafficSources.map((source) => (
                  <div key={source.name} className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: source.color }}
                    />
                    <div>
                      <p className="text-sm font-medium text-surface-900 dark:text-surface-50">
                        {source.name}
                      </p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">
                        {source.value}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="rounded-lg border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900">
            <h2 className="mb-6 text-lg font-semibold text-surface-900 dark:text-surface-50">
              Répartition des appareils
            </h2>
            <div className="space-y-4">
              {deviceData.map((device) => {
                const Icon = device.icon;
                return (
                  <div key={device.device}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                        <span className="text-sm font-medium text-surface-900 dark:text-surface-50">
                          {device.device}
                        </span>
                      </div>
                      <span className="font-semibold text-surface-900 dark:text-surface-50">
                        {device.value}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface-200 dark:bg-surface-700">
                      <div
                        className="h-full bg-brand-500"
                        style={{ width: `${device.value}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Pages Table */}
        <div className="mb-8 rounded-lg border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900">
          <div className="border-b border-surface-200 px-6 py-4 dark:border-surface-800">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50">
              Pages principales
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-800">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400">
                    Page
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-surface-600 dark:text-surface-400">
                    Vues
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-surface-600 dark:text-surface-400">
                    Visiteurs uniques
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-surface-600 dark:text-surface-400">
                    Durée moy.
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-surface-600 dark:text-surface-400">
                    Rebond
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-surface-600 dark:text-surface-400">
                    Entrées
                  </th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((page, i) => (
                  <tr
                    key={i}
                    className="border-b border-surface-100 hover:bg-surface-50 dark:border-surface-800 dark:hover:bg-surface-800"
                  >
                    <td className="px-6 py-4">
                      <code className="text-xs font-medium text-brand-600 dark:text-brand-400">
                        {page.url}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-surface-900 dark:text-surface-50">
                      {formatNumber(page.views)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-surface-600 dark:text-surface-400">
                      {formatNumber(page.unique)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-surface-600 dark:text-surface-400">
                      {page.time}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-surface-600 dark:text-surface-400">
                      {page.bounce}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-surface-600 dark:text-surface-400">
                      {formatNumber(page.entrances)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="mb-8 rounded-lg border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900">
          <h2 className="mb-6 text-lg font-semibold text-surface-900 dark:text-surface-50">
            Distribution géographique
          </h2>
          <div className="space-y-4">
            {countries.map((country) => (
              <div key={country.name}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{country.flag}</span>
                    <div>
                      <p className="text-sm font-medium text-surface-900 dark:text-surface-50">
                        {country.name}
                      </p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">
                        {formatNumber(country.sessions)} sessions
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-surface-900 dark:text-surface-50">
                    {country.percentage}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-200 dark:bg-surface-700">
                  <div
                    className="h-full bg-brand-500"
                    style={{ width: `${country.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Keywords Table */}
        <div className="mb-8 rounded-lg border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900">
          <div className="border-b border-surface-200 px-6 py-4 dark:border-surface-800">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50">
              Mots-clés principaux
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-800">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-surface-600 dark:text-surface-400">
                    Mot-clé
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-surface-600 dark:text-surface-400">
                    Sessions
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-surface-600 dark:text-surface-400">
                    Taux rebond
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-surface-600 dark:text-surface-400">
                    Conversion
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-surface-600 dark:text-surface-400">
                    Position
                  </th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((kw, i) => (
                  <tr
                    key={i}
                    className="border-b border-surface-100 hover:bg-surface-50 dark:border-surface-800 dark:hover:bg-surface-800"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-accent-600 dark:text-accent-400" />
                        <span className="text-sm font-medium text-surface-900 dark:text-surface-50">
                          {kw.keyword}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-surface-900 dark:text-surface-50">
                      {formatNumber(kw.sessions)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-surface-600 dark:text-surface-400">
                      {kw.bounce}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-surface-600 dark:text-surface-400">
                      {kw.conversion}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-surface-900 dark:text-surface-50">
                      #{kw.position}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Conversion Tracking */}
        <div>
          <h2 className="mb-6 text-lg font-semibold text-surface-900 dark:text-surface-50">
            Suivi des conversions
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {goals.map((goal) => (
              <div
                key={goal.name}
                className="rounded-lg border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-sm text-surface-600 dark:text-surface-400">
                      {goal.name}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-surface-900 dark:text-surface-50">
                      {goal.value}
                    </p>
                  </div>
                  <Target className="h-6 w-6 text-accent-600 dark:text-accent-400" />
                </div>
                <div className="mb-3">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-surface-600 dark:text-surface-400">
                      Objectif: {goal.target}
                    </span>
                    <span className="font-semibold text-surface-900 dark:text-surface-50">
                      {formatPercent(goal.completion)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-200 dark:bg-surface-700">
                    <div
                      className={cn(
                        'h-full',
                        goal.completion >= 100 ? 'bg-green-500' : 'bg-accent-500'
                      )}
                      style={{ width: `${Math.min(goal.completion, 100)}%` }}
                    />
                  </div>
                </div>
                {goal.completion >= 100 && (
                  <p className="text-xs font-medium text-green-600 dark:text-green-400">
                    Objectif atteint!
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
