export default function AdminTable({
    columns,
    data,
    actions
}){


return (

<div className="admin-table-wrapper">


<table className="admin-table">


<thead>

<tr>

{
columns.map(column=>(

<th key={column.key}>

{column.label}

</th>

))
}



{
actions &&
<th>
Ações
</th>
}


</tr>

</thead>



<tbody>


{

data.length === 0

?

<tr>

<td
colSpan={
columns.length +
(actions ? 1 : 0)
}
className="empty-table"
>

Nenhum registro encontrado

</td>

</tr>


:


data.map(row=>(


<tr key={row.id}>


{

columns.map(column=>(


<td key={column.key}>


{

column.render

?

column.render(row)

:

row[column.key]


}


</td>


))


}



{

actions &&

<td>


<div className="table-actions">

{
actions(row)
}

</div>


</td>


}



</tr>


))


}



</tbody>


</table>


</div>

)


}