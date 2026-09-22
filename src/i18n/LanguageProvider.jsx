import { useState, useEffect } from 'react';
import { translations } from './translations';
import { LanguageContext } from './languageContext';

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('mvqr_language');
    if (saved && (saved === 'pt' || saved === 'en')) {
      return saved;
    }
    const browserLang = navigator.language?.split('-')[0];
    return browserLang === 'en' ? 'en' : 'pt';
  });

  useEffect(() => {
    localStorage.setItem('mvqr_language', language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'pt' ? 'en' : 'pt'));
  };

  const t = (path) => {
    const keys = path.split('.');
    let result = translations[language];

    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        let fallback = translations['pt'];
        for (const k of keys) {
          if (fallback && fallback[k] !== undefined) {
            fallback = fallback[k];
          } else {
            return path;
          }
        }
        return fallback;
      }
    }

    return result;
  };

  const getBusinessInfo = (type) => {
    const types = translations[language].businessTypes;
    return types[type] || types.outros;
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    getBusinessInfo,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}