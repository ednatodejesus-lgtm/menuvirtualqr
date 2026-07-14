import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Loading from './Loading'

/**
 * Componente para proteger rotas baseado no papel do usuário
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes filhos para renderizar
 * @param {string} props.role - Papel necessário para acessar a rota ('super_admin' | 'admin')
 */
const ProtectedRoute = ({ children, role }) => {
  const { user, loading, isSuperAdmin, isAdmin } = useAuth()

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return <Loading message="Verificando autenticação..." />
  }

  // Se não estiver autenticado, redirecionar para login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Verificar permissões baseado no papel
  if (role === 'super_admin' && !isSuperAdmin()) {
    // Redirecionar para dashboard do admin se for admin
    if (isAdmin()) {
      return <Navigate to="/admin/dashboard" replace />
    }
    // Senão, redirecionar para login
    return <Navigate to="/login" replace />
  }

  if (role === 'admin' && !isAdmin()) {
    // Redirecionar para dashboard do super admin se for super admin
    if (isSuperAdmin()) {
      return <Navigate to="/superadmin/dashboard" replace />
    }
    // Senão, redirecionar para login
    return <Navigate to="/login" replace />
  }

  // Se tiver permissão, renderizar os filhos
  return children
}

export default ProtectedRoute