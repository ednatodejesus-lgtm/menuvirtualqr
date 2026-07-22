// ============================================================
// EDGE FUNCTION: create-restaurant (MELHORADO)
// Agora também gera tema com DeepSeek
// ============================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

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

function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function generatePassword(length = 12): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  let pass = "";
  for (let i = 0; i < length; i++) {
    pass += chars[randomValues[i] % chars.length];
  }
  return pass;
}

async function generateThemeWithAI(name: string, business_type: string, style: string, description: string) {
  const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY");
  if (!DEEPSEEK_API_KEY) return null;

  try {
    const prompt = `
Create a visual theme for a restaurant:
Name: ${name}
Type: ${business_type}
Style: ${style}
Description: ${description}

Return JSON with colors, fonts, styles and hero section.
`;

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "You are a designer. Respond only with valid JSON." },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 800
      })
    });

    if (!response.ok) return null;
    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error("Error generating theme:", error);
    return null;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed. Use POST." }, 405);
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // 1. Validate caller is super_admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Authorization token missing." }, 401);
    }
    const callerToken = authHeader.replace("Bearer ", "");
    const { data: callerData, error: callerError } = await supabaseAdmin.auth.getUser(callerToken);
    if (callerError || !callerData?.user) {
      return json({ error: "Invalid or expired session." }, 401);
    }

    const { data: callerProfile, error: callerProfileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", callerData.user.id)
      .single();

    if (callerProfileError || callerProfile?.role !== "super_admin") {
      return json({ error: "Only Super Admin can create restaurants." }, 403);
    }

    // 2. Read and validate form data
    const body = await req.json();
    const {
      name,
      logo_url,
      contact_phone,
      contact_email,
      address,
      social_links,
      business_type,
      style,
      description, // NOVO: descrição para gerar tema
      admin_email,
    } = body;

    if (!name || !business_type || !style) {
      return json(
        { error: "Missing required fields: name, business_type, style." },
        400,
      );
    }

    // 3. Generate unique slug
    const baseSlug = slugify(name);
    let slug = baseSlug;
    let attempt = 0;
    while (true) {
      const { data: existing } = await supabaseAdmin
        .from("restaurants")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (!existing) break;
      attempt += 1;
      slug = `${baseSlug}-${attempt}`;
    }

    // 4. Generate theme with AI (if description provided)
    let theme = null;
    if (description) {
      theme = await generateThemeWithAI(name, business_type, style, description);
    }

    // 5. Create restaurant
    const { data: restaurant, error: restaurantError } = await supabaseAdmin
      .from("restaurants")
      .insert({
        name,
        slug,
        logo_url: logo_url ?? null,
        contact_phone: contact_phone ?? null,
        contact_email: contact_email ?? null,
        address: address ?? null,
        social_links: social_links ?? {},
        business_type,
        style,
        theme: theme || {}, // Salva o tema gerado
        description: description || null,
        status: "active",
      })
      .select()
      .single();

    if (restaurantError || !restaurant) {
      return json(
        { error: "Error creating restaurant.", details: restaurantError?.message },
        500,
      );
    }

    // 6. Create admin user
    const generatedEmail = admin_email || `${slug}@menuvirtualqr.com`;
    const generatedPassword = generatePassword();

    const { data: newUser, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: generatedEmail,
      password: generatedPassword,
      email_confirm: true,
    });

    if (userError || !newUser?.user) {
      await supabaseAdmin.from("restaurants").delete().eq("id", restaurant.id);
      return json(
        { error: "Error creating admin user.", details: userError?.message },
        500,
      );
    }

    // 7. Create admin profile
    const { error: profileInsertError } = await supabaseAdmin.from("profiles").insert({
      id: newUser.user.id,
      email: generatedEmail,
      full_name: body.admin_name || "Restaurant Admin",
      role: "restaurant_admin",
      restaurant_id: restaurant.id,
      status: "active",
    });

    if (profileInsertError) {
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
      await supabaseAdmin.from("restaurants").delete().eq("id", restaurant.id);
      return json(
        { error: "Error creating admin profile.", details: profileInsertError.message },
        500,
      );
    }

    // 8. Link restaurant to admin
    await supabaseAdmin
      .from("restaurants")
      .update({ owner_admin_id: newUser.user.id })
      .eq("id", restaurant.id);

    // 9. Return result
    return json(
      {
        restaurant,
        theme_generated: !!theme,
        admin: {
          id: newUser.user.id,
          email: generatedEmail,
          password: generatedPassword,
          restaurant_id: restaurant.id,
        },
      },
      200,
    );
  } catch (err) {
    return json({ error: "Unexpected error.", details: String(err) }, 500);
  }
});