// src/components/organisms/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-4 pb-3 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5>🌸 IsaFlor</h5>
            <p className="small text-muted">
              Florería dedicada a llevar frescura y elegancia a cada rincón con los mejores arreglos florales.
            </p>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Contacto</h5>
            <p className="small text-muted mb-1">📍 Av. Las Flores 1234, Santiago</p>
            <p className="small text-muted mb-1">📞 +56 9 1234 5678</p>
            <p className="small text-muted">✉️ contacto@isaflor.cl</p>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Horario de Atención</h5>
            <p className="small text-muted mb-1">Lunes a Viernes: 09:00 - 19:00 hrs</p>
            <p className="small text-muted">Sábados: 10:00 - 14:00 hrs</p>
          </div>
        </div>
        <hr className="border-secondary" />
        <div className="text-center small text-muted">
          © {new Date().getFullYear()} IsaFlor. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;