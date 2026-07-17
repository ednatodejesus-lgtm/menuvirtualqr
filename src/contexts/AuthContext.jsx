import React, { createContext, useState, useContext, useEffect } from 'react'
import { supabase } from '../services/supabase'
import toast from 'react-hot-toast'

export const AuthContext = createContext()


export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState(null)
  const [restaurantId, setRestaurantId] = useState(null)



  useEffect(() => {

    const getSession = async () => {

      const {
        data:{session},
        error
      } = await supabase.auth.getSession()


      if(error){
        console.error(error)
        setLoading(false)
        return
      }


      if(session){

        setUser(session.user)

        await getUserRole(session.user.id)

      }

      setLoading(false)

    }


    getSession()



    const {
      data:{subscription}
    } = supabase.auth.onAuthStateChange(
      async (_event, session)=>{


        if(session){

          setUser(session.user)

          await getUserRole(session.user.id)

        }else{

          setUser(null)
          setUserRole(null)
          setRestaurantId(null)

        }


        setLoading(false)

      }
    )


    return ()=>{
      subscription.unsubscribe()
    }


  },[])




  const getUserRole = async(userId)=>{


    const {
      data,
      error
    } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle()



    console.log("PROFILE:", data)



    if(error){

      console.error(
        "Erro buscando profile:",
        error
      )

      return

    }



    if(data){

      setUserRole(data.role)

      setRestaurantId(data.restaurant_id || null)


    }else{


      setUserRole(null)
      setRestaurantId(null)

    }

  }






  const login = async(email,password)=>{


    try{


      setLoading(true)


      const {
        data,
        error
      } = await supabase.auth.signInWithPassword({

        email,
        password

      })



      if(error){

        toast.error(error.message)

        return {
          success:false,
          error:error.message
        }

      }




      await getUserRole(data.user.id)



      toast.success("Login realizado")



      return {

        success:true,
        user:data.user

      }



    }catch(error){


      toast.error(error.message)


      return {

        success:false,
        error:error.message

      }



    }finally{

      setLoading(false)

    }

  }







  const logout = async()=>{


    await supabase.auth.signOut()


    setUser(null)
    setUserRole(null)
    setRestaurantId(null)


    toast.success("Sessão terminada")


  }






  const value={


    user,

    userRole,

    restaurantId,

    loading,

    login,

    logout,


    // permissões

    isSuperAdmin:
      ()=> userRole === "super_admin",


    isAdmin:
      ()=> userRole === "admin",



    isAuthenticated:
      ()=> !!user



  }



  return (

    <AuthContext.Provider value={value}>

      {children}

    </AuthContext.Provider>

  )


}



export const useAuth=()=>{

 const context=useContext(AuthContext)


 if(!context){

   throw new Error(
    "useAuth must be used inside AuthProvider"
   )

 }


 return context

}


export default AuthContext