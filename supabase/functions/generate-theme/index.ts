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

// Fallback theme if AI fails
function getDefaultTheme() {
  return {
    colors: {
      primary: "#8B4513",
      secondary: "#DAA520",
      accent: "#F5DEB3",
      background: "#1A0F0A",
      text: "#FFFFFF",
      card: "#FFFFFF"
    },
    fonts: {
      heading: "Playfair Display",
      body: "Lato"
    },
    styles: {
      borders: "rounded-lg",
      shadows: "shadow-xl",
      buttons: "rounded-lg",
      animations: "fade-in-up"
    },
    hero: {
      title: "Welcome to Our Restaurant",
      subtitle: "Experience the finest dining",
      cta_text: "View Menu"
    }
  };
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed. Use POST." }, 405);
  }

  try {
    // Get DeepSeek API Key from environment
    const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY");
    if (!DEEPSEEK_API_KEY) {
      console.error("DEEPSEEK_API_KEY not configured");
      return json({ 
        error: "AI service not configured", 
        theme: getDefaultTheme() 
      }, 200); // Return default theme instead of failing
    }

    // Get request body
    const body = await req.json();
    const { name, business_type, style, description } = body;

    if (!name || !description) {
      return json({ 
        error: "Name and description are required",
        theme: getDefaultTheme()
      }, 200);
    }

    // Build prompt for DeepSeek
    const prompt = `
You are an expert restaurant designer and branding specialist. 
Create a complete visual theme for a restaurant based on the following details:

Restaurant Name: ${name}
Business Type: ${business_type || 'restaurant'}
Style: ${style || 'modern'}
Description: ${description}

Generate a theme with the following structure in JSON format:
{
  "colors": {
    "primary": "#hexcode",
    "secondary": "#hexcode",
    "accent": "#hexcode",
    "background": "#hexcode",
    "text": "#hexcode",
    "card": "#hexcode"
  },
  "fonts": {
    "heading": "Font Name",
    "body": "Font Name"
  },
  "styles": {
    "borders": "rounded-lg|rounded-xl|rounded-2xl",
    "shadows": "shadow-md|shadow-lg|shadow-xl",
    "buttons": "rounded-full|rounded-lg",
    "animations": "fade-in-up|slide-in|scale-in"
  },
  "hero": {
    "title": "Restaurant Tagline",
    "subtitle": "Short description for hero section",
    "cta_text": "View Menu"
  }
}

Consider:
- Colors should be harmonious and reflect the restaurant's concept
- Choose fonts that match the restaurant's personality
- Style should match the restaurant's theme (luxury, casual, modern, etc.)
- Make it unique and memorable

Return only valid JSON, no other text.
`;

    // Call DeepSeek API
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
            content: "You are an expert restaurant designer. Respond only with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      console.error("DeepSeek API error:", await response.text());
      return json({ 
        error: "AI service temporarily unavailable", 
        theme: getDefaultTheme() 
      }, 200);
    }

    const data = await response.json();
    let theme;

    try {
      // Try to parse the AI response
      const content = data.choices[0].message.content;
      theme = JSON.parse(content);
      
      // Validate theme structure
      if (!theme.colors || !theme.fonts || !theme.styles) {
        throw new Error("Invalid theme structure");
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      theme = getDefaultTheme();
    }

    return json({ theme }, 200);

  } catch (err) {
    console.error("Error in generate-theme function:", err);
    return json({ 
      error: "Unexpected error", 
      theme: getDefaultTheme() 
    }, 200);
  }
});