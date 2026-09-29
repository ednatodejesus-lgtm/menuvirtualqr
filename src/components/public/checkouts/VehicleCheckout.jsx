export default function VehicleCheckout({ data, onChange }) {
  const contactPreferences = ['WhatsApp', 'Telefone', 'Email'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
        <label style={styles.label}>Preferência de contacto</label>
        <div style={styles.radioGroup}>
          {contactPreferences.map((pref) => (
            <label key={pref} style={styles.radioLabel}>
              <input type="radio" name="contactPreference" value={pref}
                checked={data.contactPreference === pref}
                onChange={() => onChange({ ...data, contactPreference: pref })}
                style={styles.radio} />
              {pref}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label style={styles.label}>Observações</label>
        <textarea value={data.observations || ''}
          onChange={(e) => onChange({ ...data, observations: e.target.value })}
          rows={4} placeholder="Ex: Gostaria de saber o preço e condições de pagamento"
          style={styles.textarea} />
      </div>
    </div>
  );
}

const styles = {
  label: { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' },
  input: { width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box' },
  radioGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  radioLabel: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#334155', cursor: 'pointer' },
  radio: { width: '18px', height: '18px', accentColor: '#8B4513', cursor: 'pointer' },
};