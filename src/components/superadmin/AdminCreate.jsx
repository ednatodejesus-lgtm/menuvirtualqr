import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, TABLES } from '../../services/supabase'
import { ArrowLeft, Loader2, UserPlus, Copy, Check } from 'lucide-react'
import styled from 'styled-components'
import toast from 'react-hot-toast'

const Container = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 2rem;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  
  button {
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: background 0.2s;
    
    &:hover {
      background: #f1f5f9;
    }
  }
`

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #0f172a;
`

const Subtitle = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  grid-column: ${props => props.full ? '1 / -1' : 'auto'};
`

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
`

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #8B4513;
    box-shadow: 0 0 0 3px rgba(139, 69, 19, 0.1);
  }
  
  &:disabled {
    background: #f1f5f9;
    cursor: not-allowed;
  }
`

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #8B4513;
    box-shadow: 0 0 0 3px rgba(139, 69, 19, 0.1);
  }
`

const ButtonGroup = styled.div`
  grid-column: 1 / -1;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`

const Button = styled.button`
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`

const ButtonPrimary = styled(Button)`
  background: #8B4513;
  color: white;
  
  &:hover:not(:disabled) {
    background: #6b3410;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
  }
`

const ButtonSecondary = styled(Button)`
  background: #f1f5f9;
  color: #475569;
  
  &:hover:not(:disabled) {
    background: #e2e8f0;
  }
`

const CredentialsBox = styled.div`
  grid-column: 1 / -1;
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 0.5rem;
  
  h4 {
    color: #166534;
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`

const CredentialRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #bbf7d0;
  
  &:last-child {
    border-bottom: none;
  }
  
  span {
    color: #166534;
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  code {
    background: white;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.875rem;
    color: #0f172a;
    font-family: monospace;
    word-break: break-all;
  }
`

const CopyButton = styled.button`
  background: none;
  border: none;
  color: #166534;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background 0.2s;
  
  &:hover {
    background: #bbf7d0;
  }
`

const AdminsList = styled.div`
  grid-column: 1 / -1;
  margin-top: 1rem;
`

const AdminsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  
  th {
    text-align: left;
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid #e2e8f0;
  }
  
  td {
    padding: 0.75rem 1rem;
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

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background 0.2s;
  
  &:hover {
    background: #fee2e2;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
  
  p {
    margin-top: 0.5rem;
    font-size: 0.875rem;
  }
`

const AdminCreate = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [admins, setAdmins] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [generatedCredentials, setGeneratedCredentials] = useState(null)
  const [copySuccess, setCopySuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    restaurant_id: '',
    role: 'admin'
  })

  useEffect(() => {
    loadAdmins()
    loadRestaurants()
  }, [])

  const loadAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.ADMINS)
        .select(`
          *,
          restaurant:restaurant_id (
            id,
            name,
            slug
          )
        `)
        .eq('role', 'admin')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAdmins(data || [])
    } catch (error) {
      console.error('Error loading admins:', error)
      toast.error('Error loading admins')
    }
  }

  const loadRestaurants = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.RESTAURANTES)
        .select('id, name, slug, status')
        .eq('status', 'active')
        .order('name')

      if (error) throw error
      setRestaurants(data || [])
    } catch (error) {
      console.error('Error loading restaurants:', error)
      toast.error('Error loading restaurants')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData(prev => ({ ...prev, password }))
  }

  const generateEmail = () => {
    if (formData.name) {
      const email = formData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '.')
        .replace(/^\.|\.$/g, '')
        .replace(/\.+/g, '.') + '@menuqr.com'
      setFormData(prev => ({ ...prev, email }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password || !formData.restaurant_id) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)

      // 1. Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: 'admin'
          }
        }
      })

      if (authError) throw authError

      if (!authData.user) {
        throw new Error('Failed to create user')
      }

      // 2. Create profile in profiles table
      const { error: profileError } = await supabase
        .from(TABLES.ADMINS)
        .insert([{
          id: authData.user.id,
          email: formData.email,
          name: formData.name,
          role: 'admin',
          restaurant_id: formData.restaurant_id
        }])

      if (profileError) throw profileError

      // 3. Update restaurant with admin_id
      const { error: restaurantError } = await supabase
        .from(TABLES.RESTAURANTES)
        .update({ admin_id: authData.user.id })
        .eq('id', formData.restaurant_id)

      if (restaurantError) throw restaurantError

      // Show generated credentials
      setGeneratedCredentials({
        email: formData.email,
        password: formData.password,
        restaurant_name: restaurants.find(r => r.id === formData.restaurant_id)?.name
      })

      toast.success('Admin created successfully!')
      
      // Reset form
      setFormData({
        email: '',
        password: '',
        name: '',
        restaurant_id: '',
        role: 'admin'
      })

      // Reload admins list
      loadAdmins()

    } catch (error) {
      console.error('Error creating admin:', error)
      toast.error(error.message || 'Error creating admin')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAdmin = async (id) => {
    if (!confirm('Are you sure you want to delete this admin?')) return

    try {
      // Delete profile
      const { error: profileError } = await supabase
        .from(TABLES.ADMINS)
        .delete()
        .eq('id', id)

      if (profileError) throw profileError

      // Delete auth user
      // Note: This requires admin privileges in Supabase
      // You may need to use a service role key for this

      toast.success('Admin deleted successfully!')
      loadAdmins()
    } catch (error) {
      console.error('Error deleting admin:', error)
      toast.error('Error deleting admin')
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopySuccess(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopySuccess(false), 3000)
  }

  const getRestaurantName = (id) => {
    const restaurant = restaurants.find(r => r.id === id)
    return restaurant?.name || 'Unknown'
  }

  return (
    <Container>
      <Header>
        <button onClick={() => navigate('/superadmin/dashboard')}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <Title>Manage Admins</Title>
          <Subtitle>Create and manage restaurant administrators</Subtitle>
        </div>
      </Header>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Full Name *</Label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={generateEmail}
            placeholder="John Doe"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Email *</Label>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@restaurant.com"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Password *</Label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Input
              name="password"
              type="text"
              value={formData.password}
              onChange={handleChange}
              placeholder="Auto-generated or manual"
              required
              style={{ flex: 1 }}
            />
            <ButtonSecondary type="button" onClick={generatePassword} style={{ padding: '0 1rem' }}>
              Generate
            </ButtonSecondary>
          </div>
        </FormGroup>

        <FormGroup full>
          <Label>Assign to Restaurant *</Label>
          <Select
            name="restaurant_id"
            value={formData.restaurant_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a restaurant...</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name} ({restaurant.slug})
              </option>
            ))}
          </Select>
        </FormGroup>

        <ButtonGroup>
          <ButtonSecondary type="button" onClick={() => navigate('/superadmin/dashboard')}>
            Cancel
          </ButtonSecondary>
          <ButtonPrimary type="submit" disabled={loading}>
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <UserPlus size={18} />
            )}
            Create Admin
          </ButtonPrimary>
        </ButtonGroup>

        {generatedCredentials && (
          <CredentialsBox>
            <h4>✅ Admin Created Successfully!</h4>
            <p style={{ color: '#166534', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Save these credentials. The password will not be shown again.
            </p>
            
            <CredentialRow>
              <span>Restaurant:</span>
              <code>{generatedCredentials.restaurant_name}</code>
            </CredentialRow>
            
            <CredentialRow>
              <span>Email:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <code>{generatedCredentials.email}</code>
                <CopyButton onClick={() => copyToClipboard(generatedCredentials.email)}>
                  {copySuccess ? <Check size={16} /> : <Copy size={16} />}
                </CopyButton>
              </div>
            </CredentialRow>
            
            <CredentialRow>
              <span>Password:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <code>{generatedCredentials.password}</code>
                <CopyButton onClick={() => copyToClipboard(generatedCredentials.password)}>
                  {copySuccess ? <Check size={16} /> : <Copy size={16} />}
                </CopyButton>
              </div>
            </CredentialRow>
          </CredentialsBox>
        )}
      </Form>

      <AdminsList>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem' }}>
          Existing Admins ({admins.length})
        </h3>

        {admins.length === 0 ? (
          <EmptyState>
            <p>No admins created yet</p>
          </EmptyState>
        ) : (
          <AdminsTable>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Restaurant</th>
                <th>Status</th>
                <th>Created At</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td>{admin.name || 'N/A'}</td>
                  <td>{admin.email}</td>
                  <td>{admin.restaurant?.name || 'No restaurant'}</td>
                  <td>
                    <StatusBadge active={admin.status !== 'suspended'}>
                      {admin.status === 'suspended' ? 'Suspended' : 'Active'}
                    </StatusBadge>
                  </td>
                  <td>{new Date(admin.created_at).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <DeleteButton onClick={() => handleDeleteAdmin(admin.id)}>
                      Delete
                    </DeleteButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </AdminsTable>
        )}
      </AdminsList>
    </Container>
  )
}

export default AdminCreate