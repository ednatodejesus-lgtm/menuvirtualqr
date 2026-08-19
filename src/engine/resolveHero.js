/**
 * Resolve as configurações do Hero
 */
export function resolveHero(theme) {
  const heroConfig = theme?.hero || {};
  const layoutHero = theme?.layout?.hero || {};
  
  return {
    // Conteúdo
    title: heroConfig.title || 'Bem-vindo ao nosso restaurante',
    subtitle: heroConfig.subtitle || 'Uma experiência gastronómica única',
    cta_text: heroConfig.cta_text || 'Ver Menu',
    secondary_cta: heroConfig.secondary_cta || null,
    image_url: heroConfig.image_url || null,
    
    // Estilo
    height: layoutHero.height || 'medium', // fullscreen, large, medium, compact
    variant: layoutHero.variant || 'centered', // fullscreen, split, centered, editorial, compact
    alignment: layoutHero.alignment || 'center', // center, left, right
    
    // Tratamento de imagem
    image_treatment: heroConfig.image_treatment || 'standard',
    visual_priority: heroConfig.visual_priority || 'content',
    overlay_strength: heroConfig.overlay_strength || 0.5,
    
    // Layout
    image_ratio: layoutHero.image_ratio || '16:9',
  };
}