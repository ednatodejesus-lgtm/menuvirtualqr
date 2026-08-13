export default function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <div className={`admin-field ${className}`}>
      {label && <label>{label}</label>}

      <textarea
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        disabled={disabled}
        {...props}
      />
    </div>
  );
}