export default function AdminEmptyState({

title,

description,

action

}){

return (

<div className="admin-empty-state">

<h3>

{title}

</h3>

{

description &&

<p>

{description}

</p>

}

{

action &&

<div className="admin-empty-action">

{action}

</div>

}

</div>

)

}