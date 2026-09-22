import { Globe } from 'lucide-react';
import { useLanguage } from '../../i18n/useLanguage';

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="mvqr-language-switcher"
      aria-label="Change language"
      title={language === 'pt' ? 'Switch to English' : 'Mudar para Português'}
    >
      <Globe size={18} />
      <span>{language === 'pt' ? 'PT' : 'EN'}</span>
    </button>
  );
}