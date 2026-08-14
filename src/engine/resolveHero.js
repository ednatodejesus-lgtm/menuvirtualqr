const DEFAULT_HERO = {
  cta_url: "",
  cta_text: "",
  headline: "",
  subheadline: "",
  background_image: "",
  overlay: "rgba(0, 0, 0, 0.35)",
  text_color: "#FFFFFF",
};


/**
 * Normaliza o Hero recebido pela IA.
 *
 * Suporta:
 *
 * heroSection
 * hero_section
 *
 * title / headline
 * subtitle / subheadline
 * backgroundImage / background_image
 * textColor / text_color
 *
 * cta.text / cta_text
 * cta.link / cta_url
 */
export function resolveHero(theme = {}) {

  const hero =
    theme.hero_section ||
    theme.heroSection ||
    {};


  const cta =
    hero.cta ||
    {};


  return {

    // =========================================
    // CTA
    // =========================================

    cta_url:
      hero.cta_url ||
      cta.link ||
      DEFAULT_HERO.cta_url,


    cta_text:
      hero.cta_text ||
      cta.text ||
      DEFAULT_HERO.cta_text,


    // =========================================
    // TEXT
    // =========================================

    headline:
      hero.headline ||
      hero.title ||
      DEFAULT_HERO.headline,


    subheadline:
      hero.subheadline ||
      hero.subtitle ||
      DEFAULT_HERO.subheadline,


    // =========================================
    // IMAGE
    // =========================================

    background_image:
      hero.background_image ||
      hero.backgroundImage ||
      DEFAULT_HERO.background_image,


    // =========================================
    // OVERLAY
    // =========================================

    overlay:
      hero.overlay ||
      theme.colors?.hero_overlay ||
      theme.colors?.overlay ||
      DEFAULT_HERO.overlay,


    // =========================================
    // TEXT COLOR
    // =========================================

    text_color:
      hero.text_color ||
      hero.textColor ||
      DEFAULT_HERO.text_color,
  };
}


export { DEFAULT_HERO };