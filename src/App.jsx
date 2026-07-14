import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Login from './pages/Login'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import AdminDashboard from './pages/AdminDashboard'
import MenuPublic from './pages/MenuPublic'
import ProtectedRoute from './components/common/ProtectedRoute'
import './styles/global.css'

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a1a1a',
                color: '#fff',
                borderRadius: '8px'
              }
            }}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Rotas do Super Admin */}
            <Route 
              path="/superadmin/*" 
              element={
                <ProtectedRoute role="super_admin">
                  <SuperAdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Rotas do Admin/Gerente */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Rota Pública do Menu */}
            <Route path="/menu/:restaurantId" element={<MenuPublic />} />
            
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App