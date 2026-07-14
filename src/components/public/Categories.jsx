import React from 'react'
import styled from 'styled-components'

const Container = styled.section`
  padding: 2rem 0;
`

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid #8B4513;
`

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`

const CategoryItem = styled.div`
  background: white;
  padding: 1.5rem 1rem;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid ${props => props.active ? '#8B4513' : '#e2e8f0'};
  box-shadow: ${props => props.active ? '0 4px 12px rgba(139, 69, 19, 0.15)' : 'none'};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    border-color: #8B4513;
  }
`

const CategoryIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`

const CategoryName = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
`

const CategoryCount = styled.p`
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 0.25rem;
`

const Categories = ({ categories, selectedCategory, onSelectCategory, products }) => {
  // Contar produtos por categoria
  const getProductCount = (categoryId) => {
    return products.filter(p => p.category_id === categoryId).length
  }

  // Ícones para categorias (opcional)
  const getCategoryIcon = (categoryName) => {
    const icons = {
      'Entradas': '🍢',
      'Pratos Principais': '🍛',
      'Sobremesas': '🍰',
      'Bebidas': '🥤',
      'Café': '☕',
      'Sucos': '🧃',
      'Saladas': '🥗',
      'Massas': '🍝',
      'Pizzas': '🍕',
      'Hambúrgueres': '🍔',
      'Peixes': '🐟',
      'Carnes': '🥩',
      'Vegano': '🌱',
      'Vegetariano': '🥦',
      'Acompanhamentos': '🍟',
      'Sopas': '🍜'
    }
    return icons[categoryName] || '🍽️'
  }

  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <Container>
      <Title>📂 Categorias</Title>
      <CategoryGrid>
        {/* Opção "Todos" */}
        <CategoryItem 
          active={!selectedCategory}
          onClick={() => onSelectCategory(null)}
        >
          <CategoryIcon>📋</CategoryIcon>
          <CategoryName>Todos</CategoryName>
          <CategoryCount>{products.length} itens</CategoryCount>
        </CategoryItem>

        {categories.map((category) => {
          const count = getProductCount(category.id)
          if (count === 0) return null // Não mostrar categorias vazias

          return (
            <CategoryItem 
              key={category.id}
              active={selectedCategory === category.id}
              onClick={() => onSelectCategory(category.id)}
            >
              <CategoryIcon>{getCategoryIcon(category.name)}</CategoryIcon>
              <CategoryName>{category.name}</CategoryName>
              <CategoryCount>{count} itens</CategoryCount>
            </CategoryItem>
          )
        })}
      </CategoryGrid>
    </Container>
  )
}

export default Categories