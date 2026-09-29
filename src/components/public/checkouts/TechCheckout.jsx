import { Minus, Plus } from 'lucide-react';

export default function TechCheckout({ data, onChange }) {
  const colors = ['Preto', 'Prateado', 'Dourado', 'Azul'];
  const storages = ['64 GB', '128 GB', '256 GB', '512 GB', '1 TB'];

  const quantity = data.quantity || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label style={styles.label}>Cor</label>
        <div style={styles.radioGroup}>
          {colors.map((color) => (
            <label key={color} style={styles.radioLabel}>
              <input type="radio" name="color" value={color}
                checked={data.color === color}
                onChange={() => onChange({ ...data, color })} style={styles.radio} />
              {color}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label style={styles.label}>Armazenamento</label>
        <div style={styles.radioGroup}>
          {storages.map((storage) => (
            <label key={storage} style={styles.radioLabel}>
              <input type="radio" name="storage" value={storage}
                checked={data.storage === storage}
                onChange={() => onChange({ ...data, storage })} style={styles.radio} />
              {storage}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label style={styles.label}>Quantidade</label>
        <div style={styles.quantityControl}>
          <button type="button" onClick={() => onChange({ ...data, quantity: Math.max(1, quantity - 1) })} style={styles.qtyBtn}><Minus size={16} /></button>
          <span style={styles.qtyValue}>{quantity}</span>
          <button type="button" onClick={() => onChange({ ...data, quantity: quantity + 1 })} style={styles.qtyBtn}><Plus size={16} /></button>
        </div>
      </div>

      <div>
        <label style={styles.label}>Observações</label>
        <textarea value={data.observations || ''}
          onChange={(e) => onChange({ ...data, observations: e.target.value })}
          rows={3} placeholder="Ex: Quero saber se existe entrega" style={styles.textarea} />
      </div>
    </div>
  );
}

const styles = {
  label: { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' },
  quantityControl: { display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '10px', border: '1px solid #e2e8f0', width: 'fit-content' },
  qtyBtn: { width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569' },
  qtyValue: { minWidth: '30px', textAlign: 'center', fontWeight: '700', fontSize: '1rem', color: '#0f172a' },
  radioGroup: { display: 'flex', flexDirection: 'row', gap: '0.5rem', flexWrap: 'wrap' },
  radioLabel: { display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.9rem', color: '#334155', cursor: 'pointer', padding: '0.4rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white' },
  radio: { accentColor: '#8B4513', cursor: 'pointer' },
  textarea: { width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box' },
};