import React from 'react'
import styled from 'styled-components'

const Card = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  }
`

const ImageContainer = styled.div`
  width: 100%;
  height: 200px;
  background: #f1f5f9;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #94a3b8;
  background: #f1f5f9;
`

const Badge = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: ${props => props.featured ? '#DAA520' : '#8B4513'};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
`

const Content = styled.div`
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`

const ProductName = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const ProductDescription = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 1rem;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
`

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
`

const Price = styled.div`
  font-size: 1.25rem;
  font-weight: 800;
  color: #8B4513;
  
  span {
    font-size: 0.75rem;
    font-weight: 400;
    color: #94a3b8;
  }
`

const AvailabilityBadge = styled.span`
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 600;
  background: ${props => props.available ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.available ? '#166534' : '#991b1b'};
`

const ProductCard = ({ product }) => {
  if (!product) return null

  return (
    <Card>
      <ImageContainer>
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextElementSibling.style.display = 'flex'
            }}
          />
        ) : (
          <ImagePlaceholder>🍽️</ImagePlaceholder>
        )}
        {product.destaque && (
          <Badge featured>⭐ Destaque</Badge>
        )}
        {!product.disponivel && (
          <Badge style={{ background: '#ef4444' }}>Indisponível</Badge>
        )}
      </ImageContainer>

      <Content>
        <ProductName>{product.name}</ProductName>
        {product.description && (
          <ProductDescription>{product.description}</ProductDescription>
        )}
        <Footer>
          <Price>
            ${parseFloat(product.price).toFixed(2)}
            <span> / item</span>
          </Price>
          <AvailabilityBadge available={product.disponivel}>
            {product.disponivel ? '✅ Disponível' : '❌ Indisponível'}
          </AvailabilityBadge>
        </Footer>
      </Content>
    </Card>
  )
}

export default ProductCard