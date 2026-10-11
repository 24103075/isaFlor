// src/pages/Carrito.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button';
import { 
  CONFIG_CARRITO, 
  formatearPrecio, 
  calcularTotalCarrito, 
  actualizarCantidadItem, 
  eliminarItemCarrito 
} from '../utils/validaciones';
import '../styles/pages/Carrito.css'; // Importación directa del CSS

const Carrito = ({ cart = [], setCart }) => {
  const navigate = useNavigate();

  // Asegura que siempre sea un arreglo para evitar pantalla en blanco
  const listaCarrito = Array.isArray(cart) ? cart : [];

  const handleCantidad = (id, delta) => setCart(prev => actualizarCantidadItem(prev, id, delta));
  const handleEliminar = (id) => setCart(prev => eliminarItemCarrito(prev, id));

  const total = calcularTotalCarrito(listaCarrito);

  if (listaCarrito.length === 0) {
    return (
      <div className="text-center py-5 isaflor-carrito-vacio">
        <h2 className="mb-3 fw-bold text-isaflor-green">{CONFIG_CARRITO.MENSAJE_CARRITO_VACIO}</h2>
        <p className="text-muted">{CONFIG_CARRITO.SUBTITULO_CARRITO_VACIO}</p>
        <Link to="/catalogo">
          <Button variant="isaflor" className="mt-3 px-4 py-2">
            Explorar Catálogo
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4 isaflor-carrito-container">
      <h2 className="mb-4 text-isaflor-green border-bottom pb-2 fw-bold">
        Carrito de Compras
      </h2>
      
      <div className="row g-4">
        {/* Lista de productos */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listaCarrito.map(item => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={item.imagen || CONFIG_CARRITO.IMAGEN_DEFECTO}
                              alt={item.nombre}
                              className="img-carrito-thumb rounded-3 shadow-sm"
                            />
                            <span className="fw-semibold text-dark">{item.nombre}</span>
                          </div>
                        </td>
                        <td>{formatearPrecio(item.precio)}</td>
                        <td>
                          <div className="btn-group btn-group-sm" role="group">
                            <button className="btn btn-outline-secondary" onClick={() => handleCantidad(item.id, -1)}>-</button>
                            <span className="btn btn-light disabled px-3 text-dark fw-bold">{item.cantidad}</span>
                            <button className="btn btn-outline-secondary" onClick={() => handleCantidad(item.id, 1)} disabled={item.cantidad >= item.stock}>+</button>
                          </div>
                        </td>
                        <td className="fw-bold text-isaflor-green">
                          {formatearPrecio(item.precio * item.cantidad)}
                        </td>
                        <td className="text-center">
                          <button className="btn btn-outline-danger btn-sm border-0" onClick={() => handleEliminar(item.id)} title="Eliminar">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen de Compra */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <h5 className="card-title mb-3 fw-bold text-isaflor-green">Resumen de Compra</h5>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal:</span>
                <span className="fw-semibold">{formatearPrecio(total)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Envío:</span>
                <span className="text-success fw-bold">{CONFIG_CARRITO.TEXTO_ENVIO_GRATIS}</span>
              </div>
              <hr className="my-3" />
              <div className="d-flex justify-content-between mb-4 fs-5 fw-bold">
                <span>Total:</span>
                <span className="text-isaflor-green">{formatearPrecio(total)}</span>
              </div>
              <Button variant="isaflor" className="w-100 py-2 fs-6 fw-bold shadow-sm" onClick={() => navigate('/checkout')}>
                Proceder al Pago 💳
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrito;