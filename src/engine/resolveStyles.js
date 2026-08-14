const DEFAULT_STYLES = {
  spacing: "1rem",
  box_shadow: "0 4px 20px rgba(0, 0, 0, 0.10)",
  transition: "all 0.3s ease",
  border_radius: "12px",
  button_style: "rounded",
};


export function resolveStyles(styles = {}) {
  return {
    spacing:
      styles.spacing ||
      DEFAULT_STYLES.spacing,

    box_shadow:
      styles.box_shadow ||
      styles.shadow ||
      DEFAULT_STYLES.box_shadow,

    transition:
      styles.transition ||
      DEFAULT_STYLES.transition,

    border_radius:
      styles.border_radius ||
      styles.borderRadius ||
      DEFAULT_STYLES.border_radius,

    button_style:
      styles.button_style ||
      styles.buttonStyle ||
      DEFAULT_STYLES.button_style,
  };
}


export { DEFAULT_STYLES };