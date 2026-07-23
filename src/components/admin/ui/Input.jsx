export default function Input({

label,

value,

onChange,

placeholder,

type="text",

name

}){


return (

<div className="admin-field">


{
label &&
<label>
{label}
</label>
}



<input

name={name}

type={type}

value={value}

placeholder={placeholder}

onChange={onChange}

/>


</div>

)

}