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


export default function PublicMenu() {

  const { slug } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [activeCategory, setActiveCategory] =
    useState("all");

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);


  useEffect(() => {

    async function loadMenu() {

      try {

        setLoading(true);
        setError(null);

        const restaurantData =
          await getRestaurantBySlug(slug);

        const [
          categoriesData,
          productsData,
        ] = await Promise.all([
          getCategories(restaurantData.id),
          getProducts(restaurantData.id),
        ]);

        setRestaurant(restaurantData);
        setCategories(categoriesData || []);
        setProducts(productsData || []);

      } catch (err) {

        console.error(
          "Public menu error:",
          err
        );

        setError(
          err?.message ||
          "Não foi possível carregar o menu."
        );

      } finally {

        setLoading(false);

      }
    }


    if (slug) {
      loadMenu();
    }

  }, [slug]);


  const filteredProducts = useMemo(() => {

    return products.filter((product) => {

      const matchesCategory =
        activeCategory === "all" ||
        product.category_id === activeCategory;

      const searchText =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        product.name
          ?.toLowerCase()
          .includes(searchText) ||
        product.description
          ?.toLowerCase()
          .includes(searchText);

      return (
        matchesCategory &&
        matchesSearch
      );
    });

  }, [
    products,
    activeCategory,
    search,
  ]);


  if (loading) {
    return <LoadingScreen />;
  }


  if (error) {

    return (
      <div className="mvqr-empty-menu">

        <h2>
          Não foi possível carregar o menu
        </h2>

        <p>
          {error}
        </p>

      </div>
    );
  }


  if (!restaurant) {
    return <EmptyMenu />;
  }


  return (

    <ThemeProvider
      theme={restaurant.theme}
    >

      <main className="mvqr-public-menu">

        <RestaurantHero
          restaurant={restaurant}
        />


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