export const MENUQR_APP_URL = "https://menuvirtualqr.web.app";

export function getPublicMenuUrl(slug) {
  return slug ? `${MENUQR_APP_URL}/menu/${slug}` : MENUQR_APP_URL;
}

// MQ: M branco, Q dourado, fundo preto, cantos arredondados.
export const MENUQR_QR_LOGO = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="2" y="2" width="96" height="96" rx="18" fill="#111111"/>
  <text x="8" y="70" font-family="Arial, Helvetica, sans-serif"
        font-size="51" font-weight="800" letter-spacing="-5">
    <tspan fill="#FFFFFF">M</tspan><tspan fill="#E5A100">Q</tspan>
  </text>
</svg>
`)}`;

export const MENUQR_QR_IMAGE_SETTINGS = {
  src: MENUQR_QR_LOGO,
  width: 48,
  height: 48,
  excavate: true,
};
