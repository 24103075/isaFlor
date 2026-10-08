// src/pages/Home.jsx
import React from 'react';
import ProductCard from '../components/organisms/ProductCard';
import { getProductos } from '../data/datosIsaflor';

const Home = ({ onAddToCart }) => {
  const productos = getProductos();
  const ofertas = productos.filter(p => p.enOferta);

  return (
    <div>
      {/* Banner Principal */}
      <div className="bg-success p-5 mb-4 rounded-3 text-center d-flex flex-column align-items-center justify-content-center">
        <h1 className="fw-bold mb-3 text-center w-100">
          Bienvenidos a IsaFlor 🌸
        </h1>
        <p className="fs-5 text-center mb-0 max-w-75 mx-auto">
          Expresa tus sentimientos con la frescura y elegancia de nuestras flores seleccionadas a mano.
        </p>
      </div>

      {/* Sección de Ofertas */}
      <h2 className="mb-4 text-success border-bottom pb-2">Destacados y Ofertas 🔥</h2>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {ofertas.map(producto => (
          <div className="col" key={producto.id}>
            <ProductCard producto={producto} onAddToCart={onAddToCart} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;