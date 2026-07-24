import {
    useEffect,
    useState
} from "react";


import Card from "../ui/Card";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";


import {
    useAuth
} from "../../../hooks/useAuth";


import {
    getRestaurantSettings,
    updateRestaurantSettings
} from "../../../services/restaurantSettingsService";





export default function RestaurantSettings() {



    const {

        profile

    } = useAuth();




    const [loading,setLoading] = useState(true);



    const [saving,setSaving] = useState(false);




    const [form,setForm] = useState({


        name:"",

        description:"",

        contact_phone:"",

        contact_email:"",

        address:""


    });






    const restaurantId =
        profile?.restaurant_id;








    useEffect(()=>{


        loadSettings();


    },[restaurantId]);







    async function loadSettings(){


        if(!restaurantId)

            return;



        try{


            const data = await getRestaurantSettings(

                restaurantId

            );



            setForm({


                name:data.name || "",


                description:data.description || "",


                contact_phone:data.contact_phone || "",


                contact_email:data.contact_email || "",


                address:data.address || ""


            });



        }


        catch(error){


            console.error(
                "Erro ao carregar restaurante:",
                error
            );


        }

        finally{


            setLoading(false);


        }


    }









    function handleChange(e){



        setForm({

            ...form,

            [e.target.name]:

            e.target.value


        });



    }









    async function handleSubmit(){



        try{


            setSaving(true);



            await updateRestaurantSettings(


                restaurantId,


                form


            );



            alert(
                "Informações atualizadas com sucesso"
            );



        }


        catch(error){


            console.error(
                "Erro ao guardar:",
                error
            );


            alert(
                "Erro ao guardar alterações"
            );


        }


        finally{


            setSaving(false);


        }


    }









    if(loading){


        return (

            <Card title="Informações do Restaurante">

                Carregando informações...

            </Card>

        );


    }








    return (



        <Card title="Informações do Restaurante">





            <Input

                label="Nome"

                name="name"

                value={form.name}

                onChange={handleChange}

                placeholder="Nome do restaurante"

            />






            <Textarea

                label="Descrição"

                name="description"

                value={form.description}

                onChange={handleChange}

                placeholder="Descreva o restaurante"

            />








            <Input

                label="Telefone"

                name="contact_phone"

                value={form.contact_phone}

                onChange={handleChange}

                placeholder="+244..."

            />








            <Input

                label="Email"

                name="contact_email"

                value={form.contact_email}

                onChange={handleChange}

                placeholder="email@restaurante.com"

                type="email"

            />








            <Textarea

                label="Endereço"

                name="address"

                value={form.address}

                onChange={handleChange}

                placeholder="Endereço completo"

                rows={3}

            />








            <Button

                onClick={handleSubmit}

                disabled={saving}


            >

                {

                    saving

                    ?

                    "Guardando..."

                    :

                    "Guardar Alterações"

                }


            </Button>





        </Card>


    );


}