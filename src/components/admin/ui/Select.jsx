export default function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder,
  required = false,
  disabled = false,
  children, // Permitir children também
  className = "",
  ...props
}) {
  return (
    <div className={`admin-field ${className}`}>
      {label && <label>{label}</label>}

      <select
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        {...props}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        
        {/* Se tiver options, usa options */}
        {options.length > 0 && options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        
        {/* Se tiver children, usa children (para compatibilidade) */}
        {!options.length && children}
      </select>
    </div>
  );
}