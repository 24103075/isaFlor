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
      <div className="p-5 mb-4 bg-success text-white rounded-3 shadow-sm">
        <div className="container-fluid py-3">
          <h1 className="display-5 fw-bold">Bienvenidos a IsaFlor 🌸</h1>
          <p className="col-md-8 fs-4">
            Expresa tus sentimientos con la frescura y elegancia de nuestras flores seleccionadas a mano.
          </p>
        </div>
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