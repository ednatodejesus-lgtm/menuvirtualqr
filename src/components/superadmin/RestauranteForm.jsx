import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase, TABLES } from '../../services/supabase'
import { useDeepSeek } from '../../hooks/useDeepSeek'
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react'
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
`

const TextArea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #8B4513;
    box-shadow: 0 0 0 3px rgba(139, 69, 19, 0.1);
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

const AIButton = styled(Button)`
  background: linear-gradient(135deg, #8B4513, #DAA520);
  color: white;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
  }
`

const RestauranteForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { generateTheme, loading: aiLoading } = useDeepSeek()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    logo_url: '',
    contact_phone: '',
    contact_email: '',
    address: '',
    social_links: {
      instagram: '',
      facebook: '',
      whatsapp: ''
    },
    business_type: 'restaurant',
    style: 'modern',
    description: '',
    status: 'active'
  })

  const businessTypes = [
    'restaurant', 'fast-food', 'hamburger', 'pizza', 'sushi',
    'cafe', 'bar', 'hotel', 'spa', 'bakery', 'other'
  ]

  const styles = ['classic', 'modern', 'luxury', 'rustic', 'minimalist', 'colorful']

  useEffect(() => {
    if (id) {
      loadRestaurant()
    }
  }, [id])

  const loadRestaurant = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from(TABLES.RESTAURANTES)
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (data) {
        setFormData(data)
      }
    } catch (error) {
      console.error('Error loading restaurant:', error)
      toast.error('Error loading restaurant')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const generateSlug = () => {
    if (formData.name) {
      const slug = formData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  const handleAIGenerate = async () => {
    if (!formData.description) {
      toast.error('Please describe the restaurant to generate the theme')
      return
    }

    try {
      const theme = await generateTheme({
        name: formData.name,
        business_type: formData.business_type,
        style: formData.style,
        description: formData.description
      })

      setFormData(prev => ({ ...prev, theme }))
      toast.success('Theme generated successfully by AI!')
    } catch (error) {
      console.error('Error generating theme:', error)
      toast.error('Error generating theme with AI')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      const dataToSave = {
        name: formData.name,
        slug: formData.slug,
        logo_url: formData.logo_url,
        contact_phone: formData.contact_phone,
        contact_email: formData.contact_email,
        address: formData.address,
        social_links: formData.social_links,
        business_type: formData.business_type,
        style: formData.style,
        theme: formData.theme || {},
        status: formData.status
      }

      let result
      if (id) {
        result = await supabase
          .from(TABLES.RESTAURANTES)
          .update(dataToSave)
          .eq('id', id)
      } else {
        result = await supabase
          .from(TABLES.RESTAURANTES)
          .insert([dataToSave])
      }

      if (result.error) throw result.error

      toast.success(id ? 'Restaurant updated successfully!' : 'Restaurant created successfully!')
      navigate('/superadmin/restaurants')
    } catch (error) {
      console.error('Error saving restaurant:', error)
      toast.error('Error saving restaurant')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <Header>
        <button onClick={() => navigate('/superadmin/restaurants')}>
          <ArrowLeft size={20} />
        </button>
        <Title>{id ? 'Edit Restaurant' : 'New Restaurant'}</Title>
      </Header>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Restaurant Name *</Label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={generateSlug}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Slug *</Label>
          <Input
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
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
            placeholder="+244 923 456 789"
          />
        </FormGroup>

        <FormGroup>
          <Label>Contact Email</Label>
          <Input
            name="contact_email"
            type="email"
            value={formData.contact_email}
            onChange={handleChange}
            placeholder="contact@restaurant.com"
          />
        </FormGroup>

        <FormGroup full>
          <Label>Address</Label>
          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street, City, Country"
          />
        </FormGroup>

        <FormGroup>
          <Label>Business Type *</Label>
          <Select
            name="business_type"
            value={formData.business_type}
            onChange={handleChange}
            required
          >
            {businessTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Style *</Label>
          <Select
            name="style"
            value={formData.style}
            onChange={handleChange}
            required
          >
            {styles.map(style => (
              <option key={style} value={style}>
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup full>
          <Label>Description (for AI Theme Generation)</Label>
          <TextArea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your restaurant in detail for AI to generate a unique theme..."
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

        <FormGroup>
          <Label>Instagram</Label>
          <Input
            name="social_links.instagram"
            value={formData.social_links?.instagram || ''}
            onChange={handleChange}
            placeholder="@username"
          />
        </FormGroup>

        <FormGroup>
          <Label>Facebook</Label>
          <Input
            name="social_links.facebook"
            value={formData.social_links?.facebook || ''}
            onChange={handleChange}
            placeholder="/page"
          />
        </FormGroup>

        <FormGroup>
          <Label>WhatsApp</Label>
          <Input
            name="social_links.whatsapp"
            value={formData.social_links?.whatsapp || ''}
            onChange={handleChange}
            placeholder="+244 923 456 789"
          />
        </FormGroup>

        <FormGroup>
          <Label>Status</Label>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </Select>
        </FormGroup>

        <ButtonGroup>
          <ButtonSecondary type="button" onClick={() => navigate('/superadmin/restaurants')}>
            Cancel
          </ButtonSecondary>
          <ButtonPrimary type="submit" disabled={loading}>
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              id ? 'Update' : 'Create'
            )}
          </ButtonPrimary>
        </ButtonGroup>
      </Form>
    </Container>
  )
}

export default RestauranteForm