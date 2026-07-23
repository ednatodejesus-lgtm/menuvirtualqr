export default function AdminHeader({
    profile,
    restaurant,
    logout
}){


return (

<header className="admin-header">


<div>

<h3>
{restaurant?.name}
</h3>


<p>
Gerente:
{" "}
{profile?.full_name}
</p>


</div>


<button onClick={logout}>
Sair
</button>


</header>


)


}