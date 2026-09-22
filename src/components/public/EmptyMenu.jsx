import { Utensils, Store, Package, Clock } from 'lucide-react';

export default function EmptyMenu({ restaurant }) {
  // 🔥 Mapear business_type para artigo e nome
  const getBusinessInfo = (type) => {
    const types = {
      restaurant: { article: 'O', name: 'Restaurante', icon: Utensils },
      cafeteria: { article: 'A', name: 'Cafeteria', icon: Store },
      pizzaria: { article: 'A', name: 'Pizzaria', icon: Package },
      humbergeria: { article: 'A', name: 'Hamburgueria', icon: Package },
      bar_noturno: { article: 'O', name: 'Bar Noturno', icon: Store },
      hotel: { article: 'O', name: 'Hotel', icon: Store },
      hospedaria: { article: 'A', name: 'Hospedaria', icon: Store },
      spa: { article: 'O', name: 'Spa', icon: Store },
      loja_tech: { article: 'A', name: 'Loja de Tecnologia', icon: Package },
      loja_roupa: { article: 'A', name: 'Loja de Roupa', icon: Package },
      boutique: { article: 'A', name: 'Boutique', icon: Package },
      farmacia: { article: 'A', name: 'Farmácia', icon: Package },
      stand_automovel: { article: 'O', name: 'Stand Automóvel', icon: Store },
      resort: { article: 'O', name: 'Resort', icon: Store },
      outros: { article: 'O', name: 'Estabelecimento', icon: Store },
    };
    return types[type] || { article: 'O', name: 'Estabelecimento', icon: Store };
  };

  const businessInfo = restaurant?.business_type 
    ? getBusinessInfo(restaurant.business_type) 
    : { article: 'O', name: 'Restaurante', icon: Utensils };

  const restaurantName = restaurant?.name || 'nosso estabelecimento';
  const Icon = businessInfo.icon;

  return (
    <div className="mvqr-empty-menu">
      <div className="mvqr-empty-menu__icon">
        <Icon size={64} />
      </div>

      <h2 className="mvqr-empty-menu__title">
        Menu em preparação
      </h2>

      <p className="mvqr-empty-menu__text">
        {businessInfo.article} <strong>{restaurantName}</strong> ainda está a preparar
        os seus produtos.
      </p>

      <p className="mvqr-empty-menu__subtext">
        <Clock size={16} />
        Volte em breve para ver o nosso menu completo.
      </p>
    </div>
  );
}