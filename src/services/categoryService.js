import { supabase } from "../services/supabase";


export async function getCategories(restaurantId){


    const {data,error}= await supabase
        .from("categories")
        .select("*")
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



export async function createCategory(category){


    const {data,error}= await supabase
        .from("categories")
        .insert(category)
        .select()
        .single();


    if(error)
        throw error;


    return data;


}



export async function updateCategory(id,values){


    const {data,error}= await supabase
        .from("categories")
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



export async function deleteCategory(id){


    const {error}= await supabase
        .from("categories")
        .delete()
        .eq(
            "id",
            id
        );


    if(error)
        throw error;


}