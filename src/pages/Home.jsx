// src/pages/Home.jsx
import React from 'react';
import ProductCard from '../components/organisms/ProductCard';
import { getProductos } from '../data/datosIsaflor';
import bannerImage from '../assets/banner.webp';
import '../styles/pages/Home.css';

const Home = ({ onAddToCart }) => {
  const productos = getProductos();
  const ofertas = productos.filter(p => p.enOferta);

  return (
    <div>
      {/* Banner Principal */}
      <section className="home-hero">
  <div className="home-hero__content">
    <h1>Bienvenidos a IsaFlor</h1>
    <p>
      Expresa tus sentimientos con la frescura y elegancia de nuestras flores
      seleccionadas a mano.
    </p>
  </div>

  <img
    className="home-hero__image"
    src={bannerImage}
    alt="Arreglo floral de IsaFlor"
  />
</section>

      {/* Sección de Ofertas */}
      <h2 className="mb-4 text-success border-bottom pb-2">Destacados y Ofertas</h2>
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