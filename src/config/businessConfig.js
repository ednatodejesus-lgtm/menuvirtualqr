// ============================================================
// CONFIGURAÇÃO POR TIPO DE NEGÓCIO
// ============================================================

// 🔥 Lista explícita de negócios que têm mesas
export const BUSINESS_TYPES_WITH_TABLES = [
  'restaurant',
  'hamburgeria',
  'cafeteria',
  'bar_noturno',
  'pizzaria',
];

// 🔥 Lista explícita de negócios que têm checkout
export const BUSINESS_TYPES_WITH_CHECKOUT = [
  'restaurant',
  'hamburgeria',
  'cafeteria',
  'bar_noturno',
  'pizzaria',
  'hotel',
  'hospedaria',
  'resort',
  'spa',
  'boutique',
  'loja_roupa',
  'loja_tech',
  'farmacia',
  'stand_automovel',
  'outros',
];

// ============================================================
// CONFIGURAÇÃO DETALHADA POR TIPO
// ============================================================
export const BUSINESS_CONFIG = {
  restaurant: {
    hasTables: true,
    checkoutType: 'food',
    actionLabel: 'Pedir',
  },
  hamburgeria: {
    hasTables: true,
    checkoutType: 'burger',
    actionLabel: 'Pedir',
  },
  cafeteria: {
    hasTables: true,
    checkoutType: 'cafe',
    actionLabel: 'Pedir',
  },
  bar_noturno: {
    hasTables: true,
    checkoutType: 'bar',
    actionLabel: 'Pedir',
  },
  pizzaria: {
    hasTables: true,
    checkoutType: 'pizza',
    actionLabel: 'Pedir',
  },

  hotel: {
    hasTables: false,
    checkoutType: 'hotel',
    actionLabel: 'Reservar',
  },
  hospedaria: {
    hasTables: false,
    checkoutType: 'hotel',
    actionLabel: 'Reservar',
  },
  resort: {
    hasTables: false,
    checkoutType: 'resort',
    actionLabel: 'Reservar',
  },
  spa: {
    hasTables: false,
    checkoutType: 'spa',
    actionLabel: 'Agendar',
  },

  boutique: {
    hasTables: false,
    checkoutType: 'fashion',
    actionLabel: 'Pedir',
  },
  loja_roupa: {
    hasTables: false,
    checkoutType: 'fashion',
    actionLabel: 'Pedir',
  },
  loja_tech: {
    hasTables: false,
    checkoutType: 'tech',
    actionLabel: 'Pedir',
  },

  farmacia: {
    hasTables: false,
    checkoutType: 'pharmacy',
    actionLabel: 'Pedir',
  },
  stand_automovel: {
    hasTables: false,
    checkoutType: 'vehicle',
    actionLabel: 'Tenho interesse',
  },
  outros: {
    hasTables: false,
    checkoutType: 'generic',
    actionLabel: 'Pedir',
  },
};

// ============================================================
// HELPERS
// ============================================================

/**
 * Retorna a configuração para um business_type.
 */
export function getBusinessConfig(businessType) {
  return BUSINESS_CONFIG[businessType] || BUSINESS_CONFIG.outros;
}

/**
 * 🔥 Retorna true apenas se o business_type estiver na lista de mesas.
 * Usa lista explícita (mais claro e seguro que confiar num default).
 */
export function hasTables(businessType) {
  return BUSINESS_TYPES_WITH_TABLES.includes(businessType);
}

/**
 * Retorna true se o business_type tiver checkout.
 */
export function hasCheckout(businessType) {
  return BUSINESS_TYPES_WITH_CHECKOUT.includes(businessType);
}

/**
 * Retorna o label do botão de ação.
 */
export function getActionLabel(businessType) {
  return getBusinessConfig(businessType).actionLabel;
}

/**
 * Retorna o tipo de checkout.
 */
export function getCheckoutType(businessType) {
  return getBusinessConfig(businessType).checkoutType;
}