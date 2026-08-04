import { 
  X,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Check
} from "lucide-react";

import QRCode from "react-qr-code";

import { useState } from "react";

import { generateRestaurantPDF } 
from "../../services/pdfGenerator";

import "../../styles/superadmin.css";


export default function RestaurantSuccessModal({
    data,
    onClose
}){


const [showPassword,setShowPassword]=useState(false);

const [copied,setCopied]=useState(false);


if(!data) return null;


const restaurant=data.restaurant;

const admin=data.admin;

const qr=data.qr;



const copyData=async()=>{


const text=`

Menu Virtual QR

Restaurante:
${restaurant.name}


Gerente:

Email:
${admin.email}


Password temporária:
${admin.password}


Link do Menu:

${qr.link}

`;


await navigator.clipboard.writeText(text);


setCopied(true);


setTimeout(()=>{

setCopied(false);

},2000);


};



return (

<div className="modal-overlay">


<div className="success-modal">


<button
className="modal-close"
onClick={onClose}
>
<X size={22}/>
</button>



<div className="success-header">

<div className="success-icon">
<Check size={35}/>
</div>


<h2>
Restaurante criado com sucesso
</h2>


<p>
Guarde as credenciais do gerente.
</p>

</div>




<div className="success-content">


<div className="info-card">

<h3>
Restaurante
</h3>

<strong>
{restaurant.name}
</strong>

</div>



<div className="info-card">

<h3>
Gerente
</h3>


<p>
{admin.email}
</p>


</div>




<div className="info-card">

<h3>
Password temporária
</h3>


<div className="password-box">


<span>

{
showPassword
?
admin.password
:
"••••••••••••"
}

</span>


<button
onClick={()=>setShowPassword(!showPassword)}
>

{
showPassword
?
<EyeOff size={18}/>
:
<Eye size={18}/>
}


</button>


</div>


</div>





<div className="info-card">

<h3>
URL Pública
</h3>


<a
href={qr.link}
target="_blank"
rel="noreferrer"
>

{qr.link}

</a>


</div>





<div className="qr-container">


<QRCode
value={qr.link}
size={220}
/>


</div>



</div>




<div className="modal-actions">


<button
onClick={copyData}
className="primary-action"
>

{
copied
?
"Copiado!"
:
<>
<Copy size={18}/>
Copiar dados
</>
}


</button>




<a

href={qr.link}

target="_blank"

rel="noreferrer"

className="secondary-action"

>

<ExternalLink size={18}/>

Abrir restaurante

</a>




<button

className="secondary-action"

onClick={() =>
generateRestaurantPDF(data)
}

>

Baixar PDF

</button> a



</div>



</div>


</div>


)

}