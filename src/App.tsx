/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthUser } from './types';
import LoginScreen from './components/LoginScreen';
import StudentPortal from './components/StudentPortal';
import ProfessorDashboard from './components/ProfessorDashboard';
import { LanguageProvider, useLanguage } from './lib/LanguageContext';
import { ThemeProvider } from './lib/ThemeContext';

function AppContent() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  // Load session from localStorage on startup
  useEffect(() => {
    try {
      const stored = localStorage.getItem('idiomas_session');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error recovering session:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLoginSuccess = (authenticatedUser: AuthUser) => {
    setUser(authenticatedUser);
    localStorage.setItem('idiomas_session', JSON.stringify(authenticatedUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('idiomas_session');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-light flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-coral border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-ink-navy/60">
            {t('loadingSession')}
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  if (user.role === 'professor') {
    return <ProfessorDashboard user={user} onLogout={handleLogout} />;
  }

  return <StudentPortal user={user} onLogout={handleLogout} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
