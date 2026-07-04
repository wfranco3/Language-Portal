import React from 'react';
import { useLanguage, Language } from '../lib/LanguageContext';
import { Languages } from 'lucide-react';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const options: { code: Language; label: string; flag: string }[] = [
    { code: 'pt', label: 'Português', flag: '🇧🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'id', label: 'Indonesia', flag: '🇮🇩' }
  ];

  return (
    <div className="flex items-center gap-1 bg-white/40 backdrop-blur-sm border border-ink-navy/10 rounded-full p-1 self-center" id="lang-selector">
      <div className="pl-2 pr-1 text-ink-navy/40">
        <Languages className="w-3.5 h-3.5" />
      </div>
      {options.map((opt) => (
        <button
          key={opt.code}
          onClick={() => setLanguage(opt.code)}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
            language === opt.code
              ? 'bg-ink-navy text-sand font-bold shadow-sm'
              : 'text-ink-navy/60 hover:text-ink-navy hover:bg-sand/50'
          }`}
          title={opt.label}
        >
          <span>{opt.flag}</span>
          <span className="uppercase text-[10px] tracking-wider">{opt.code}</span>
        </button>
      ))}
    </div>
  );
}
