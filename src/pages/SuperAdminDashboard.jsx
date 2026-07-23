import {
  useEffect,
  useState
} from "react";

import {
  Plus,
  Search,
  Store,
  Users,
  CheckCircle,
  XCircle,
  QrCode,
  Eye,
  UserRound,
  Trash2,
  Power,
  PowerOff,
  RefreshCcw
} from "lucide-react";


import { supabase } from "../services/supabase";

import RestaurantCreate from "../components/superadmin/RestaurantCreate";

import RestaurantSuccessModal from "../components/superadmin/RestaurantSuccessModal";

import "../styles/superadmin.css";



export default function SuperAdminDashboard(){


const [restaurants,setRestaurants]=useState([]);

const [loading,setLoading]=useState(true);

const [showCreate,setShowCreate]=useState(false);

const [search,setSearch]=useState("");

//Modal states
const [createdRestaurant, setCreatedRestaurant] = useState(null);

const [showSuccessModal, setShowSuccessModal] = useState(false);


async function loadRestaurants(){


setLoading(true);


const {

data,

error

}=await supabase

.from("restaurants")

.select(`

*

`)

.order(
"created_at",
{
ascending:false
}

);



if(error){

console.error(error);

return;

}



setRestaurants(data || []);

setLoading(false);


}




useEffect(()=>{

loadRestaurants();

},[]);





const filteredRestaurants = restaurants.filter(
(item)=>

item.name
?.toLowerCase()
.includes(
search.toLowerCase()
)

);





async function updateStatus(
id,
status
){


const {

error

}=await supabase

.from("restaurants")

.update({

status

})

.eq(
"id",
id
);



if(error){

console.error(error);

return;

}



loadRestaurants();


}






async function deleteRestaurant(id){


const confirmDelete =
window.confirm(
"Eliminar este restaurante?"
);



if(!confirmDelete)
return;



const {

error

}=await supabase

.from("restaurants")

.delete()

.eq(
"id",
id
);



if(error){

console.error(error);

return;

}



loadRestaurants();


}





function openRestaurant(id){

console.log(
"VER RESTAURANTE:",
id
);

}





function openQR(id){

console.log(
"QR RESTAURANTE:",
id
);

}





function openManager(id){

console.log(
"GERENTE:",
id
);

}





return (

<div className="super-dashboard">


<header className="dashboard-top">


<div>


<h1>
Super Admin
</h1>


<p>
Gestão central do Menu Virtual QR
</p>


</div>



<button

className="primary-button"

onClick={()=>
setShowCreate(
!showCreate
)
}

>


<Plus size={18}/>

Novo Restaurante


</button>


</header>





{

showCreate &&

<section className="create-container">


<RestaurantCreate
  onCreated={(result)=>{

    setCreatedRestaurant(result);

    setShowSuccessModal(true);

    setShowCreate(false);

    loadRestaurants();

  }}
/>


</section>


}







<section className="stats-grid">



<div className="stat-card">

<Store/>

<div>

<strong>
{restaurants.length}
</strong>

<span>
Restaurantes
</span>

</div>

</div>




<div className="stat-card">

<CheckCircle/>

<div>

<strong>

{
restaurants.filter(
r=>r.status==="active"
).length
}

</strong>

<span>
Ativos
</span>

</div>

</div>





<div className="stat-card">

<XCircle/>

<div>

<strong>

{
restaurants.filter(
r=>r.status==="disabled"
).length
}

</strong>

<span>
Desativados
</span>

</div>

</div>





<div className="stat-card">

<Users/>

<div>

<strong>
{restaurants.length}
</strong>

<span>
Gerentes
</span>

</div>

</div>



</section>







<section className="restaurant-panel">


<div className="panel-header">


<div className="search-box">


<Search size={18}/>


<input

placeholder="Pesquisar restaurante..."

value={search}

onChange={
e=>
setSearch(
e.target.value
)
}

/>


</div>



<button

className="icon-button"

onClick={loadRestaurants}

>


<RefreshCcw size={18}/>


</button>


</div>







{

loading ?

<div className="loading">

Carregando restaurantes...

</div>


:

<div className="restaurant-list">



{

filteredRestaurants.map(
(
restaurant,
index
)=>(


<div

key={restaurant.id}

className={
`
restaurant-row
${index % 2 ===0
?
"dark-row"
:
"light-row"
}
`
}


>


<div className="restaurant-main">


{

restaurant.logo_url ?

<img

src={restaurant.logo_url}

alt="logo"

/>

:

<div className="logo-empty">

<Store/>

</div>


}



<div>

<h3>
{restaurant.name}
</h3>


<span>

{restaurant.business_type}

</span>


</div>


</div>





<div className="status">


{

restaurant.status==="active"

?

<span className="active">

Active

</span>


:

<span className="inactive">

Disabled

</span>


}


</div>





<div className="actions">


<button

title="Ver restaurante"

onClick={()=>
openRestaurant(
restaurant.id
)
}

>

<Eye/>

</button>




<button

title="QR"

onClick={()=>
openQR(
restaurant.id
)
}

>

<QrCode/>

</button>




<button

title="Gerente"

onClick={()=>
openManager(
restaurant.id
)
}

>

<UserRound/>

</button>





{

restaurant.status==="active"

?

<button

title="Desactivar"

onClick={()=>
updateStatus(
restaurant.id,
"disabled"
)
}

>

<PowerOff/>

</button>


:

<button

title="Activar"

onClick={()=>
updateStatus(
restaurant.id,
"active"
)
}

>

<Power/>

</button>


}




<button

className="danger"

title="Eliminar"

onClick={()=>
deleteRestaurant(
restaurant.id
)
}

>

<Trash2/>

</button>




</div>



</div>


)

)

}



</div>


}


</section>


{
showSuccessModal && (

<RestaurantSuccessModal

data={createdRestaurant}

onClose={() => {

setShowSuccessModal(false);

setCreatedRestaurant(null);

}}

 />

)
}


</div>


);


}