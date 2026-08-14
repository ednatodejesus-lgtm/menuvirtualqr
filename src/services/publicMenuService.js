import { supabase, TABLES } from "./supabase";

/**
 * Busca um restaurante através do slug público.
 *
 * Exemplo:
 * /menu/luna
 * → slug = "luna"
 */
export async function getRestaurantBySlug(slug) {
  if (!slug) {
    throw new Error("Restaurant slug is required");
  }

  const { data, error } = await supabase
    .from(TABLES.RESTAURANTS)
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Busca as categorias do restaurante.
 */
export async function getCategories(restaurantId) {
  if (!restaurantId) {
    throw new Error("Restaurant ID is required");
  }

  const { data, error } = await supabase
    .from(TABLES.CATEGORIES)
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}

/**
 * Busca os produtos do restaurante.
 */
export async function getProducts(restaurantId) {
  if (!restaurantId) {
    throw new Error("Restaurant ID is required");
  }

  const { data, error } = await supabase
    .from(TABLES.PRODUCTS)
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}