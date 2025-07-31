
import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';

type Locale = 'en' | 'ko' | 'ja' | 'zh';

interface LocalizationContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  translations: Record<string, string>;
  t: (key: string) => string;
}

export const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    const storedLocale = localStorage.getItem('locale') as Locale | null;
    
    if (storedLocale) {
        setLocale(storedLocale);
    } else if (['en', 'ko', 'ja', 'zh'].includes(browserLang)) {
        setLocale(browserLang as Locale);
    } else {
        setLocale('en');
    }
  }, []);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await fetch(`/locales/${locale}.json`);
        const data = await response.json();
        setTranslations(data);
        localStorage.setItem('locale', locale);
        document.documentElement.lang = locale;
      } catch (error) {
        console.error(`Could not load locale file: ${locale}.json`, error);
        // Fallback to English if loading fails
        const response = await fetch(`/locales/en.json`);
        const data = await response.json();
        setTranslations(data);
      }
    };
    fetchTranslations();
  }, [locale]);

  const t = useCallback((key: string): string => {
    return translations[key] || key;
  }, [translations]);

  const value = useMemo(() => ({ locale, setLocale, translations, t }), [locale, translations, t]);

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};
