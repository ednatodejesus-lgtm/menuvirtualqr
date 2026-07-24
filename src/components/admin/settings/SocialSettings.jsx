import {
    useEffect,
    useState
} from "react";


import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";


import {
    useAuth
} from "../../../hooks/useAuth";


import {
    getRestaurantSettings,
    updateRestaurantSettings
} from "../../../services/restaurantSettingsService";





export default function SocialSettings(){



    const {

        profile

    } = useAuth();




    const [loading,setLoading] = useState(true);


    const [saving,setSaving] = useState(false);




    const [form,setForm] = useState({


        facebook:"",

        instagram:"",

        tiktok:"",

        website:""


    });





    const restaurantId =
        profile?.restaurant_id;









    useEffect(()=>{


        loadSocial();


    },[restaurantId]);









    async function loadSocial(){


        if(!restaurantId)

            return;




        try{


            const data = await getRestaurantSettings(

                restaurantId

            );



            setForm({


                facebook:
                data.social_links?.facebook || "",



                instagram:
                data.social_links?.instagram || "",



                tiktok:
                data.social_links?.tiktok || "",



                website:
                data.social_links?.website || ""


            });



        }

        catch(error){


            console.error(
                "Erro ao carregar redes sociais:",
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


                {


                    social_links:{

                        ...form

                    }


                }


            );



            alert(
                "Redes sociais atualizadas com sucesso"
            );



        }


        catch(error){


            console.error(
                "Erro ao guardar redes sociais:",
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

            <Card title="Redes Sociais">

                Carregando redes sociais...

            </Card>

        );


    }









    return (



        <Card title="Redes Sociais">





            <Input

                label="Facebook"

                name="facebook"

                value={form.facebook}

                onChange={handleChange}

                placeholder="https://facebook.com/..."

            />







            <Input

                label="Instagram"

                name="instagram"

                value={form.instagram}

                onChange={handleChange}

                placeholder="https://instagram.com/..."

            />








            <Input

                label="TikTok"

                name="tiktok"

                value={form.tiktok}

                onChange={handleChange}

                placeholder="https://tiktok.com/@..."

            />








            <Input

                label="Website"

                name="website"

                value={form.website}

                onChange={handleChange}

                placeholder="https://..."

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

                "Guardar Redes Sociais"

                }


            </Button>






        </Card>


    );


}