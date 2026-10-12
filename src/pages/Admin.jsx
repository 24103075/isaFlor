// src/pages/Admin.jsx
import React, { useState } from 'react';
import Button from '../components/atoms/Button';
import Badge from '../components/atoms/Badge';
import { getProductos, guardarProductos, getCategorias } from '../data/datosIsaflor';
import { REGISTRO_PRODUCTO, formatearPrecio,
         tieneStockCritico, obtenerProductosStockBajo,
         validarFormularioProducto, procesarGuardarProducto, eliminarProductoPorId} from '../utils/validaciones';
import '../styles/pages/Admin.css';
import FormInput from '../components/molecules/FormInput';


const Admin = () => {
  const [productos, setProductos] = useState(getProductos());
  const [errorForm, setErrorForm] = useState('');
  const [form, setForm] = useState(REGISTRO_PRODUCTO);
  const [editando, setEditando] = useState(false);

  const categorias = getCategorias();

  // Captura los cambios de los inputs en el estado del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Procesa el formulario delegando la regla a validaciones.js
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const error = validarFormularioProducto(form);
    if (error) {
      setErrorForm(error);
      return;
    }

    const listaActualizada = procesarGuardarProducto(productos, form, editando);
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
      const listaFiltrada = eliminarProductoPorId(productos, id);
      setProductos(listaFiltrada);
      guardarProductos(listaFiltrada);
    }
  };

  const resetForm = () => {
    setForm(REGISTRO_PRODUCTO);
    setEditando(false);
    setErrorForm('');
  };

  const productosStockBajo = obtenerProductosStockBajo(productos);

  return (
    <div className="admin-container container py-3">
      <h2 className="mb-4 admin-title border-bottom pb-2 fw-bold">
        Panel de Administración de Inventario
      </h2>

      {/* Banner de alertas de Stock Crítico */}
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
              <FormInput label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} required/>
              <FormInput type="select" label="Categoría" name="categoria" value={form.categoria} onChange={handleChange} options={categorias.map(c => ({value: c.nombre, label: c.nombre }))}/>

              
            <div className="row g-2 mb-2">
              <div className="col-6">
                <FormInput label="Precio ($)" type="number" name="precio" value={form.precio} onChange={handleChange} min="1" step="1" required />
              </div>

              <div className="col-6">
                <FormInput label="Stock" type="number" name="stock" value={form.stock} onChange={handleChange} min="0" step="1" required />
              </div>
            </div>

              <FormInput label="Stock Crítico" type="number" name="stockCritico" value={form.stockCritico} onChange={handleChange} min="0" step="1" required />
              <FormInput label="Descripción" type="textarea" name="descripcion" value={form.descripcion} onChange={handleChange} />
              <FormInput label="URL de la Imagen (Foto)" type="url" name="imagen" value={form.imagen} onChange={handleChange} placeholder="URL de la imagen" required />
              <FormInput type="checkbox" label="En Oferta" name="enOferta" checked={form.enOferta} onChange={handleChange} className="me-2" />
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
          <div className="card shadow-sm border-0 rounded-4 admin-table-card">
            <div className="card-body p-0">
              <div className="table-responsive admin-table-responsive">
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
                            {esCritico ? (
                              <Badge bg="warning" className="text-dark">Stock Bajo</Badge>
                            ) : (
                              <Badge bg="success">OK</Badge>
                            )}
                          </td>
                          <td className="text-end pe-3">
                            <Button 
                              type="button" 
                              variant="outline-primary" 
                              className="btn-sm me-2 border-0" 
                              title="Editar" 
                              onClick={() => handleEditar(p)}
                            >
                              ✏️
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline-danger" 
                              className="btn-sm border-0" 
                              title="Eliminar" 
                              onClick={() => handleEliminar(p.id)}
                            >
                              🗑️
                            </Button>
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