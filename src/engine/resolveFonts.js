/**
 * Resolve as fontes do tema
 */
export function resolveFonts(theme) {
  const typography = theme?.visual?.typography || {};
  
  const fonts = {
    heading: typography.heading || 'Playfair Display',
    body: typography.body || 'Inter',
    accent: typography.accent || 'Lato',
  };
  
  // Gerar URL do Google Fonts
  const fontFamilies = Object.values(fonts);
  const uniqueFonts = [...new Set(fontFamilies)];
  const fontUrl = `https://fonts.googleapis.com/css2?family=${uniqueFonts.join('&family=')}&display=swap`;
  
  return {
    ...fonts,
    headingWeight: typography.heading_weight || 700,
    bodyWeight: typography.body_weight || 400,
    headingLetterSpacing: typography.heading_letter_spacing || '0.02em',
    bodyLetterSpacing: typography.body_letter_spacing || '0.01em',
    fontUrl,
  };
}