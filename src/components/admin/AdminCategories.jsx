import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { supabase, TABLES } from '../../services/supabase'
import { Plus, Edit, Trash2, GripVertical, X } from 'lucide-react'
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
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #8B4513;
  }
`

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: #8B4513;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #6b3410;
  }
`

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const CategoryItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
  
  &:hover {
    border-color: #8B4513;
  }
`

const CategoryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
`

const CategoryName = styled.span`
  font-weight: 500;
  color: #0f172a;
`

const CategoryCount = styled.span`
  font-size: 0.75rem;
  color: #94a3b8;
  background: #f1f5f9;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`

const IconButton = styled.button`
  background: none;
  border: none;
  padding: 0.25rem;
  color: ${props => props.danger ? '#ef4444' : '#94a3b8'};
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: ${props => props.danger ? '#dc2626' : '#475569'};
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #94a3b8;
  
  p {
    margin-top: 0.5rem;
  }
`

const AdminCategories = () => {
  const { restaurantId } = useAuth()
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (restaurantId) {
      loadCategories()
    }
  }, [restaurantId])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from(TABLES.CATEGORIAS)
        .select(`
          *,
          products:produtos(count)
        `)
        .eq('restaurant_id', restaurantId)
        .order('ordem', { ascending: true })

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Error loading categories')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newCategory.trim()) {
      toast.error('Please enter a category name')
      return
    }

    try {
      const { data, error } = await supabase
        .from(TABLES.CATEGORIAS)
        .insert([{
          restaurant_id: restaurantId,
          name: newCategory.trim(),
          ordem: categories.length
        }])
        .select()

      if (error) throw error

      toast.success('Category created successfully!')
      setNewCategory('')
      loadCategories()
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error('Error creating category')
    }
  }

  const handleUpdate = async (id) => {
    if (!editName.trim()) {
      toast.error('Please enter a category name')
      return
    }

    try {
      const { error } = await supabase
        .from(TABLES.CATEGORIAS)
        .update({ name: editName.trim() })
        .eq('id', id)

      if (error) throw error

      toast.success('Category updated successfully!')
      setEditingId(null)
      setEditName('')
      loadCategories()
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error('Error updating category')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const { error } = await supabase
        .from(TABLES.CATEGORIAS)
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Category deleted successfully!')
      loadCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Error deleting category')
    }
  }

  const startEditing = (category) => {
    setEditingId(category.id)
    setEditName(category.name)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditName('')
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
  }

  return (
    <Container>
      <Header>
        <h2>📂 Categories</h2>
        <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
          {categories.length} categories
        </span>
      </Header>

      <Form onSubmit={handleCreate}>
        <Input
          type="text"
          placeholder="New category name..."
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Button type="submit">
          <Plus size={18} />
          Add Category
        </Button>
      </Form>

      {categories.length === 0 ? (
        <EmptyState>
          <p>No categories yet. Create your first category above.</p>
        </EmptyState>
      ) : (
        <CategoryList>
          {categories.map((category) => (
            <CategoryItem key={category.id}>
              <CategoryInfo>
                <GripVertical size={16} color="#94a3b8" />
                {editingId === category.id ? (
                  <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      style={{ flex: 1 }}
                      autoFocus
                    />
                    <Button 
                      type="button" 
                      onClick={() => handleUpdate(category.id)}
                      style={{ padding: '0.5rem 1rem' }}
                    >
                      Save
                    </Button>
                    <Button 
                      type="button" 
                      onClick={cancelEditing}
                      style={{ 
                        padding: '0.5rem 1rem',
                        background: '#e2e8f0',
                        color: '#475569'
                      }}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ) : (
                  <>
                    <CategoryName>{category.name}</CategoryName>
                    <CategoryCount>
                      {category.products?.[0]?.count || 0} items
                    </CategoryCount>
                  </>
                )}
              </CategoryInfo>
              <ActionButtons>
                {!editingId && (
                  <>
                    <IconButton onClick={() => startEditing(category)}>
                      <Edit size={16} />
                    </IconButton>
                    <IconButton 
                      danger 
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </>
                )}
              </ActionButtons>
            </CategoryItem>
          ))}
        </CategoryList>
      )}
    </Container>
  )
}

export default AdminCategories