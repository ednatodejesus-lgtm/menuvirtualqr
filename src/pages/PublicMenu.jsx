import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getRestaurantBySlug, getCategories, getProducts } from "../services/publicMenuService";
//  Importar do engine
import { ThemeProvider } from "../engine/ThemeProvider";
import RestaurantHero from "../components/public/RestaurantHero";
import CategoryTabs from "../components/public/CategoryTabs";
import ProductGrid from "../components/public/ProductGrid";
import SearchBar from "../components/public/SearchBar";
import RestaurantFooter from "../components/public/RestaurantFooter";
import LoadingScreen from "../components/public/LoadingScreen";
import EmptyMenu from "../components/public/EmptyMenu";
// Importar estilos
import { Lock, XCircle, Home } from "lucide-react";
import "../styles/public/public-menu.css";
import "../styles/public/public-menu.css";
import "../styles/public/categories.css";
import "../styles/public/product-card.css";
import "../styles/public/hero.css";
import "../styles/public/footer.css";

export default function PublicMenu() {
  const { slug } = useParams();
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
          setError("Restaurante nao encontrado.");
          setLoading(false);
          return;
        }
        if (restaurantData.status === "suspended") {
          setError("Este restaurante esta bloqueado. O menu nao pode ser exibido no momento.");
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
        setError(err?.message || "Nao foi possivel carregar o menu.");
      } finally {
        setLoading(false);
      }
    }
    if (slug) loadMenu();
    else {
      setError("Slug do restaurante nao informado.");
      setLoading(false);
    }
  }, [slug]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === "all" || product.category_id === activeCategory;
      const searchText = search.trim().toLowerCase();
      const matchesSearch = !searchText || product.name?.toLowerCase().includes(searchText) || product.description?.toLowerCase().includes(searchText);
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, search]);

  if (loading) return <LoadingScreen />;

  if (error) {
    const isBlocked = error.includes("bloqueado");
    return (
      <div className="mvqr-empty-menu">
        <div className="mvqr-error-card">
          <div className="mvqr-error-icon">
            {isBlocked ? <Lock size={48} color="#ef4444" /> : <XCircle size={48} color="#ef4444" />}
          </div>
          <h2 className="mvqr-error-title">
            {isBlocked ? "Restaurante bloqueado" : "Menu indisponivel"}
          </h2>
          <p className="mvqr-error-message">{error}</p>
          <button className="mvqr-error-button" onClick={() => window.location.href = "/"}>
            <Home size={16} /> Voltar ao inicio
          </button>
        </div>
      </div>
    );
  }

  if (!restaurant) return <EmptyMenu />;

  return (
    <ThemeProvider theme={restaurant.theme}>
      <main className="mvqr-public-menu">
        <RestaurantHero restaurant={restaurant} />
        <div className="menu-content">
          <SearchBar value={search} onChange={setSearch} />
          <CategoryTabs categories={categories} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
          <ProductGrid products={filteredProducts} />
        </div>
        <RestaurantFooter restaurant={restaurant} />
      </main>
    </ThemeProvider>
  );
}