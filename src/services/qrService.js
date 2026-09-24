import { supabase } from "../services/supabase";

export async function getRestaurantQR(restaurantId) {
  const { data, error } = await supabase
    .from("qr_codes")
    .select(`
      *,
      restaurant:restaurants(name, slug)
    `)
    .eq("restaurant_id", restaurantId)
    .eq("tipo", "menu")
    .single();

  if (error) throw error;

  // Achata o resultado para facilitar o acesso no resto do código
  return {
    ...data,
    restaurant_name: data.restaurant?.name || null,
    restaurant_slug: data.restaurant?.slug || data.slug || null,
  };
}