// src/pages/Admin.jsx
import React, { useState } from 'react';
import { getProductos, guardarProductos, getCategorias } from '../data/datosIsaflor';
import { formatearPrecio } from '../utils/validaciones';

const Admin = () => {
  const [productos, setProductos] = useState(getProductos());
  const categorias = getCategorias();

  const [form, setForm] = useState({
    id: null,
    nombre: '',
    categoria: 'Rosas',
    precio: '',
    stock: '',
    stockCritico: 3,
    descripcion: '',
    imagen: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500',
    enOferta: false
  });

  const [editando, setEditando] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.precio || !form.stock) return;

    let listaActualizada;
    if (editando) {
      listaActualizada = productos.map(p => (p.id === form.id ? { ...form, precio: Number(form.precio), stock: Number(form.stock) } : p));
    } else {
      const nuevoProducto = {
        ...form,
        id: Date.now(),
        precio: Number(form.precio),
        stock: Number(form.stock)
      };
      listaActualizada = [...productos, nuevoProducto];
    }

    setProductos(listaActualizada);
    guardarProductos(listaActualizada);
    resetForm();
  };

  const handleEditar = (producto) => {
    setForm(producto);
    setEditando(true);
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      const listaFiltrada = productos.filter(p => p.id !== id);
      setProductos(listaFiltrada);
      guardarProductos(listaFiltrada);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      nombre: '',
      categoria: 'Rosas',
      precio: '',
      stock: '',
      stockCritico: 3,
      descripcion: '',
      imagen: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500',
      enOferta: false
    });
    setEditando(false);
  };

  const productosStockBajo = productos.filter(p => p.stock <= p.stockCritico);

  return (
    <div>
      <h2 className="mb-4 text-success border-bottom pb-2">Panel de Administración de Inventario</h2>

      {productosStockBajo.length > 0 && (
        <div className="alert alert-warning shadow-sm mb-4" role="alert">
          <h5 className="alert-heading fw-bold">⚠️ Alertas de Stock Crítico ({productosStockBajo.length})</h5>
          <ul className="mb-0">
            {productosStockBajo.map(p => (
              <li key={p.id}>
                <strong>{p.nombre}</strong> — Quedan <strong>{p.stock}</strong> unidades (Mínimo requerido: {p.stockCritico}).
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-3">
            <h5 className="card-title text-success mb-3">
              {editando ? 'Editar Producto' : 'Añadir Nuevo Producto'}
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="form-label small">Nombre</label>
                <input type="text" name="nombre" value={form.nombre} onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-2">
                <label className="form-label small">Categoría</label>
                <select name="categoria" value={form.categoria} onChange={handleChange} className="form-select">
                  {categorias.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
                </select>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small">Precio ($)</label>
                  <input type="number" name="precio" value={form.precio} onChange={handleChange} className="form-control" required />
                </div>
                <div className="col-6">
                  <label className="form-label small">Stock</label>
                  <input type="number" name="stock" value={form.stock} onChange={handleChange} className="form-control" required />
                </div>
              </div>
              <div className="mb-2">
                <label className="form-label small">Stock Crítico</label>
                <input type="number" name="stockCritico" value={form.stockCritico} onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-2">
                <label className="form-label small">Descripción</label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="form-control" rows="2"></textarea>
              </div>
              <div className="form-check mb-3">
                <input type="checkbox" name="enOferta" checked={form.enOferta} onChange={handleChange} className="form-check-input" id="checkOferta" />
                <label className="form-check-label small" htmlFor="checkOferta">En Oferta</label>
              </div>
              <button type="submit" className="btn btn-success w-100 mb-2">
                {editando ? 'Guardar Cambios' : 'Crear Producto'}
              </button>
              {editando && (
                <button type="button" onClick={resetForm} className="btn btn-outline-secondary w-100">
                  Cancelar
                </button>
              )}
            </form>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map(p => (
                      <tr key={p.id} className={p.stock <= p.stockCritico ? 'table-warning' : ''}>
                        <td className="fw-bold">{p.nombre}</td>
                        <td>{p.categoria}</td>
                        <td>{formatearPrecio(p.precio)}</td>
                        <td>{p.stock}</td>
                        <td>
                          {p.stock <= p.stockCritico ? (
                            <span className="badge bg-warning text-dark">Stock Bajo</span>
                          ) : (
                            <span className="badge bg-success">OK</span>
                          )}
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditar(p)}>✏️</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleEliminar(p.id)}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;