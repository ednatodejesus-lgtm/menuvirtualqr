import { useTheme } from "../../contexts/ThemeContext";

export default function CategoryTabs({
  categories = [],
  activeCategory,
  onCategoryChange,
}) {
  const { theme } = useTheme();

  if (!categories.length) {
    return null;
  }

  const variant =
    theme?.layout?.categories?.variant ||
    "horizontal_scroll";

  const position =
    theme?.layout?.categories?.position ||
    "static";


  const allCategories = [
    {
      id: "all",
      name: "Todos",
    },
    ...categories,
  ];


  return (
    <nav
      className={`
        mvqr-category-tabs
        mvqr-category-tabs--${variant}
        mvqr-category-tabs--${position}
      `}
      aria-label="Categorias do menu"
    >
      <div className="mvqr-category-tabs__inner">

        {allCategories.map((category) => {

          const active =
            activeCategory === category.id;

          return (
            <button
              key={category.id}
              type="button"
              className={`
                mvqr-category-tab
                ${active ? "active" : ""}
              `}
              onClick={() =>
                onCategoryChange(category.id)
              }
            >
              {category.name}
            </button>
          );
        })}

      </div>
    </nav>
  );
}