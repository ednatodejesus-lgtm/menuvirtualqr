import { Minus, Plus } from 'lucide-react';
import { useEffect } from 'react';

export default function ResortCheckout({ data, onChange }) {
  const adults = data.adults || 2;
  const children = data.children || 0;
  const rooms = data.rooms || 1;

  function calculateDays() {
    if (!data.checkIn || !data.checkOut) return 0;
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    return Math.max(0, Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)));
  }

  const days = calculateDays();

  // 🔥 INICIALIZAR valores por defeito
  useEffect(() => {
    const updates = {};
    if (data.adults === undefined) updates.adults = 2;
    if (data.children === undefined) updates.children = 0;
    if (data.rooms === undefined) updates.rooms = 1;

    if (Object.keys(updates).length > 0) {
      onChange({ ...data, ...updates });
    }
  }, []); // eslint-disable-line

  // 🔥 SINCRONIZAR days
  useEffect(() => {
    const currentDays = calculateDays();
    if (currentDays !== data.days) {
      onChange({ ...data, days: currentDays });
    }
  }, [data.checkIn, data.checkOut]); // eslint-disable-line

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div>
          <label style={styles.label}>Check-in</label>
          <input
            type="date"
            value={data.checkIn || ''}
            onChange={(e) => onChange({ ...data, checkIn: e.target.value })}
            style={styles.input}
          />
        </div>
        <div>
          <label style={styles.label}>Check-out</label>
          <input
            type="date"
            value={data.checkOut || ''}
            onChange={(e) => onChange({ ...data, checkOut: e.target.value })}
            style={styles.input}
          />
        </div>
      </div>

      {days > 0 && (
        <div style={{
          padding: '0.5rem 0.75rem',
          background: '#dcfce7',
          color: '#166534',
          borderRadius: '8px',
          fontSize: '0.85rem',
          fontWeight: '600',
        }}>
          {days} {days === 1 ? 'noite' : 'noites'}
        </div>
      )}

      <div>
        <label style={styles.label}>Adultos</label>
        <div style={styles.quantityControl}>
          <button type="button" onClick={() => onChange({ ...data, adults: Math.max(1, adults - 1) })} style={styles.qtyBtn}><Minus size={16} /></button>
          <span style={styles.qtyValue}>{adults}</span>
          <button type="button" onClick={() => onChange({ ...data, adults: adults + 1 })} style={styles.qtyBtn}><Plus size={16} /></button>
        </div>
      </div>

      <div>
        <label style={styles.label}>Crianças</label>
        <div style={styles.quantityControl}>
          <button type="button" onClick={() => onChange({ ...data, children: Math.max(0, children - 1) })} style={styles.qtyBtn}><Minus size={16} /></button>
          <span style={styles.qtyValue}>{children}</span>
          <button type="button" onClick={() => onChange({ ...data, children: children + 1 })} style={styles.qtyBtn}><Plus size={16} /></button>
        </div>
      </div>

      <div>
        <label style={styles.label}>Quartos</label>
        <div style={styles.quantityControl}>
          <button type="button" onClick={() => onChange({ ...data, rooms: Math.max(1, rooms - 1) })} style={styles.qtyBtn}><Minus size={16} /></button>
          <span style={styles.qtyValue}>{rooms}</span>
          <button type="button" onClick={() => onChange({ ...data, rooms: rooms + 1 })} style={styles.qtyBtn}><Plus size={16} /></button>
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
          rows={3} placeholder="Ex: Necessitamos berço" style={styles.textarea} />
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