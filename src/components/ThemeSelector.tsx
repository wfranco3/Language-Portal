import React from 'react';
import { useAppTheme } from '../lib/ThemeContext';
import { Sparkles, Feather } from 'lucide-react';

export default function ThemeSelector() {
  const { theme, setTheme } = useAppTheme();

  return (
    <div className="flex items-center gap-1 bg-card-bg/40 backdrop-blur-sm border border-ink-navy/10 rounded-full p-1 self-center" id="theme-selector">
      <button
        onClick={() => setTheme('classic')}
        className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
          theme === 'classic'
            ? 'bg-ink-navy text-sand font-bold shadow-sm'
            : 'text-ink-navy/60 hover:text-ink-navy hover:bg-sand/50'
        }`}
        title="Classic Mode"
      >
        <Feather className="w-3 h-3" />
        <span className="uppercase text-[9px] tracking-wider">Classic</span>
      </button>
      <button
        onClick={() => setTheme('premium')}
        className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
          theme === 'premium'
            ? 'bg-coral text-white font-bold shadow-sm'
            : 'text-ink-navy/60 hover:text-ink-navy hover:bg-sand/50'
        }`}
        title="Premium Mode"
      >
        <Sparkles className="w-3 h-3 text-amber-300" />
        <span className="uppercase text-[9px] tracking-wider">Premium</span>
      </button>
    </div>
  );
}
