// src/components/organisms/Footer.jsx
import React from 'react';
import '../../styles/organisms/Footer.css';

const Footer = () => {
  return (
    <footer className="isaflor-footer pt-4 pb-3 mt-auto">
      <div className="container">
        <div className="isaflor-footer__detalles">
          <p>Teléfono: +56 9 61991487</p>
          <p>Correo: contacto@isaflor.cl</p>
          <p>Dirección: Manantiales sitio 7, Melipilla</p>
          <p>Horario: Lunes a Sábado, 09:00 a 18:00</p>
        </div>
        <div className="isaflor-footer__redes">
          <a href="https://www.instagram.com/isa_flor.manantiales?stkn=OXRzMWd5eDE1Nm1p&utm_source=qr/" target="_blank" rel="noreferrer">
            <i className="bi bi-instagram" aria-hidden="true" /> Instagram
          </a>
          <a href="https://wa.me/56961991487" target="_blank" rel="noreferrer">
            <i className="bi bi-whatsapp" aria-hidden="true" /> WhatsApp
          </a>
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