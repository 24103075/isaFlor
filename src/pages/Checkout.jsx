// src/pages/Checkout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/molecules/FormInput';
import { validarRut, validarEmail, formatearPrecio } from '../utils/validaciones';
import { guardarOrden } from '../data/datosIsaflor';

const Checkout = ({ cart, setCart, usuario }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: usuario ? usuario.nombre : '',
    rut: usuario ? usuario.rut : '',
    email: usuario ? usuario.email : '',
    direccion: '',
    region: 'Región Metropolitana',
    comuna: 'Santiago'
  });

  const [errores, setErrores] = useState({});
  const [ordenCompletada, setOrdenCompletada] = useState(null);

  const total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    if (!formData.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio.';
    if (!validarRut(formData.rut)) nuevosErrores.rut = 'Ingrese un RUT chileno válido (ej: 12345678-9).';
    if (!validarEmail(formData.email)) nuevosErrores.email = 'Ingrese un correo electrónico válido.';
    if (!formData.direccion.trim()) nuevosErrores.direccion = 'La dirección de entrega es obligatoria.';

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    const nuevaOrden = {
      cliente: formData,
      items: cart,
      total: total
    };

    const ordenGuardada = guardarOrden(nuevaOrden);
    setOrdenCompletada(ordenGuardada);
    setCart([]);
  };

  if (ordenCompletada) {
    return (
      <div className="card shadow border-0 max-w-lg mx-auto my-4 p-4 text-center">
        <div className="text-success fs-1 mb-2">🎉</div>
        <h3 className="text-success mb-2">¡Compra Realizada con Éxito!</h3>
        <p className="text-muted mb-4">Número de Boleta: <strong>{ordenCompletada.id}</strong></p>

        <div className="text-start bg-light p-3 rounded mb-4">
          <h5 className="border-bottom pb-2">Detalles de la Boleta</h5>
          <p className="mb-1"><strong>Cliente:</strong> {ordenCompletada.cliente.nombre}</p>
          <p className="mb-1"><strong>RUT:</strong> {ordenCompletada.cliente.rut}</p>
          <p className="mb-1"><strong>Fecha:</strong> {ordenCompletada.fecha}</p>
          <p className="mb-3"><strong>Dirección:</strong> {ordenCompletada.cliente.direccion}, {ordenCompletada.cliente.comuna}</p>

          <h6>Productos:</h6>
          <ul className="list-group mb-3">
            {ordenCompletada.items.map(item => (
              <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                {item.nombre} (x{item.cantidad})
                <span>{formatearPrecio(item.precio * item.cantidad)}</span>
              </li>
            ))}
          </ul>
          <div className="d-flex justify-content-between fs-5 fw-bold text-success">
            <span>Total Pagado:</span>
            <span>{formatearPrecio(ordenCompletada.total)}</span>
          </div>
        </div>

        <button className="btn btn-success" onClick={() => navigate('/')}>
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="row g-4">
      <div className="col-lg-7">
        <h2 className="mb-4 text-success border-bottom pb-2">Datos de Facturación y Envío</h2>
        <form onSubmit={handleSubmit} noValidate>
          <FormInput
            label="Nombre Completo"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            error={errores.nombre}
            required
          />
          <FormInput
            label="RUT"
            name="rut"
            placeholder="12345678-9"
            value={formData.rut}
            onChange={handleChange}
            error={errores.rut}
            required
          />
          <FormInput
            label="Correo Electrónico"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errores.email}
            required
          />
          <FormInput
            label="Dirección de Entrega"
            name="direccion"
            placeholder="Av. Principal 123, Depto 45"
            value={formData.direccion}
            onChange={handleChange}
            error={errores.direccion}
            required
          />
          <button type="submit" className="btn btn-success w-100 mt-3 py-2 fw-bold">
            Confirmar y Generar Boleta
          </button>
        </form>
      </div>

      <div className="col-lg-5">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h5 className="card-title mb-3">Resumen del Pedido</h5>
            <ul className="list-group list-group-flush mb-3">
              {cart.map(item => (
                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <div>
                    <h6 className="my-0">{item.nombre}</h6>
                    <small className="text-muted">Cant: {item.cantidad}</small>
                  </div>
                  <span className="text-muted">{formatearPrecio(item.precio * item.cantidad)}</span>
                </li>
              ))}
            </ul>
            <div className="d-flex justify-content-between fs-5 fw-bold text-success border-top pt-2">
              <span>Total:</span>
              <span>{formatearPrecio(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;