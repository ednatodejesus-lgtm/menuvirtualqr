export default function AdminLoading({

message = "Carregando..."

}){

return (

<div className="admin-loading">

<div className="admin-spinner"></div>

<p>

{message}

</p>

</div>

)

}