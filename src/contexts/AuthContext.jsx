import { createContext, useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import toast from 'react-hot-toast'

export const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState(null)
  const [restaurantId, setRestaurantId] = useState(null)

  useEffect(() => {
    // Verificar sessão atual
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) throw error
        
        if (session) {
          setUser(session.user)
          await getUserRole(session.user.id)
        }
      } catch (error) {
        console.error('Erro ao buscar sessão:', error.message)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          setUser(session.user)
          await getUserRole(session.user.id)
        } else {
          setUser(null)
          setUserRole(null)
          setRestaurantId(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Buscar papel do usuário no banco
  const getUserRole = async (userId) => {
    try {
      // Verificar se é Super Admin
      const { data: superAdminData, error: superAdminError } = await supabase
        .from('admins')
        .select('role, restaurante_id')
        .eq('id', userId)
        .eq('role', 'super_admin')
        .single()

      if (!superAdminError && superAdminData) {
        setUserRole('super_admin')
        setRestaurantId(null)
        return
      }

      // Verificar se é Admin de Restaurante
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('role, restaurante_id')
        .eq('id', userId)
        .eq('role', 'admin')
        .single()

      if (!adminError && adminData) {
        setUserRole('admin')
        setRestaurantId(adminData.restaurante_id)
        return
      }

      // Se não for nem super_admin nem admin
      setUserRole(null)
      setRestaurantId(null)
    } catch (error) {
      console.error('Erro ao buscar papel do usuário:', error.message)
      setUserRole(null)
      setRestaurantId(null)
    }
  }

  // Função de login
  const login = async (email, password) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      toast.success('Login realizado com sucesso!')
      return { success: true, user: data.user }
    } catch (error) {
      toast.error(error.message || 'Erro ao fazer login')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Função de logout
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      setUserRole(null)
      setRestaurantId(null)
      toast.success('Logout realizado com sucesso!')
    } catch (error) {
      toast.error(error.message || 'Erro ao fazer logout')
    }
  }

  // Funções auxiliares
  const isSuperAdmin = () => userRole === 'super_admin'
  const isAdmin = () => userRole === 'admin'
  const isAuthenticated = () => !!user

  const value = {
    user,
    userRole,
    restaurantId,
    loading,
    login,
    logout,
    isSuperAdmin,
    isAdmin,
    isAuthenticated,
    getUserRole
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider