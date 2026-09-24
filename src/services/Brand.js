/**
 * Logo Horizontal MenuQR
 * Estilo: Ícone MQ (M branco, Q dourado, fundo preto, cantos arredondados)
 * + Texto "MenuQR" (Menu preto, QR dourado)
 */
export const MENUQR_HORIZONTAL_LOGO = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 90">
  <!-- Ícone Quadrado (MQ) -->
  <rect x="0" y="0" width="60" height="60" rx="12" fill="#111111"/>
  <text x="6" y="44" font-family="Arial, Helvetica, sans-serif"
        font-size="32" font-weight="800" letter-spacing="-3">
    <tspan fill="#FFFFFF">M</tspan><tspan fill="#E5A100">Q</tspan>
  </text>
  
  <!-- Texto "MenuQR" -->
  <text x="72" y="44" font-family="Arial, Helvetica, sans-serif"
        font-size="38" font-weight="800" letter-spacing="-2">
    <tspan fill="#111111">Menu</tspan><tspan fill="#E5A100">QR</tspan>
  </text>

  <!-- Slogan ajustado: Alinhado à esquerda (por baixo do M) e mais acima -->
  <text x="80" y="60" font-family="Arial, Helvetica, sans-serif" font-weight="normal" 
        font-size="12" fill="#111111" text-anchor="start">Digital, Prático e Inteligente.</text>

</svg>
`)}`;