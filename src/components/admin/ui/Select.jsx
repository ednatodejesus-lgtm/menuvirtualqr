export default function Select({

label,

value,

onChange,

options=[]

}){


return (

<div className="admin-field">


{
label &&
<label>
{label}
</label>
}



<select

value={value}

onChange={onChange}

>


{
options.map(option=>(


<option

key={option.value}

value={option.value}

>

{option.label}

</option>


))

}


</select>


</div>

)

}