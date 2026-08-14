const DEFAULT_COLORS = {
  text: "#1F2937",
  accent: "#E67E22",
  primary: "#FFFFFF",
  secondary: "#F3F4F6",
  background: "#FFFFFF",
  hero_overlay: "rgba(0, 0, 0, 0.35)",
};


export function resolveColors(colors = {}) {
  return {
    text:
      colors.text ||
      DEFAULT_COLORS.text,

    accent:
      colors.accent ||
      DEFAULT_COLORS.accent,

    primary:
      colors.primary ||
      DEFAULT_COLORS.primary,

    secondary:
      colors.secondary ||
      DEFAULT_COLORS.secondary,

    background:
      colors.background ||
      DEFAULT_COLORS.background,

    hero_overlay:
      colors.hero_overlay ||
      colors.overlay ||
      DEFAULT_COLORS.hero_overlay,
  };
}


export { DEFAULT_COLORS };