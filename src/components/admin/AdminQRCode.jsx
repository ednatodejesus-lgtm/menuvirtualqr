import {useEffect,useState} from "react";

import {useAuth} from "../../hooks/useAuth";


import Card from "./ui/Card";

import InfoBox from "./InfoBox";


import {
    getRestaurantQR
} from "../../services/qrService";


import {
    QRCodeCanvas
} from "qrcode.react";





export default function AdminQRCode(){


const {
    profile
}=useAuth();



const restaurantId =
    profile?.restaurant_id;



const [qr,setQr]=useState(null);

const [loading,setLoading]=useState(true);





useEffect(()=>{


async function loadQR(){


try{


const data =
await getRestaurantQR(
    restaurantId
);


setQr(data);



}catch(error){

console.error(
    error
);

}

finally{

setLoading(false);

}


}



if(restaurantId)
    loadQR();



},[restaurantId]);







function downloadQR(){


const canvas =
document.getElementById(
    "restaurant-qr"
);



const url =
canvas.toDataURL(
    "image/png"
);



const link =
document.createElement(
    "a"
);


link.href=url;


link.download=
`${qr.slug}-qr-code.png`;


link.click();


}







if(loading)

return (

<p>
Carregando QR Code...
</p>

);







return (

<Card
title="QR Code do Restaurante"
>



{

qr ?

<>


<div className="qr-container">


<QRCodeCanvas

id="restaurant-qr"

value={
    qr.link
}

size={250}


/>


</div>





<h3>

Link público

</h3>



<a

href={qr.link}

target="_blank"

rel="noreferrer"

>

{qr.link}

</a>





<br/><br/>



<button

onClick={downloadQR}

>

Baixar QR Code

</button>





<InfoBox>


<h4>
💡 Dicas do QR Code
</h4>


<ul>

<li>
Imprima e coloque nas mesas do restaurante
</li>


<li>
Partilhe nas redes sociais
</li>


<li>
Os clientes escaneiam para ver o menu
</li>


<li>
As alterações do menu aparecem automaticamente em tempo real
</li>


</ul>


</InfoBox>




</>


:

<p>
QR Code não encontrado.
</p>


}



</Card>

)


}