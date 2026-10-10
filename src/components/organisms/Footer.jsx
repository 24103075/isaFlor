// src/components/organisms/Footer.jsx
import React from 'react';
import { INFO_CONTACTO } from '../../data/datosIsaflor';
import '../../styles/organisms/Footer.css';

const Footer = () => {
  return (
    <footer className="isaflor-footer pt-4 pb-3 mt-auto border-top">
      <div className="container">
        <div className="row g-3 align-items-center mb-3">
          
          {/* Detalles de contacto */}
          <div className="col-12 col-md-8 text-center text-md-start">
            <h6 className="fw-bold mb-2 text-isaflor">IsaFlor - Florería Artesanal</h6>
            <div className="small text-muted d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
              <span>📞 {INFO_CONTACTO.telefono}</span>
              <span className="d-none d-md-inline">•</span>
              <span>✉️ {INFO_CONTACTO.correo}</span>
            </div>
            <div className="small text-muted mt-1">
              📍 {INFO_CONTACTO.direccion} | 🕒 {INFO_CONTACTO.horario}
            </div>
          </div>

          {/* Enlaces de Redes Sociales */}
          <div className="col-12 col-md-4 text-center text-md-end">
            <div className="d-flex gap-3 justify-content-center justify-content-md-end">
              <a 
                href={INFO_CONTACTO.instagram} 
                target="_blank" 
                rel="noreferrer"
                className="btn btn-sm btn-outline-danger rounded-pill d-inline-flex align-items-center gap-1"
              >
                <i className="bi bi-instagram" aria-hidden="true" /> Instagram
              </a>
              <a 
                href={INFO_CONTACTO.whatsapp} 
                target="_blank" 
                rel="noreferrer"
                className="btn btn-sm btn-outline-success rounded-pill d-inline-flex align-items-center gap-1"
              >
                <i className="bi bi-whatsapp" aria-hidden="true" /> WhatsApp
              </a>
            </div>
          </div>

        </div>

        <hr className="my-2 border-secondary opacity-25" />

        <div className="text-center small text-muted pt-1">
          © {new Date().getFullYear()} IsaFlor. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;