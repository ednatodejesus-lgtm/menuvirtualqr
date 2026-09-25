import React, { useState, useEffect } from 'react';
import { 
    Tag, 
    Clock, 
    Flame, 
    Sparkles, 
    Calendar,
    ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../i18n/useLanguage';
import { getActivePromotions, getOfferOfTheDay } from '../../services/promotionService';

export default function Promo({ restaurantId }) {
    const { t } = useLanguage();
    const [promotions, setPromotions] = useState([]);
    const [offerOfDay, setOfferOfDay] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        if (restaurantId) {
            loadPromotions();
        }
    }, [restaurantId]);

    async function loadPromotions() {
        try {
            setLoading(true);
            const [promos, offer] = await Promise.all([
                getActivePromotions(restaurantId),
                getOfferOfTheDay(restaurantId)
            ]);
            setPromotions(promos || []);
            setOfferOfDay(offer);
        } catch (error) {
            console.error('Erro ao carregar promoções:', error);
        } finally {
            setLoading(false);
        }
    }

    // Filtrar promoções por tipo
    const filteredPromotions = promotions.filter(p => {
        if (activeTab === 'all') return true;
        return p.type === activeTab;
    });

    // Destacar oferta do dia
    const displayPromotions = offerOfDay 
        ? [offerOfDay, ...filteredPromotions.filter(p => p.id !== offerOfDay.id)]
        : filteredPromotions;

    if (loading) return null;
    if (displayPromotions.length === 0) return null;

    return (
        <section className="mvqr-promo-section">
            <div className="mvqr-promo-header">
                <div className="mvqr-promo-title">
                    <Sparkles size={24} className="mvqr-promo-icon" />
                    <h2>{t('promotions.title')}</h2>
                </div>
                {offerOfDay && (
                    <div className="mvqr-offer-day-badge">
                        <Flame size={16} />
                        {t('promotions.offerOfDay')}
                    </div>
                )}
            </div>

            {/* Lista de Promoções */}
            <div className="mvqr-promo-grid">
                {displayPromotions.map((promo) => {
                    // 🔥 Buscar imagem (promoção ou produto)
                    const bgImage = promo.image_url || promo.products?.image_url;

                    return (
                        <div 
                            key={promo.id} 
                            className={`mvqr-promo-card ${promo.type === 'offer_day' ? 'featured' : ''}`}
                            style={{
                                backgroundImage: bgImage ? `url(${bgImage})` : 'none',
                            }}
                        >
                            {/* 🔥 OVERLAY SUAVE */}
                            <div className="mvqr-promo-overlay" />

                            <div className="mvqr-promo-content">
                                <div className="mvqr-promo-type">
                                    {promo.type === 'offer_day' && t('promotions.types.offerDay')}
                                    {promo.type === 'flash_sale' && t('promotions.types.flashSale')}
                                    {promo.type === 'promotion' && t('promotions.types.promotion')}
                                </div>
                                <h3>{promo.name}</h3>
                                {promo.description && (
                                    <p className="mvqr-promo-description">{promo.description}</p>
                                )}
                                <div className="mvqr-promo-price">
                                    {promo.original_price && (
                                        <span className="mvqr-promo-original">
                                            {promo.original_price} Kz
                                        </span>
                                    )}
                                    <span className="mvqr-promo-discount">
                                        {promo.discounted_price} Kz
                                    </span>
                                    {promo.discount_percentage > 0 && (
                                        <span className="mvqr-promo-percent">
                                            -{promo.discount_percentage}%
                                        </span>
                                    )}
                                </div>
                                {promo.end_date && (
                                    <div className="mvqr-promo-time">
                                        <Clock size={14} />
                                        <span>
                                            {t('promotions.endsIn')}: {new Date(promo.end_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}