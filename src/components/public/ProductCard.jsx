import React from 'react';
import { useTheme } from '../../engine/ThemeProvider';
import { Star, Utensils, CheckCircle, XCircle } from 'lucide-react';

export default function ProductCard({ product }) {
  const { theme } = useTheme();
  
  
  const menuConfig = theme?.layout?.menu || {};
  
  // Estilos baseados no tema
  const cardStyles = {
    borderRadius: theme?.tokens?.card_radius || '12px',
    boxShadow: theme?.tokens?.shadow || '0 4px 12px rgba(0,0,0,0.1)',
    transition: `all ${theme?.tokens?.transition || '0.3s ease'}`,
    backgroundColor: `var(--color-card, #2C1810)`,
    border: `1px solid var(--color-border, #3D2318)`,
    overflow: 'hidden',
  };

  const getCardVariant = () => {
    switch (menuConfig.card_variant || 'grid') {
      case 'showcase': return 'product-card-showcase';
      case 'immersive': return 'product-card-immersive';
      case 'editorial': return 'product-card-editorial';
      case 'list': return 'product-card-list';
      default: return 'product-card-grid';
    }
  };

  const getImageRatio = () => {
    switch (menuConfig.image_ratio || 'square') {
      case 'portrait': return 'aspect-3-4';
      case 'landscape': return 'aspect-4-3';
      case 'cinematic': return 'aspect-16-9';
      default: return 'aspect-square';
    }
  };

  const priceEmphasis = menuConfig.price_emphasis || 'bold';

  return (
    <div className={`product-card ${getCardVariant()}`} style={cardStyles}>
      <div className={`product-image ${getImageRatio()}`}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} />
        ) : (
          <div className="product-image-placeholder">
            <Utensils size={32} />
          </div>
        )}
        {product.destaque && (
          <span className="product-badge">
            <Star size={12} />
            Destaque
          </span>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        {product.description && (
          <p className="product-description">{product.description}</p>
        )}
        <div className="product-footer">
          <span className={`product-price price-${priceEmphasis}`}>
           <h3> Preço: {parseFloat(product.price).toFixed(2)} Kz</h3>
          </span>
          <span className="product-availability">
            {product.disponivel ? (
              <CheckCircle size={14} color="#22c55e" />
            ) : (
              <XCircle size={14} color="#ef4444" />
            )}
            {product.disponivel ? ' Disponível' : ' Indisponível'}
          </span>
        </div>
      </div>
    </div>
  );
}