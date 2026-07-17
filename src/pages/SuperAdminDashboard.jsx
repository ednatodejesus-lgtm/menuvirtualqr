import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { 
  LayoutDashboard, 
  Store, 
  Users, 
  PlusCircle,
  BarChart3,
  QrCode,
  Settings,
  LogOut
} from 'lucide-react'
import styled from 'styled-components'
import toast from 'react-hot-toast'
import { supabase, TABLES } from '../services/supabase'

import RestauranteList from '../components/superadmin/RestauranteList'
import RestauranteForm from '../components/superadmin/RestauranteForm'
import AdminCreate from '../components/superadmin/AdminCreate'
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
  
  h3 {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 500;
    margin-bottom: 0.5rem;
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

const SuperAdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState({
    restaurants: 0,
    admins: 0,
    products: 0
  })
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const { count: restaurantsCount } = await supabase
        .from(TABLES.RESTAURANTS)
        .select('*', { count: 'exact', head: true })

      const { count: adminsCount } = await supabase
        .from(TABLES.ADMINS)
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin')

      const { count: productsCount } = await supabase
        .from(TABLES.PRODUCTS)
        .select('*', { count: 'exact', head: true })

      setStats({
        restaurants: restaurantsCount || 0,
        admins: adminsCount || 0,
        products: productsCount || 0
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
    { icon: LayoutDashboard, label: 'Dashboard', path: '/superadmindashboard' },
    { icon: Store, label: 'Restaurants', path: '/superadmin/restaurants' },
    { icon: Users, label: 'Admins', path: '/superadmin/admins' },
    { icon: BarChart3, label: 'Analytics', path: '/superadmin/analytics' },
    { icon: QrCode, label: 'QR Codes', path: '/superadmin/qrcodes' },
    { icon: Settings, label: 'Settings', path: '/superadmin/settings' },
  ]

  return (
    <DashboardContainer>
      <Overlay open={sidebarOpen} onClick={() => setSidebarOpen(false)} />
      
      <Sidebar open={sidebarOpen}>
        <SidebarHeader>
          <h2>🍽️ Menu<span>QR</span></h2>
        </SidebarHeader>
        
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
          <Route path="/" element={<DashboardHome stats={stats} />} />
          <Route path="/dashboard" element={<DashboardHome stats={stats} />} />
          <Route path="/restaurants" element={<RestauranteList />} />
          <Route path="/restaurants/new" element={<RestauranteForm />} />
          <Route path="/restaurants/edit/:id" element={<RestauranteForm />} />
          <Route path="/admins" element={<AdminCreate />} />
          <Route path="/admins/new" element={<AdminCreate />} />
        </Routes>
      </MainContent>
    </DashboardContainer>
  )
}

const DashboardHome = ({ stats }) => {
  return (
    <>
      <PageHeader>
        <PageTitle>Dashboard</PageTitle>
      </PageHeader>

      <StatsGrid>
        <StatCard>
          <h3>Total Restaurants</h3>
          <p>{stats.restaurants}</p>
        </StatCard>
        <StatCard>
          <h3>Total Admins</h3>
          <p>{stats.admins}</p>
        </StatCard>
        <StatCard>
          <h3>Total Products</h3>
          <p>{stats.products}</p>
        </StatCard>
        <StatCard>
          <h3>System Status</h3>
          <p style={{ fontSize: '1rem', color: '#22c55e' }}>🟢 Online</p>
        </StatCard>
      </StatsGrid>
    </>
  )
}

export default SuperAdminDashboard