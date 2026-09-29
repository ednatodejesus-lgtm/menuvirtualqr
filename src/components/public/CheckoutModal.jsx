import { useState, useEffect } from 'react';
import { X, ShoppingCart, Lock } from 'lucide-react';
import { getCheckoutType, getBusinessConfig } from '../../config/businessConfig';
import { buildWhatsAppMessage, sendToWhatsApp } from '../../services/checkoutService';

import FoodCheckout from './checkouts/FoodCheckout';
import BurgerCheckout from './checkouts/BurgerCheckout';
import CafeCheckout from './checkouts/CafeCheckout';
import PizzaCheckout from './checkouts/PizzaCheckout';
import BarCheckout from './checkouts/BarCheckout';
import HotelCheckout from './checkouts/HotelCheckout';
import ResortCheckout from './checkouts/ResortCheckout';
import SpaCheckout from './checkouts/SpaCheckout';
import FashionCheckout from './checkouts/FashionCheckout';
import TechCheckout from './checkouts/TechCheckout';
import PharmacyCheckout from './checkouts/PharmacyCheckout';
import VehicleCheckout from './checkouts/VehicleCheckout';
import GenericCheckout from './checkouts/GenericCheckout';

export default function CheckoutModal({ product, restaurant, onClose }) {
  const [checkoutData, setCheckoutData] = useState({});

  const checkoutType = getCheckoutType(restaurant?.business_type);
  const businessConfig = getBusinessConfig(restaurant?.business_type);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  function handleConfirm() {
    const message = buildWhatsAppMessage({
      checkoutType,
      product,
      restaurant,
      data: checkoutData,
    });
    sendToWhatsApp({ restaurant, message });
    onClose();
  }

  function renderCheckout() {
    const commonProps = {
      product,
      data: checkoutData,
      onChange: setCheckoutData,
      businessConfig,
    };
    switch (checkoutType) {
      case 'food': return <FoodCheckout {...commonProps} />;
      case 'burger': return <BurgerCheckout {...commonProps} />;
      case 'cafe': return <CafeCheckout {...commonProps} />;
      case 'pizza': return <PizzaCheckout {...commonProps} />;
      case 'bar': return <BarCheckout {...commonProps} />;
      case 'hotel': return <HotelCheckout {...commonProps} />;
      case 'resort': return <ResortCheckout {...commonProps} />;
      case 'spa': return <SpaCheckout {...commonProps} />;
      case 'fashion': return <FashionCheckout {...commonProps} />;
      case 'tech': return <TechCheckout {...commonProps} />;
      case 'pharmacy': return <PharmacyCheckout {...commonProps} />;
      case 'vehicle': return <VehicleCheckout {...commonProps} />;
      default: return <GenericCheckout {...commonProps} />;
    }
  }

  return (
    <div
      className="mvqr-checkout-overlay"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: '1rem',
      }}
    >
      <div
        className="mvqr-checkout-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFFFFF', borderRadius: '16px',
          width: '100%', maxWidth: '520px', maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky', top: 0, background: '#FFFFFF', zIndex: 2,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingCart size={20} color="#8B4513" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              {businessConfig.actionLabel}
            </h2>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#94a3b8', padding: '0.25rem', display: 'flex',
          }}>
            <X size={22} />
          </button>
        </div>

        <div style={{
          padding: '1rem 1.5rem', background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
        }}>
          {product?.image_url && (
            <img src={product.image_url} alt={product.name} style={{
              width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover',
            }} />
          )}
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontSize: '0.95rem', fontWeight: '600',
              color: '#0f172a', margin: '0 0 0.15rem 0',
            }}>{product?.name}</h3>
            <p style={{
              fontSize: '0.85rem', color: '#8B4513',
              fontWeight: '700', margin: 0,
            }}>{parseFloat(product?.price || 0).toFixed(2)} Kz</p>
          </div>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {renderCheckout()}
        </div>

        <div style={{
          padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0',
          display: 'flex', gap: '0.75rem',
          position: 'sticky', bottom: 0, background: '#FFFFFF',
        }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '0.75rem',
            background: '#f1f5f9', color: '#475569',
            border: '1px solid #e2e8f0', borderRadius: '10px',
            fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer',
          }}>Cancelar</button>
          <button onClick={handleConfirm} style={{
            flex: 2, padding: '0.75rem',
            background: '#22c55e', color: '#FFFFFF',
            border: 'none', borderRadius: '10px',
            fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          }}>
            <Lock size={16} />
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}