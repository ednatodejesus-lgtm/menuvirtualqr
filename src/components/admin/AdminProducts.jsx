import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { supabase, TABLES } from '../../services/supabase'
import { Plus, Edit, Trash2, Image, X, Upload } from 'lucide-react'
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

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
`

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  
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
  min-height: 80px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #8B4513;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const ButtonPrimary = styled(Button)`
  background: #8B4513;
  color: white;
  
  &:hover {
    background: #6b3410;
  }
`

const ButtonSecondary = styled(Button)`
  background: #e2e8f0;
  color: #475569;
  
  &:hover {
    background: #cbd5e1;
  }
`

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
`

const ProductCard = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
`

const ProductImage = styled.div`
  width: 100%;
  height: 150px;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const ProductInfo = styled.div`
  padding: 1rem;
  
  h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 0.25rem;
  }
  
  p {
    font-size: 0.75rem;
    color: #64748b;
    margin-bottom: 0.5rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`

const ProductPrice = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: #8B4513;
  margin-bottom: 0.5rem;
`

const ProductActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #94a3b8;
  
  p {
    margin-top: 0.5rem;
  }
`

const AdminProducts = () => {
  const { restaurantId } = useAuth()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    disponivel: true,
    destaque: false
  })

  useEffect(() => {
    if (restaurantId) {
      loadProducts()
      loadCategories()
    }
  }, [restaurantId])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from(TABLES.PRODUTOS)
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Error loading products')
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.CATEGORIAS)
        .select('id, name')
        .eq('restaurant_id', restaurantId)
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        category_id: product.category_id || '',
        image_url: product.image_url || '',
        disponivel: product.disponivel,
        destaque: product.destaque || false
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        description: '',
        price: '',
        category_id: '',
        image_url: '',
        disponivel: true,
        destaque: false
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProduct(null)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.price || !formData.category_id) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const dataToSave = {
        restaurant_id: restaurantId,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: formData.category_id,
        image_url: formData.image_url,
        disponivel: formData.disponivel,
        destaque: formData.destaque
      }

      let result
      if (editingProduct) {
        result = await supabase
          .from(TABLES.PRODUTOS)
          .update(dataToSave)
          .eq('id', editingProduct.id)
      } else {
        result = await supabase
          .from(TABLES.PRODUTOS)
          .insert([dataToSave])
      }

      if (result.error) throw result.error

      toast.success(editingProduct ? 'Product updated!' : 'Product created!')
      handleCloseModal()
      loadProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error('Error saving product')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const { error } = await supabase
        .from(TABLES.PRODUTOS)
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Product deleted!')
      loadProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Error deleting product')
    }
  }

  const getCategoryName = (categoryId) => {
    return categories.find(c => c.id === categoryId)?.name || 'Uncategorized'
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
  }

  return (
    <Container>
      <Header>
        <h2>📦 Products</h2>
        <ButtonPrimary onClick={() => handleOpenModal()}>
          <Plus size={18} />
          New Product
        </ButtonPrimary>
      </Header>

      {products.length === 0 ? (
        <EmptyState>
          <p>No products yet. Click "New Product" to add your first item.</p>
        </EmptyState>
      ) : (
        <ProductGrid>
          {products.map((product) => (
            <ProductCard key={product.id}>
              <ProductImage>
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} />
                ) : (
                  <Image size={32} />
                )}
              </ProductImage>
              <ProductInfo>
                <h4>{product.name}</h4>
                <p>{product.description || 'No description'}</p>
                <ProductPrice>${parseFloat(product.price).toFixed(2)}</ProductPrice>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {getCategoryName(product.category_id)}
                </div>
                <ProductActions>
                  <ButtonSecondary 
                    type="button"
                    onClick={() => handleOpenModal(product)}
                    style={{ padding: '0.25rem 0.5rem' }}
                  >
                    <Edit size={14} />
                  </ButtonSecondary>
                  <ButtonSecondary 
                    type="button"
                    danger
                    onClick={() => handleDelete(product.id)}
                    style={{ 
                      padding: '0.25rem 0.5rem',
                      background: '#fee2e2',
                      color: '#ef4444'
                    }}
                  >
                    <Trash2 size={14} />
                  </ButtonSecondary>
                </ProductActions>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductGrid>
      )}

      {showModal && (
        <Modal onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>{editingProduct ? 'Edit Product' : 'New Product'}</h3>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Product Name *</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Category *</Label>
                <Select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category...</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Price (USD) *</Label>
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Description</Label>
                <TextArea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of the product..."
                />
              </FormGroup>

              <FormGroup>
                <Label>Image URL</Label>
                <Input
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </FormGroup>

              <FormGroup>
                <Label style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Input
                    type="checkbox"
                    name="disponivel"
                    checked={formData.disponivel}
                    onChange={handleChange}
                    style={{ width: 'auto' }}
                  />
                  Available
                </Label>
              </FormGroup>

              <FormGroup>
                <Label style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Input
                    type="checkbox"
                    name="destaque"
                    checked={formData.destaque}
                    onChange={handleChange}
                    style={{ width: 'auto' }}
                  />
                  Featured Product
                </Label>
              </FormGroup>

              <ButtonGroup>
                <ButtonSecondary type="button" onClick={handleCloseModal}>
                  Cancel
                </ButtonSecondary>
                <ButtonPrimary type="submit">
                  {editingProduct ? 'Update' : 'Create'}
                </ButtonPrimary>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  )
}

export default AdminProducts