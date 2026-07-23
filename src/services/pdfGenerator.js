import jsPDF from "jspdf";


export function generateRestaurantPDF(data){


const doc = new jsPDF();



const restaurant = data.restaurant;

const admin = data.admin;

const qr = data.qr;



const now = new Date();


const date = now.toLocaleDateString("pt-AO");

const time = now.toLocaleTimeString("pt-AO");



/*
 HEADER
*/


doc.setFontSize(22);

doc.text(
"Menu Virtual QR",
20,
25
);



doc.setFontSize(12);

doc.text(
"Comprovativo de criação de restaurante",
20,
35
);



doc.line(
20,
40,
190,
40
);



/*
 RESTAURANTE
*/


doc.setFontSize(15);

doc.text(
"Restaurante",
20,
55
);


doc.setFontSize(12);

doc.text(
restaurant.name,
20,
65
);



/*
 GERENTE
*/


doc.setFontSize(15);

doc.text(
"Dados do Gerente",
20,
85
);


doc.setFontSize(12);


doc.text(
`Email: ${admin.email}`,
20,
95
);



doc.text(
`Password temporária: ${admin.password}`,
20,
105
);



/*
 URL
*/


doc.setFontSize(15);


doc.text(
"URL Pública",
20,
125
);



doc.setFontSize(11);


doc.text(
qr.link,
20,
135
);



/*
 QR CODE

*/


const qrSvg =
document.querySelector(
".qr-container svg"
);



if(qrSvg){


const serializer =
new XMLSerializer();


const svgString =
serializer.serializeToString(qrSvg);



const canvas =
document.createElement("canvas");


const ctx =
canvas.getContext("2d");



const img =
new Image();


const svgBlob =
new Blob(
[svgString],
{
type:"image/svg+xml;charset=utf-8"
}
);



const url =
URL.createObjectURL(svgBlob);



img.onload=()=>{


canvas.width=220;

canvas.height=220;


ctx.drawImage(
img,
0,
0
);



const image =
canvas.toDataURL(
"image/png"
);



doc.addImage(
image,
"PNG",
70,
145,
70,
70
);



finishPDF();



};



img.src=url;



}
else{


finishPDF();


}




function finishPDF(){


doc.setFontSize(11);


doc.text(
`Criado em: ${date} ${time}`,
20,
240
);



doc.line(
20,
245,
190,
245
);



doc.setFontSize(10);



doc.text(
"Documento gerado pelo Menu Virtual QR",
20,
255
);



doc.text(
"Feito com amor, café e ChatGPT",
20,
265
);



doc.save(
`${restaurant.slug}-credenciais.pdf`
);



}



}