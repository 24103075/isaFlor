// src/pages/Ofertas.jsx

import React from 'react';
import ProductCard from '../components/organisms/ProductCard';
import { getProductos } from '../data/datosIsaflor';
import '../styles/pages/Catalogo.css';

const Ofertas = ({ onAddToCart }) => {
  // Obtener todos los productos guardados en el inventario
  const productos = getProductos();

  // Filtrar únicamente los productos marcados como oferta
  const productosEnOferta = productos.filter(
    producto => producto.enOferta === true
  );

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-success border-bottom pb-2 catalogo-title">
        <i className="bi bi-tag-fill me-2" aria-hidden="true"></i>
        Ofertas especiales
      </h2>

      <p className="text-muted mb-4">
        Descubre nuestros productos en oferta.
      </p>

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
          <div className="col-12 catalogo-sin-resultados">
            <p className="fs-5 mb-0">
              Por el momento no tenemos productos en oferta.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ofertas;
