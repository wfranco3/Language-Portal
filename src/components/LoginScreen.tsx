import React, { useState } from 'react';
import { AuthUser } from '../types';
import { LogIn, BookOpen, GraduationCap } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import LanguageSelector from './LanguageSelector';
import ThemeSelector from './ThemeSelector';

interface LoginScreenProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(t('loginErrorFields'));
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error during login.');
      }

      onLoginSuccess(data);
    } catch (err: any) {
      setError(err.message || 'Error connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = async (demoEmail: string, demoPass: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: demoPass })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error during demo login.');
      }

      onLoginSuccess(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-light flex items-center justify-center p-4 flex-col gap-6">
      {/* Top Floating Selectors */}
      <div className="flex items-center gap-2">
        <LanguageSelector />
        <ThemeSelector />
      </div>

      <div className="w-full max-w-md bg-card-bg rounded-[14px] border border-[rgba(28,37,65,0.12)] p-8 relative overflow-hidden shadow-sm">
        
        {/* Stamp Signature Accent */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full border border-[rgba(28,37,65,0.08)] flex items-center justify-center rotate-12 pointer-events-none">
          <div className="w-24 h-24 rounded-full border border-dashed border-[rgba(28,37,65,0.08)] flex items-center justify-center">
            <span className="text-[9px] font-mono-plex tracking-widest text-ink-navy opacity-30 uppercase">ID*LANG</span>
          </div>
        </div>

        {/* Brand Header */}
        <div className="text-center mb-8">
          {/* Logo Circular Stamp */}
          <div className="w-16 h-16 rounded-full border-2 border-ink-navy border-dashed mx-auto flex items-center justify-center mb-4 relative rotate-[-6deg]">
            <div className="w-12 h-12 rounded-full bg-ink-navy flex items-center justify-center text-sand">
              <BookOpen className="w-6 h-6" />
            </div>
            {/* Stamp Badge */}
            <div className="absolute -bottom-1 -right-2 bg-coral text-white text-[8px] font-mono-plex px-1.5 py-0.5 rounded-full uppercase tracking-wider scale-90">
              EST. 2026
            </div>
          </div>

          <h1 className="text-3xl font-serif text-ink-navy mb-1 tracking-tight">
            {t('loginTitle')}
          </h1>
          <p className="text-sm text-ink-navy/60 font-sans">
            {t('loginSub')}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-coral/10 text-coral text-xs rounded-lg border border-coral/20 font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono-plex uppercase tracking-wider text-ink-navy/70 mb-1">
              {t('emailLabel')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-sand-light/50 border border-[rgba(28,37,65,0.15)] rounded-[14px] px-4 py-2.5 text-sm text-ink-navy focus:outline-none focus:ring-1 focus:ring-coral/50 font-sans transition-all"
              placeholder="seu@email.com"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono-plex uppercase tracking-wider text-ink-navy/70 mb-1">
              {t('passwordLabel')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-sand-light/50 border border-[rgba(28,37,65,0.15)] rounded-[14px] px-4 py-2.5 text-sm text-ink-navy focus:outline-none focus:ring-1 focus:ring-coral/50 font-sans transition-all"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-coral hover:bg-coral/90 text-white font-sans font-medium text-sm py-3 px-4 rounded-[14px] transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>{t('btnEnter')}</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Logins Section */}
        <div className="mt-8 pt-6 border-t border-[rgba(28,37,65,0.1)]">
          <p className="text-center text-[10px] font-mono-plex uppercase tracking-wider text-ink-navy/50 mb-4">
            {t('demoAccessTitle')}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => loginAsDemo('meella@idiomas.com', 'admin')}
              className="flex items-center justify-center gap-1.5 bg-ink-navy text-sand text-xs font-medium py-2 px-3 rounded-lg border border-ink-navy/20 hover:opacity-95 transition-all cursor-pointer"
              disabled={loading}
            >
              <GraduationCap className="w-3.5 h-3.5 text-coral" />
              <span>{t('demoHelena')}</span>
            </button>
            <button
              onClick={() => loginAsDemo('carlos@aluno.com', 'aluno')}
              className="flex items-center justify-center gap-1.5 bg-sand text-ink-navy text-xs font-medium py-2 px-3 rounded-lg border border-sand/30 hover:opacity-95 transition-all cursor-pointer"
              disabled={loading}
            >
              <BookOpen className="w-3.5 h-3.5 text-sage" />
              <span>{t('demoCarlos')}</span>
            </button>
            <button
              onClick={() => loginAsDemo('marcus@idiomas.com', 'admin')}
              className="flex items-center justify-center gap-1.5 bg-ink-navy text-sand text-xs font-medium py-2 px-3 rounded-lg border border-ink-navy/20 hover:opacity-95 transition-all cursor-pointer"
              disabled={loading}
            >
              <GraduationCap className="w-3.5 h-3.5 text-coral" />
              <span>{t('demoMarcus')}</span>
            </button>
            <button
              onClick={() => loginAsDemo('mariana@aluno.com', 'aluno')}
              className="flex items-center justify-center gap-1.5 bg-sand text-ink-navy text-xs font-medium py-2 px-3 rounded-lg border border-sand/30 hover:opacity-95 transition-all cursor-pointer"
              disabled={loading}
            >
              <BookOpen className="w-3.5 h-3.5 text-sage" />
              <span>{t('demoMariana')}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
