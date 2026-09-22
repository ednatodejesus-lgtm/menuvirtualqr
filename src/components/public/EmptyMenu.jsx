import { Store, Clock } from 'lucide-react';
import { useLanguage } from '../../i18n/useLanguage';

export default function EmptyMenu({ restaurant }) {
  const { t, getBusinessInfo } = useLanguage();

  const businessInfo = getBusinessInfo(restaurant?.business_type);
  const restaurantName = restaurant?.name || t('menu.fallbackName');
  const hasLogo = restaurant?.logo_url;

  return (
    <div className="mvqr-empty-menu mvqr-empty-menu--inline">
      {/* 🔥 LOGO CIRCULAR (Avatar) */}
      <div className="mvqr-empty-menu__avatar">
        {hasLogo ? (
          <img
            src={restaurant.logo_url}
            alt={restaurantName}
            className="mvqr-empty-menu__avatar-img"
          />
        ) : (
          <div className="mvqr-empty-menu__avatar-placeholder">
            <Store size={48} />
          </div>
        )}
      </div>

      {/* Título */}
      <h2 className="mvqr-empty-menu__title">
        {t('menu.menuPreparation')}
      </h2>

      {/* 🔥 Texto com artigo + tipo + nome */}
      <p className="mvqr-empty-menu__text">
        <strong>
          {businessInfo.article} {businessInfo.type} {restaurantName}
        </strong>{' '}
        <strong>
          {t('menu.menuPreparationText')}
        </strong>
      </p>

      {/* Subtexto */}
      <p className="mvqr-empty-menu__subtext">
        <Clock size={16} />
        {t('menu.comeBackSoon')}
      </p>
    </div>
  );
}