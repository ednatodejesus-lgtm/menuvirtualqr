import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getRestaurantBySlug,
  getCategories,
  getProducts,
} from "../services/publicMenuService";

import ThemeProvider from "../engine/ThemeProvider";

import RestaurantHero from "../components/public/RestaurantHero";
import CategoryTabs from "../components/public/CategoryTabs";
import ProductGrid from "../components/public/ProductGrid";
import SearchBar from "../components/public/SearchBar";
import RestaurantFooter from "../components/public/RestaurantFooter";
import LoadingScreen from "../components/public/LoadingScreen";
import EmptyMenu from "../components/public/EmptyMenu";


import { AlertCircle, Lock, UtensilsCrossed, Home, XCircle } from "lucide-react";

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
          setError(
            "Este restaurante está bloqueado. O menu não pode ser exibido no momento."
          );
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

    if (slug) {
      loadMenu();
    } else {
      setError("Slug do restaurante nao informado.");
      setLoading(false);
    }
  }, [slug]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "all" ||
        product.category_id === activeCategory;

      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        product.name?.toLowerCase().includes(searchText) ||
        product.description?.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, search]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    //  VERIFICAR SE O ERRO E SOBRE BLOQUEIO
    const isBlocked = error.includes("bloqueado") || error.includes("bloqueado");
    
    return (
      <div className="mvqr-empty-menu" style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "2rem",
        textAlign: "center",
        backgroundColor: "#f8fafc"
      }}>
        <div style={{
          maxWidth: "400px",
          padding: "2rem",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
        }}>
          {/* ICONE COM BASE NO TIPO DE ERRO */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "1rem"
          }}>
            {isBlocked ? (
              <Lock size={48} color="#ef4444" />
            ) : (
              <XCircle size={48} color="#ef4444" />
            )}
          </div>
          
          <h2 style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            color: "#0f172a",
            marginBottom: "0.5rem"
          }}>
            {isBlocked ? "Restaurante bloqueado!" : "Menu indisponivel"}
          </h2>
          
          <p style={{
            color: "#64748b",
            fontSize: "0.875rem",
            lineHeight: "1.6",
            marginBottom: "1.5rem"
          }}>
            {error}
          </p>
          
          <button
            onClick={() => window.location.href = "/"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1.5rem",
              backgroundColor: "#8B4513",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#6b3410"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#8B4513"}
          >
            <Home size={16} />
            Voltar ao inicio
          </button>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return <EmptyMenu />;
  }

  return (
    <ThemeProvider theme={restaurant.theme}>
      <main className="mvqr-public-menu">
        <RestaurantHero restaurant={restaurant} />

        <SearchBar
          value={search}
          onChange={setSearch}
        />

        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <ProductGrid
          products={filteredProducts}
        />

        <RestaurantFooter
          restaurant={restaurant}
        />
      </main>
    </ThemeProvider>
  );
}