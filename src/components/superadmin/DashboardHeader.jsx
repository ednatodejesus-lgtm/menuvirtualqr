import "./../../styles/superadmin.css";


export default function DashboardHeader({
    profile,
    onCreateRestaurant
}){


    return (

        <header className="super-header">


            <div>

                <h1>

                    Super Admin

                </h1>


                <p>

                    Bem vindo,
                    {" "}
                    {profile?.full_name}

                </p>


            </div>





            <button

                className="create-button"

                onClick={() => {

                   if(onCreateRestaurant){

                     onCreateRestaurant();

                        }

          }}
            >

                + Criar Restaurante

            </button>



        </header>

    );

}