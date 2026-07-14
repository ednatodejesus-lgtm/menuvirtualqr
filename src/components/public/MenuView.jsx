import React, { useState } from 'react'
import styled from 'styled-components'
import Categories from './Categories'
import ProductCard from './ProductCard'

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`

const SearchBar = styled.div`
  margin-bottom: 2rem;
  
  input {
    width: 100%;
    max-width: 400px;
    padding: 0.75rem 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 0.875rem;
    transition: all 0.2s;
    
    &:focus {
      outline: none;
      border-color: #8B4513;
      box-shadow: 0 0 0 3px rgba(139, 69, 19, 0.1);
    }
    
    &::placeholder {
      color: #94a3b8;
    }
  }
`

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #94a3b8;
  
  p {
    margin-top: 0.5rem;
    font-size: 1rem;
  }
`

const MenuView = ({ categories, products, restaurant }) => {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Filtrar produtos por categoria e busca
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory ? product.category_id === selectedCategory : true
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch && product.disponivel
  })

  // Agrupar por categoria para exibição
  const getProductsByCategory = () => {
    if (selectedCategory || searchTerm) {
      // Se está filtrando, mostrar tudo junto
      return { 'Resultados': filteredProducts }
    }

    // Agrupar por categoria
    const grouped = {}
    categories.forEach(cat => {
      const catProducts = products.filter(p => p.category_id === cat.id && p.disponivel)
      if (catProducts.length > 0) {
        grouped[cat.name] = catProducts
      }
    })
    return grouped
  }

  const groupedProducts = getProductsByCategory()

  return (
    <Container>
      {restaurant && (
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
            {restaurant.name}
          </h1>
          {restaurant.description && (
            <p style={{ color: '#64748b', marginTop: '0.25rem' }}>
              {restaurant.description}
            </p>
          )}
        </div>
      )}

      <SearchBar>
        <input
          type="text"
          placeholder="🔍 Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchBar>

      <Categories 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        products={products}
      />

      {Object.keys(groupedProducts).length === 0 ? (
        <EmptyState>
          <p>😅 Nenhum produto encontrado</p>
          <p style={{ fontSize: '0.875rem' }}>Tente ajustar sua busca ou filtros</p>
        </EmptyState>
      ) : (
        Object.entries(groupedProducts).map(([categoryName, productsList]) => (
          <div key={categoryName} style={{ marginTop: '2rem' }}>
            {!selectedCategory && !searchTerm && (
              <h2 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 700, 
                color: '#0f172a',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid #e2e8f0'
              }}>
                {categoryName}
              </h2>
            )}
            <ProductGrid>
              {productsList.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ProductGrid>
          </div>
        ))
      )}
    </Container>
  )
}

export default MenuView