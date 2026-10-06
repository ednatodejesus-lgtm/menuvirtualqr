import { useState, useRef, useEffect } from 'react';
import { Utensils, CupSoda } from 'lucide-react';

const EXTRAS_CATEGORIES = {
  food: {
    id: 'food',
    label: 'Comida',
    icon: Utensils,
    items: [
      { id: 'batata', label: 'Dose de batata', price: 500 },
      { id: 'arroz', label: 'Dose de arroz', price: 400 },
      { id: 'salada', label: 'Salada', price: 300 },
      { id: 'molho', label: 'Molho especial', price: 200 },
      { id: 'legumes', label: 'Legumes salteados', price: 450 },
      { id: 'farofa', label: 'Farofa', price: 250 },
    ],
  },
  drinks: {
    id: 'drinks',
    label: 'Bebidas',
    icon: CupSoda,
    items: [
      { id: 'gelo', label: 'Gelo extra', price: 100 },
      { id: 'limao', label: 'Limão', price: 100 },
      { id: 'canudo', label: 'Canudo', price: 0 },
      { id: 'energetico', label: 'Energético', price: 800 },
      { id: 'leite_condensado', label: 'Leite condensado', price: 300 },
      { id: 'chantilly', label: 'Chantilly', price: 250 },
    ],
  },
};

export default function ExtrasSelector({ selectedExtras = [], onChange }) {
  const [activeCategory, setActiveCategory] = useState('food');
  const scrollContainerRef = useRef(null);

  const categories = Object.values(EXTRAS_CATEGORIES);
  const activeItems = EXTRAS_CATEGORIES[activeCategory].items;

  // 🔥 Scroll automático para a categoria ativa
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeButton = scrollContainerRef.current.querySelector(
        `[data-category="${activeCategory}"]`
      );
      if (activeButton) {
        activeButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [activeCategory]);

  function toggleExtra(extraId) {
    const updated = selectedExtras.includes(extraId)
      ? selectedExtras.filter((id) => id !== extraId)
      : [...selectedExtras, extraId];
    onChange(updated);
  }

  function formatPrice(price) {
    if (price === 0) return 'Grátis';
    return `+${price.toFixed(0)} Kz`;
  }

  return (
    <div style={styles.container}>
      <label style={styles.mainLabel}>Extras</label>

      {/* 🔥 SELETOR DE CATEGORIA (scroll horizontal) */}
      <div style={styles.scrollWrapper}>
        <button
          type="button"
          style={{ ...styles.scrollArrow, ...styles.scrollArrowLeft }}
          onClick={() => {
            scrollContainerRef.current?.scrollBy({
              left: -120,
              behavior: 'smooth',
            });
          }}
          aria-label="Scroll esquerda"
        >
          ‹
        </button>

        <div ref={scrollContainerRef} style={styles.scrollContainer}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                data-category={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  ...styles.categoryBtn,
                  ...(isActive ? styles.categoryBtnActive : {}),
                }}
              >
                <Icon size={16} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          style={{ ...styles.scrollArrow, ...styles.scrollArrowRight }}
          onClick={() => {
            scrollContainerRef.current?.scrollBy({
              left: 120,
              behavior: 'smooth',
            });
          }}
          aria-label="Scroll direita"
        >
          ›
        </button>
      </div>

      {/* 🔥 LISTA DE EXTRAS DA CATEGORIA ATIVA */}
      <div style={styles.extrasList}>
        {activeItems.map((extra) => {
          const isSelected = selectedExtras.includes(extra.id);
          return (
            <label
              key={extra.id}
              style={{
                ...styles.extraItem,
                ...(isSelected ? styles.extraItemSelected : {}),
              }}
            >
              <div style={styles.extraLeft}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleExtra(extra.id)}
                  style={styles.checkbox}
                />
                <span style={styles.extraLabel}>{extra.label}</span>
              </div>
              <span
                style={{
                  ...styles.extraPrice,
                  ...(isSelected ? styles.extraPriceSelected : {}),
                }}
              >
                {formatPrice(extra.price)}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  mainLabel: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#334155',
  },
  scrollWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  scrollContainer: {
    flex: 1,
    display: 'flex',
    gap: '0.5rem',
    overflowX: 'auto',
    scrollBehavior: 'smooth',
    padding: '0.25rem 0',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  scrollArrow: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '1px solid #e2e8f0',
    background: '#FFFFFF',
    color: '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
    fontWeight: '700',
    flexShrink: 0,
    transition: 'all 0.2s',
  },
  scrollArrowLeft: {},
  scrollArrowRight: {},
  categoryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    border: '1px solid #e2e8f0',
    background: '#FFFFFF',
    color: '#475569',
    fontSize: '0.85rem',
    fontWeight: '500',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    transition: 'all 0.2s',
  },
  categoryBtnActive: {
    background: '#8B4513',
    color: '#FFFFFF',
    borderColor: '#8B4513',
    boxShadow: '0 2px 8px rgba(139, 69, 19, 0.25)',
  },
  extrasList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    maxHeight: '220px',
    overflowY: 'auto',
    paddingRight: '0.25rem',
  },
  extraItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.6rem 0.75rem',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  extraItemSelected: {
    background: '#fef3e8',
    borderColor: '#fed7aa',
  },
  extraLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: '#8B4513',
    cursor: 'pointer',
  },
  extraLabel: {
    fontSize: '0.9rem',
    color: '#334155',
  },
  extraPrice: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#64748b',
  },
  extraPriceSelected: {
    color: '#8B4513',
  },
};