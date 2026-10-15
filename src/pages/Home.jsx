// src/pages/Home.jsx
import React from 'react';
import ProductCard from '../components/organisms/ProductCard';
import { getProductos } from '../data/datosIsaflor';
import logo from '../assets/logo.webp';
import lisianthusRosado from '../assets/Lisianthus-1.webp';
import cultivoLisianthus from '../assets/Lisianthus-2.webp';
import girasoles from '../assets/girasol.webp';
import alstroemerias from '../assets/alstroemeria.webp';
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
          src={logo}
          alt="Arreglo floral de IsaFlor"
        />
      </section>
      {/* Foografias de inicio flores */}
        <section className="home-lisianthus mb-5" aria-labelledby="home-lisianthus-title">
          <div className="home-lisianthus__intro">
            <p className="home-lisianthus__eyebrow">Cultivadas con amor en nuestros invernaderos</p>
            <h2 id="home-lisianthus-title">Flores frescas y recien cortadas para ti </h2>
            <p>
              Somos productores locales. Cuidamos cada variedad desde la semilla hasta la cosecha para llevar la máxima frescura, aroma y color directamente a tu hogar.
            </p>
          </div>

          <div className="home-lisianthus__grid">
            <figure className="home-lisianthus__card">
              <img
                className="home-lisianthus__image"
                src={lisianthusRosado}
                alt="Lisianthus rosados y crema en plena floración"
              />
            </figure>

            <figure className="home-lisianthus__card">
              <img
                className="home-lisianthus__image"
                src={cultivoLisianthus}
                alt="Cultivo de lisianthus blancos en un invernadero"
              />
            </figure>

            <figure className="home-lisianthus__card">
              <img
                className="home-lisianthus__image"
                src={girasoles}
                alt="Girasoles en plena floración"
              />
            </figure>

            <figure className="home-lisianthus__card">
              <img
                className="home-lisianthus__image"
                src={alstroemerias}
                alt="Alstroemerias en un invernadero"
              />
            </figure>
          </div>
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