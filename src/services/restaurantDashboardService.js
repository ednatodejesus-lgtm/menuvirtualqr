import { supabase } from "../services/supabase";



/**
 * Buscar estatísticas principais do Cockpit
 */
export async function getDashboardStats(restaurantId) {


    if (!restaurantId) {

        throw new Error(
            "Restaurant ID não informado"
        );

    }



    const [

        categories,

        products,

        qrCode

    ] = await Promise.all([



        supabase

            .from("categories")

            .select(
                "id",
                {
                    count: "exact",
                    head: true
                }
            )

            .eq(
                "restaurant_id",
                restaurantId
            ),




        supabase

            .from("products")

            .select(
                "id",
                {
                    count: "exact",
                    head: true
                }
            )

            .eq(
                "restaurant_id",
                restaurantId
            ),





        supabase

            .from("qr_codes")

            .select(
                `
                id,
                ativo,
                acessos,
                link,
                created_at,
                updated_at
                `
            )

            .eq(
                "restaurant_id",
                restaurantId
            )

            .eq(
                "tipo",
                "menu"
            )

            .maybeSingle()



    ]);





    if (categories.error)
        throw categories.error;



    if (products.error)
        throw products.error;



    if (qrCode.error)
        throw qrCode.error;





    return {


        categoriesCount:
            categories.count ?? 0,



        productsCount:
            products.count ?? 0,



        qrCode:
            qrCode.data ?? null



    };


}







/**
 * Buscar atividades recentes
 * baseado nas tabelas existentes
 */
export async function getRecentActivities(
    restaurantId
) {


    if (!restaurantId) {

        throw new Error(
            "Restaurant ID não informado"
        );

    }



    const [

        categories,

        products,

        qrCodes,

        restaurant


    ] = await Promise.all([




        supabase

            .from("categories")

            .select(
                `
                id,
                name,
                created_at,
                updated_at
                `
            )

            .eq(
                "restaurant_id",
                restaurantId
            )

            .order(
                "updated_at",
                {
                    ascending:false
                }
            )

            .limit(5),






        supabase

            .from("products")

            .select(
                `
                id,
                name,
                created_at,
                updated_at
                `
            )

            .eq(
                "restaurant_id",
                restaurantId
            )

            .order(
                "updated_at",
                {
                    ascending:false
                }
            )

            .limit(5),






        supabase

            .from("qr_codes")

            .select(
                `
                id,
                created_at,
                updated_at,
                acessos
                `
            )

            .eq(
                "restaurant_id",
                restaurantId
            )

            .eq(
                "tipo",
                "menu"
            )

            .limit(1),






        supabase

            .from("restaurants")

            .select(
                `
                updated_at
                `
            )

            .eq(
                "id",
                restaurantId
            )

            .maybeSingle()



    ]);







    if(categories.error)
        throw categories.error;



    if(products.error)
        throw products.error;



    if(qrCodes.error)
        throw qrCodes.error;



    if(restaurant.error)
        throw restaurant.error;







    const activities = [];





    categories.data?.forEach(
        category => {


            const created =
                category.created_at === category.updated_at;



            activities.push({

                type:"category",

                text:

                created

                ?

                `Criou a categoria ${category.name}`

                :

                `Atualizou a categoria ${category.name}`,



                date:

                category.updated_at


            });


        }
    );







    products.data?.forEach(
        product => {


            const created =
                product.created_at === product.updated_at;



            activities.push({


                type:"product",


                text:


                created

                ?

                `Adicionou o produto ${product.name}`

                :

                `Atualizou o produto ${product.name}`,



                date:

                product.updated_at


            });


        }
    );







    qrCodes.data?.forEach(
        qr => {


            activities.push({

                type:"qr",

                text:
                "QR Code do menu gerado",


                date:
                qr.updated_at || qr.created_at


            });


        }
    );








    if(restaurant.data){


        activities.push({


            type:"restaurant",


            text:
            "Atualizou informações do restaurante",


            date:
            restaurant.data.updated_at


        });


    }









    return activities

        .sort(

            (a,b)=>

            new Date(b.date)

            -

            new Date(a.date)

        )

        .slice(0,10);



}








/**
 * Realtime do Cockpit
 */
export function subscribeDashboardChanges(
    restaurantId,
    callback
) {



    if(!restaurantId)
        return;



    const channel = supabase

        .channel(
            `restaurant-dashboard-${restaurantId}`
        )




        .on(

            "postgres_changes",

            {

                event:"*",

                schema:"public",

                table:"categories",

                filter:
                `restaurant_id=eq.${restaurantId}`

            },

            callback

        )





        .on(

            "postgres_changes",

            {

                event:"*",

                schema:"public",

                table:"products",

                filter:
                `restaurant_id=eq.${restaurantId}`

            },

            callback

        )





        .on(

            "postgres_changes",

            {

                event:"*",

                schema:"public",

                table:"qr_codes",

                filter:
                `restaurant_id=eq.${restaurantId}`

            },

            callback

        )





        .on(

            "postgres_changes",

            {

                event:"*",

                schema:"public",

                table:"restaurants",

                filter:
                `id=eq.${restaurantId}`

            },

            callback

        )




        .subscribe();







    return () => {


        supabase

            .removeChannel(channel);


    };


}