import { supabase } from "../services/supabase";


export async function getRestaurantQR(restaurantId){


    const {data,error}=await supabase

        .from("qr_codes")

        .select("*")

        .eq(
            "restaurant_id",
            restaurantId
        )

        .eq(
            "tipo",
            "menu"
        )

        .single();



    if(error)
        throw error;


    return data;


}