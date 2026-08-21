import { supabase, TABLES } from './supabase';

export async function getPromotions(restaurantId) {
    if (!restaurantId) {
        throw new Error('Restaurant ID é obrigatório');
    }

    // 🔥 Usar string diretamente como fallback
    const tableName = TABLES?.PROMOTIONS || 'promotions';
    
    const { data, error } = await supabase
        .from(tableName)
        .select(`
            *,
            products:product_id (
                name,
                price,
                image_url,
                description,
                category_id,
                categories:category_id (
                    name
                )
            )
        `)
        .eq('restaurant_id', restaurantId)
        .order('featured', { ascending: false })
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function getActivePromotions(restaurantId) {
    const tableName = TABLES?.PROMOTIONS || 'promotions';
    
    const { data, error } = await supabase
        .from(tableName)
        .select(`
            *,
            products:product_id (
                name,
                price,
                image_url,
                description
            )
        `)
        .eq('restaurant_id', restaurantId)
        .eq('is_active', true)
        .lte('start_date', new Date().toISOString())
        .or(`end_date.is.null,end_date.gte.${new Date().toISOString()}`)
        .order('featured', { ascending: false })
        .order('display_order', { ascending: true })
        .limit(10);

    if (error) throw error;
    return data;
}

export async function getOfferOfTheDay(restaurantId) {
    const tableName = TABLES?.PROMOTIONS || 'promotions';
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    const { data, error } = await supabase
        .from(tableName)
        .select(`
            *,
            products:product_id (
                name,
                price,
                image_url,
                description
            )
        `)
        .eq('restaurant_id', restaurantId)
        .eq('type', 'offer_day')
        .eq('is_active', true)
        .gte('start_date', startOfDay)
        .lte('start_date', endOfDay)
        .maybeSingle();

    if (error) throw error;
    return data;
}

export async function createPromotion(promotion) {
    const tableName = TABLES?.PROMOTIONS || 'promotions';
    
    const { data, error } = await supabase
        .from(tableName)
        .insert([{
            ...promotion,
            discount_percentage: calculateDiscountPercentage(
                promotion.original_price,
                promotion.discounted_price
            )
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updatePromotion(id, updates) {
    const tableName = TABLES?.PROMOTIONS || 'promotions';
    
    if (updates.original_price && updates.discounted_price) {
        updates.discount_percentage = calculateDiscountPercentage(
            updates.original_price,
            updates.discounted_price
        );
    }

    const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deletePromotion(id) {
    const tableName = TABLES?.PROMOTIONS || 'promotions';
    
    const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

    if (error) throw error;
}

export async function togglePromotionStatus(id, isActive) {
    const tableName = TABLES?.PROMOTIONS || 'promotions';
    
    const { data, error } = await supabase
        .from(tableName)
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

function calculateDiscountPercentage(original, discounted) {
    if (!original || !discounted || original <= 0) return 0;
    return Math.round(((original - discounted) / original) * 100);
}

export function isPromotionActive(promotion) {
    const now = new Date();
    const start = new Date(promotion.start_date);
    const end = promotion.end_date ? new Date(promotion.end_date) : null;

    return promotion.is_active && 
           now >= start && 
           (end === null || now <= end);
}

export function getPromotionTimeLeft(promotion) {
    if (!promotion.end_date) return null;
    
    const now = new Date();
    const end = new Date(promotion.end_date);
    const diff = end - now;
    
    if (diff <= 0) return 'Terminado';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

export function getPromotionTypeLabel(type) {
    const labels = {
        'promotion': 'Promoção',
        'offer_day': 'Oferta do Dia',
        'flash_sale': 'Flash Sale'
    };
    return labels[type] || type;
}