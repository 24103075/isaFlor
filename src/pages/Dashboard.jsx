// src/pages/Dashboard.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import TarjetaResumen from '../components/molecules/TarjetaResumen';
import Button from '../components/atoms/Button';
import { obtenerEstadisticasDashboard } from '../utils/estadisticasDashboard';
import { TARJETAS_DASHBOARD } from '../data/datosIsaflor';
import '../styles/pages/Dashboard.css';



const Dashboard = () => {
    const estadisticas = obtenerEstadisticasDashboard();
    const navigate = useNavigate();

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-isaflor-dark mb-1">
        Dashboard
      </h2>

      <p className="text-muted mb-4">
        Resumen general de la tienda IsaFlor.
      </p>

      <div className="row g-3">
        {TARJETAS_DASHBOARD.map((tarjeta) => (
          <div
        className="col-12 col-sm-6 col-lg-3"
        key={tarjeta.titulo}
      >
        <div
          role={tarjeta.titulo === 'Órdenes' ? 'button' : undefined}
          tabIndex={tarjeta.titulo === 'Órdenes' ? 0 : undefined}
          onClick={
            tarjeta.titulo === 'Órdenes'
              ? () => navigate('/admin/ordenes')
              : undefined
          }
          onKeyDown={
            tarjeta.titulo === 'Órdenes'
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate('/admin/ordenes');
                  }
                }
              : undefined
          }
          style={
            tarjeta.titulo === 'Órdenes'
              ? { cursor: 'pointer' }
              : undefined
          }
        >
          <TarjetaResumen
            titulo={tarjeta.titulo}
            cantidad={estadisticas[tarjeta.estadistica]}
            icono={tarjeta.icono}
            color={tarjeta.color}
          />
        </div>
      </div>
        ))}
      </div>

      <div className="card card-isaflor mt-4">
        <div className="card-body p-4">
          <h5 className="fw-bold text-isaflor-dark mb-3">
            Resumen de IsaFlor
          </h5>

          <p className="mb-2">
            Productos registrados: {estadisticas.totalProductos}
          </p>

          <p className="mb-2">
            Órdenes registradas: {estadisticas.totalOrdenes}
          </p>

          <p className="mb-0">
            Productos con stock crítico: {estadisticas.productosStockBajo}
          </p>
        </div>
      </div>
            <div className="mt-4">
         <Button
          variant="primary"
          onClick={() => navigate('/admin/inventario')}
        >
          <i className="bi bi-box-seam me-2" aria-hidden="true"></i>
          Gestionar inventario
         </Button>
      </div>
    </div>
  );
};

export default Dashboard;
