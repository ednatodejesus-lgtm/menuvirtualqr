import { Minus, Plus } from 'lucide-react';

export default function CafeCheckout({ data, onChange }) {
  const sizes = ['Pequeno', 'Médio', 'Grande'];
  const sugarOptions = ['Sem açúcar', 'Normal', 'Extra'];
  const extrasList = [
    { id: 'leite_vegetal', label: 'Leite vegetal' },
    { id: 'chantilly', label: 'Chantilly' },
    { id: 'canela', label: 'Canela' },
  ];

  const quantity = data.quantity || 1;
  const selectedExtras = data.extras || [];

  function updateQuantity(delta) {
    onChange({ ...data, quantity: Math.max(1, quantity + delta) });
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
        <label style={styles.label}>Tamanho</label>
        <div style={styles.radioGroup}>
          {sizes.map((size) => (
            <label key={size} style={styles.radioLabel}>
              <input type="radio" name="size" value={size}
                checked={data.size === size}
                onChange={() => onChange({ ...data, size })} style={styles.radio} />
              {size}
            </label>
          ))}
        </div>
      </div>
      <div>
        <label style={styles.label}>Açúcar</label>
        <div style={styles.radioGroup}>
          {sugarOptions.map((sugar) => (
            <label key={sugar} style={styles.radioLabel}>
              <input type="radio" name="sugar" value={sugar}
                checked={data.sugar === sugar}
                onChange={() => onChange({ ...data, sugar })} style={styles.radio} />
              {sugar}
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
          rows={3} placeholder="Ex: Sem canela..." style={styles.textarea} />
      </div>
      <div>
        <label style={styles.label}>Mesa (opcional)</label>
        <input type="number" value={data.table || ''}
          onChange={(e) => onChange({ ...data, table: e.target.value })}
          placeholder="Número da mesa" style={styles.input} />
      </div>
    </div>
  );
}

const styles = {
  label: { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' },
  quantityControl: { display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '10px', border: '1px solid #e2e8f0', width: 'fit-content' },
  qtyBtn: { width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569' },
  qtyValue: { minWidth: '30px', textAlign: 'center', fontWeight: '700', fontSize: '1rem', color: '#0f172a' },
  radioGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  radioLabel: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#334155', cursor: 'pointer' },
  radio: { width: '18px', height: '18px', accentColor: '#8B4513', cursor: 'pointer' },
  checkboxGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#334155', cursor: 'pointer' },
  checkbox: { width: '18px', height: '18px', accentColor: '#8B4513', cursor: 'pointer' },
  textarea: { width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box' },
  input: { width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' },
};