import {
    useEffect,
    useState
} from "react";


import Card from "../ui/Card";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";


import {
    useAuth
} from "../../../hooks/useAuth";


import {
    getRestaurantSettings,
    updateRestaurantSettings
} from "../../../services/restaurantSettingsService";





export default function AppearanceSettings(){



    const {

        profile

    } = useAuth();




    const [loading,setLoading] = useState(true);



    const [saving,setSaving] = useState(false);




    const [form,setForm] = useState({


        logo_url:"",

        style:"modern"


    });





    const restaurantId =
        profile?.restaurant_id;







    useEffect(()=>{


        loadAppearance();


    },[restaurantId]);









    async function loadAppearance(){



        if(!restaurantId)

            return;




        try{


            const data = await getRestaurantSettings(

                restaurantId

            );



            setForm({


                logo_url:
                data.logo_url || "",



                style:
                data.style || "modern"



            });



        }

        catch(error){


            console.error(
                "Erro ao carregar aparência:",
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









    function handleFileChange(e){



        const file = e.target.files[0];



        if(!file)

            return;




        setForm({

            ...form,


            logo_url:file.name


        });



    }









    async function handleSubmit(){



        try{


            setSaving(true);




            await updateRestaurantSettings(


                restaurantId,


                {


                    logo_url:
                    form.logo_url,


                    style:
                    form.style


                }


            );



            alert(
                "Aparência atualizada com sucesso"
            );



        }


        catch(error){


            console.error(
                "Erro ao atualizar aparência:",
                error
            );



            alert(
                "Erro ao guardar aparência"
            );


        }



        finally{


            setSaving(false);


        }


    }









    if(loading){


        return (

            <Card title="Aparência">

                Carregando aparência...

            </Card>

        );


    }









    return (


        <Card title="Aparência">





            <Input

                label="Logótipo"

                type="file"

                onChange={handleFileChange}

            />






            {

            form.logo_url &&

            <p>

                Logótipo atual:

                {" "}

                {form.logo_url}

            </p>

            }








            <Select


                label="Tema"


                name="style"


                value={form.style}


                onChange={handleChange}



                options={[


                    {

                        value:"modern",

                        label:"Moderno"

                    },


                    {

                        value:"minimal",

                        label:"Minimalista"

                    },


                    {

                        value:"classic",

                        label:"Clássico"

                    }



                ]}



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

                    "Guardar Aparência"

                }


            </Button>






        </Card>


    );


}