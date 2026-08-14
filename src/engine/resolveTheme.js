const DEFAULT_THEME = {
  fonts: {
    body: "Roboto",
    headings: "Montserrat",
    accent: "Roboto",
  },

  colors: {
    text: "#1F2937",
    accent: "#E67E22",
    primary: "#FFFFFF",
    secondary: "#F3F4F6",
    background: "#FFFFFF",
    hero_overlay: "rgba(0, 0, 0, 0.35)",
  },

  styles: {
    spacing: "1rem",
    box_shadow: "0 4px 20px rgba(0, 0, 0, 0.10)",
    transition: "all 0.3s ease",
    border_radius: "12px",
  },

  hero_section: {
    cta_url: "",
    cta_text: "",
    headline: "",
    subheadline: "",
    background_image: "",
    overlay: "rgba(0, 0, 0, 0.35)",
    text_color: "#FFFFFF",
  },
};


/**
 * Resolve e normaliza o tema recebido da IA.
 *
 * Aceita tanto o formato atual da IA quanto
 * o formato interno utilizado pelo nosso motor.
 */
export function resolveTheme(theme) {

  if (!theme || typeof theme !== "object") {
    return DEFAULT_THEME;
  }


  // =========================================
  // FONTS
  // =========================================

  const fonts = {
    body:
      theme.fonts?.body ||
      DEFAULT_THEME.fonts.body,

    headings:
      theme.fonts?.headings ||
      theme.fonts?.heading ||
      DEFAULT_THEME.fonts.headings,

    accent:
      theme.fonts?.accent ||
      DEFAULT_THEME.fonts.accent,
  };


  // =========================================
  // COLORS
  // =========================================

  const colors = {
    text:
      theme.colors?.text ||
      DEFAULT_THEME.colors.text,

    accent:
      theme.colors?.accent ||
      DEFAULT_THEME.colors.accent,

    primary:
      theme.colors?.primary ||
      DEFAULT_THEME.colors.primary,

    secondary:
      theme.colors?.secondary ||
      DEFAULT_THEME.colors.secondary,

    background:
      theme.colors?.background ||
      DEFAULT_THEME.colors.background,

    hero_overlay:
      theme.colors?.hero_overlay ||
      theme.colors?.overlay ||
      DEFAULT_THEME.colors.hero_overlay,
  };


  // =========================================
  // STYLES
  // =========================================

  const styles = {
    spacing:
      theme.styles?.spacing ||
      DEFAULT_THEME.styles.spacing,

    box_shadow:
      theme.styles?.box_shadow ||
      theme.styles?.shadow ||
      DEFAULT_THEME.styles.box_shadow,

    transition:
      theme.styles?.transition ||
      DEFAULT_THEME.styles.transition,

    border_radius:
      theme.styles?.border_radius ||
      theme.styles?.borderRadius ||
      DEFAULT_THEME.styles.border_radius,
  };


  // =========================================
  // HERO
  // =========================================

  const heroSource =
    theme.hero_section ||
    theme.heroSection ||
    {};


  const ctaSource =
    heroSource.cta ||
    {};


  const hero_section = {

    cta_url:
      heroSource.cta_url ||
      ctaSource.link ||
      DEFAULT_THEME.hero_section.cta_url,

    cta_text:
      heroSource.cta_text ||
      ctaSource.text ||
      DEFAULT_THEME.hero_section.cta_text,

    headline:
      heroSource.headline ||
      heroSource.title ||
      DEFAULT_THEME.hero_section.headline,

    subheadline:
      heroSource.subheadline ||
      heroSource.subtitle ||
      DEFAULT_THEME.hero_section.subheadline,

    background_image:
      heroSource.background_image ||
      heroSource.backgroundImage ||
      DEFAULT_THEME.hero_section.background_image,

    overlay:
      heroSource.overlay ||
      colors.hero_overlay ||
      DEFAULT_THEME.hero_section.overlay,

    text_color:
      heroSource.text_color ||
      heroSource.textColor ||
      DEFAULT_THEME.hero_section.text_color,
  };


  // =========================================
  // RESULTADO FINAL
  // =========================================

  return {
    fonts,
    colors,
    styles,
    hero_section,
  };
}


export { DEFAULT_THEME };