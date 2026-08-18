export function resolveStyles(theme = {}) {
  const tokens = theme?.tokens || {};
  const materials = theme?.visual?.materials || {};
  const effects = theme?.visual?.effects || {};
  const animations = theme?.animations || {};
  const interaction = theme?.interaction || {};

  return {
    spacingUnit:
      tokens.spacing_unit || "8px",

    containerMaxWidth:
      tokens.container_max_width || "1280px",

    cardRadius:
      tokens.card_radius || materials.radius || "16px",

    sectionRadius:
      tokens.section_radius || "24px",

    buttonRadius:
      tokens.button_radius || "999px",

    shadow:
      tokens.shadow ||
      effects.shadow ||
      "0 10px 30px rgba(0,0,0,0.12)",

    transition:
      tokens.transition ||
      "0.3s ease",

    borderStyle:
      materials.border_style || "thin and subtle",

    surfaceStyle:
      materials.surface_style || "solid",

    texture:
      materials.texture || "none",

    imageStyle:
      materials.image_style || "natural",

    blur:
      effects.blur ?? false,

    glass:
      effects.glass ?? false,

    noise:
      effects.noise ?? false,

    gradient:
      effects.gradient ?? false,

    animationIntensity:
      animations.intensity || "subtle",

    cardHover:
      animations.card_hover || "lift",

    pageEnter:
      animations.page_enter || "fade_up",

    imageHover:
      animations.image_hover || "zoom",

    sectionReveal:
      animations.section_reveal || "fade_up",

    buttonStyle:
      interaction.button_style || "solid",

    hoverBehavior:
      interaction.hover_behavior || "lift",

    transitionSpeed:
      interaction.transition_speed || "normal",

    transitionStyle:
      interaction.transition_style || "smooth",

    microInteractions:
      interaction.micro_interactions ?? true,
  };
}