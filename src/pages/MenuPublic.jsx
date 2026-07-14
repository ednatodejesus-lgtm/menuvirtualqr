import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase, TABLES } from '../services/supabase'
import styled from 'styled-components'
import MenuView from '../components/public/MenuView'

const Container = styled.div`
  min-height: 100vh;
  background: #f8fafc;
`

const Header = styled.header`
  background: linear-gradient(135deg, #1A0F0A 0%, #2C1810 50%, #3D2318 100%);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
`

const RestaurantName = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
`

const RestaurantInfo = styled.p`
  color: #DAA520;
  font-size: 1rem;
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: 1.125rem;
  color: #64748b;
`

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  flex-direction: column;
  gap: 1rem;
  
  h2 {
    color: #ef4444;
  }
  
  p {
    color: #64748b;
  }
`

const MenuPublic = () => {
  const { restaurantId } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [restaurant, setRestaurant] = useState(null)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    if (restaurantId) {
      loadRestaurantData()
    }
  }, [restaurantId])

  const loadRestaurantData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Buscar restaurante
      const { data: restaurantData, error: restaurantError } = await supabase
        .from(TABLES.RESTAURANTS)
        .select('*')
        .eq('id', restaurantId)
        .single()

      if (restaurantError) throw restaurantError
      setRestaurant(restaurantData)

      // Buscar categorias
      const { data: categoriesData, error: categoriesError } = await supabase
        .from(TABLES.CATEGORIES)
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('ordem', { ascending: true })

      if (categoriesError) throw categoriesError
      setCategories(categoriesData || [])

      // Buscar produtos
      const { data: productsData, error: productsError } = await supabase
        .from(TABLES.PRODUCTS)
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('ordem', { ascending: true })

      if (productsError) throw productsError
      setProducts(productsData || [])

    } catch (error) {
      console.error('Error loading menu:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <LoadingContainer>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #e2e8f0',
            borderTopColor: '#8B4513',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p>Carregando menu...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </LoadingContainer>
    )
  }

  if (error) {
    return (
      <ErrorContainer>
        <h2>😅 Ops! Algo deu errado</h2>
        <p>Não foi possível carregar o menu do restaurante.</p>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{error}</p>
      </ErrorContainer>
    )
  }

  if (!restaurant) {
    return (
      <ErrorContainer>
        <h2>🍽️ Restaurante não encontrado</h2>
        <p>O restaurante que você está procurando não existe.</p>
      </ErrorContainer>
    )
  }

  return (
    <Container>
      <Header>
        {restaurant.logo_url && (
          <img 
            src={restaurant.logo_url} 
            alt={restaurant.name}
            style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              objectFit: 'cover',
              marginBottom: '1rem'
            }}
          />
        )}
        <RestaurantName>{restaurant.name}</RestaurantName>
        <RestaurantInfo>{restaurant.business_type} • {restaurant.style}</RestaurantInfo>
        {restaurant.address && (
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            📍 {restaurant.address}
          </p>
        )}
        {restaurant.contact_phone && (
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            📞 {restaurant.contact_phone}
          </p>
        )}
      </Header>

      <MenuView 
        categories={categories}
        products={products}
        restaurant={restaurant}
      />
    </Container>
  )
}

export default MenuPublic