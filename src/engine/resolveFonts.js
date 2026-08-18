export function resolveFonts(theme = {}) {
  const typography = theme?.visual?.typography || {};

  return {
    heading: typography.heading || "Playfair Display",
    body: typography.body || "Inter",
    accent: typography.accent || typography.heading || "Playfair Display",

    headingWeight: typography.heading_weight || 600,
    bodyWeight: typography.body_weight || 400,

    headingLetterSpacing:
      typography.heading_letter_spacing || "normal",

    bodyLetterSpacing:
      typography.body_letter_spacing || "normal",
  };
}