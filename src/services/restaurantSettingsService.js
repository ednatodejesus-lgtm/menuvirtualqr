import { supabase } from "../services/supabase";



export async function getRestaurantSettings(
    restaurantId
){


    if(!restaurantId)
        throw new Error(
            "Restaurant ID obrigatório"
        );



    const {

        data,

        error

    } = await supabase


        .from("restaurants")


        .select(
            `
            id,
            name,
            description,
            logo_url,
            contact_phone,
            contact_email,
            address,
            social_links,
            business_type,
            style,
            theme,
            status
            `
        )


        .eq(
            "id",
            restaurantId
        )


        .single();




    if(error)
        throw error;



    return data;



}






export async function updateRestaurantSettings(
    restaurantId,
    updates
){



    if(!restaurantId)

        throw new Error(
            "Restaurant ID obrigatório"
        );




    const {

        data,

        error

    } = await supabase


        .from("restaurants")


        .update(
            updates
        )


        .eq(
            "id",
            restaurantId
        )


        .select()


        .single();





    if(error)

        throw error;




    return data;



}