export default function Tabs({

tabs,

activeTab,

onChange

}){


return (

<div className="admin-tabs">


{
tabs.map(tab=>(


<button

key={tab.id}

className={

activeTab === tab.id

?

"admin-tab active"

:

"admin-tab"

}

onClick={()=>onChange(tab.id)}

>


{
tab.icon
}


<span>
{tab.label}
</span>


</button>


))

}


</div>

)

}