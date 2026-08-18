export function applyTheme(theme = {}) {
  const root = document.documentElement;

  const colors = theme.colors || {};
  const fonts = theme.fonts || {};
  const styles = theme.styles || {};
  const hero = theme.hero || {};

  const layout = theme.layout || {};
  const navigation = layout.navigation || {};
  const categories = layout.categories || {};
  const menu = layout.menu || {};
  const featured = layout.featured || {};
  const about = layout.about || {};
  const footer = layout.footer || {};

  const animations = theme.animations || {};
  const interaction = theme.interaction || {};

  const brand = theme.brand || {};
  const imagery = theme.imagery || {};
  const materials = theme.materials || {};
  const effects = theme.effects || {};
  const tokens = theme.tokens || {};

  /*
  ============================================================
  COLORS
  ============================================================
  */

  root.style.setProperty(
    "--color-primary",
    colors.primary
  );

  root.style.setProperty(
    "--color-secondary",
    colors.secondary
  );

  root.style.setProperty(
    "--color-accent",
    colors.accent
  );

  root.style.setProperty(
    "--color-background",
    colors.background
  );

  root.style.setProperty(
    "--color-surface",
    colors.surface
  );

  root.style.setProperty(
    "--color-surface-alt",
    colors.surfaceAlt
  );

  root.style.setProperty(
    "--color-card",
    colors.card
  );

  root.style.setProperty(
    "--color-text",
    colors.text
  );

  root.style.setProperty(
    "--color-text-muted",
    colors.textMuted
  );

  root.style.setProperty(
    "--color-text-inverse",
    colors.textInverse
  );

  root.style.setProperty(
    "--color-border",
    colors.border
  );

  root.style.setProperty(
    "--color-overlay",
    colors.overlay
  );

  root.style.setProperty(
    "--color-success",
    colors.success
  );

  root.style.setProperty(
    "--color-warning",
    colors.warning
  );

  root.style.setProperty(
    "--color-error",
    colors.error
  );


  /*
  ============================================================
  TYPOGRAPHY
  ============================================================
  */

  root.style.setProperty(
    "--font-heading",
    `'${fonts.heading}', sans-serif`
  );

  root.style.setProperty(
    "--font-body",
    `'${fonts.body}', sans-serif`
  );

  root.style.setProperty(
    "--font-accent",
    `'${fonts.accent}', serif`
  );

  root.style.setProperty(
    "--font-heading-weight",
    fonts.headingWeight
  );

  root.style.setProperty(
    "--font-body-weight",
    fonts.bodyWeight
  );

  root.style.setProperty(
    "--font-heading-spacing",
    fonts.headingLetterSpacing
  );

  root.style.setProperty(
    "--font-body-spacing",
    fonts.bodyLetterSpacing
  );


  /*
  ============================================================
  SPACING / CONTAINER
  ============================================================
  */

  root.style.setProperty(
    "--spacing-unit",
    styles.spacingUnit
  );

  root.style.setProperty(
    "--container-max-width",
    styles.containerMaxWidth
  );


  /*
  ============================================================
  RADII
  ============================================================
  */

  root.style.setProperty(
    "--radius-card",
    styles.cardRadius
  );

  root.style.setProperty(
    "--radius-section",
    styles.sectionRadius
  );

  root.style.setProperty(
    "--radius-button",
    styles.buttonRadius
  );


  /*
  ============================================================
  EFFECTS
  ============================================================
  */

  root.style.setProperty(
    "--shadow",
    styles.shadow
  );

  root.style.setProperty(
    "--transition",
    styles.transition
  );

  root.style.setProperty(
    "--hero-overlay-strength",
    hero.overlayStrength
  );


  /*
  ============================================================
  DATA ATTRIBUTES
  ============================================================
  These attributes allow CSS/components to react
  to the AI-generated architecture.
  ============================================================
  */

  root.dataset.layoutArchitecture =
    layout.architecture || "modern";

  root.dataset.layoutDensity =
    layout.density || "balanced";

  root.dataset.layoutContentWidth =
    layout.contentWidth || "wide";

  root.dataset.layoutRhythm =
    layout.sectionRhythm || "comfortable";


  /*
  ============================================================
  HERO
  ============================================================
  */

  root.dataset.heroVariant =
    hero.variant || "fullscreen";

  root.dataset.heroAlignment =
    hero.alignment || "center";

  root.dataset.heroHeight =
    hero.height || "large";

  root.dataset.heroVisualPriority =
    hero.visualPriority || "image";

  root.dataset.heroImageTreatment =
    hero.imageTreatment || "natural";


  /*
  ============================================================
  NAVIGATION
  ============================================================
  */

  root.dataset.navigationVariant =
    navigation.variant || "standard";

  root.dataset.navigationPosition =
    navigation.position || "static";


  /*
  ============================================================
  CATEGORIES
  ============================================================
  */

  root.dataset.categoriesVariant =
    categories.variant || "standard";

  root.dataset.categoriesPosition =
    categories.position || "static";


  /*
  ============================================================
  MENU
  ============================================================
  */

  root.dataset.menuVariant =
    menu.variant || "classic";

  root.dataset.menuCardVariant =
    menu.card_variant || "standard";

  root.dataset.menuImageRatio =
    menu.image_ratio || "square";

  root.dataset.menuImagePriority =
    menu.image_priority || "normal";

  root.dataset.menuPriceEmphasis =
    menu.price_emphasis || "balanced";

  root.dataset.menuDescriptionStyle =
    menu.description_style || "standard";


  /*
  ============================================================
  FEATURED
  ============================================================
  */

  root.dataset.featuredEnabled =
    featured.enabled === false
      ? "false"
      : "true";

  root.dataset.featuredVariant =
    featured.variant || "standard";


  /*
  ============================================================
  ABOUT
  ============================================================
  */

  root.dataset.aboutEnabled =
    about.enabled === false
      ? "false"
      : "true";

  root.dataset.aboutVariant =
    about.variant || "standard";


  /*
  ============================================================
  FOOTER
  ============================================================
  */

  root.dataset.footerVariant =
    footer.variant || "standard";

  root.dataset.footerAlignment =
    footer.alignment || "center";

  root.dataset.footerVariant =
  theme.layout?.footer?.variant || "dark";

  /*
  ============================================================
  ANIMATIONS
  ============================================================
  */

  root.dataset.animationIntensity =
    animations.intensity || "subtle";

  root.dataset.cardHover =
    animations.card_hover || "lift";

  root.dataset.pageEnter =
    animations.page_enter || "fade_up";

  root.dataset.imageHover =
    animations.image_hover || "zoom";

  root.dataset.sectionReveal =
    animations.section_reveal || "fade_up";


  /*
  ============================================================
  INTERACTION
  ============================================================
  */

  root.dataset.buttonStyle =
    interaction.button_style || "solid";

  root.dataset.hoverBehavior =
    interaction.hover_behavior || "lift";

  root.dataset.transitionSpeed =
    interaction.transition_speed || "normal";

  root.dataset.transitionStyle =
    interaction.transition_style || "smooth";


  /*
  ============================================================
  BRAND / MATERIALS / IMAGERY
  ============================================================
  */

  root.dataset.brandMood =
    brand.mood || "";

  root.dataset.luxuryLevel =
    brand.luxury_level ?? 0;

  root.dataset.imageStyle =
    imagery.style || "";

  root.dataset.imageContrast =
    imagery.contrast || "";

  root.dataset.materialTexture =
    materials.texture || "none";

  root.dataset.surfaceStyle =
    materials.surface_style || "solid";


  /*
  ============================================================
  EFFECTS
  ============================================================
  */

  root.dataset.effectBlur =
    effects.blur ? "true" : "false";

  root.dataset.effectGlass =
    effects.glass ? "true" : "false";

  root.dataset.effectNoise =
    effects.noise ? "true" : "false";

  root.dataset.effectGradient =
    effects.gradient ? "true" : "false";


  /*
  ============================================================
  TOKENS
  ============================================================
  */

  root.style.setProperty(
    "--token-spacing-unit",
    tokens.spacing_unit || styles.spacingUnit
  );

  root.style.setProperty(
    "--token-card-radius",
    tokens.card_radius || styles.cardRadius
  );

  root.style.setProperty(
    "--token-section-radius",
    tokens.section_radius || styles.sectionRadius
  );

  root.style.setProperty(
    "--token-button-radius",
    tokens.button_radius || styles.buttonRadius
  );

  root.style.setProperty(
    "--token-container-width",
    tokens.container_max_width || styles.containerMaxWidth
  );


  return root;
}