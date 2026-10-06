import { Minus, Plus } from 'lucide-react';

export default function BurgerCheckout({ data, onChange, tableFromURL }) {
  const saucesList = ['Maionese', 'Ketchup', 'Mostarda', 'Barbecue'];
  const extrasList = [
    { id: 'chips', label: 'Regular Chips' },
    { id: 'bacon', label: 'Bacon' },
    { id: 'cheese', label: 'Queijo extra' },
    { id: 'egg', label: 'Ovo' },
  ];

  const quantity = data.quantity || 1;
  const selectedSauces = data.sauces || [];
  const selectedExtras = data.extras || [];

   const tableFromScanner = !!tableFromURL;

  function updateQuantity(delta) {
    onChange({ ...data, quantity: Math.max(1, quantity + delta) });
  }

  function toggleSauce(sauce) {
    const sauces = selectedSauces.includes(sauce)
      ? selectedSauces.filter((s) => s !== sauce)
      : [...selectedSauces, sauce];
    onChange({ ...data, sauces });
  }

  function toggleExtra(extraId) {
    const extras = selectedExtras.includes(extraId)
      ? selectedExtras.filter((e) => e !== extraId)
      : [...selectedExtras, extraId];
    onChange({ ...data, extras });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label style={styles.label}>Quantidade</label>
        <div style={styles.quantityControl}>
          <button type="button" onClick={() => updateQuantity(-1)} style={styles.qtyBtn}><Minus size={16} /></button>
          <span style={styles.qtyValue}>{quantity}</span>
          <button type="button" onClick={() => updateQuantity(1)} style={styles.qtyBtn}><Plus size={16} /></button>
        </div>
      </div>
      <div>
        <label style={styles.label}>Molhos</label>
        <div style={styles.checkboxGroup}>
          {saucesList.map((sauce) => (
            <label key={sauce} style={styles.checkboxLabel}>
              <input type="checkbox" checked={selectedSauces.includes(sauce)}
                onChange={() => toggleSauce(sauce)} style={styles.checkbox} />
              {sauce}
            </label>
          ))}
        </div>
      </div>
      <div>
        <label style={styles.label}>Extras</label>
        <div style={styles.checkboxGroup}>
          {extrasList.map((extra) => (
            <label key={extra.id} style={styles.checkboxLabel}>
              <input type="checkbox" checked={selectedExtras.includes(extra.id)}
                onChange={() => toggleExtra(extra.id)} style={styles.checkbox} />
              {extra.label}
            </label>
          ))}
        </div>
      </div>
      <div>
        <label style={styles.label}>Observações</label>
        <textarea value={data.observations || ''}
          onChange={(e) => onChange({ ...data, observations: e.target.value })}
          placeholder="Ex: Sem picante..." rows={3} style={styles.textarea} />
      </div>
      {/* 🔥 MESA */}
      <div>
        <label style={styles.label}>
          Mesa
          {tableFromScanner && (
            <span style={styles.badge}>
              <Lock size={12} />
              Via QR Code
            </span>
          )}
        </label>

        {tableFromScanner ? (
          <div style={styles.lockedInput}>
            <span>Mesa {data.table}</span>
            <Lock size={14} color="#8B4513" />
          </div>
        ) : (
          <input
            type="number"
            value={data.table || ''}
            onChange={(e) => onChange({ ...data, table: e.target.value })}
            placeholder="Número da mesa (opcional)"
            style={styles.input}
          />
        )}
      </div>
    </div>
  );
}
const styles = {
  label: { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' },
  quantityControl: { display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '10px', border: '1px solid #e2e8f0', width: 'fit-content' },
  qtyBtn: { width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569' },
  qtyValue: { minWidth: '30px', textAlign: 'center', fontWeight: '700', fontSize: '1rem', color: '#0f172a' },
  checkboxGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#334155', cursor: 'pointer' },
  checkbox: { width: '18px', height: '18px', accentColor: '#8B4513', cursor: 'pointer' },
  textarea: { width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box' },
  input: { width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' },
};