// src/components/molecules/FormInput.jsx
import React from 'react';

const FormInput = ({ label, type = 'text', name, value, onChange, placeholder, error, required = false }) => {
  return (
    <div className="mb-3">
      {label && <label htmlFor={name} className="form-label">{label}{required && ' *'}</label>}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-control ${error ? 'is-invalid' : ''}`}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default FormInput;