
// src/pages/Catalogo.jsx

import React, { useState, useEffect } from 'react';

import ProductCard from '../components/organisms/ProductCard';
import FormInput from '../components/molecules/FormInput';

import { obtenerProductos } from '../services/productoService';

import '../styles/pages/Catalogo.css';

const Catalogo = ({ onAddToCart }) => {

  // Estados de los filtros
  const [categoriaSel, setCategoriaSel] = useState('TODAS');
  const [busqueda, setBusqueda] = useState('');

  // Estados de los productos
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Consultar productos desde el backend
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
            'No fue posible cargar los productos. Intente nuevamente más tarde.'
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

  // Obtener categorías dinámicas sin duplicados
  const categorias = Array.from(
    new Map(
      productos
        .filter(producto =>
          producto.idCategoria != null && producto.categoria
        )
        .map(producto => [
          producto.idCategoria,
          {
            id: producto.idCategoria,
            nombre: producto.categoria
          }
        ])
    ).values()
  ).sort((a, b) =>
    a.nombre.localeCompare(b.nombre, 'es')
  );

  // Filtrar productos por categoría y nombre
  const productosFiltrados = productos.filter(producto => {

    const coincideCat =
      categoriaSel === 'TODAS' ||
      String(producto.idCategoria) === categoriaSel;

    const coincideNombre = producto.nombre
      .toLowerCase()
      .includes(busqueda.trim().toLowerCase());

    return coincideCat && coincideNombre;
  });

  return (

    <div>

      <h2 className="mb-4 text-success border-bottom pb-2 catalogo-title">
        Catálogo de Flores
      </h2>

      {/* Filtros */}
      <div className="row g-3 catalogo-filtros">

        {/* Buscador por nombre */}
        <div className="col-md-6">

          <FormInput
            name="busqueda"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            disabled={cargando || !!error}
          />

        </div>

        {/* Selector de categorías */}
        <div className="col-md-6">

          <FormInput
            type="select"
            name="categoriaSel"
            value={categoriaSel}
            onChange={(e) => setCategoriaSel(e.target.value)}
            disabled={cargando || !!error}
            options={[
              {
                value: 'TODAS',
                label: 'Todas las Categorías'
              },

              ...categorias.map(categoria => ({
                value: String(categoria.id),
                label: categoria.nombre
              }))
            ]}
          />

        </div>

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
            Cargando productos...
          </p>

        </div>

      )}

      {/* Mensaje de error */}
      {error && (

        <div className="alert alert-danger mt-4" role="alert">
          {error}
        </div>

      )}

      {/* Lista de productos */}
      {!cargando && !error && (

        <div className="row row-cols-1 row-cols-md-3 g-4">

          {productosFiltrados.length > 0 ? (

            productosFiltrados.map(producto => (

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

                {productos.length === 0
                  ? 'Actualmente no hay productos disponibles.'
                  : 'No se encontraron productos que coincidan con la búsqueda.'
                }

              </p>

            </div>

          )}

        </div>

      )}

    </div>

  );
};

export default Catalogo;
