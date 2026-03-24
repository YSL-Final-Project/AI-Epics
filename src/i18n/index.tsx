import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import zh from './locales/zh';
import en from './locales/en';
import type { Translations } from './locales/zh';

type Lang = 'zh' | 'en';

interface I18nContextType {
  lang: Lang;
  t: Translations;
  toggleLang: () => void;
  setLang: (lang: Lang) => void;
}

const translations: Record<Lang, Translations> = { zh, en };

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('aice_lang') as Lang;
      if (saved === 'en' || saved === 'zh') return saved;
    } catch { /* noop */ }
    return 'zh';
  });

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem('aice_lang', l); } catch { /* noop */ }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'zh' ? 'en' : 'zh');
  }, [lang, setLang]);

  return (
    <I18nContext.Provider value={{ lang, t: translations[lang], toggleLang, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
