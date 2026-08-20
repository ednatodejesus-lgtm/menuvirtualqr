import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed. Use POST." }, 405);
  }

  try {
    const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY");
    if (!DEEPSEEK_API_KEY) {
      // Fallback com cores padrão baseadas no tipo de negócio
      return json({ 
        colors: getDefaultColors("restaurant"),
        typography: {
          heading: "Playfair Display",
          body: "Inter",
          accent: "Lato"
        }
      }, 200);
    }

    const body = await req.json();
    const { business_type, name, description } = body;

    // Construir prompt para o DeepSeek
    const prompt = `
You are a professional color designer specializing in restaurant branding.
Based on the restaurant information below, suggest a harmonious color palette and fonts.

Restaurant Name: ${name || "Restaurant"}
Business Type: ${business_type || "restaurant"}
Description: ${description || "A great restaurant"}

Return ONLY a valid JSON object with this exact structure:
{
  "colors": {
    "primary": "#hexcode",
    "secondary": "#hexcode",
    "accent": "#hexcode",
    "background": "#hexcode",
    "surface": "#hexcode",
    "text": "#hexcode",
    "text_muted": "#hexcode"
  },
  "typography": {
    "heading": "Font Name",
    "body": "Font Name",
    "accent": "Font Name"
  }
}

Requirements:
- primary: Main brand color
- secondary: Complementary color
- accent: Highlight color
- background: Page background
- surface: Card background
- text: Main text color
- text_muted: Secondary text color
- All colors must have good contrast
- Choose fonts that match the restaurant's personality
- Return ONLY JSON, no other text
`;

    // Chamar DeepSeek API
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are a color designer expert. Respond only with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.9,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      console.error("DeepSeek API error:", await response.text());
      return json({
        colors: getDefaultColors(business_type || "restaurant"),
        typography: {
          heading: "Playfair Display",
          body: "Inter",
          accent: "Lato"
        }
      }, 200);
    }

    const data = await response.json();
    let result;

    try {
      const content = data.choices[0].message.content;
      result = JSON.parse(content);
      
      // Validar estrutura
      if (!result.colors || !result.typography) {
        throw new Error("Invalid response structure");
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      return json({
        colors: getDefaultColors(business_type || "restaurant"),
        typography: {
          heading: "Playfair Display",
          body: "Inter",
          accent: "Lato"
        }
      }, 200);
    }

    return json(result, 200);

  } catch (err) {
    console.error("Error in suggest-colors:", err);
    return json({
      colors: getDefaultColors("restaurant"),
      typography: {
        heading: "Playfair Display",
        body: "Inter",
        accent: "Lato"
      }
    }, 200);
  }
});

// Fallback colors by business type
function getDefaultColors(businessType: string) {
  const palettes: Record<string, any> = {
    'restaurant': {
      primary: '#8B4513',
      secondary: '#DAA520',
      accent: '#F5DEB3',
      background: '#1A0F0A',
      surface: '#2C1810',
      text: '#FFFFFF',
      text_muted: '#94A3B8'
    },
    'fast-food': {
      primary: '#E63946',
      secondary: '#F4A261',
      accent: '#E9C46A',
      background: '#FFFFFF',
      surface: '#F8F9FA',
      text: '#212529',
      text_muted: '#6C757D'
    },
    'pizza': {
      primary: '#C0392B',
      secondary: '#F39C12',
      accent: '#F1C40F',
      background: '#FFFFFF',
      surface: '#FDF2E9',
      text: '#1A1A2E',
      text_muted: '#6C757D'
    },
    'sushi': {
      primary: '#1A3A3A',
      secondary: '#D4A373',
      accent: '#E76F51',
      background: '#FFFFFF',
      surface: '#F8F9FA',
      text: '#1A1A2E',
      text_muted: '#6C757D'
    },
    'cafe': {
      primary: '#6F4E37',
      secondary: '#C8A88E',
      accent: '#D4A373',
      background: '#FDF6EE',
      surface: '#FFFFFF',
      text: '#1A1A2E',
      text_muted: '#8D8D8D'
    },
    'bar': {
      primary: '#1A0A2E',
      secondary: '#C70039',
      accent: '#FFD700',
      background: '#0D0D0D',
      surface: '#1A1A2E',
      text: '#FFFFFF',
      text_muted: '#A0A0A0'
    },
    'hotel': {
      primary: '#1A2A3A',
      secondary: '#C9A84C',
      accent: '#D4AF37',
      background: '#F8F9FA',
      surface: '#FFFFFF',
      text: '#1A1A2E',
      text_muted: '#6C757D'
    },
    'spa': {
      primary: '#2E8B57',
      secondary: '#B8D4C8',
      accent: '#F5F0E8',
      background: '#F8FAF5',
      surface: '#FFFFFF',
      text: '#1A2E1A',
      text_muted: '#6C8D7A'
    },
    'bakery': {
      primary: '#D4A373',
      secondary: '#F4E4C8',
      accent: '#E8D5B7',
      background: '#FDF8F0',
      surface: '#FFFFFF',
      text: '#3D2B1F',
      text_muted: '#8D7A6C'
    }
  };

  return palettes[businessType] || palettes['restaurant'];
}