import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { supabase, TABLES } from '../../services/supabase'
import { useDeepSeek } from '../../hooks/useDeepSeek'
import { Save, Sparkles, Loader2, RefreshCw } from 'lucide-react'
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #0f172a;
  }
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
  
  &:focus {
    outline: none;
    border-color: #8B4513;
  }
`

const TextArea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #8B4513;
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
  }
`

const ButtonSecondary = styled(Button)`
  background: #f1f5f9;
  color: #475569;
  
  &:hover:not(:disabled) {
    background: #e2e8f0;
  }
`

const AIButton = styled(Button)`
  background: linear-gradient(135deg, #8B4513, #DAA520);
  color: white;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
  }
`

const ThemePreview = styled.div`
  grid-column: 1 / -1;
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  
  h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 1rem;
  }
`

const ColorGrid = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`

const ColorBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  
  div {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: ${props => props.color};
  }
  
  span {
    font-size: 0.75rem;
    color: #64748b;
  }
`

const AdminSettings = () => {
  const { restaurantId } = useAuth()
  const { generateTheme, loading: aiLoading } = useDeepSeek()
  const [loading, setLoading] = useState(false)
  const [restaurant, setRestaurant] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    contact_phone: '',
    contact_email: '',
    address: '',
    business_type: '',
    style: '',
    description: ''
  })

  useEffect(() => {
    if (restaurantId) {
      loadRestaurant()
    }
  }, [restaurantId])

  const loadRestaurant = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.RESTAURANTES)
        .select('*')
        .eq('id', restaurantId)
        .single()

      if (error) throw error
      setRestaurant(data)
      setFormData({
        name: data.name || '',
        logo_url: data.logo_url || '',
        contact_phone: data.contact_phone || '',
        contact_email: data.contact_email || '',
        address: data.address || '',
        business_type: data.business_type || '',
        style: data.style || '',
        description: data.description || ''
      })
    } catch (error) {
      console.error('Error loading restaurant:', error)
      toast.error('Error loading restaurant data')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAIGenerate = async () => {
    if (!formData.description) {
      toast.error('Please describe your restaurant to generate a theme')
      return
    }

    try {
      const theme = await generateTheme({
        name: formData.name,
        business_type: formData.business_type,
        style: formData.style,
        description: formData.description
      })

      // Update restaurant with new theme
      const { error } = await supabase
        .from(TABLES.RESTAURANTES)
        .update({ theme })
        .eq('id', restaurantId)

      if (error) throw error

      toast.success('Theme generated and applied successfully!')
      loadRestaurant()
    } catch (error) {
      console.error('Error generating theme:', error)
      toast.error('Error generating theme with AI')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      const { error } = await supabase
        .from(TABLES.RESTAURANTES)
        .update({
          name: formData.name,
          logo_url: formData.logo_url,
          contact_phone: formData.contact_phone,
          contact_email: formData.contact_email,
          address: formData.address,
          business_type: formData.business_type,
          style: formData.style
        })
        .eq('id', restaurantId)

      if (error) throw error

      toast.success('Settings updated successfully!')
      loadRestaurant()
    } catch (error) {
      console.error('Error updating settings:', error)
      toast.error('Error updating settings')
    } finally {
      setLoading(false)
    }
  }

  if (!restaurant) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
  }

  return (
    <Container>
      <Header>
        <h2>⚙️ Restaurant Settings</h2>
        <ButtonSecondary onClick={loadRestaurant}>
          <RefreshCw size={18} />
          Refresh
        </ButtonSecondary>
      </Header>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Restaurant Name</Label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>Logo URL</Label>
          <Input
            name="logo_url"
            value={formData.logo_url}
            onChange={handleChange}
            placeholder="https://example.com/logo.png"
          />
        </FormGroup>

        <FormGroup>
          <Label>Contact Phone</Label>
          <Input
            name="contact_phone"
            value={formData.contact_phone}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>Contact Email</Label>
          <Input
            name="contact_email"
            type="email"
            value={formData.contact_email}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup full>
          <Label>Address</Label>
          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>Business Type</Label>
          <Input
            name="business_type"
            value={formData.business_type}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>Style</Label>
          <Input
            name="style"
            value={formData.style}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup full>
          <Label>Description (for AI Theme Generation)</Label>
          <TextArea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your restaurant's concept, ambiance, cuisine, etc..."
          />
          <AIButton type="button" onClick={handleAIGenerate} disabled={aiLoading}>
            {aiLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Sparkles size={18} />
            )}
            Generate Theme with AI
          </AIButton>
        </FormGroup>

        {restaurant.theme && (
          <ThemePreview>
            <h4>🎨 Current Theme</h4>
            <ColorGrid>
              {Object.entries(restaurant.theme.colors || {}).map(([key, value]) => (
                <ColorBox key={key} color={value}>
                  <div />
                  <span>{key}</span>
                </ColorBox>
              ))}
            </ColorGrid>
          </ThemePreview>
        )}

        <ButtonGroup>
          <ButtonSecondary type="button" onClick={loadRestaurant}>
            Cancel
          </ButtonSecondary>
          <ButtonPrimary type="submit" disabled={loading}>
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Save Settings
          </ButtonPrimary>
        </ButtonGroup>
      </Form>
    </Container>
  )
}

export default AdminSettings