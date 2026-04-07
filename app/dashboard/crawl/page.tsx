'use client';

import { useState, useEffect } from 'react';
import { cn, formatNumber } from '@/lib/utils';
import {
  BarChart3,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  TrendingUp,
  Globe,
  Zap,
  Link2,
  Activity,
  FileText,
  Image,
  Search,
} from 'lucide-react';
import { useWebsite } from '@/contexts/WebsiteContext';
import { UrlInput } from '@/components/shared/UrlInput';

interface CrawledPage {
  url: string;
  statusCode: number;
  contentType: string;
  contentLength: number;
  responseTime: number;
  title: string;
  description: string;
  h1Count: number;
  h2Count: number;
  internalLinks: number;
  externalLinks: number;
  imageCount: number;
  imagesWithoutAlt: number;
  issues: string[];
}

interface CrawlStats {
  totalPages: number;
  statusCodes: Record<string, number>;
  totalInternalLinks: number;
  totalExternalLinks: number;
  totalImages: number;
  totalImagesWithoutAlt: number;
  avgResponseTime: number;
}

interface CrawlData {
  url: string;
  stats: CrawlStats;
  pages: CrawledPage[];
  crawlId?: string;
}

export default function CrawlPage() {
  const { selectedWebsite } = useWebsite();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CrawlData | null>(null);
  const [maxPages, setMaxPages] = useState(10);
  const [progress, setProgress] = useState<{ pagesCrawled: number; pagesFound: number; currentUrl: string } | null>(null);
  const [streamPages, setStreamPages] = useState<CrawledPage[]>([]);

  // Pre-fill URL from selected website
  useEffect(() => {
    if (selectedWebsite?.domain && !url) {
      setUrl(`https://${selectedWebsite.domain}`);
    }
  }, [selectedWebsite]);

  const handleCrawl = async () => {
    if (!url.trim()) {
      setError('Veuillez entrer une URL valide');
      return;
    }

    let crawlUrl = url.trim();
    if (!crawlUrl.startsWith('http')) {
      crawlUrl = 'https://' + crawlUrl;
    }

    setLoading(true);
    setError(null);
    setData(null);
    setProgress(null);
    setStreamPages([]);

    try {
      // Use SSE streaming endpoint for real-time progress
      const response = await fetch('/api/crawl-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: crawlUrl, maxPages }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Erreur lors du crawl');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      const collectedPages: CrawledPage[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            const eventType = line.slice(7).trim();
            const nextLine = lines[lines.indexOf(line) + 1];
            if (nextLine?.startsWith('data: ')) {
              try {
                const eventData = JSON.parse(nextLine.slice(6));
                if (eventType === 'progress') {
                  setProgress(eventData);
                } else if (eventType === 'page') {
                  const page: CrawledPage = {
                    url: eventData.url,
                    statusCode: eventData.statusCode,
                    contentType: 'text/html',
                    contentLength: 0,
                    responseTime: eventData.responseTime,
                    title: eventData.title,
                    description: '',
                    h1Count: eventData.h1Count,
                    h2Count: 0,
                    internalLinks: eventData.internalLinks,
                    externalLinks: eventData.externalLinks,
                    imageCount: 0,
                    imagesWithoutAlt: eventData.imagesNoAlt,
                    issues: eventData.issues || [],
                  };
                  collectedPages.push(page);
                  setStreamPages([...collectedPages]);
                } else if (eventType === 'complete') {
                  const stats: CrawlStats = {
                    totalPages: eventData.totalPages,
                    statusCodes: {},
                    totalInternalLinks: collectedPages.reduce((s, p) => s + p.internalLinks, 0),
                    totalExternalLinks: collectedPages.reduce((s, p) => s + p.externalLinks, 0),
                    totalImages: collectedPages.reduce((s, p) => s + p.imageCount, 0),
                    totalImagesWithoutAlt: collectedPages.reduce((s, p) => s + p.imagesWithoutAlt, 0),
                    avgResponseTime: collectedPages.length > 0
                      ? Math.round(collectedPages.reduce((s, p) => s + p.responseTime, 0) / collectedPages.length)
                      : 0,
                  };
                  // Count status codes
                  collectedPages.forEach(p => {
                    const cat = `${Math.floor(p.statusCode / 100)}xx`;
                    stats.statusCodes[cat] = (stats.statusCodes[cat] || 0) + 1;
                  });
                  setData({ url: crawlUrl, stats, pages: collectedPages });
                  setProgress(null);
                } else if (eventType === 'error') {
                  setError(eventData.message);
                }
              } catch { /* parse error, skip */ }
            }
          }
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur reseau';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusCodeColor = (code: number) => {
    if (code >= 200 && code < 300) return 'bg-emerald-500 text-white';
    if (code >= 300 && code < 400) return 'bg-amber-500 text-white';
    if (code >= 400 && code < 500) return 'bg-orange-500 text-white';
    return 'bg-red-500 text-white';
  };

  const getStatusBarColor = (category: string) => {
    if (category === '2xx') return 'bg-emerald-500';
    if (category === '3xx') return 'bg-amber-500';
    if (category === '4xx') return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-surface-900 dark:text-surface-50 mb-2">
            Crawl & Analyse de Logs
          </h1>
          <p className="text-surface-600 dark:text-surface-400">
            Analysez votre site web et détectez les problèmes techniques
          </p>
        </div>

        {/* URL Input Section */}
        <div className="border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-800 rounded-xl p-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
              URL à crawler
            </label>
            <div className="flex gap-3 items-start">
              <div className="flex-1">
                <UrlInput
                  value={url}
                  onChange={setUrl}
                  onSubmit={handleCrawl}
                  loading={loading}
                  submitLabel="Lancer le crawl"
                />
              </div>
              <select
                value={maxPages}
                onChange={(e) => setMaxPages(Number(e.target.value))}
                disabled={loading}
                className="h-[46px] rounded-lg border border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-700 px-3 text-sm text-surface-900 dark:text-surface-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value={5}>5 pages</option>
                <option value={10}>10 pages</option>
                <option value={25}>25 pages</option>
                <option value={50}>50 pages</option>
              </select>
            </div>
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="font-medium text-red-900 dark:text-red-300">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Loading State with SSE Progress */}
        {loading && (
          <div className="border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 rounded-xl p-8 space-y-4">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
              <p className="text-lg font-medium text-surface-900 dark:text-white">
                Crawl en cours...
              </p>
            </div>

            {progress && (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-surface-600 dark:text-surface-400">
                    {progress.pagesCrawled}/{progress.pagesFound} pages crawlees
                  </span>
                  <span className="text-brand-600 font-mono text-xs truncate max-w-xs">
                    {progress.currentUrl}
                  </span>
                </div>
                <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-brand-500 to-cyan-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (progress.pagesCrawled / Math.max(1, maxPages)) * 100)}%` }}
                  />
                </div>
              </>
            )}

            {/* Live pages feed */}
            {streamPages.length > 0 && (
              <div className="mt-4 max-h-48 overflow-y-auto space-y-1 scrollbar-thin">
                {streamPages.slice(-8).map((p, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className={cn(
                      'w-8 text-center font-mono rounded px-1 py-0.5 text-white',
                      p.statusCode >= 200 && p.statusCode < 300 ? 'bg-emerald-500' : p.statusCode >= 300 && p.statusCode < 400 ? 'bg-amber-500' : 'bg-red-500'
                    )}>
                      {p.statusCode}
                    </span>
                    <span className="text-surface-600 dark:text-surface-400 truncate flex-1">{p.url}</span>
                    {p.issues.length > 0 && (
                      <span className="text-amber-500 text-[10px] font-medium">{p.issues.length} issues</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {data && !loading && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { icon: Globe, label: 'Pages crawlées', value: data.stats.totalPages, color: 'text-brand-600 dark:text-brand-400' },
                { icon: Zap, label: 'Temps moyen', value: `${data.stats.avgResponseTime}ms`, color: 'text-accent-600 dark:text-accent-400' },
                { icon: CheckCircle2, label: 'Codes 2xx', value: data.stats.statusCodes['2xx'] || 0, color: 'text-emerald-600 dark:text-emerald-400' },
                { icon: TrendingUp, label: 'Redirections (3xx)', value: data.stats.statusCodes['3xx'] || 0, color: 'text-amber-600 dark:text-amber-400' },
                { icon: AlertTriangle, label: 'Erreurs (4xx)', value: data.stats.statusCodes['4xx'] || 0, color: 'text-orange-600 dark:text-orange-400' },
                { icon: Activity, label: 'Erreurs serveur (5xx)', value: data.stats.statusCodes['5xx'] || 0, color: 'text-red-600 dark:text-red-400' },
              ].map((stat) => (
                <div key={stat.label} className="border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-800 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <stat.icon className={cn('w-8 h-8', stat.color)} />
                    <div>
                      <p className="text-xs text-surface-600 dark:text-surface-400">{stat.label}</p>
                      <p className="text-xl font-bold text-surface-900 dark:text-surface-50">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Status Code Distribution & Link Analysis */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Status Codes */}
              <div className="border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-800 rounded-xl p-6">
                <h2 className="text-lg font-bold text-surface-900 dark:text-surface-50 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  Distribution des codes de statut
                </h2>
                <div className="space-y-3">
                  {Object.entries(data.stats.statusCodes).sort().map(([code, count]) => (
                    <div key={code} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-surface-600 dark:text-surface-400">{code}</span>
                        <span className="font-medium text-surface-900 dark:text-surface-50">{count}</span>
                      </div>
                      <div className="h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                        <div
                          className={cn('h-full transition-all rounded-full', getStatusBarColor(code))}
                          style={{ width: `${(count / data.stats.totalPages) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Link & Image Analysis */}
              <div className="border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-800 rounded-xl p-6">
                <h2 className="text-lg font-bold text-surface-900 dark:text-surface-50 mb-4 flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-accent-600 dark:text-accent-400" />
                  Liens & Images
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Liens internes</span>
                      <span className="text-lg font-bold text-brand-600 dark:text-brand-400">{data.stats.totalInternalLinks}</span>
                    </div>
                    <div className="h-2 bg-brand-500 rounded-full" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Liens externes</span>
                      <span className="text-lg font-bold text-accent-600 dark:text-accent-400">{data.stats.totalExternalLinks}</span>
                    </div>
                    <div className="h-2 bg-accent-500 rounded-full" />
                  </div>
                  <div className="pt-4 border-t border-surface-200 dark:border-surface-700 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-600 dark:text-surface-400 flex items-center gap-1">
                        <Image className="w-4 h-4" /> Total images
                      </span>
                      <span className="font-bold text-surface-900 dark:text-surface-50">{data.stats.totalImages}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-600 dark:text-surface-400">Images sans alt</span>
                      <span className={cn('font-bold', data.stats.totalImagesWithoutAlt > 0 ? 'text-red-500' : 'text-emerald-500')}>
                        {data.stats.totalImagesWithoutAlt}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Crawl Results Table */}
            <div className="border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-800 rounded-xl p-6">
              <h2 className="text-lg font-bold text-surface-900 dark:text-surface-50 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                Résultats détaillés ({data.pages.length} pages)
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-200 dark:border-surface-700">
                      <th className="text-left py-3 px-4 font-semibold text-surface-700 dark:text-surface-300">URL</th>
                      <th className="text-left py-3 px-4 font-semibold text-surface-700 dark:text-surface-300">Code</th>
                      <th className="text-left py-3 px-4 font-semibold text-surface-700 dark:text-surface-300">Titre</th>
                      <th className="text-right py-3 px-4 font-semibold text-surface-700 dark:text-surface-300">Taille</th>
                      <th className="text-right py-3 px-4 font-semibold text-surface-700 dark:text-surface-300">Temps</th>
                      <th className="text-center py-3 px-4 font-semibold text-surface-700 dark:text-surface-300">H1</th>
                      <th className="text-center py-3 px-4 font-semibold text-surface-700 dark:text-surface-300">Liens</th>
                      <th className="text-left py-3 px-4 font-semibold text-surface-700 dark:text-surface-300">Problèmes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.pages.map((page, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-surface-100 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <a
                            href={page.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 group text-brand-600 dark:text-brand-400 hover:underline"
                          >
                            <span className="truncate max-w-[200px]">{page.url.replace(/^https?:\/\//, '')}</span>
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          <span className={cn('px-2 py-1 rounded-md font-semibold text-xs', getStatusCodeColor(page.statusCode))}>
                            {page.statusCode}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-surface-700 dark:text-surface-300 max-w-[200px] truncate">
                          {page.title || <span className="text-red-500 italic">Manquant</span>}
                        </td>
                        <td className="py-3 px-4 text-right text-surface-700 dark:text-surface-300">
                          {formatNumber(page.contentLength)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={cn(
                            'font-medium',
                            page.responseTime < 500 ? 'text-emerald-600 dark:text-emerald-400' :
                            page.responseTime < 1500 ? 'text-amber-600 dark:text-amber-400' :
                            'text-red-600 dark:text-red-400'
                          )}>
                            {page.responseTime}ms
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={cn(
                            'font-medium',
                            page.h1Count === 1 ? 'text-emerald-600 dark:text-emerald-400' :
                            page.h1Count === 0 ? 'text-red-600 dark:text-red-400' :
                            'text-amber-600 dark:text-amber-400'
                          )}>
                            {page.h1Count}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-surface-700 dark:text-surface-300">
                          {page.internalLinks + page.externalLinks}
                        </td>
                        <td className="py-3 px-4">
                          {page.issues.length > 0 ? (
                            <div className="space-y-1">
                              {page.issues.map((issue, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300 rounded text-xs font-medium mr-1"
                                >
                                  <AlertTriangle className="w-3 h-3" />
                                  {issue}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs">
                              <CheckCircle2 className="w-3 h-3" /> OK
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!data && !loading && !error && (
          <div className="border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-800 rounded-xl p-12 text-center">
            <Globe className="w-16 h-16 text-surface-400 dark:text-surface-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-2">
              Prêt à crawler
            </h3>
            <p className="text-surface-500 dark:text-surface-400 max-w-md mx-auto">
              Entrez une URL ci-dessus pour lancer l'exploration de votre site. Le crawler analysera chaque page, les liens, les images et détectera les problèmes techniques.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
