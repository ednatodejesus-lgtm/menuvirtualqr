import {useEffect,useState} from "react";

import {useAuth} from "../../hooks/useAuth";

import AdminCard from "./AdminCard";

import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct

} from "../../services/productService";


import {
    getCategories

} from "../../services/categoryService";





export default function AdminProducts(){



const {
    profile
}=useAuth();



const restaurantId =
    profile?.restaurant_id;



const [products,setProducts]=useState([]);

const [categories,setCategories]=useState([]);


const [form,setForm]=useState({

    name:"",
    description:"",
    price:"",
    category_id:""

});


const [editing,setEditing]=useState(null);


const columns=[

{
key:"name",
label:"Produto"
},


{
key:"categories",
label:"Categoria",

render:(product)=>
product.categories?.name || "-"

},


{
key:"price",
label:"Preço",

render:(product)=>
`${product.price} Kz`

},


{
key:"available",
label:"Estado",

render:(product)=>
product.available
?
"Disponível"
:
"Indisponível"

}

];




async function loadData(){


    if(!restaurantId)
        return;


    const [
        productsData,
        categoriesData

    ] = await Promise.all([


        getProducts(
            restaurantId
        ),


        getCategories(
            restaurantId
        )


    ]);



    setProducts(
        productsData
    );


    setCategories(
        categoriesData
    );


}





useEffect(()=>{

    loadData();

},[restaurantId]);







function handleChange(e){


    setForm({

        ...form,

        [e.target.name]:
            e.target.value

    });


}







async function handleSubmit(e){


e.preventDefault();



const payload={

    restaurant_id:
        restaurantId,


    category_id:
        form.category_id
        ||
        null,


    name:
        form.name,


    description:
        form.description,


    price:
        Number(
            form.price
        )


};





if(editing){


    await updateProduct(

        editing.id,

        payload

    );


}
else{


    await createProduct({

        ...payload,

        sort_order:
            products.length

    });


}




setForm({

name:"",
description:"",
price:"",
category_id:""

});


setEditing(null);



loadData();



}









async function removeProduct(id){


if(!confirm(
"Eliminar produto?"
))
return;



await deleteProduct(id);



loadData();



}









return(


<AdminCard
title="Produtos"
>

<form
onSubmit={handleSubmit}
>



<input

name="name"

placeholder="Nome do produto"

value={form.name}

onChange={handleChange}

/>




<textarea

name="description"

placeholder="Descrição"

value={form.description}

onChange={handleChange}

/>





<input

name="price"

type="number"

placeholder="Preço"

value={form.price}

onChange={handleChange}

/>






<select

name="category_id"

value={form.category_id}

onChange={handleChange}

>


<option value="">
Categoria
</option>



{
categories.map(cat=>(

<option

key={cat.id}

value={cat.id}

>

{cat.name}

</option>


))

}



</select>





<button>

{
editing
?
"Actualizar"
:
"Criar Produto"
}

</button>



</form>







<hr/>







<table>


<thead>

<tr>

<th>
Produto
</th>


<th>
Categoria
</th>


<th>
Preço
</th>


<th>
Acções
</th>

</tr>

</thead>



<tbody>


{

products.map(product=>(


<tr key={product.id}>


<td>

{product.name}

</td>



<td>

{
product.categories?.name
||
"-"
}

</td>



<td>

{
product.price
}

Kz

</td>




<td>


<button

onClick={()=>{


setEditing(product);


setForm({

name:product.name,

description:
product.description || "",


price:
product.price,


category_id:
product.category_id || ""

});


}}

>

Editar

</button>




<button

onClick={()=>
removeProduct(product.id)
}

>

Excluir

</button>


</td>


</tr>


))


}



</tbody>


</table>




</AdminCard>


)


}