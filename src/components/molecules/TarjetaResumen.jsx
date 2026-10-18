
// src/components/molecules/TarjetaResumen.jsx
import React from 'react';

const TarjetaResumen = ({ titulo, cantidad, icono, color = 'verde' }) => {
  return (
    <div className={`card card-isaflor dashboard-card dashboard-card-${color} h-100`}>
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-muted">{titulo}</span>
          <i className={`bi ${icono} fs-3`} aria-hidden="true"></i>
        </div>

        <h3 className="fw-bold mt-3 mb-0 dashboard-card-cantidad">
          {cantidad}
        </h3>
      </div>
    </div>
  );
};

export default TarjetaResumen;
