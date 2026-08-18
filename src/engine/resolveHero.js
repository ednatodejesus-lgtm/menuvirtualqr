export function resolveHero(theme = {}) {
  const hero = theme.hero || {};
  const layoutHero = theme.layout?.hero || {};
  const visual = theme.visual || {};

  return {
    title:
      hero.title ||
      "Bem-vindo",

    subtitle:
      hero.subtitle ||
      "",

    ctaText:
      hero.cta_text ||
      "Ver Menu",

    secondaryCta:
      hero.secondary_cta ||
      "",

    imageUrl:
      hero.image_url ||
      "",

    imageTreatment:
      hero.image_treatment ||
      "standard",

    visualPriority:
      hero.visual_priority ||
      layoutHero.visual_priority ||
      "image",

    overlayStrength:
      typeof hero.overlay_strength === "number"
        ? hero.overlay_strength
        : 0.5,

    variant:
      layoutHero.variant ||
      "fullscreen",

    height:
      layoutHero.height ||
      "large",

    alignment:
      layoutHero.alignment ||
      "center",

    mood:
      visual.brand?.mood ||
      "",

    imagery:
      visual.imagery || {},
  };
}