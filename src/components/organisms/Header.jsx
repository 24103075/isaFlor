// src/components/organisms/Header.jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../../styles/organisms/Header.css';
import logo from '../../assets/logo.webp';
import {MENU_NAVEGACION} from '../../data/datosIsaflor';

const Header = ({ cartCount = 0, usuario, onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg isaflor-header shadow-sm sticky-top">
      <div className="container isaflor-header__container">
        
        {/* Logo y Nombre de Marca */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img src={logo} alt="Logo de IsaFlor" className="isaflor-header__logo" />
          <span className="isaflor-header__brand-text">IsaFlor</span>
        </Link>

        {/* Botón Toggler para Móviles */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links de Navegación y Acciones */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 isaflor-header__nav">
            {MENU_NAVEGACION.map((item) => (
              <li className="nav-item" key={item.ruta}>
                <NavLink 
                  className={({ isActive }) => 
                    `nav-link isaflor-header__nav-link ${isActive ? 'active-link' : ''}`
                  } 
                  to={item.ruta}
                >
                  {item.nombre}
                </NavLink>
              </li>
            ))}

            {/* Enlace Condicional para Administrador */}
            {usuario && usuario.rol === 'ADMIN' && (
              <li className="nav-item">
                <NavLink 
                  className={({ isActive }) => 
                    `nav-link fw-bold isaflor-admin-link ${isActive ? 'active-link' : ''}`
                  } 
                  to="/admin"
                >
                  ⚙️ Panel Admin
                </NavLink>
              </li>
            )}
          </ul>

          {/* Acciones: Carrito y Usuario/Auth */}
          <div className="d-flex align-items-center gap-2 isaflor-header__actions">
            
            {/* Botón Carrito */}
            <Link to="/carrito" className="btn btn-isaflor-outline position-relative me-2">
              🛒 Carrito
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill isaflor-badge">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Dropdown de Usuario o Botones de Login/Registro */}
            {usuario ? (
              <div className="dropdown">
                <button
                  className="btn btn-isaflor-user dropdown-toggle d-flex align-items-center gap-1"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  👤 {usuario.nombre}
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0">
                  <li>
                    <button className="dropdown-item text-danger d-flex align-items-center gap-2" onClick={onLogout}>
                      🚪 Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-isaflor-outline">
                  Ingresar
                </Link>
                <Link to="/registro" className="btn btn-isaflor-primary">
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