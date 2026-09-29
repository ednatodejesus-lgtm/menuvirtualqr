import { Minus, Plus } from 'lucide-react';

export default function GenericCheckout({ data, onChange }) {
  const quantity = data.quantity || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
          rows={4} placeholder="Escreva aqui o seu pedido ou observações..."
          style={styles.textarea} />
      </div>
    </div>
  );
}

const styles = {
  label: { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' },
  quantityControl: { display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '10px', border: '1px solid #e2e8f0', width: 'fit-content' },
  qtyBtn: { width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569' },
  qtyValue: { minWidth: '30px', textAlign: 'center', fontWeight: '700', fontSize: '1rem', color: '#0f172a' },
  textarea: { width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box' },
};