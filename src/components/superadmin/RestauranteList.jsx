import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase, TABLES } from '../../services/supabase'
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle,
  XCircle
} from 'lucide-react'
import styled from 'styled-components'
import toast from 'react-hot-toast'

const Container = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
`

const Header = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
`

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f1f5f9;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  
  input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 0.875rem;
    color: #0f172a;
    
    &::placeholder {
      color: #94a3b8;
    }
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th {
    text-align: left;
    padding: 1rem 1.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #e2e8f0;
  }
  
  td {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    font-size: 0.875rem;
    color: #0f172a;
  }
  
  tr:hover td {
    background: #f8fafc;
  }
`

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => props.active ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.active ? '#166534' : '#991b1b'};
`

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 0.25rem;
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: #475569;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #94a3b8;
  
  p {
    margin-top: 0.5rem;
    font-size: 0.875rem;
  }
`

const RestauranteList = () => {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadRestaurants()
  }, [])

  const loadRestaurants = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from(TABLES.RESTAURANTES)
        .select(`
          *,
          admin:admin_id (
            email,
            name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRestaurants(data || [])
    } catch (error) {
      console.error('Error loading restaurants:', error)
      toast.error('Error loading restaurants')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this restaurant?')) return

    try {
      const { error } = await supabase
        .from(TABLES.RESTAURANTES)
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Restaurant deleted successfully!')
      loadRestaurants()
    } catch (error) {
      console.error('Error deleting restaurant:', error)
      toast.error('Error deleting restaurant')
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active'
    
    try {
      const { error } = await supabase
        .from(TABLES.RESTAURANTES)
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      toast.success(`Restaurant ${newStatus === 'active' ? 'activated' : 'suspended'}!`)
      loadRestaurants()
    } catch (error) {
      console.error('Error toggling status:', error)
      toast.error('Error toggling status')
    }
  }

  const filteredRestaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.slug.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
  }

  return (
    <Container>
      <Header>
        <Title>Restaurants</Title>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <SearchBar>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search restaurant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </SearchBar>
          <Link to="/superadmin/restaurants/new">
            <button style={{
              padding: '0.5rem 1rem',
              background: '#8B4513',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem'
            }}>
              <PlusCircle size={18} />
              New Restaurant
            </button>
          </Link>
        </div>
      </Header>

      {filteredRestaurants.length === 0 ? (
        <EmptyState>
          <Store size={48} />
          <p>No restaurants found</p>
        </EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Business Type</th>
              <th>Style</th>
              <th>Status</th>
              <th>Admin</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRestaurants.map((restaurant) => (
              <tr key={restaurant.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {restaurant.logo_url && (
                      <img 
                        src={restaurant.logo_url} 
                        alt={restaurant.name}
                        style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                    )}
                    <strong>{restaurant.name}</strong>
                  </div>
                </td>
                <td>{restaurant.slug}</td>
                <td>{restaurant.business_type}</td>
                <td>{restaurant.style}</td>
                <td>
                  <StatusBadge active={restaurant.status === 'active'}>
                    {restaurant.status === 'active' ? (
                      <CheckCircle size={12} />
                    ) : (
                      <XCircle size={12} />
                    )}
                    {restaurant.status === 'active' ? 'Active' : 'Suspended'}
                  </StatusBadge>
                </td>
                <td>{restaurant.admin?.email || 'No admin'}</td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                    <ActionButton onClick={() => handleToggleStatus(restaurant.id, restaurant.status)}>
                      {restaurant.status === 'active' ? <XCircle size={16} /> : <CheckCircle size={16} />}
                    </ActionButton>
                    <Link to={`/superadmin/restaurants/edit/${restaurant.id}`}>
                      <ActionButton><Edit size={16} /></ActionButton>
                    </Link>
                    <ActionButton onClick={() => handleDelete(restaurant.id)}>
                      <Trash2 size={16} />
                    </ActionButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  )
}

export default RestauranteList