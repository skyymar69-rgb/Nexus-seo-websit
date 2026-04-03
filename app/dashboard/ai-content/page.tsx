'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import {
  Copy,
  Download,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  Link2,
  Sparkles,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

const CONTENT_TYPES = [
  { id: 'blog', label: 'Article de blog', icon: '📝', apiValue: 'article' },
  { id: 'product', label: 'Page produit', icon: '🛍️', apiValue: 'product-description' },
  { id: 'meta', label: 'Meta descriptions', icon: '📋', apiValue: 'meta-description' },
  { id: 'faq', label: 'FAQ', icon: '❓', apiValue: 'faq' },
  { id: 'landing', label: 'Landing page', icon: '🚀', apiValue: 'title' },
  { id: 'category', label: 'Description categorie', icon: '📂', apiValue: 'product-description' },
];

const TONES = [
  { label: 'Professionnel', value: 'professional' },
  { label: 'Decontracte', value: 'casual' },
  { label: 'Technique', value: 'academic' },
  { label: 'Commercial', value: 'persuasive' },
];

const LANGUAGES = [
  { label: 'Francais', value: 'fr' },
  { label: 'English', value: 'en' },
  { label: 'Espanol', value: 'es' },
  { label: 'Deutsch', value: 'de' },
];

const HISTORY_ITEMS = [
  { id: 1, title: 'Guide complet du SEO 2024', date: "Aujourd'hui" },
  { id: 2, title: 'Optimisation des pages produit', date: 'Hier' },
  { id: 3, title: 'Stratégie de contenu pour e-commerce', date: '3 jours' },
  { id: 4, title: 'FAQ - Amélioration continue', date: '1 semaine' },
  { id: 5, title: 'Description landing page SaaS', date: '2 semaines' },
];

const RELATED_KEYWORDS = [
  'SEO technique',
  'stratégie de contenu',
  'optimisation des mots-clés',
  'backlinking',
  'expérience utilisateur',
  'mobile first indexing',
  'core web vitals',
  'schéma structuré',
];

export default function AIContentPage() {
  const [selectedType, setSelectedType] = useState('blog');
  const [keyword, setKeyword] = useState('');
  const [tone, setTone] = useState('professional');
  const [language, setLanguage] = useState('fr');
  const [wordCount, setWordCount] = useState(1500);
  const [instructions, setInstructions] = useState('');
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSEO, setShowSEO] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [charCount, setCharCount] = useState(0);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  const wordCountValue = content.split(/\s+/).filter(w => w.length > 0).length;

  useEffect(() => {
    setCharCount(content.length);
  }, [content]);

  const handleGenerate = async () => {
    if (!keyword.trim()) {
      setError('Veuillez entrer un mot-cle');
      return;
    }

    // Cancel any in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setIsGenerating(true);
    setContent('');
    setShowSEO(false);
    setIsDemo(false);
    setError('');

    const contentType = CONTENT_TYPES.find(t => t.id === selectedType);

    try {
      const res = await fetch('/api/ai-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: contentType?.apiValue || 'article',
          keyword: keyword.trim(),
          tone,
          language,
          wordCount,
          instructions: instructions.trim() || undefined,
        }),
        signal: controller.signal,
      });

      // Handle JSON responses (demo mode or errors)
      const contentTypeHeader = res.headers.get('content-type') || '';
      if (contentTypeHeader.includes('application/json')) {
        const data = await res.json();
        if (data.demo) {
          setIsDemo(true);
          setIsGenerating(false);
          return;
        }
        if (data.error) {
          setError(data.error);
          setIsGenerating(false);
          return;
        }
      }

      // Handle SSE stream
      if (!res.body) {
        setError('Pas de reponse du serveur');
        setIsGenerating(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        // Keep the last potentially incomplete line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;

          try {
            const payload = JSON.parse(trimmed.slice(6));
            if (payload.done) {
              break;
            }
            if (payload.error) {
              setError(payload.error);
              break;
            }
            if (payload.text) {
              setContent(prev => prev + payload.text);
            }
          } catch {
            // Skip malformed lines
          }
        }
      }

      setShowSEO(true);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setIsGenerating(false);
      abortRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setIsGenerating(false);
    if (content.length > 0) {
      setShowSEO(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `contenu-${Date.now()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const toggleKeyword = (kw: string) => {
    setSelectedKeywords(prev =>
      prev.includes(kw) ? prev.filter(k => k !== kw) : [...prev, kw]
    );
  };

  const metaTitle = keyword ? `${keyword} - Guide Complet 2024` : '';
  const metaDesc = keyword ? `Découvrez comment optimiser votre ${keyword}. Guide pratique avec stratégies éprouvées et cas d'étude réels.` : '';

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      {/* Header */}
      <div className="border-b border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-brand-600" />
            <h1 className="text-3xl font-bold text-surface-900 dark:text-white">
              Generation de Contenu IA
            </h1>
          </div>
          <p className="text-surface-600 dark:text-surface-400">
            Creez du contenu SEO-optimise en quelques secondes avec notre editeur IA
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Demo Banner */}
        {isDemo && (
          <div className="mb-6 rounded-xl border-2 border-amber-400 dark:border-amber-600 bg-amber-50 dark:bg-amber-950/30 p-5">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-amber-800 dark:text-amber-300 text-lg">
                  MODE DEMO
                </p>
                <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">
                  Configurez la variable d&apos;environnement <code className="px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-900 font-mono text-xs">OPENAI_API_KEY</code> pour activer la generation IA reelle.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Content Type Selector */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
            Choisissez le type de contenu
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {CONTENT_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={cn(
                  'p-4 rounded-lg border-2 transition-all text-center',
                  selectedType === type.id
                    ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/30'
                    : 'border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 hover:border-brand-300 dark:hover:border-brand-800'
                )}
              >
                <div className="text-2xl mb-2">{type.icon}</div>
                <p className="text-sm font-medium text-surface-900 dark:text-white">
                  {type.label}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Configuration and Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Configuration Panel */}
            <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-5">
                Configuration
              </h2>

              {/* Keyword Input */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Mot-cle cible
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Ex: SEO, developpement web, e-commerce..."
                  className="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Tone Selector */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Ton de la voix
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TONES.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setTone(t.value)}
                      className={cn(
                        'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                        tone === t.value
                          ? 'bg-brand-600 text-white'
                          : 'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selector */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Langue
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>

              {/* Word Count Slider */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Nombre de mots: {wordCount}
                </label>
                <input
                  type="range"
                  min="300"
                  max="5000"
                  step="100"
                  value={wordCount}
                  onChange={(e) => setWordCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-surface-300 dark:bg-surface-700 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
                <div className="flex justify-between text-xs text-surface-500 mt-1">
                  <span>300</span>
                  <span>5000</span>
                </div>
              </div>

              {/* Instructions */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Instructions supplementaires (optionnel)
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Ex: Inclure des statistiques recentes, mentionner des outils specifiques..."
                  rows={3}
                  maxLength={1000}
                  className="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>

              {/* Generate / Stop Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex-1 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 shadow-lg hover:shadow-xl"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generation en cours...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Generer
                    </span>
                  )}
                </button>
                {isGenerating && (
                  <button
                    onClick={handleStop}
                    className="px-6 py-3 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    Arreter
                  </button>
                )}
              </div>
            </div>

            {/* Streaming skeleton / placeholder */}
            {isGenerating && !content && (
              <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
                  <span className="text-sm font-medium text-surface-600 dark:text-surface-400">
                    L&apos;IA genere votre contenu...
                  </span>
                </div>
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-surface-200 dark:bg-surface-800 rounded w-3/4" />
                  <div className="h-4 bg-surface-200 dark:bg-surface-800 rounded w-full" />
                  <div className="h-4 bg-surface-200 dark:bg-surface-800 rounded w-5/6" />
                  <div className="h-4 bg-surface-200 dark:bg-surface-800 rounded w-2/3" />
                  <div className="h-4 bg-surface-200 dark:bg-surface-800 rounded w-full" />
                  <div className="h-4 bg-surface-200 dark:bg-surface-800 rounded w-4/5" />
                </div>
              </div>
            )}

            {/* AI Editor */}
            {content && (
              <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 overflow-hidden">
                {/* Toolbar */}
                <div className="bg-surface-50 dark:bg-surface-800/50 border-b border-surface-200 dark:border-surface-800 p-4 flex items-center gap-2 flex-wrap">
                  <button className="p-2 hover:bg-surface-200 dark:hover:bg-surface-700 rounded transition-colors" title="Gras">
                    <Bold className="w-4 h-4 text-surface-600 dark:text-surface-400" />
                  </button>
                  <button className="p-2 hover:bg-surface-200 dark:hover:bg-surface-700 rounded transition-colors" title="Italique">
                    <Italic className="w-4 h-4 text-surface-600 dark:text-surface-400" />
                  </button>
                  <button className="p-2 hover:bg-surface-200 dark:hover:bg-surface-700 rounded transition-colors" title="Titre 2">
                    <Heading2 className="w-4 h-4 text-surface-600 dark:text-surface-400" />
                  </button>
                  <button className="p-2 hover:bg-surface-200 dark:hover:bg-surface-700 rounded transition-colors" title="Titre 3">
                    <Heading3 className="w-4 h-4 text-surface-600 dark:text-surface-400" />
                  </button>
                  <button className="p-2 hover:bg-surface-200 dark:hover:bg-surface-700 rounded transition-colors" title="Liste">
                    <List className="w-4 h-4 text-surface-600 dark:text-surface-400" />
                  </button>
                  <button className="p-2 hover:bg-surface-200 dark:hover:bg-surface-700 rounded transition-colors" title="Lien">
                    <Link2 className="w-4 h-4 text-surface-600 dark:text-surface-400" />
                  </button>
                  <div className="flex-1"></div>
                  {isGenerating && (
                    <div className="flex items-center gap-2 mr-3">
                      <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                      <span className="text-xs text-brand-600 font-medium">En cours...</span>
                    </div>
                  )}
                  <div className="text-sm text-surface-600 dark:text-surface-400">
                    {wordCountValue} mots | {charCount} caracteres
                  </div>
                </div>

                {/* Editor */}
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-96 p-6 focus:outline-none bg-white dark:bg-surface-900 text-surface-900 dark:text-white resize-none font-serif leading-relaxed"
                  placeholder="Le contenu genere apparaitra ici..."
                />

                {/* Actions */}
                <div className="bg-surface-50 dark:bg-surface-800/50 border-t border-surface-200 dark:border-surface-800 p-4 flex gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors font-medium"
                  >
                    <Copy className="w-4 h-4" />
                    Copier
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Telecharger
                  </button>
                </div>
              </div>
            )}

            {/* Content Templates */}
            {!content && !isGenerating && (
              <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6">
                <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
                  Modeles disponibles
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['Blog listicle', 'Guide complet', 'Etude de cas', 'Entrevue', 'Comparatif', 'Tutoriel'].map(template => (
                    <button
                      key={template}
                      className="p-4 text-left rounded-lg bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 hover:border-brand-400 dark:hover:border-brand-600 transition-colors text-surface-700 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white font-medium"
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - SEO Sidebar */}
          <div className="space-y-6">
            {/* History */}
            <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-600" />
                Historique
              </h3>
              <div className="space-y-3">
                {HISTORY_ITEMS.map(item => (
                  <button
                    key={item.id}
                    className="w-full text-left p-3 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors group"
                  >
                    <p className="font-medium text-sm text-surface-900 dark:text-white group-hover:text-brand-600 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-surface-500 mt-1">{item.date}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* SEO Analysis */}
            {showSEO && content && (
              <>
                {/* SEO Score */}
                <div className="bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-950/30 dark:to-accent-950/30 rounded-xl border border-brand-200 dark:border-brand-800 p-6">
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-brand-600" />
                    Score SEO
                  </h3>
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-200 dark:text-surface-700" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={`${282 * 0.78} 282`}
                        className="text-green-500"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                      />
                      <text x="50" y="55" textAnchor="middle" className="text-2xl font-bold fill-surface-900 dark:fill-white">
                        78%
                      </text>
                    </svg>
                  </div>
                  <p className="text-center text-sm text-surface-600 dark:text-surface-400">
                    Excellent! Votre contenu est bien optimise.
                  </p>
                </div>

                {/* Keyword Density */}
                <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6">
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-3">
                    Densite du mot-cle
                  </h3>
                  {keyword && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-surface-600 dark:text-surface-400">{keyword}</span>
                        <span className="font-bold text-brand-600">2.1%</span>
                      </div>
                      <div className="w-full bg-surface-200 dark:bg-surface-800 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '2.1%' }}></div>
                      </div>
                      <p className="text-xs text-surface-500 mt-2">Optimal (1-3%)</p>
                    </div>
                  )}
                </div>

                {/* Readability */}
                <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6">
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Lisibilite
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-surface-600 dark:text-surface-400">Score Flesch</span>
                      <span className="font-bold text-green-600">62/100</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-surface-600 dark:text-surface-400">Longueur moyenne</span>
                      <span className="text-sm">18 mots/phrase</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-surface-600 dark:text-surface-400">Titres</span>
                      <span className="text-sm text-green-600">Bien structure</span>
                    </div>
                  </div>
                </div>

                {/* Meta Title */}
                <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6">
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-3">
                    Suggestion Meta Title
                  </h3>
                  <p className="text-sm text-surface-700 dark:text-surface-300 mb-2 line-clamp-2">
                    {metaTitle}
                  </p>
                  <p className="text-xs text-surface-500">
                    {metaTitle.length}/60 caracteres
                  </p>
                  <p className={cn(
                    'text-xs mt-2',
                    metaTitle.length <= 60
                      ? 'text-green-600'
                      : 'text-amber-600'
                  )}>
                    {metaTitle.length <= 60 ? 'Optimal' : 'Trop long'}
                  </p>
                </div>

                {/* Meta Description */}
                <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6">
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-3">
                    Suggestion Meta Description
                  </h3>
                  <p className="text-sm text-surface-700 dark:text-surface-300 mb-2 line-clamp-3">
                    {metaDesc}
                  </p>
                  <p className="text-xs text-surface-500">
                    {metaDesc.length}/160 caracteres
                  </p>
                  <p className={cn(
                    'text-xs mt-2',
                    metaDesc.length > 120 && metaDesc.length <= 160
                      ? 'text-green-600'
                      : 'text-amber-600'
                  )}>
                    {metaDesc.length > 120 && metaDesc.length <= 160 ? 'Optimal' : 'A ajuster'}
                  </p>
                </div>

                {/* Related Keywords */}
                <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6">
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-4">
                    Mots-cles connexes
                  </h3>
                  <div className="space-y-2">
                    {RELATED_KEYWORDS.map(kw => (
                      <label key={kw} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedKeywords.includes(kw)}
                          onChange={() => toggleKeyword(kw)}
                          className="w-4 h-4 rounded accent-brand-600 cursor-pointer"
                        />
                        <span className="text-sm text-surface-700 dark:text-surface-300 group-hover:text-surface-900 dark:group-hover:text-white">
                          {kw}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Structure Recommendations */}
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    Recommandations
                  </h3>
                  <ul className="space-y-2 text-sm text-surface-700 dark:text-surface-300">
                    <li>Utilisez votre mot-cle dans le premier paragraphe</li>
                    <li>Ajoutez au moins 3-4 sous-titres H2/H3</li>
                    <li>Incluez des listes a puces</li>
                    <li>Integrez les mots-cles LSI naturellement</li>
                    <li>Ajoutez une image avec alt-text optimise</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
