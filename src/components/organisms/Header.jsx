// src/components/organisms/Header.jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../../styles/organisms/Header.css';
import logo from '../../assets/logo.webp';

const Header = ({ cartCount = 0, usuario, onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg isaflor-header shadow-sm">
      <div className="container-fluid isaflor-header__container">
        <Link className="navbar-brand isaflor-header__brand" to="/">
          <img src={logo} alt="Logo de IsaFlor" className="isaflor-header__logo" />
          <span className="isaflor-header__brand-text">IsaFlor</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 isaflor-header__nav">
            <li className="nav-item">
              <Link className="nav-link isaflor-header__nav-link" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/catalogo">Catálogo</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/nosotros">Nosotros</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contacto">Contacto</Link>
            </li>
            {usuario && usuario.rol === 'ADMIN' && (
              <li className="nav-item">
                <Link className="nav-link fw-bold text-warning" to="/admin">
                  Panel Admin
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3 isaflor-header__actions">
            <Link to="/carrito" className="btn isaflor-header__action position-relative">
              🛒 Carrito
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
            </Link>

            {usuario ? (
              <div className="dropdown">
                <button
                  className="btn btn-light dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  👤 {usuario.nombre}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button className="dropdown-item text-danger" onClick={onLogout}>
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn isaflor-header__action">                  Ingresar
                </Link>
                <Link to="/registro" className="btn isaflor-header__action isaflor-header__action--primary">
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;