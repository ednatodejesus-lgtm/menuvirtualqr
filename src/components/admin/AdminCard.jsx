export default function AdminCard({
    title,
    children,
    actions
}){


return (

<section className="admin-card">


<header className="admin-card-header">


<div>

<h2>
{title}
</h2>


</div>



{
actions &&
<div className="admin-card-actions">

{actions}

</div>
}



</header>




<div className="admin-card-body">

{children}

</div>



</section>


)


}