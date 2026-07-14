import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { 
  LayoutDashboard, 
  Menu as MenuIcon,
  Tag,
  Package,
  QrCode,
  Settings,
  LogOut,
  Home,
  Users,
  DollarSign,
  Eye,
  TrendingUp,
  RefreshCw
} from 'lucide-react'
import styled from 'styled-components'
import toast from 'react-hot-toast'
import { supabase, TABLES } from '../services/supabase'

// Componentes do Admin
import AdminCategories from '../components/admin/AdminCategories'
import AdminProducts from '../components/admin/AdminProducts'
import AdminQRCode from '../components/admin/AdminQRCode'
import AdminSettings from '../components/admin/AdminSettings'
import Navbar from '../components/common/Navbar'

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
`

const Sidebar = styled.aside`
  width: 280px;
  background: white;
  border-right: 1px solid #e2e8f0;
  padding: 1.5rem;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  overflow-y: auto;
  transition: transform 0.3s ease;
  z-index: 50;
  
  @media (max-width: 768px) {
    transform: translateX(${props => props.open ? '0' : '-100%'});
    width: 280px;
  }
`

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
  
  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #8B4513;
    
    span {
      color: #DAA520;
    }
  }
`

const RestaurantInfo = styled.div`
  background: #fef3e8;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  
  h3 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #8B4513;
    margin-bottom: 0.25rem;
  }
  
  p {
    font-size: 0.75rem;
    color: #64748b;
  }
`

const SidebarMenu = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  color: ${props => props.active ? '#8B4513' : '#64748b'};
  background: ${props => props.active ? '#fef3e8' : 'transparent'};
  font-weight: ${props => props.active ? '600' : '500'};
  text-decoration: none;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.active ? '#fef3e8' : '#f1f5f9'};
    color: #8B4513;
  }
`

const MainContent = styled.main`
  flex: 1;
  margin-left: 280px;
  padding: 2rem;
  
  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`

const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #0f172a;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
  
  h3 {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 500;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  p {
    font-size: 2rem;
    font-weight: 700;
    color: #0f172a;
  }
`

const Overlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 40;
  
  @media (max-width: 768px) {
    display: ${props => props.open ? 'block' : 'none'};
  }
`

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
    totalRevenue: 0,
    views: 0
  })
  const [restaurant, setRestaurant] = useState(null)
  const { logout, user, restaurantId } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (restaurantId) {
      loadRestaurantData()
      loadStats()
    }
  }, [restaurantId])

  const loadRestaurantData = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.RESTAURANTES)
        .select('*')
        .eq('id', restaurantId)
        .single()

      if (error) throw error
      setRestaurant(data)
    } catch (error) {
      console.error('Error loading restaurant:', error)
      toast.error('Error loading restaurant data')
    }
  }

  const loadStats = async () => {
    try {
      // Total de categorias
      const { count: categoriesCount } = await supabase
        .from(TABLES.CATEGORIAS)
        .select('*', { count: 'exact', head: true })
        .eq('restaurant_id', restaurantId)

      // Total de produtos
      const { count: productsCount } = await supabase
        .from(TABLES.PRODUTOS)
        .select('*', { count: 'exact', head: true })
        .eq('restaurant_id', restaurantId)

      setStats({
        categories: categoriesCount || 0,
        products: productsCount || 0,
        totalRevenue: 0, // Será implementado com pedidos
        views: 0 // Será implementado com analytics
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: MenuIcon, label: 'Categories', path: '/admin/categories' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: QrCode, label: 'QR Code', path: '/admin/qrcode' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ]

  return (
    <DashboardContainer>
      <Overlay open={sidebarOpen} onClick={() => setSidebarOpen(false)} />
      
      <Sidebar open={sidebarOpen}>
        <SidebarHeader>
          <h2>🍽️ Menu<span>QR</span></h2>
        </SidebarHeader>
        
        {restaurant && (
          <RestaurantInfo>
            <h3>{restaurant.name}</h3>
            <p>{restaurant.business_type} • {restaurant.style}</p>
          </RestaurantInfo>
        )}
        
        <SidebarMenu>
          {menuItems.map((item) => (
            <MenuItem 
              key={item.path}
              to={item.path}
              active={window.location.pathname === item.path}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              {item.label}
            </MenuItem>
          ))}
        </SidebarMenu>
      </Sidebar>

      <MainContent>
        <Navbar />
        
        <Routes>
          <Route path="/" element={<DashboardHome stats={stats} restaurant={restaurant} />} />
          <Route path="/dashboard" element={<DashboardHome stats={stats} restaurant={restaurant} />} />
          <Route path="/categories" element={<AdminCategories />} />
          <Route path="/products" element={<AdminProducts />} />
          <Route path="/qrcode" element={<AdminQRCode />} />
          <Route path="/settings" element={<AdminSettings />} />
        </Routes>
      </MainContent>
    </DashboardContainer>
  )
}

// Componente Home do Dashboard
const DashboardHome = ({ stats, restaurant }) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <RefreshCw size={32} className="animate-spin" style={{ color: '#8B4513' }} />
        <p style={{ marginTop: '1rem', color: '#64748b' }}>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <>
      <PageHeader>
        <PageTitle>
          Welcome, {restaurant?.name || 'Restaurant Admin'}! 👋
        </PageTitle>
        <Link to="/admin/qrcode">
          <button style={{
            padding: '0.75rem 1.5rem',
            background: '#8B4513',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '600'
          }}>
            <QrCode size={18} />
            Generate QR Code
          </button>
        </Link>
      </PageHeader>

      <StatsGrid>
        <StatCard>
          <h3><Tag size={18} /> Categories</h3>
          <p>{stats.categories}</p>
        </StatCard>
        <StatCard>
          <h3><Package size={18} /> Products</h3>
          <p>{stats.products}</p>
        </StatCard>
        <StatCard>
          <h3><DollarSign size={18} /> Total Revenue</h3>
          <p>${stats.totalRevenue}</p>
        </StatCard>
        <StatCard>
          <h3><Eye size={18} /> Menu Views</h3>
          <p>{stats.views}</p>
        </StatCard>
      </StatsGrid>

      <div style={{
        background: '#fef3e8',
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid #fed7aa'
      }}>
        <h3 style={{ color: '#8B4513', marginBottom: '0.5rem' }}>📊 Quick Tips</h3>
        <ul style={{ color: '#64748b', listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #fed7aa' }}>
            💡 Add categories first to organize your menu
          </li>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #fed7aa' }}>
            📸 Upload high-quality images of your dishes
          </li>
          <li style={{ padding: '0.5rem 0' }}>
            📱 Share your QR Code with customers
          </li>
        </ul>
      </div>
    </>
  )
}

export default AdminDashboard