import { resolveColors } from "./resolveColors";
import { resolveFonts } from "./resolveFonts";
import { resolveStyles } from "./resolveStyles";
import { resolveHero } from "./resolveHero";

export function resolveTheme(theme = {}) {
  return {
    colors: resolveColors(theme),

    fonts: resolveFonts(theme),

    styles: resolveStyles(theme),

    hero: resolveHero(theme),

    layout: {
      architecture:
        theme?.layout?.architecture || "modern",

      density:
        theme?.layout?.density || "balanced",

      contentWidth:
        theme?.layout?.content_width || "wide",

      sectionRhythm:
        theme?.layout?.section_rhythm || "comfortable",

      navigation:
        theme?.layout?.navigation || {},

      categories:
        theme?.layout?.categories || {},

      menu:
        theme?.layout?.menu || {},

      featured:
        theme?.layout?.featured || {},

      about:
        theme?.layout?.about || {},

      footer:
        theme?.layout?.footer || {},
    },

    animations:
      theme?.animations || {},

    interaction:
      theme?.interaction || {},

    raw: theme,
  };
}