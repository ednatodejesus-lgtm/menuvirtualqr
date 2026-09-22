import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getRestaurantBySlug, getCategories, getProducts } from "../services/publicMenuService";
import { ThemeProvider } from "../engine/ThemeProvider";
import { LanguageProvider } from "../i18n/LanguageProvider";
import { useLanguage } from "../i18n/useLanguage";
import RestaurantHero from "../components/public/RestaurantHero";
import CategoryTabs from "../components/public/CategoryTabs";
import ProductGrid from "../components/public/ProductGrid";
import SearchBar from "../components/public/SearchBar";
import RestaurantFooter from "../components/public/RestaurantFooter";
import LoadingScreen from "../components/public/LoadingScreen";
import EmptyMenu from "../components/public/EmptyMenu";
import LanguageSwitcher from "../components/public/LanguageSwitcher";
import { Lock, XCircle, Home } from "lucide-react";
import "../styles/public/public-menu.css";
import "../styles/public/categories.css";
import "../styles/public/product-card.css";
import "../styles/public/hero.css";
import "../styles/public/footer.css";

// ============================================================
// 🔥 COMPONENTE INTERNO (usa useLanguage)
// ============================================================
function PublicMenuContent() {
  const { slug } = useParams();
  const { t } = useLanguage();

  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMenu() {
      try {
        setLoading(true);
        setError(null);

        const restaurantData = await getRestaurantBySlug(slug);

        if (!restaurantData) {
          setError("error.notFound"); // 🔥 chave da tradução
          setLoading(false);
          return;
        }

        if (restaurantData.status === "suspended") {
          setError("blocked"); // 🔥 chave de bloqueio
          setLoading(false);
          return;
        }

        const [categoriesData, productsData] = await Promise.all([
          getCategories(restaurantData.id),
          getProducts(restaurantData.id),
        ]);

        setRestaurant(restaurantData);
        setCategories(categoriesData || []);
        setProducts(productsData || []);
      } catch (err) {
        console.error("Public menu error:", err);
        setError("error.generic");
      } finally {
        setLoading(false);
      }
    }

    if (slug) loadMenu();
    else {
      setError("error.notFound");
      setLoading(false);
    }
  }, [slug]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "all" || product.category_id === activeCategory;
      const searchText = search.trim().toLowerCase();
      const matchesSearch =
        !searchText ||
        product.name?.toLowerCase().includes(searchText) ||
        product.description?.toLowerCase().includes(searchText);
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, search]);

  // ============================================================
  // 1. LOADING
  // ============================================================
  if (loading) return <LoadingScreen />;

  // ============================================================
  // 2. ERRO / BLOQUEIO
  // ============================================================
  if (error) {
    const isBlocked = error === "blocked";

    return (
      <div className="mvqr-empty-menu">
        <LanguageSwitcher />

        <div className="mvqr-error-card">
          <div className="mvqr-error-icon">
            {isBlocked ? (
              <Lock size={48} color="#ef4444" />
            ) : (
              <XCircle size={48} color="#ef4444" />
            )}
          </div>

          <h2 className="mvqr-error-title">
            {isBlocked ? t("blocked.title") : t("error.title")}
          </h2>

          <p className="mvqr-error-message">
            {isBlocked ? t("blocked.message") : t(error)}
          </p>

          <button
            className="mvqr-error-button"
            onClick={() => (window.location.href = "/")}
          >
            <Home size={16} />
            {t("common.backToHome")}
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // 3. RESTAURANTE NÃO ENCONTRADO
  // ============================================================
  if (!restaurant) return <EmptyMenu />;

  // ============================================================
  // 4. PÁGINA COMPLETA
  // ============================================================
  const hasProducts = filteredProducts.length > 0;
  const isMenuEmpty = products.length === 0;

  return (
    <ThemeProvider theme={restaurant.theme}>
      {/* 🔥 SELETOR DE IDIOMA */}
      <LanguageSwitcher />

      <main className="mvqr-public-menu">
        {/* HERO SEMPRE VISÍVEL */}
        <RestaurantHero restaurant={restaurant} />

        <div className="menu-content">
          {/* SEARCH BAR SEMPRE VISÍVEL */}
          <SearchBar value={search} onChange={setSearch} />

          {/* CATEGORIAS */}
          {!isMenuEmpty && categories.length > 0 && (
            <CategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          )}

          {/* CONTEÚDO */}
          {isMenuEmpty ? (
            <EmptyMenu restaurant={restaurant} />
          ) : hasProducts ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="mvqr-no-results">
              <p>{t("menu.noResults")}</p>
            </div>
          )}
        </div>

        {/* FOOTER SEMPRE VISÍVEL */}
        <RestaurantFooter restaurant={restaurant} />
      </main>
    </ThemeProvider>
  );
}

// ============================================================
// 🔥 WRAPPER COM LANGUAGE PROVIDER
// ============================================================
export default function PublicMenu() {
  return (
    <LanguageProvider>
      <PublicMenuContent />
    </LanguageProvider>
  );
}