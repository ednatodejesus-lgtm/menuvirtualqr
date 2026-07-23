import {useEffect,useState} from "react";

import {useAuth} from "../../hooks/useAuth";


import Table from "./ui/Table";
import Card from "./ui/Card";

import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory

} from "../../services/categoryService";



export default function AdminCategories(){


    const {
    profile
} = useAuth();



    const [categories,setCategories]=useState([]);

    const [name,setName]=useState("");

    const [editing,setEditing]=useState(null);

    const [loading,setLoading]=useState(false);



    const restaurantId = profile?.restaurant_id;


    const columns=[

{
    key:"name",
    label:"Nome"
},

{
    key:"sort_order",
    label:"Ordem"
}

];

    async function loadCategories(){


        if(!restaurantId)
            return;


        try{

            setLoading(true);


            const data =
                await getCategories(
                    restaurantId
                );


            setCategories(data);


        }catch(error){

            console.error(error);

        }
        finally{

            setLoading(false);

        }


    }




    useEffect(()=>{

        loadCategories();

    },[restaurantId]);





    async function handleSubmit(e){


        e.preventDefault();



        if(!name.trim())
            return;




        try{


            if(editing){


                await updateCategory(
                    editing.id,
                    {
                        name
                    }
                );


            }
            else{


                await createCategory({

                    restaurant_id:
                        restaurantId,

                    name,

                    sort_order:
                        categories.length

                });


            }



            setName("");

            setEditing(null);


            loadCategories();



        }catch(error){

            console.error(error);

        }



    }






    async function handleDelete(id){


        if(
            !confirm(
                "Eliminar categoria?"
            )
        )
            return;



        await deleteCategory(id);


        loadCategories();


    }





return (

<Card
    title="Categorias"
>


<form
    onSubmit={handleSubmit}
    className="category-form"
>


<input

placeholder="Nome da categoria"

value={name}

onChange={
    e=>setName(e.target.value)
}

/>



<button>

{
editing
?
"Atualizar"
:
"Criar"
}

</button>



{
editing &&

<button

type="button"

onClick={()=>{

setEditing(null);
setName("");

}}

>

Cancelar

</button>

}


</form>



{
loading

?

<p>
Carregando...
</p>


:

<Table

columns={columns}

data={categories}


actions={(category)=>(

<>


<button

onClick={()=>{

setEditing(category);

setName(category.name);

}}

>

Editar

</button>




<button

onClick={()=>handleDelete(category.id)}

>

Excluir

</button>


</>

)}

/>


}



</Card>

)
}