// src/components/organisms/Header.jsx

import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../../styles/organisms/Header.css';
import logo from '../../assets/logo.webp';
import { MENU_NAVEGACION } from '../../data/datosIsaflor';

const Header = ({ cartCount = 0, usuario, onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg isaflor-header shadow-sm sticky-top">
      <div className="container-fluid isaflor-header__container px-4 px-xl-5">

        {/* Logo y nombre de la tienda */}
        <Link
          className="navbar-brand d-flex align-items-center gap-2"
          to="/"
        >
          <img
            src={logo}
            alt="Logo de IsaFlor"
            className="isaflor-header__logo"
          />
          <span className="isaflor-header__brand-text">
            IsaFlor
          </span>
        </Link>

        {/* Botón del menú para celulares */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Abrir menú de navegación"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú principal */}
        <div className="collapse navbar-collapse" id="navbarNav">

          <ul className="navbar-nav me-auto mb-2 mb-lg-0 isaflor-header__nav">

            {MENU_NAVEGACION.map((item) => (
              <li className="nav-item" key={item.ruta}>
                <NavLink
                  className={({ isActive }) =>
                    `nav-link isaflor-header__nav-link ${
                      isActive ? 'active-link' : ''
                    }`
                  }
                  to={item.ruta}
                >
                  {item.nombre}
                </NavLink>
              </li>
            ))}

            {/* Panel administrativo: solo para administradores */}
            {usuario && usuario.rol === 'ADMIN' && (
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link fw-bold isaflor-admin-link ${
                      isActive ? 'active-link' : ''
                    }`
                  }
                  to="/admin"
                >
                  Panel Admin
                </NavLink>
              </li>
            )}

          </ul>

          {/* Carrito y opciones de usuario */}
          <div className="d-flex align-items-center gap-2 isaflor-header__actions">

            {/* Carrito de compras */}
            <Link
              to="/carrito"
              className="btn btn-isaflor-outline position-relative me-2"
            >
              <i className="bi bi-cart3 me-1" aria-hidden="true"></i>
              Carrito

              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill isaflor-badge">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Si hay sesión iniciada */}
            {usuario ? (
              <div className="dropdown">

                <button
                  className="btn btn-isaflor-user dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i
                    className="bi bi-person-circle"
                    aria-hidden="true"
                  ></i>
                  {usuario.nombre}
                </button>

                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0">

                  {/* Perfil: solo para clientes */}
                  {usuario.rol === 'CLIENTE' && (
                    <li>
                      <Link
                        className="dropdown-item d-flex align-items-center gap-2"
                        to="/perfil"
                      >
                        <i
                          className="bi bi-person"
                          aria-hidden="true"
                        ></i>
                        Mi perfil
                      </Link>
                    </li>
                  )}

                  {/* Cerrar sesión */}
                  <li>
                    <button
                      className="dropdown-item text-danger d-flex align-items-center gap-2"
                      type="button"
                      onClick={onLogout}
                    >
                      <i
                        className="bi bi-box-arrow-right"
                        aria-hidden="true"
                      ></i>
                      Cerrar sesión
                    </button>
                  </li>

                </ul>
              </div>
            ) : (

              /* Si no hay sesión iniciada */
              <div className="d-flex gap-2">

                <Link
                  to="/login"
                  className="btn btn-isaflor-outline"
                >
                  <i
                    className="bi bi-box-arrow-in-right me-1"
                    aria-hidden="true"
                  ></i>
                  Ingresar
                </Link>

                <Link
                  to="/registro"
                  className="btn btn-isaflor-primary"
                >
                  <i
                    className="bi bi-person-plus me-1"
                    aria-hidden="true"
                  ></i>
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