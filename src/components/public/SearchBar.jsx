import { Search } from "lucide-react";
import { useLanguage } from '../../i18n/useLanguage';

export default function SearchBar({ value, onChange }) {
  const { t } = useLanguage();
  const hasValue = Boolean(value?.trim());

  return (
    <div className="mvqr-search">
      <Search
        className="mvqr-search__icon"
        size={19}
        aria-hidden="true"
      />

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t('menu.searchPlaceholder')}
        aria-label={t('menu.searchPlaceholder')}
      />

      {hasValue && (
        <button
          type="button"
          className="mvqr-search__clear"
          onClick={() => onChange("")}
          aria-label={t('common.clear')}
        >
        </button>
      )}
    </div>
  );
}
