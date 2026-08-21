import React, { useState, useEffect } from 'react';
import { 
    Tag, 
    Clock, 
    Flame, 
    Sparkles, 
    Percent,
    Calendar,
    ArrowRight,
    Gift,
    Zap,
    Info
} from 'lucide-react';
import { getActivePromotions, getOfferOfTheDay } from '../../services/promotionService';

export default function Promo({ restaurantId }) {
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
                    <h2>Promoções e Ofertas</h2>
                </div>
                {offerOfDay && (
                    <div className="mvqr-offer-day-badge">
                        <Flame size={16} />
                        Oferta do Dia
                    </div>
                )}
            </div>

            {/* Tabs para filtrar */}
            <div className="mvqr-promo-tabs">
                <button 
                    className={`mvqr-promo-tab ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    Todas
                </button>
                <button 
                    className={`mvqr-promo-tab ${activeTab === 'promotion' ? 'active' : ''}`}
                    onClick={() => setActiveTab('promotion')}
                >
                    <Tag size={14} />
                    Promoções
                </button>
                <button 
                    className={`mvqr-promo-tab ${activeTab === 'offer_day' ? 'active' : ''}`}
                    onClick={() => setActiveTab('offer_day')}
                >
                    <Calendar size={14} />
                    Ofertas do Dia
                </button>
                <button 
                    className={`mvqr-promo-tab ${activeTab === 'flash_sale' ? 'active' : ''}`}
                    onClick={() => setActiveTab('flash_sale')}
                >
                    <Flame size={14} />
                    Flash Sales
                </button>
            </div>

            {/* Lista de Promoções */}
            <div className="mvqr-promo-grid">
                {displayPromotions.map((promo) => (
                    <div key={promo.id} className={`mvqr-promo-card ${promo.type === 'offer_day' ? 'featured' : ''}`}>
                        {promo.image_url && (
                            <div className="mvqr-promo-image">
                                <img src={promo.image_url} alt={promo.name} />
                            </div>
                        )}
                        <div className="mvqr-promo-content">
                            <div className="mvqr-promo-type">
                                {promo.type === 'offer_day' && 'Oferta do Dia'}
                                {promo.type === 'flash_sale' && 'Flash Sale'}
                                {promo.type === 'promotion' && 'Promoção'}
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
                                    <span>Termina em: {new Date(promo.end_date).toLocaleDateString('pt-PT')}</span>
                                </div>
                            )}
                            <button className="mvqr-promo-cta">
                                Ver Oferta
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}