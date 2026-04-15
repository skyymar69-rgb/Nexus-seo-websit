'use client';

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Loader2 } from 'lucide-react';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(emailParam || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Password strength
  const [strength, setStrength] = useState({ score: 0, label: '', color: '' });

  useEffect(() => {
    if (!password) { setStrength({ score: 0, label: '', color: '' }); return; }
    let s = 0;
    if (password.length >= 8) s++;
    if (password.length >= 12) s++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) s++;
    if (/\d/.test(password)) s++;
    if (/[^a-zA-Z\d]/.test(password)) s++;
    s = Math.min(s, 4);
    const labels = ['', 'Faible', 'Moyen', 'Bon', 'Très fort'];
    const colors = ['', 'bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];
    setStrength({ score: s, label: labels[s] || '', color: colors[s] || '' });
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || name.trim().length < 2) { setError('Le nom doit contenir au moins 2 caractères.'); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Adresse e-mail invalide.'); return; }
    if (password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères.'); return; }
    if (password !== confirmPassword) { setError('Les mots de passe ne correspondent pas.'); return; }
    if (!agreeTerms) { setError('Veuillez accepter les conditions d\'utilisation.'); return; }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, plan: 'free' }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Erreur lors de l\'inscription.'); return; }

      const signInResult = await signIn('credentials', { email, password, redirect: false });
      if (signInResult?.ok) {
        router.push('/dashboard/onboarding');
      } else {
        router.push('/login');
      }
    } catch {
      setError('Erreur serveur. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Créer un compte</h2>
        <p className="text-sm text-white/50">
          Rejoignez Nexus SEO et commencez à optimiser votre référencement
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
          <p className="text-sm text-rose-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-1.5">Nom complet</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Jean Dupont"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1.5">Adresse e-mail</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@example.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-1.5">Mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              id="password" type={showPassword ? 'text' : 'password'} value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-colors"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full transition-all ${strength.color}`} style={{ width: `${(strength.score / 4) * 100}%` }} />
              </div>
              <span className="text-xs text-white/40">{strength.label}</span>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/70 mb-1.5">Confirmer le mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              id="confirmPassword" type="password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2">
          <input id="terms" type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-brand-500 focus:ring-brand-500/50" />
          <label htmlFor="terms" className="text-sm text-white/50">
            J&apos;accepte les{' '}
            <Link href="/cgu" className="text-brand-400 hover:text-brand-300">conditions d&apos;utilisation</Link>
            {' '}et la{' '}
            <Link href="/privacy" className="text-brand-400 hover:text-brand-300">politique de confidentialité</Link>
          </label>
        </div>

        <button type="submit" disabled={isLoading}
          className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Inscription en cours...</>
          ) : (
            <>Créer mon compte <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-white/40">
        Déjà un compte ?{' '}
        <Link href="/login" className="font-medium text-brand-400 hover:text-brand-300">Se connecter</Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="space-y-6 animate-pulse" />}>
      <SignupForm />
    </Suspense>
  );
}
