// src/pages/Carrito.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatearPrecio } from '../utils/validaciones';

const Carrito = ({ cart, setCart }) => {
  const navigate = useNavigate();

  const handleCantidad = (id, delta) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id === id) {
          const nuevaCant = item.cantidad + delta;
          return nuevaCant > 0 ? { ...item, cantidad: nuevaCant } : item;
        }
        return item;
      })
    );
  };

  const handleEliminar = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  if (cart.length === 0) {
    return (
      <div className="text-center py-5">
        <h2 className="mb-3">Tu Carrito está vacío 🛒</h2>
        <p className="text-muted">Aún no has añadido productos al carrito.</p>
        <Link to="/catalogo" className="btn btn-success mt-3">
          Explorar Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-success border-bottom pb-2">Carrito de Compras</h2>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map(item => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={item.imagen}
                              alt={item.nombre}
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              className="rounded"
                            />
                            <span className="fw-bold">{item.nombre}</span>
                          </div>
                        </td>
                        <td>{formatearPrecio(item.precio)}</td>
                        <td>
                          <div className="btn-group btn-group-sm" role="group">
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => handleCantidad(item.id, -1)}
                            >
                              -
                            </button>
                            <span className="btn btn-light disabled px-3">{item.cantidad}</span>
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => handleCantidad(item.id, 1)}
                              disabled={item.cantidad >= item.stock}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="fw-bold">{formatearPrecio(item.precio * item.cantidad)}</td>
                        <td>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleEliminar(item.id)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title mb-3">Resumen de Compra</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>{formatearPrecio(total)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Envío:</span>
                <span className="text-success fw-bold">Gratis</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4 fs-5 fw-bold">
                <span>Total:</span>
                <span className="text-success">{formatearPrecio(total)}</span>
              </div>
              <button
                className="btn btn-success w-100 py-2 fw-bold"
                onClick={() => navigate('/checkout')}
              >
                Proceder al Pago 💳
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrito;