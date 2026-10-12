// src/pages/Catalogo.jsx
import React, { useState } from 'react';
import ProductCard from '../components/organisms/ProductCard';
import { getProductos, getCategorias } from '../data/datosIsaflor';
import FormInput from '../components/molecules/FormInput';
import '../styles/pages/Catalogo.css';

const Catalogo = ({ onAddToCart }) => {
  const [categoriaSel, setCategoriaSel] = useState('TODAS');
  const [busqueda, setBusqueda] = useState('');

  const productos = getProductos();
  const categorias = getCategorias();

  const productosFiltrados = productos.filter(p => {
    const coincideCat = categoriaSel === 'TODAS' || p.categoria === categoriaSel;
    const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCat && coincideNombre;
  });

  return (
    <div>
      <h2 className="mb-4 text-success border-bottom pb-2 catalogo-title">
        Catálogo de Flores
      </h2>

      {/* Filtros */}
      <div className="row g-3 catalogo-filtros">
        <div className="col-md-6">
          <FormInput name="busqueda" placeholder="Buscar por nombre..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}/>
        </div>
        <div className="col-md-6">
          <FormInput type="select" name="categoriaSel" value={categoriaSel} onChange={(e) => setCategoriaSel(e.target.value)}
            options={[
              { value: 'TODAS', label: 'Todas las Categorías' },
              ...categorias.map(cat => ({value: cat.nombre, 
                                         label: cat.nombre}))
            ]}
          />
        </div>
      </div>

      {/* Lista de Productos */}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map(producto => (
            <div className="col" key={producto.id}>
              <ProductCard producto={producto} onAddToCart={onAddToCart} />
            </div>
          ))
        ) : (
          <div className="col-12 catalogo-sin-resultados">
            <p className="fs-5 mb-0">
              No se encontraron productos que coincidan con la búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalogo;