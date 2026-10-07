// src/pages/Catalogo.jsx
import React, { useState } from 'react';
import ProductCard from '../components/organisms/ProductCard';
import { getProductos, getCategorias } from '../data/datosIsaflor';

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
      <h2 className="mb-4 text-success border-bottom pb-2">Catálogo de Flores</h2>

      {/* Filtros */}
      <div className="row mb-4 g-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={categoriaSel}
            onChange={(e) => setCategoriaSel(e.target.value)}
          >
            <option value="TODAS">Todas las Categorías</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
            ))}
          </select>
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
          <div className="col-12 text-center py-5">
            <p className="fs-5 text-muted">No se encontraron productos que coincidan con la búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalogo;