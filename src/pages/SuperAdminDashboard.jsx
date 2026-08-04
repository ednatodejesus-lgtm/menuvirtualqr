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

import ManagerModal from "../components/superadmin/ManagerModal";

import "../styles/superadmin.css";



export default function SuperAdminDashboard(){


const [restaurants,setRestaurants]=useState([]);

const [loading,setLoading]=useState(true);

const [showCreate,setShowCreate]=useState(false);

const [search,setSearch]=useState("");

//Modal states
const [createdRestaurant, setCreatedRestaurant] = useState(null);

const [showSuccessModal, setShowSuccessModal] = useState(false);
//novos

const [theme,setTheme] = useState("light");

const [selectedRestaurant,setSelectedRestaurant] = useState(null);

const [showQR,setShowQR] = useState(false);

const [showManager,setShowManager] = useState(false);

const [profile,setProfile] = useState(null);

//Modal states
const [showManagerModal, setShowManagerModal] = useState(false);
const [managerData, setManagerData] = useState(null);


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




async function loadProfile(){

const {
data:{
user
}
}=await supabase.auth.getUser();


if(!user)
return;


const {
data
}=await supabase

.from("profiles")

.select("*")

.eq(
"id",
user.id
)

.single();


setProfile(data);

}






useEffect(()=>{

loadRestaurants();

loadProfile();


},[]);


//duas funções




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



//função para eliminar restaurante


async function deleteRestaurant(id){


const confirmDelete =
window.confirm(
`Tem Certeza Que Deseja Eliminar ${restaurant.name}? Esta ação não pode ser revertida.`
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





function openRestaurant(restaurant){


window.open(
`/menu/${restaurant.slug}`,
"_blank"
);


}





function openQR(restaurant){

setSelectedRestaurant(restaurant);

setShowQR(true);

}



//* function to open manager modal and load manager data

async function openManager(restaurant){

const {
data,
error
} = await supabase

.from("profiles")

.select("*")

.eq(
"restaurant_id",
restaurant.id
)

.eq(
"role",
"restaurant_admin"
)

.single();


if(error){

console.error(error);

return;

}


setManagerData(data);

setShowManagerModal(true);

}


function toggleTheme(){

const newTheme =
theme==="light"
?
"dark"
:
"light";


setTheme(newTheme);

document.body.className=newTheme;

}


return (

<div className="super-dashboard">

<h1>Menu Virtual QR</h1>

<header className="dashboard-top">

  <div>

    <p>
      Bom dia, Super Admin:
      <strong> {profile?.full_name || "Administrador"}</strong>
    </p>

  </div>

  <div className="header-actions">

   
    <button
      className="primary-button"
      onClick={() => setShowCreate(!showCreate)}
    >
      <Plus size={18} />
      Novo Restaurante
    </button>

 <button
      className="secondary-button"
      onClick={toggleTheme}
    >
      {theme === "light" ? "🌙" : "☀️"}
      Alternar tema
    </button>

    <button
      className="danger-button"
      onClick={async () => {
        await supabase.auth.signOut();
        window.location.href = "/login";
      }}
    >
      Sair
    </button>

  </div>

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
restaurant
)
}

>

<Eye/>

</button>




<button

title="QR"

onClick={()=>
openQR(
restaurant
)
}

>

<QrCode/>

</button>




<button

title="Gerente"

onClick={()=>
openManager(
restaurant
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




 {
showManagerModal && (

<ManagerModal

manager={managerData}

onClose={() => {

setShowManagerModal(false);

setManagerData(null);

}}

/>

)
}


<footer className="dashboard-footer">

© 2026 Menu Virtual QR

<br/>

Todos os direitos reservados.

<br/>

Feito com ☕ e código por Ednato

<br/>

Com assistência do ChatGPT

</footer>


</div>


);


}