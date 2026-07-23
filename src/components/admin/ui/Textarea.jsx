export default function Textarea({

label,

value,

onChange,

placeholder,

rows=4

}){


return (

<div className="admin-field">


{
label &&
<label>
{label}
</label>
}



<textarea

value={value}

onChange={onChange}

placeholder={placeholder}

rows={rows}

/>


</div>

)

}