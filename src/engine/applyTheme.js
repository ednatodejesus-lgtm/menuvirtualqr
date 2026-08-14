export function applyTheme(theme = {}) {

  if (!theme || typeof theme !== "object") {
    console.warn("applyTheme: invalid theme");
    return;
  }


  // =========================================
  // FONTES
  // =========================================

  const fonts = theme.fonts || {};

  const bodyFont =
    fonts.body ||
    "Roboto";

  const headingsFont =
    fonts.headings ||
    fonts.heading ||
    "Montserrat";

  const accentFont =
    fonts.accent ||
    "Roboto";


  // =========================================
  // CORES
  // =========================================

  const colors = theme.colors || {};

  const primaryColor =
    colors.primary ||
    "#FFFFFF";

  const secondaryColor =
    colors.secondary ||
    "#F3F4F6";

  const accentColor =
    colors.accent ||
    "#E67E22";

  const textColor =
    colors.text ||
    "#1F2937";

  const backgroundColor =
    colors.background ||
    "#FFFFFF";

  const heroOverlayValue =
    colors.hero_overlay ||
    colors.overlay ||
    "rgba(0, 0, 0, 0.35)";


  // =========================================
  // ESTILOS
  // =========================================

  const styles = theme.styles || {};

  const spacing =
    styles.spacing ||
    "1rem";

  const boxShadow =
    styles.box_shadow ||
    styles.shadow ||
    "0 4px 20px rgba(0, 0, 0, 0.10)";

  const transition =
    styles.transition ||
    "all 0.3s ease";

  const borderRadius =
    styles.border_radius ||
    styles.borderRadius ||
    "12px";

  const buttonStyle =
    styles.button_style ||
    styles.buttonStyle ||
    "rounded";


  // =========================================
  // HERO
  // =========================================

  const hero =
    theme.hero_section ||
    theme.heroSection ||
    {};

  const cta =
    hero.cta ||
    {};

  const heroHeadline =
    hero.headline ||
    hero.title ||
    "";

  const heroSubheadline =
    hero.subheadline ||
    hero.subtitle ||
    "";

  const heroBackgroundImage =
    hero.background_image ||
    hero.backgroundImage ||
    "";

  const heroCtaText =
    hero.cta_text ||
    cta.text ||
    "";

  const heroCtaUrl =
    hero.cta_url ||
    cta.link ||
    "";

  const heroTextColor =
    hero.text_color ||
    hero.textColor ||
    "#FFFFFF";

  const heroOverlay =
    hero.overlay ||
    heroOverlayValue;


  // =========================================
  // ROOT
  // =========================================

  const root = document.documentElement;


  // =========================================
  // COLORS
  // =========================================

  root.style.setProperty(
    "--color-primary",
    primaryColor
  );

  root.style.setProperty(
    "--color-secondary",
    secondaryColor
  );

  root.style.setProperty(
    "--color-accent",
    accentColor
  );

  root.style.setProperty(
    "--color-text",
    textColor
  );

  root.style.setProperty(
    "--color-background",
    backgroundColor
  );

  root.style.setProperty(
    "--color-hero-overlay",
    heroOverlayValue
  );


  // =========================================
  // FONTS
  // =========================================

  root.style.setProperty(
    "--font-body",
    `"${bodyFont}", sans-serif`
  );

  root.style.setProperty(
    "--font-headings",
    `"${headingsFont}", sans-serif`
  );

  root.style.setProperty(
    "--font-accent",
    `"${accentFont}", cursive`
  );


  // =========================================
  // STYLES
  // =========================================

  root.style.setProperty(
    "--spacing",
    spacing
  );

  root.style.setProperty(
    "--box-shadow",
    boxShadow
  );

  root.style.setProperty(
    "--transition",
    transition
  );

  root.style.setProperty(
    "--border-radius",
    borderRadius
  );

  root.style.setProperty(
    "--button-style",
    buttonStyle
  );


  // =========================================
  // HERO
  // =========================================

  root.style.setProperty(
    "--hero-background-image",
    heroBackgroundImage
      ? `url("${heroBackgroundImage}")`
      : "none"
  );

  root.style.setProperty(
    "--hero-headline",
    heroHeadline
  );

  root.style.setProperty(
    "--hero-subheadline",
    heroSubheadline
  );

  root.style.setProperty(
    "--hero-cta-text",
    heroCtaText
  );

  root.style.setProperty(
    "--hero-cta-url",
    heroCtaUrl
  );

  root.style.setProperty(
    "--hero-text-color",
    heroTextColor
  );

  root.style.setProperty(
    "--hero-overlay",
    heroOverlay
  );
}