import {
    useState
} from "react";


import Card from "../ui/Card";
import Button from "../ui/Button";


import {
    useAuth
} from "../../../hooks/useAuth";


import {
    updateRestaurantSettings
} from "../../../services/restaurantSettingsService";




import {
    supabase
} from "../../../services/supabase";



//


export default function AISettings(){



    const {

        profile

    } = useAuth();





    const [loading,setLoading] = useState(false);



    const [message,setMessage] = useState("");




    const restaurantId =
        profile?.restaurant_id;








    async function generateTheme(){



        try{


            setLoading(true);

            setMessage("");




            const {

                data,

                error

            } = await supabase.functions.invoke(

                "generate-restaurant-theme",

                {

                    body:{

                        restaurant_id:
                        restaurantId

                    }

                }

            );






            if(error)

                throw error;







            await updateRestaurantSettings(


                restaurantId,


                {


                    theme:data

                }


            );






            setMessage(

                "Tema gerado e aplicado com sucesso."

            );





        }


        catch(error){


            console.error(

                "Erro ao gerar tema:",

                error

            );



            setMessage(

                "Não foi possível gerar o tema."

            );


        }



        finally{


            setLoading(false);


        }



    }









    return (



        <Card title="Inteligência Artificial">






            <p>

                Utilize a IA para melhorar automaticamente o perfil visual do restaurante.

            </p>







            <Button

                onClick={generateTheme}

                disabled={loading}

            >


                {

                loading

                ?

                "Gerando..."

                :

                "Gerar Tema"

                }


            </Button>







            <br/>

            <br/>








            <Button

                variant="secondary"

            >

                Melhorar Descrição

            </Button>







            <br/>

            <br/>








            <Button

                variant="secondary"

            >

                Gerar Paleta de Cores

            </Button>








            {

            message &&

            <p>

                {message}

            </p>

            }





        </Card>



    );


}