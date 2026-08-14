export default function SearchBar({
  value,
  onChange,
}) {
  return (
    <div className="mvqr-search">

      <span className="mvqr-search__icon">
        🔎
      </span>

      <input
        type="search"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder="Pesquisar no menu..."
        aria-label="Pesquisar no menu"
      />

    </div>
  );
}