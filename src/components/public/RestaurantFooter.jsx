import React from 'react';
import { useTheme } from '../../engine/ThemeProvider';
import { MapPin, Phone, Mail } from 'lucide-react';
// 🔥 IMPORTAR ICONES DE MARCAS DO REACT-ICONS
import { 
  FaInstagram, 
  FaFacebook, 
  FaWhatsapp, 
  FaTiktok 
} from 'react-icons/fa';

export default function RestaurantFooter({ restaurant }) {
  const { theme } = useTheme();
  const footerConfig = theme?.layout?.footer || {};
  const colors = theme?.visual?.colors || {};
  
  const getFooterVariant = () => {
    switch (footerConfig.variant || 'minimal') {
      case 'editorial': return 'footer-editorial';
      case 'immersive': return 'footer-immersive';
      case 'dark': return 'footer-dark';
      default: return 'footer-minimal';
    }
  };

  const getAlignment = () => {
    switch (footerConfig.alignment || 'center') {
      case 'split': return 'footer-split';
      case 'left': return 'footer-left';
      case 'right': return 'footer-right';
      default: return 'footer-center';
    }
  };

  const footerStyles = {
    backgroundColor: colors.surface || '#1A0F0A',
    color: colors.text_muted || '#94A3B8',
    borderTop: `1px solid ${colors.border || '#3D2318'}`,
  };

  // 🔥 MAPEAR REDES SOCIAIS COM ÍCONES
  const socialLinks = [
    {
      id: 'instagram',
      url: restaurant?.social_links?.instagram,
      icon: FaInstagram,
      label: 'Instagram',
    },
    {
      id: 'facebook',
      url: restaurant?.social_links?.facebook,
      icon: FaFacebook,
      label: 'Facebook',
    },
    {
      id: 'whatsapp',
      url: restaurant?.social_links?.whatsapp,
      icon: FaWhatsapp,
      label: 'WhatsApp',
      getHref: (url) => url ? `https://wa.me/${url.replace(/\D/g, '')}` : null,
    },
    {
      id: 'tiktok',
      url: restaurant?.social_links?.tiktok,
      icon: FaTiktok,
      label: 'TikTok',
    },
  ];

  // Filtrar apenas redes com URL
  const activeSocialLinks = socialLinks.filter(social => social.url);
  
   

  const getSocialHref = (social) => {
    if (social.id === 'whatsapp' && social.url) {
      // Remove tudo que não é número para o WhatsApp
      const phone = social.url.replace(/\D/g, '');
      return `https://wa.me/${phone}`;
    }
    return social.url;
  };


  return (
    <footer 
      className={`restaurant-footer ${getFooterVariant()} ${getAlignment()}`}
      style={footerStyles}
    >
      <div className="footer-content">
        
        <div className="footer-contact">
          {restaurant?.address && (
            <p><MapPin size={16} /> {restaurant.address}</p>
          )}
          {restaurant?.contact_phone && (
            <p><Phone size={16} /> {restaurant.contact_phone}</p>
          )}
          {restaurant?.contact_email && (
            <p><Mail size={16} /> {restaurant.contact_email}</p>
          )}
        </div>
        
        <div className="footer-social">
          {activeSocialLinks.map((social) => {
            const Icon = social.icon;
            const href = getSocialHref(social);
            return (
              <a 
                key={social.id}
                href={href} 
                target="_blank" 
                rel="noreferrer"
                aria-label={social.label}
              >
                <Icon size={18} />
                {social.label}
              </a>
            );
          })}
        </div>
        
        <div className="footer-copyright">
          <h1>{restaurant?.name}</h1>
          <p>{restaurant?.business_type}</p>
          <p>© 2026 Menu Virtual QR - Todos os direitos reservados</p>
        </div>
      </div>
    </footer>
  );
}