/**
 * Resolve o tema completo do restaurante
 * Combina o tema da IA com fallbacks padrão
 */
export function resolveTheme(restaurantTheme = {}) {
  // Fallback padrão
  const defaultTheme = {
    hero: {
      title: "Bem-vindo ao nosso restaurante",
      subtitle: "Uma experiência gastronómica única",
      cta_text: "Ver Menu",
      image_url: null,
      image_treatment: "standard",
      visual_priority: "content",
      overlay_strength: 0.5
    },
    layout: {
      hero: { height: "medium", variant: "centered", alignment: "center" },
      menu: { variant: "grid", image_ratio: "square", price_emphasis: "bold" },
      footer: { variant: "minimal", alignment: "center" },
      categories: { variant: "tabs", position: "static" },
      navigation: { variant: "classic", position: "top" },
      content_width: "normal",
      density: "comfortable"
    },
    tokens: {
      shadow: "0 4px 12px rgba(0,0,0,0.1)",
      transition: "0.3s ease",
      card_radius: "12px",
      spacing_unit: "8px",
      button_radius: "8px",
      container_max_width: "1200px"
    },
    visual: {
      colors: {
        primary: "#8B4513",
        secondary: "#DAA520",
        accent: "#F5DEB3",
        background: "#1A0F0A",
        surface: "#2C1810",
        surface_alt: "#3D2318",
        text: "#FFFFFF",
        text_muted: "#94A3B8",
        text_inverse: "#1A0F0A",
        card: "#2C1810",
        border: "#3D2318",
        error: "#EF4444",
        success: "#22C55E",
        warning: "#F59E0B",
        overlay: "rgba(0,0,0,0.6)"
      },
      typography: {
        heading: "Playfair Display",
        body: "Inter",
        accent: "Lato",
        heading_weight: 700,
        body_weight: 400,
        heading_letter_spacing: "0.02em",
        body_letter_spacing: "0.01em"
      },
      effects: {
        blur: false,
        glass: false,
        noise: false,
        shadow: "0 4px 12px rgba(0,0,0,0.1)",
        gradient: false
      },
      imagery: {
        style: "natural",
        overlay: "Linear gradient from black to transparent",
        contrast: "medium",
        priority: "medium",
        saturation: "natural"
      },
      materials: {
        radius: "Rounded corners",
        texture: "Smooth",
        image_style: "Natural, warm photography",
        border_style: "Subtle borders",
        shadow_style: "Soft shadows",
        surface_style: "Warm, inviting surfaces"
      },
      brand: {
        mood: "warm, inviting, comfortable",
        personality: ["elegant", "authentic", "memorable"],
        luxury_level: 2,
        design_direction: "Elegant restaurant design with warm tones and comfortable atmosphere"
      }
    },
    animations: {
      intensity: "light",
      card_hover: "lift",
      page_enter: "fade",
      image_hover: "zoom",
      section_reveal: "fade_up"
    },
    interaction: {
      button_style: "rounded",
      hover_behavior: "lift",
      transition_speed: "normal",
      transition_style: "ease",
      micro_interactions: true
    }
  };

  // Mesclar com o tema do restaurante
  return deepMerge(defaultTheme, restaurantTheme);
}

/**
 * Deep merge de objetos
 */
function deepMerge(target, source) {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
}