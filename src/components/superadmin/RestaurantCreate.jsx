import { useState } from "react";
import {
  ImagePlus,
  Upload,
  LoaderCircle,
  Store,
  UserRound,
  Globe,
  Phone,
  Mail,
  CheckCircle,
  XCircle
} from "lucide-react";

import { supabase } from "../../services/supabase";

import "../../styles/superadmin.css";


export default function RestaurantCreate({ onCreated }) {


  const [loading,setLoading] = useState(false);

  const [message,setMessage] = useState(null);


  const [logoFile,setLogoFile] = useState(null);

  const [logoPreview,setLogoPreview] = useState(null);


  const [form,setForm] = useState({

    name:"",

    contact_phone:"",

    contact_email:"",

    address:"",

    business_type:"restaurant",

    style:"modern",

    description:"",

    admin_name:"",

    admin_email:"",

    facebook:"",

    instagram:"",

    whatsapp:"",

    website:"",

    tiktok:""

  });



  function handleChange(e){

    setForm({

      ...form,

      [e.target.name]:e.target.value

    });

  }



  function handleLogo(e){

    const file=e.target.files[0];

    if(!file) return;


    setLogoFile(file);

    setLogoPreview(
      URL.createObjectURL(file)
    );

  }



  async function uploadLogo(){


    if(!logoFile) return null;


    const extension =
      logoFile.name.split(".").pop();


    const fileName =
      `${Date.now()}.${extension}`;


    const {

      error

    } = await supabase.storage

      .from("logos")

      .upload(
        fileName,
        logoFile
      );


    if(error){

      throw error;

    }



    const {

      data

    } = supabase.storage

      .from("logos")

      .getPublicUrl(fileName);



    return data.publicUrl;


  }




  async function handleSubmit(e){

    e.preventDefault();


    setLoading(true);

    setMessage(null);



    try{


      let logo_url=null;



      if(logoFile){

        logo_url =
          await uploadLogo();

      }



      const payload={


        name:form.name,


        logo_url,


        contact_phone:
          form.contact_phone,


        contact_email:
          form.contact_email,


        address:
          form.address,



        business_type:
          form.business_type,



        style:
          form.style,



        description:
          form.description,



        social_links:{


          facebook:
            form.facebook,


          instagram:
            form.instagram,


          whatsapp:
            form.whatsapp,


          website:
            form.website,


          tiktok:
            form.tiktok

        },



        admin_name:
          form.admin_name,


        admin_email:
          form.admin_email


      };



      const {

        data:{
          session

        }

      } = await supabase.auth.getSession();



      const response =
        await supabase.functions.invoke(

          "create-restaurant",

          {

            body:payload,

            headers:{

              Authorization:
              `Bearer ${session.access_token}`

            }

          }

        );




      if(response.error){

         const errorBody =
         await response.error.context.json();


        console.error(
          "EDGE FUNCTION ERROR:",
          errorBody
          );


        throw new Error(
        errorBody.error ||
        "Erro na Edge Function"
         );

        }



      setMessage({

        type:"success",

        text:
        "Restaurante criado com sucesso"

      });



      setForm({

        name:"",

        contact_phone:"",

        contact_email:"",

        address:"",

        business_type:"restaurant",

        style:"modern",

        description:"",

        admin_name:"",

        admin_email:"",

        facebook:"",

        instagram:"",

        whatsapp:"",

        website:"",

        tiktok:""

      });



      setLogoPreview(null);

      setLogoFile(null);



      if(onCreated){

        onCreated();

      }



    }

    catch(error){


      console.error(error);



      setMessage({

        type:"error",

        text:
        error.message ||
        "Erro ao criar restaurante"

      });


    }

    finally{

      setLoading(false);

    }


  }




return (

<form
className="restaurant-create"
onSubmit={handleSubmit}
>


<div className="form-section">

<h2>
<Store size={20}/>
Dados do Restaurante
</h2>



<input
name="name"
placeholder="Nome do restaurante"
value={form.name}
onChange={handleChange}
required
/>



<select
name="business_type"
value={form.business_type}
onChange={handleChange}
>

<option value="restaurant">
Restaurante
</option>

<option value="bar_noturno">
Bar Noturno
</option>

<option value="hotel">
Hotel
</option>

<option value="spa">
Spa
</option>

</select>



<select
name="style"
value={form.style}
onChange={handleChange}
>

<option value="modern">
Moderno
</option>

<option value="classic">
Clássico
</option>

<option value="luxury">
Luxo
</option>

<option value="minimal">
Minimalista
</option>


</select>



<textarea
name="description"
placeholder="Descrição do negócio"
value={form.description}
onChange={handleChange}
/>


</div>



<div className="form-section">

<h2>
<ImagePlus size={20}/>
Logo
</h2>


<label className="upload-box">


{
logoPreview ?

<img
src={logoPreview}
className="logo-preview"
/>

:

<>

<Upload size={35}/>

<span>
Selecionar logo
</span>

</>

}


<input
type="file"
accept="image/*"
onChange={handleLogo}
/>


</label>


</div>



<div className="form-section">


<h2>
<Phone size={20}/>
Contactos
</h2>


<input
name="contact_phone"
placeholder="Telefone"
value={form.contact_phone}
onChange={handleChange}
/>



<input
name="contact_email"
placeholder="Email"
value={form.contact_email}
onChange={handleChange}
/>



<input
name="address"
placeholder="Endereço"
value={form.address}
onChange={handleChange}
/>


</div>



<div className="form-section">


<h2>
<Globe size={20}/>
Redes Sociais
</h2>


<input
name="facebook"
placeholder="Facebook"
value={form.facebook}
onChange={handleChange}
/>



<input
name="instagram"
placeholder="Instagram"
value={form.instagram}
onChange={handleChange}
/>



<input
name="whatsapp"
placeholder="WhatsApp"
value={form.whatsapp}
onChange={handleChange}
/>



<input
name="website"
placeholder="Website"
value={form.website}
onChange={handleChange}
/>



<input
name="tiktok"
placeholder="TikTok"
value={form.tiktok}
onChange={handleChange}
/>


</div>




<div className="form-section">


<h2>
<UserRound size={20}/>
Administrador
</h2>



<input
name="admin_name"
placeholder="Nome do gerente"
value={form.admin_name}
onChange={handleChange}
required
/>



<input
name="admin_email"
placeholder="Email do gerente"
value={form.admin_email}
onChange={handleChange}
required
/>


</div>




<button
disabled={loading}
className="primary-button"
>


{

loading ?

<LoaderCircle className="spin"/>

:

" criar restaurante"

}


</button>




{

message &&

<div
className={
message.type==="success"
?
"success-message"
:
"error-message"
}
>


{
message.type==="success"

?

<CheckCircle/>

:

<XCircle/>

}


{message.text}


</div>


}



</form>


);


}