import React from 'react';
import { useTheme } from '../../engine/ThemeProvider';
import { resolveHero } from '../../engine/resolveHero';
import { Utensils, ArrowRight } from 'lucide-react';

export default function RestaurantHero({ restaurant }) {
  const { theme } = useTheme();
  const hero = resolveHero(theme);
  
  // Estilos dinâmicos baseados no tema
  const heroStyles = {
    minHeight: hero.height === 'fullscreen' ? '100vh' 
      : hero.height === 'large' ? '80vh'
      : hero.height === 'medium' ? '60vh'
      : '40vh',
    display: 'flex',
    alignItems: hero.alignment === 'center' ? 'center' 
      : hero.alignment === 'left' ? 'flex-start' 
      : 'flex-end',
    justifyContent: 'center',
    textAlign: hero.alignment === 'center' ? 'center' 
      : hero.alignment === 'left' ? 'left' 
      : 'right',
    position: 'relative',
    overflow: 'hidden',
    background: `linear-gradient(rgba(0,0,0,${hero.overlay_strength || 0.5}), rgba(0,0,0,${hero.overlay_strength || 0.5})), 
                url(${hero.image_url || restaurant?.logo_url || '/images/default-hero.jpg'})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '3rem 2rem',
  };

  // Variantes de layout
  const getLayoutClass = () => {
    switch (hero.variant) {
      case 'fullscreen': return 'hero-fullscreen';
      case 'split': return 'hero-split';
      case 'editorial': return 'hero-editorial';
      case 'compact': return 'hero-compact';
      default: return 'hero-centered';
    }
  };

  return (
    <header 
      className={`restaurant-hero ${getLayoutClass()}`}
      style={heroStyles}
      data-hero-variant={hero.variant}
      data-visual-priority={hero.visual_priority}
    >
      <div className="hero-content">
        <h1 className="hero-title">{hero.title || restaurant?.name}</h1>
        <p className="hero-subtitle">{hero.subtitle}</p>
        <div className="hero-actions">
          <a href="#menu" className="hero-cta">
            {hero.cta_text || 'Ver Menu'}
            <ArrowRight size={16} />
          </a>
          {hero.secondary_cta && (
            <a href="#about" className="hero-secondary-cta">
              {hero.secondary_cta}
            </a>
          )}
        </div>
      </div>
    </header>
  );
}