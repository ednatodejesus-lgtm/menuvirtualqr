import { supabase } from "./supabase";



export async function generateRestaurantTheme(data){


    try{


        const {
            data:response,
            error

        } = await supabase.functions.invoke(

            "generate-theme",

            {
                body:data
            }

        );



        if(error){

            console.error(
                "Theme generation error:",
                error
            );


            throw error;

        }




        if(!response?.theme){


            throw new Error(
                "Invalid theme response"
            );


        }



        return response.theme;



    }
    catch(error){


        console.error(
            "generateRestaurantTheme failed:",
            error
        );


        throw error;


    }


}