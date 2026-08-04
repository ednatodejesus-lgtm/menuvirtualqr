import { X, UserRound, Mail } from "lucide-react";

export default function ManagerModal({

manager,

onClose

}){

if(!manager)
return null;

return(

<div className="modal-overlay">

<div className="manager-modal">

<button
className="close-btn"
onClick={onClose}
>

<X size={20}/>

</button>

<h2>

<UserRound size={24}/>

Dados do Gerente

</h2>

<div className="manager-info">

<p>

<strong>Nome: </strong>

{manager.full_name}

</p>

<p>

<strong>Email: </strong>

{manager.email}

</p>

<p>

<strong>Role: </strong>

{manager.role}

</p>

<p>

<strong>Status: </strong>

{manager.status}

</p>

<p>

<strong>ID: </strong>

{manager.id}

</p>

</div>

</div>

</div>

);

}