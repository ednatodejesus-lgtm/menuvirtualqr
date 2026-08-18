import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    if (!DEEPSEEK_API_KEY) {
      throw new Error("DEEPSEEK_API_KEY is not configured");
    }

    const body = await req.json();

    const {
      name,
      business_type,
      style,
      description,
    } = body;

    if (!name) {
      return new Response(
        JSON.stringify({
          error: "Restaurant name is required",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const prompt = `
You are a world-class digital art director, luxury hospitality designer,
restaurant brand strategist, UX/UI architect and visual identity specialist.

Your task is to design the complete DIGITAL DNA of a restaurant.

You are NOT simply choosing colors.

You are designing the visual identity AND the architectural structure
of a premium digital restaurant experience.

Think like the creative director of a world-class hospitality design studio.

The final website should feel intentionally designed for THIS restaurant,
not like a generic template with different colors.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESTAURANT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name:
${name}

Business Type:
${business_type || "restaurant"}

Requested Style:
${style || "modern"}

Description:
${description || "No description provided"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CREATIVE PRINCIPLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

First understand the restaurant concept.

Determine internally:

- brand personality
- emotional atmosphere
- target audience
- level of luxury
- cultural influence
- visual era
- typography personality
- image direction
- interface density
- spatial rhythm
- interaction personality

Do NOT return this reasoning.

Use it to create the final design system.

The result must feel coherent, sophisticated and memorable.

IMPORTANT:

The visual system and layout system must work together.

Do not create a beautiful color palette and then attach it
to a generic website structure.

The architecture of the website must also reflect the restaurant.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VISUAL SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generate:

"visual": {

  "brand": {
    "personality": [],
    "luxury_level": 1,
    "mood": "",
    "design_direction": ""
  },

  "colors": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "background": "#hex",
    "surface": "#hex",
    "surface_alt": "#hex",
    "card": "#hex",
    "text": "#hex",
    "text_muted": "#hex",
    "text_inverse": "#hex",
    "border": "#hex",
    "success": "#hex",
    "warning": "#hex",
    "error": "#hex",
    "overlay": "rgba(...)"
  },

  "typography": {
    "heading": "Google Font",
    "body": "Google Font",
    "accent": "Google Font",
    "heading_weight": 700,
    "body_weight": 400,
    "heading_letter_spacing": "",
    "body_letter_spacing": ""
  },

  "materials": {
    "surface_style": "",
    "border_style": "",
    "radius": "",
    "shadow_style": "",
    "texture": "",
    "image_style": ""
  },

  "effects": {
    "shadow": "",
    "glass": false,
    "gradient": false,
    "noise": false,
    "blur": false
  },

  "imagery": {
    "style": "",
    "contrast": "",
    "saturation": "",
    "overlay": "",
    "priority": "high|medium|low"
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VISUAL RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Colors must form one coherent palette.

Do not select colors independently.

Luxury does NOT mean gold.

Luxury comes from:

- precision
- restraint
- hierarchy
- typography
- spacing
- materiality
- contrast

Avoid generic SaaS aesthetics.

Avoid:

- generic purple/blue palettes
- excessive gradients
- excessive rounded cards
- excessive shadows
- unnecessary borders
- random decorative elements
- excessive glassmorphism

Use real Google Fonts.

Do not automatically use the same fonts.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAYOUT SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The layout system defines the ARCHITECTURE of the website.

Generate:

"layout": {

  "architecture": "cinematic|editorial|minimal|classic|immersive|modern|organic",

  "density": "compact|balanced|spacious|cinematic",

  "content_width": "narrow|standard|wide|full",

  "section_rhythm": "compact|balanced|generous|dramatic",

  "hero": {
    "variant": "fullscreen|split_screen|centered|editorial|compact|immersive",
    "height": "standard|large|fullscreen",
    "alignment": "left|center|right",
    "visual_priority": "image|typography|balanced"
  },

  "navigation": {
    "variant": "minimal|classic|floating|overlay|editorial",
    "position": "top|overlay|floating|sticky"
  },

  "categories": {
    "variant": "tabs|pills|minimal|floating|horizontal_scroll|sidebar",
    "position": "static|sticky|floating"
  },

  "featured": {
    "enabled": true,
    "variant": "horizontal_showcase|large_cards|split|editorial|none"
  },

  "menu": {
    "variant": "grid|editorial_grid|list|luxury_list|immersive|showcase",
    "card_variant": "minimal|editorial|luxury|immersive|compact|showcase",
    "image_ratio": "square|portrait|landscape",
    "image_priority": "high|medium|low",
    "price_emphasis": "subtle|balanced|strong",
    "description_style": "minimal|editorial|detailed"
  },

  "about": {
    "enabled": true,
    "variant": "split_story|image_left|image_right|editorial|minimal|none"
  },

  "footer": {
    "variant": "minimal|editorial|luxury|dark|immersive|classic",
    "alignment": "left|center|split"
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAYOUT INTELLIGENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is extremely important.

Do NOT use the same architecture for every restaurant.

The website must structurally change according to the concept.

Examples:

Fine dining may use:

- cinematic or editorial architecture
- fullscreen hero
- elegant typography
- restrained navigation
- editorial menu
- large photography
- spacious sections
- minimal footer

Rooftop may use:

- immersive architecture
- cinematic hero
- overlay navigation
- large photography
- showcase dishes
- horizontal category navigation
- dramatic spacing

Casual restaurant may use:

- modern architecture
- compact hero
- sticky categories
- practical menu grid
- stronger product visibility
- simpler footer

Café may use:

- organic or editorial architecture
- warm typography
- image-led hero
- compact category navigation
- editorial product cards

Nightclub may use:

- immersive architecture
- dramatic hero
- dark atmospheric palette
- bold typography
- expressive interactions

Do not copy these examples literally.

Use them as design intelligence.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HERO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generate:

"hero": {
  "title": "",
  "subtitle": "",
  "cta_text": "View Menu",
  "secondary_cta": "",
  "overlay_strength": 0.0,
  "image_treatment": "cinematic|editorial|natural|dramatic",
  "visual_priority": "image|typography|balanced"
}

The title must feel like a brand statement.

Never use generic phrases such as:

"Welcome to our restaurant"

"Experience delicious food"

"Best food in town"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERACTION SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generate:

"interaction": {

  "button_style": "minimal|solid|outline|pill|editorial",

  "hover_behavior": "subtle|lift|fill|underline|glow",

  "transition_speed": "fast|normal|slow",

  "transition_style": "smooth|spring|cinematic",

  "micro_interactions": true
}

Interactions must feel premium.

Never make the interface feel like a gaming website.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANIMATION SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generate:

"animations": {

  "page_enter": "fade|fade_up|slide|reveal|none",

  "section_reveal": "fade|fade_up|clip|scale|none",

  "image_hover": "zoom|lift|none|parallax",

  "card_hover": "lift|glow|scale|none",

  "intensity": "subtle|medium|expressive"
}

Animations must support the identity.

Prefer restraint.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN TOKENS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generate:

"tokens": {

  "spacing_unit": "",
  "section_radius": "",
  "card_radius": "",
  "button_radius": "",
  "shadow": "",
  "transition": "",
  "container_max_width": ""
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONSISTENCY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Every decision must belong to the same visual universe.

The following must feel designed together:

- hero
- navigation
- category navigation
- menu
- product cards
- featured section
- about section
- footer
- typography
- colors
- imagery
- interactions
- animations

The result should look like one creative studio designed the entire experience.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESPONSIVE DESIGN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design decisions must work on:

- mobile
- tablet
- desktop

Mobile must NOT simply be a compressed desktop layout.

The chosen architecture should remain elegant on small screens.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINAL VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before returning the JSON, verify internally:

- valid hexadecimal colors
- valid Google Fonts
- valid JSON
- no duplicated design decisions
- visual system is coherent
- layout system is coherent
- layout matches business concept
- hero is distinctive
- menu is appropriate
- cards are not generic
- navigation is not generic
- footer is not generic
- animations are restrained
- mobile is considered

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Return ONLY valid JSON.

No markdown.

No explanation.

No comments.

No code fences.

The result MUST be directly compatible with JSON.parse().
`;

    const response = await fetch(
      "https://api.deepseek.com/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content:
                "You are a world-class hospitality digital art director. Return only valid JSON.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.85,
          max_tokens: 5000,
          response_format: {
            type: "json_object",
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `DeepSeek API error (${response.status}): ${errorText}`
      );
    }

    const result = await response.json();

    const content = result?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("DeepSeek returned an empty response");
    }

    let theme;

    try {
      theme =
        typeof content === "string"
          ? JSON.parse(content)
          : content;
    } catch (parseError) {
      console.error("Invalid DeepSeek JSON:", content);

      throw new Error(
        "DeepSeek returned invalid JSON"
      );
    }

    /*
     * Basic structural validation.
     * The complete validation will eventually live inside resolveTheme.js.
     */
    if (!theme.visual || !theme.layout) {
      throw new Error(
        "Generated theme must contain visual and layout systems"
      );
    }

    if (!theme.visual.colors) {
      throw new Error(
        "Generated theme is missing visual.colors"
      );
    }

    if (!theme.visual.typography) {
      throw new Error(
        "Generated theme is missing visual.typography"
      );
    }

    if (!theme.layout.hero) {
      throw new Error(
        "Generated theme is missing layout.hero"
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        theme,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("generate-theme error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});