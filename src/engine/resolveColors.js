export function resolveColors(theme = {}) {
  const colors = theme?.visual?.colors || {};

  return {
    primary: colors.primary || "#111111",
    secondary: colors.secondary || "#333333",
    accent: colors.accent || "#C9A227",

    background: colors.background || "#FFFFFF",
    surface: colors.surface || colors.background || "#FFFFFF",
    surfaceAlt: colors.surface_alt || colors.surface || "#F5F5F5",
    card: colors.card || colors.surface || "#FFFFFF",

    text: colors.text || "#111111",
    textMuted: colors.text_muted || "#777777",
    textInverse: colors.text_inverse || "#FFFFFF",

    border: colors.border || "rgba(0,0,0,0.1)",
    overlay: colors.overlay || "rgba(0,0,0,0.45)",

    success: colors.success || "#2A9D8F",
    warning: colors.warning || "#E9C46A",
    error: colors.error || "#E63946",
  };
}