export default function Modal({

open,

title,

children,

onClose

}){


if(!open)
return null;



return (

<div className="modal-overlay">


<div className="admin-modal">


<div className="modal-header">


<h3>
{title}
</h3>



<button

onClick={onClose}

>

×


</button>


</div>



<div className="modal-body">

{children}

</div>



</div>


</div>

)

}