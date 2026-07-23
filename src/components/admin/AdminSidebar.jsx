export default function AdminSidebar({
    activePage,
    setActivePage
}){


    const menu=[

        {
            id:"dashboard",
            label:"Dashboard"
        },

        {
            id:"categories",
            label:"Categorias"
        },


        {
            id:"products",
            label:"Produtos"
        },


        {
            id:"qrcode",
            label:"QR Code"
        },


        {
            id:"settings",
            label:"Configurações"
        }

    ];



    return (

        <aside className="admin-sidebar">


            <h2>
                Menu QR
            </h2>



            <nav>

                {
                    menu.map(item=>(

                        <button

                            key={item.id}

                            className={
                                activePage===item.id
                                ?
                                "active"
                                :
                                ""
                            }


                            onClick={()=>
                                setActivePage(item.id)
                            }

                        >

                            {item.label}

                        </button>


                    ))
                }


            </nav>


        </aside>


    )

}