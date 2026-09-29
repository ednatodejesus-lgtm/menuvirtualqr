import { Minus, Plus } from 'lucide-react';

export default function SpaCheckout({ data, onChange }) {
  const people = data.people || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label style={styles.label}>Pessoas</label>
        <div style={styles.quantityControl}>
          <button type="button" onClick={() => onChange({ ...data, people: Math.max(1, people - 1) })} style={styles.qtyBtn}><Minus size={16} /></button>
          <span style={styles.qtyValue}>{people}</span>
          <button type="button" onClick={() => onChange({ ...data, people: people + 1 })} style={styles.qtyBtn}><Plus size={16} /></button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div>
          <label style={styles.label}>Data</label>
          <input type="date" value={data.date || ''}
            onChange={(e) => onChange({ ...data, date: e.target.value })} style={styles.input} />
        </div>
        <div>
          <label style={styles.label}>Horário</label>
          <input type="time" value={data.time || ''}
            onChange={(e) => onChange({ ...data, time: e.target.value })} style={styles.input} />
        </div>
      </div>

      <div>
        <label style={styles.label}>Nome</label>
        <input type="text" value={data.name || ''}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          placeholder="O seu nome" style={styles.input} />
      </div>

      <div>
        <label style={styles.label}>Telefone</label>
        <input type="tel" value={data.phone || ''}
          onChange={(e) => onChange({ ...data, phone: e.target.value })}
          placeholder="+244 9XX XXX XXX" style={styles.input} />
      </div>

      <div>
        <label style={styles.label}>Observações</label>
        <textarea value={data.observations || ''}
          onChange={(e) => onChange({ ...data, observations: e.target.value })}
          rows={3} placeholder="..." style={styles.textarea} />
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
  input: { width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' },
};