export default function CategoryTabs({
  categories = [],
  activeCategory,
  onCategoryChange,
}) {
  if (!categories.length) {
    return null;
  }

  return (
    <nav
      className="mvqr-category-tabs"
      aria-label="Categorias do menu"
    >
      <button
        type="button"
        className={
          activeCategory === "all"
            ? "mvqr-category-tab active"
            : "mvqr-category-tab"
        }
        onClick={() => onCategoryChange("all")}
      >
        Todos
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          className={
            activeCategory === category.id
              ? "mvqr-category-tab active"
              : "mvqr-category-tab"
          }
          onClick={() =>
            onCategoryChange(category.id)
          }
        >
          {category.name}
        </button>
      ))}
    </nav>
  );
}