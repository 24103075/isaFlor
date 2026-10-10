// src/pages/Home.jsx
import React from 'react';
import ProductCard from '../components/organisms/ProductCard';
import { getProductos } from '../data/datosIsaflor';
import bannerImage from '../assets/banner.webp';
import '../styles/pages/Home.css';

const Home = ({ onAddToCart }) => {
  // Obtención y filtrado directo de ofertas
  const productos = getProductos();
  const ofertas = productos.filter(p => p.enOferta);

  return (
    <main className="isaflor-home-container container py-4">
      {/* Banner Principal / Hero */}
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
          src={bannerImage}
          alt="Arreglo floral de IsaFlor"
        />
      </section>

      {/* Sección de Ofertas y Productos Destacados */}
      <section className="home-offers mb-5">
        <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-4">
          <h2 className="h3 fw-bold text-isaflor-dark m-0">
            Destacados y Ofertas
          </h2>
          <span className="badge bg-isaflor-soft text-isaflor-green px-3 py-2 rounded-pill fw-semibold">
            {ofertas.length} {ofertas.length === 1 ? 'producto' : 'productos'}
          </span>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {ofertas.map(producto => (
            <div className="col" key={producto.id}>
              <ProductCard producto={producto} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;