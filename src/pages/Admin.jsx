// src/pages/Admin.jsx
import React, { useState } from 'react';
import Button from '../components/atoms/Button';
import Badge from '../components/atoms/Badge';
import { getProductos, guardarProductos, getCategorias } from '../data/datosIsaflor';
import { formatearPrecio, tieneStockCritico, validarFormularioProducto } from '../utils/validaciones';
import '../styles/pages/Admin.css';

const Admin = () => {
  const [productos, setProductos] = useState(getProductos());
  const [errorForm, setErrorForm] = useState('');
  const categorias = getCategorias();

  // Estado inicial del formulario
  const estadoInicialForm = {
    id: null,
    nombre: '',
    categoria: 'Rosas',
    precio: '',
    stock: '',
    stockCritico: 3,
    descripcion: '',
    imagen: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500',
    enOferta: false
  };

  const [form, setForm] = useState(estadoInicialForm);
  const [editando, setEditando] = useState(false);

  // Manejador centralizado para los cambios de inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Guardar o Actualizar Producto
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 1. Usamos nuestra función de validación
    const error = validarFormularioProducto(form);
    if (error) {
      setErrorForm(error);
      return;
    }
    setErrorForm(''); // Limpiamos errores anteriores

    let listaActualizada;
    if (editando) {
      listaActualizada = productos.map(p => 
        p.id === form.id 
          ? { ...form, precio: Number(form.precio), stock: Number(form.stock) } 
          : p
      );
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
    setErrorForm('');
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      const listaFiltrada = productos.filter(p => p.id !== id);
      setProductos(listaFiltrada);
      guardarProductos(listaFiltrada);
    }
  };

  const resetForm = () => {
    setForm(estadoInicialForm);
    setEditando(false);
    setErrorForm('');
  };

  // Obtenemos directamente la lista de productos con stock crítico usando el helper
  const productosStockBajo = productos.filter(p => tieneStockCritico(p));

  return (
    <div className="admin-container container py-3">
      <h2 className="mb-4 admin-title border-bottom pb-2 fw-bold">
        Panel de Administración de Inventario
      </h2>

      {/* Banner de alerta de Stock Crítico */}
      {productosStockBajo.length > 0 && (
        <div className="alert alert-warning shadow-sm mb-4 border-0 rounded-3" role="alert">
          <h5 className="alert-heading fw-bold mb-2">
            ⚠️ Alertas de Stock Crítico ({productosStockBajo.length})
          </h5>
          <ul className="mb-0 small">
            {productosStockBajo.map(p => (
              <li key={p.id}>
                <strong>{p.nombre}</strong> — Quedan <strong>{p.stock}</strong> unidades (Mínimo: {p.stockCritico}).
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="row g-4">
        {/* Formulario de Creación / Edición */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-3 rounded-4">
            <h5 className="card-title admin-card-title mb-3 fw-bold">
              {editando ? 'Editar Producto' : 'Añadir Nuevo Producto'}
            </h5>

            {errorForm && (
              <div className="alert alert-danger p-2 small mb-3">{errorForm}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="form-label small fw-semibold">Nombre</label>
                <input type="text" name="nombre" value={form.nombre} onChange={handleChange} className="form-control form-control-sm" required />
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold">Categoría</label>
                <select name="categoria" value={form.categoria} onChange={handleChange} className="form-select form-select-sm">
                  {categorias.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
                </select>
              </div>

              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small fw-semibold">Precio ($)</label>
                  <input type="number" name="precio" value={form.precio} onChange={handleChange} className="form-control form-control-sm" required />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold">Stock</label>
                  <input type="number" name="stock" value={form.stock} onChange={handleChange} className="form-control form-control-sm" required />
                </div>
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold">Stock Crítico</label>
                <input type="number" name="stockCritico" value={form.stockCritico} onChange={handleChange} className="form-control form-control-sm" required />
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold">Descripción</label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="form-control form-control-sm" rows="2"></textarea>
              </div>

              <div className="form-check mb-3">
                <input type="checkbox" name="enOferta" checked={form.enOferta} onChange={handleChange} className="form-check-input" id="checkOferta" />
                <label className="form-check-label small" htmlFor="checkOferta">En Oferta</label>
              </div>

              {/* Uso del componente atómico Button */}
              <Button type="submit" variant="isaflor" className="w-100 mb-2 py-2 fw-semibold">
                {editando ? 'Guardar Cambios' : 'Crear Producto'}
              </Button>

              {editando && (
                <Button type="button" onClick={resetForm} variant="outline-secondary" className="w-100 py-1">
                  Cancelar
                </Button>
              )}
            </form>
          </div>
        </div>

        {/* Tabla de Productos */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
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
                      <th className="text-end pe-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map(p => {
                      const esCritico = tieneStockCritico(p);
                      return (
                        <tr key={p.id} className={esCritico ? 'table-warning-soft' : ''}>
                          <td className="fw-bold text-dark">{p.nombre}</td>
                          <td><span className="badge bg-light text-dark border">{p.categoria}</span></td>
                          <td className="fw-semibold">{formatearPrecio(p.precio)}</td>
                          <td>{p.stock}</td>
                          <td>
                            {/* Reuso del componente atómico Badge */}
                            {esCritico ? (
                              <Badge bg="warning" className="text-dark">Stock Bajo</Badge>
                            ) : (
                              <Badge bg="success">OK</Badge>
                            )}
                          </td>
                          <td className="text-end pe-3">
                            <button className="btn btn-sm btn-outline-primary me-2 border-0" title="Editar" onClick={() => handleEditar(p)}>✏️</button>
                            <button className="btn btn-sm btn-outline-danger border-0" title="Eliminar" onClick={() => handleEliminar(p.id)}>🗑️</button>
                          </td>
                        </tr>
                      );
                    })}
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