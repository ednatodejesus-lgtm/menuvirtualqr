import { Search, } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
}) {
  const hasValue = Boolean(
    value?.trim()
  );

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
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder="Pesquisar no menu..."
        aria-label="Pesquisar no menu"
      />

      {hasValue && (
        <button
          type="button"
          className="mvqr-search__clear"
          onClick={() => onChange("")}
          aria-label="Limpar pesquisa"
        >
        </button>
      )}

    </div>
  );
}