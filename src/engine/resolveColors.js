/**
 * Resolve as cores do tema e retorna CSS variables
 */
export function resolveColors(theme) {
  const colors = theme?.visual?.colors || {};
  
  return {
    '--color-primary': colors.primary || '#8B4513',
    '--color-secondary': colors.secondary || '#DAA520',
    '--color-accent': colors.accent || '#F5DEB3',
    '--color-background': colors.background || '#1A0F0A',
    '--color-surface': colors.surface || '#2C1810',
    '--color-surface-alt': colors.surface_alt || '#3D2318',
    '--color-text': colors.text || '#FFFFFF',
    '--color-text-muted': colors.text_muted || '#94A3B8',
    '--color-text-inverse': colors.text_inverse || '#1A0F0A',
    '--color-card': colors.card || '#2C1810',
    '--color-border': colors.border || '#3D2318',
    '--color-error': colors.error || '#EF4444',
    '--color-success': colors.success || '#22C55E',
    '--color-warning': colors.warning || '#F59E0B',
    '--color-overlay': colors.overlay || 'rgba(0,0,0,0.6)',
    // Tokens
    '--shadow-default': theme?.tokens?.shadow || '0 4px 12px rgba(0,0,0,0.1)',
    '--transition-default': theme?.tokens?.transition || '0.3s ease',
    '--radius-card': theme?.tokens?.card_radius || '12px',
    '--radius-button': theme?.tokens?.button_radius || '8px',
    '--spacing-unit': theme?.tokens?.spacing_unit || '8px',
    '--container-max-width': theme?.tokens?.container_max_width || '1200px',
  };
}