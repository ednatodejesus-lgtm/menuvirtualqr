import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../../hooks/useAuth'
import { LogOut, User, Home } from 'lucide-react'

const Nav = styled.nav`
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 0 2rem;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 800;
  color: #8B4513;
  text-decoration: none;
  
  span {
    color: #DAA520;
  }
`

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #475569;
  font-size: 0.875rem;
`

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s;
  
  &:hover {
    background: #f1f5f9;
    color: #ef4444;
  }
`

const Navbar = () => {
  const { user, userRole, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const getDashboardLink = () => {
    if (userRole === 'super_admin') return '/superadmin/dashboard'
    if (userRole === 'admin') return '/admin/dashboard'
    return '/login'
  }

  return (
    <Nav>
      <Logo to={getDashboardLink()}>
        🍽️ Menu<span>QR</span>
      </Logo>
      
      <NavLinks>
        {user && (
          <>
            <UserInfo>
              <User size={16} />
              <span>{user.email}</span>
              <span style={{ 
                background: userRole === 'super_admin' ? '#8B4513' : '#DAA520',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                textTransform: 'capitalize'
              }}>
                {userRole?.replace('_', ' ')}
              </span>
            </UserInfo>
            
            <LogoutButton onClick={handleLogout}>
              <LogOut size={16} />
              Sair
            </LogoutButton>
          </>
        )}
      </NavLinks>
    </Nav>
  )
}

export default Navbar