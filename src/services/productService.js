import { supabase } from "../services/supabase";



export async function getProducts(restaurantId){


    const {data,error}=await supabase

        .from("products")

        .select(`
            *,
            categories(
                name
            )
        `)

        .eq(
            "restaurant_id",
            restaurantId
        )

        .order(
            "sort_order",
            {
                ascending:true
            }
        );



    if(error)
        throw error;


    return data;

}





export async function createProduct(product){


    const {data,error}=await supabase

        .from("products")

        .insert(product)

        .select()

        .single();



    if(error)
        throw error;



    return data;

}





export async function updateProduct(id,values){


    const {data,error}=await supabase

        .from("products")

        .update(values)

        .eq(
            "id",
            id
        )

        .select()

        .single();



    if(error)
        throw error;



    return data;


}





export async function deleteProduct(id){


    const {error}=await supabase

        .from("products")

        .delete()

        .eq(
            "id",
            id
        );


    if(error)
        throw error;


}