
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/organisms/ProductCard';
import { obtenerProductosEnOferta } from '../services/productoService';
import '../styles/pages/Catalogo.css';

const Ofertas = ({ onAddToCart }) => {

  // Estados de la pagina
  const [productosEnOferta, setProductosEnOferta] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Obtener las ofertas reales desde el backend
  useEffect(() => {

    let activo = true;

    const cargarOfertas = async () => {

      try {

        setCargando(true);
        setError('');

        const productos = await obtenerProductosEnOferta();

        if (activo) {
          setProductosEnOferta(productos);
        }

      } catch (error) {

        console.error('Error al cargar las ofertas:', error);

        if (activo) {
          setError(
            'No fue posible cargar las ofertas. Intenta nuevamente más tarde.'
          );
        }

      } finally {

        if (activo) {
          setCargando(false);
        }

      }
    };

    cargarOfertas();

    return () => {
      activo = false;
    };

  }, []);


  return (
    <div className="container py-4">

      {/* Titulo de la pagina */}
      <h2 className="mb-4 text-success border-bottom pb-2 catalogo-title">
        <i
          className="bi bi-tag-fill me-2"
          aria-hidden="true"
        ></i>
        Ofertas especiales
      </h2>

      <p className="text-muted mb-4">
        Descubre nuestros productos en oferta y aprovecha
        nuestros descuentos especiales.
      </p>


      {/* Estado de carga */}
      {cargando && (
        <div className="text-center py-5" role="status">

          <div
            className="spinner-border text-success mb-3"
            aria-hidden="true"
          ></div>

          <p className="text-muted">
            Cargando ofertas disponibles...
          </p>

        </div>
      )}


      {/* Mensaje de error */}
      {!cargando && error && (
        <div className="alert alert-danger" role="alert">

          <i
            className="bi bi-exclamation-circle me-2"
            aria-hidden="true"
          ></i>

          {error}

        </div>
      )}


      {/* Mostrar ofertas disponibles */}
      {!cargando && !error && (

        <>

          {/* Cantidad de ofertas */}
          {productosEnOferta.length > 0 && (

            <p className="text-muted mb-3">
              {productosEnOferta.length}{' '}
              {productosEnOferta.length === 1
                ? 'producto en oferta'
                : 'productos en oferta'}
            </p>

          )}


          <div className="row row-cols-1 row-cols-md-3 g-4">

            {productosEnOferta.length > 0 ? (

              productosEnOferta.map(producto => (

                <div className="col" key={producto.id}>

                  <ProductCard
                    producto={producto}
                    onAddToCart={onAddToCart}
                  />

                </div>

              ))

            ) : (

              <div className="col-12 w-100 catalogo-sin-resultados">

                <i
                  className="bi bi-tag fs-1 text-muted"
                  aria-hidden="true"
                ></i>

                <p className="fs-5 mt-3 mb-2">
                  Por el momento no tenemos productos en oferta.
                </p>

                <p className="text-muted mb-0">
                  Visítanos próximamente para descubrir
                  nuevos descuentos.
                </p>

              </div>

            )}

          </div>

        </>

      )}

    </div>
  );
};

export default Ofertas;
