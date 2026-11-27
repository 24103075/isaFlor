
// src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Componentes
import ProductCard from '../components/organisms/ProductCard';

// Servicios
import { obtenerProductos } from '../services/productoService';

// Validaciones
import { esProductoAgotado } from '../utils/validaciones';

// Imágenes
import logo from '../assets/logo.webp';
import lisianthusRosado from '../assets/Lisianthus-1.webp';
import cultivoLisianthus from '../assets/Lisianthus-2.webp';
import girasoles from '../assets/girasol.webp';
import alstroemerias from '../assets/alstroemeria.webp';

// Estilos
import '../styles/pages/Home.css';


const Home = ({ onAddToCart }) => {

  // Estados de los productos
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');


  // =========================================
  // OBTENER PRODUCTOS DESDE EL BACKEND
  // =========================================

  useEffect(() => {

    let activo = true;

    const cargarProductos = async () => {

      try {

        const datos = await obtenerProductos();

        if (activo) {
          setProductos(datos);
        }

      } catch (error) {

        if (activo) {
          setError(
            'No fue posible cargar los productos destacados. Intente nuevamente más tarde.'
          );
        }

      } finally {

        if (activo) {
          setCargando(false);
        }

      }

    };

    cargarProductos();

    return () => {
      activo = false;
    };

  }, []);


  // =========================================
  // SELECCIONAR PRODUCTOS DESTACADOS
  // =========================================

  const destacados = productos
    .filter(producto => !esProductoAgotado(producto))
    .slice(0, 3);


  return (

    <main className="isaflor-home-container container py-4">

      {/* =====================================
          BANNER PRINCIPAL
      ===================================== */}

      <section className="home-hero p-4 p-md-5 mb-5 rounded-4 d-flex flex-column flex-md-row align-items-center justify-content-between gap-4">

        <div className="home-hero__content text-center text-md-start">

          <h1 className="display-5 fw-bold mb-3 home-hero__title">

            Bienvenidos a IsaFlor

          </h1>

          <p className="lead mb-0 home-hero__description">

            Expresa tus sentimientos con la frescura y elegancia de nuestras flores
            seleccionadas a mano.

          </p>

        </div>

        <img
          className="home-hero__image img-fluid rounded-3 shadow-sm"
          src={logo}
          alt="Logo de IsaFlor"
        />

      </section>


      {/* =====================================
          FOTOGRAFÍAS DE LOS INVERNADEROS
      ===================================== */}

      <section
        className="home-lisianthus mb-5"
        aria-labelledby="home-lisianthus-title"
      >

        <div className="home-lisianthus__intro">

          <p className="home-lisianthus__eyebrow">

            Cultivadas con amor en nuestros invernaderos

          </p>

          <h2 id="home-lisianthus-title">

            Flores frescas y recién cortadas para ti

          </h2>

          <p>

            Somos productores locales. Cuidamos cada variedad desde la semilla
            hasta la cosecha para llevar la máxima frescura, aroma y color
            directamente a tu hogar.

          </p>

        </div>


        <div className="home-lisianthus__grid">

          {/* Lisianthus rosados */}

          <figure className="home-lisianthus__card">

            <img
              className="home-lisianthus__image"
              src={lisianthusRosado}
              alt="Lisianthus rosados y crema en plena floración"
            />

          </figure>


          {/* Cultivo de lisianthus */}

          <figure className="home-lisianthus__card">

            <img
              className="home-lisianthus__image"
              src={cultivoLisianthus}
              alt="Cultivo de lisianthus blancos en un invernadero"
            />

          </figure>


          {/* Girasoles */}

          <figure className="home-lisianthus__card">

            <img
              className="home-lisianthus__image"
              src={girasoles}
              alt="Girasoles en plena floración"
            />

          </figure>


          {/* Alstroemerias */}

          <figure className="home-lisianthus__card">

            <img
              className="home-lisianthus__image"
              src={alstroemerias}
              alt="Alstroemerias en un invernadero"
            />

          </figure>

        </div>

      </section>


      {/* =====================================
          PRODUCTOS DESTACADOS
      ===================================== */}

      <section className="home-offers mb-5">

        {/* Encabezado */}

        <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-4">

          <h2 className="h3 fw-bold text-isaflor-dark m-0">

            Productos destacados

          </h2>

          {!cargando && !error && (

            <span className="badge bg-isaflor-soft text-isaflor-green px-3 py-2 rounded-pill fw-semibold">

              {destacados.length}{' '}
              {destacados.length === 1 ? 'producto' : 'productos'}

            </span>

          )}

        </div>


        {/* Indicador de carga */}

        {cargando && (

          <div className="text-center py-5">

            <div
              className="spinner-border text-success"
              role="status"
            >

              <span className="visually-hidden">

                Cargando...

              </span>

            </div>

            <p className="text-muted mt-3">

              Cargando productos destacados...

            </p>

          </div>

        )}


        {/* Mensaje de error */}

        {error && (

          <div className="alert alert-danger" role="alert">

            <i
              className="bi bi-exclamation-circle me-2"
              aria-hidden="true"
            ></i>

            {error}

          </div>

        )}


        {/* Productos disponibles */}

        {!cargando && !error && (

          <>

            {destacados.length > 0 ? (

              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">

                {destacados.map(producto => (

                  <div className="col" key={producto.id}>

                    <ProductCard
                      producto={producto}
                      onAddToCart={onAddToCart}
                    />

                  </div>

                ))}

              </div>

            ) : (

              <div className="text-center py-4">

                <p className="text-muted">

                  Actualmente no hay productos destacados disponibles.

                </p>

              </div>

            )}


            {/* Acceso al catálogo completo */}

            <div className="text-center mt-4">

              <Link
                to="/catalogo"
                className="btn btn-outline-success rounded-pill px-4 py-2 fw-semibold"
              >

                Ver catálogo completo

                <i
                  className="bi bi-arrow-right ms-2"
                  aria-hidden="true"
                ></i>

              </Link>

            </div>

          </>

        )}

      </section>

    </main>

  );

};

export default Home;
