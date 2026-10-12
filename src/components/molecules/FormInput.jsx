
import React from 'react';

// Componente reutilizable para crear campos de formularios.
// Permite mostrar inputs, áreas de texto, selectores y checkbox.
const FormInput = ({
  label,
  type = 'text', // Tipo de campo; por defecto es texto.
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false, // Indica si el campo es obligatorio.
  className = '',
  min,
  max,
  step,
  rows = 2, // Cantidad de filas para el textarea.
  options = [], // Opciones disponibles para un selector.
  checked,
  id,
  disabled = false
}) => {

  // Usa el id recibido o, si no existe, utiliza el name.
  // Esto permite asociar correctamente la etiqueta con el campo.
  const campoId = id || name;

  // Construye las clases CSS del campo.
  // Si existe un error, agrega la clase de Bootstrap 'is-invalid'.
  const clases = `form-control ${error ? 'is-invalid' : ''} ${className}`.trim();

  return (
    // Contenedor del campo y sus mensajes.
    <div className="mb-2">

      {/* Muestra la etiqueta y un asterisco si el campo es obligatorio. */}
      {label && (
        <label htmlFor={campoId} className="form-label small fw-semibold">
          {label}{required && ' *'}
        </label>
      )}

      {/* Si el tipo es select, genera una lista desplegable. */}
      {type === 'select' ? (
        <select
          id={campoId}
          name={name}
          value={value}
          onChange={onChange}
          className="form-select form-select-sm"
          required={required}
          disabled={disabled}
        >
          {/* Recorre las opciones recibidas y crea cada opción del selector. */}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

      ) : type === 'textarea' ? (

        // Si el tipo es textarea, permite ingresar texto en varias líneas.
        <textarea
          id={campoId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={clases}
          rows={rows}
          required={required}
          disabled={disabled}
        />

      ) : type === 'checkbox' ? (

        // Si el tipo es checkbox, muestra una casilla de selección.
        <input
          id={campoId}
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className={`form-check-input ${className}`.trim()}
          required={required}
          disabled={disabled}
        />

      ) : (

        // Para los demás tipos, genera un input normal:
        // texto, número, correo, URL, fecha, etc.
        <input
          id={campoId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={clases}
          required={required}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
        />
      )}

      {/* Si existe un error, muestra el mensaje debajo del campo. */}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

// Exporta el componente para poder utilizarlo en otras páginas.
export default FormInput;
