// src/pages/Ordenes.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Ordenes = () => {
  const navigate = useNavigate();

  // Obtener todas las órdenes guardadas
  const ordenes = JSON.parse(
    localStorage.getItem('isaflor_ordenes') || '[]'
  );

  // Formatear los precios en pesos chilenos
  const formatearPrecio = (precio) =>
    Number(precio || 0).toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    });

  return (
    <div className="container py-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-isaflor-dark">
            Órdenes de compra
          </h2>
          <p className="text-muted mb-0">
            Consulta todas las compras registradas en IsaFlor.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate('/admin')}
        >
          Volver al Dashboard
        </button>
      </div>

      <div className="card card-isaflor">
        <div className="card-body">

          <p className="mb-3">
            Total de órdenes: <strong>{ordenes.length}</strong>
          </p>

          {ordenes.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Boleta</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Productos</th>
                    <th>Total</th>
                    <th>Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {ordenes.map((orden, index) => (
                    <tr key={orden.id || index}>
                      <td>{orden.id || 'Sin número'}</td>
                      <td>{orden.fecha || 'Sin fecha'}</td>
                      <td>
                        {orden.cliente?.nombre || 'Sin nombre'}
                      </td>
                      <td>
                        {Array.isArray(orden.items)
                          ? orden.items.reduce(
                              (total, item) =>
                                total + Number(item.cantidad || 0),
                              0
                            )
                          : 0}
                      </td>
                      <td className="fw-bold">
                        {formatearPrecio(orden.total)}
                      </td>
                      <td>
                        <span className="badge bg-success">
                          {orden.estado || 'Recibido'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-receipt fs-1 text-muted"></i>
              <p className="mt-3 mb-0">
                Todavía no hay órdenes registradas.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Ordenes;
