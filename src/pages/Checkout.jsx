// src/pages/Checkout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/molecules/FormInput';
import { validarRut, validarEmail, formatearPrecio, calcularTotalCarrito } from '../utils/validaciones';
import { guardarOrden } from '../data/datosIsaflor';
import Button from '../components/atoms/Button';
import { regionesYComunas } from '../data/regionesComunas';
import '../styles/pages/Checkout.css';


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
  const [medioPago, setMedioPago] = useState('tarjeta');
  const [ordenCompletada, setOrdenCompletada] = useState(null);

  const total = calcularTotalCarrito(cart); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrores({});
    const nuevosErrores = {}; 

  if (!cart || cart.length === 0) {
    setErrores({
      general: 'No puedes realizar una compra con el carrito vacío.'
    });
    return;
  }

  if (total <= 0) {
    setErrores({
      general: 'El total de la compra debe ser mayor a $0.'
    });
    return;
  }

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
      total: total,
      medioPago: medioPago
    };

    try {
      const ordenGuardada = guardarOrden(nuevaOrden);
      setOrdenCompletada(ordenGuardada);
      setCart([]);
    } catch (error) {
      setErrores({ general: error.message });
    }
  };

  if (ordenCompletada) {
    return (
      <div className="card shadow checkout-boleta">
      <div className="text-success fs-1 mb-2"><i className="bi bi-check-circle-fill" aria-hidden="true"></i></div>
        <h3 className="text-success mb-2">¡Compra Realizada con Éxito!</h3>
        <p className="text-muted mb-4">Número de Boleta: <strong>{ordenCompletada.id}</strong></p>
        <div className="checkout-boleta-detalles mb-4">
          <h5 className="border-bottom pb-2">Detalles de la Boleta</h5>
          <p className="mb-1"><strong>Cliente:</strong> {ordenCompletada.cliente.nombre}</p>
          <p className="mb-1"><strong>RUT:</strong> {ordenCompletada.cliente.rut}</p>
          <p className="mb-1"><strong>Fecha:</strong> {ordenCompletada.fecha}</p>
          <p className="mb-1"><strong>Medio de pago:</strong>{' '}
            {ordenCompletada.medioPago === 'tarjeta'
              ? 'Tarjeta de débito o crédito'
              : ordenCompletada.medioPago === 'transferencia'
                ? 'Transferencia bancaria'  
                : ordenCompletada.medioPago || 'No especificado'}
          </p>
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
          <div className="d-flex justify-content-between fs-5 checkout-total">
            <span>Total Pagado:</span>
            <span>{formatearPrecio(ordenCompletada.total)}</span>
          </div>
        </div>

        <Button variant="success" onClick={() => navigate('/')}>
        Volver al inicio
        </Button>
      </div>
    );
  }

  return (
    <div className="row g-4 checkout-contenedor">
      <div className="col-lg-7">
        <h2 className="mb-4 border-bottom pb-2 checkout-titulo">
          Datos de Facturación y Envío</h2>
        <form onSubmit={handleSubmit} noValidate>
          {errores.general && (
          <div className="alert alert-danger py-2">
            {errores.general}
          </div>
        )}
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
          
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-6">
              <FormInput
                label="Región"
                name="region"
                type="select"
                value={formData.region}
                onChange={(e) => {
                  const nuevaRegion = e.target.value;
                  setFormData({
                    ...formData,
                    region: nuevaRegion,
                    comuna: regionesYComunas[nuevaRegion][0]
                  });
                }}
                options={Object.keys(regionesYComunas).map((region) => ({
                  value: region,
                  label: region
                }))}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <FormInput
                label="Comuna"
                name="comuna"
                type="select"
                value={formData.comuna}
                onChange={handleChange}
                options={regionesYComunas[formData.region].map((comuna) => ({
                  value: comuna,
                  label: comuna
                }))}
                required
              />
            </div>
          </div>
              
          <div className="mt-4 mb-3">
            <h5 className="mb-3">Medio de pago</h5>

            <div className="form-check border rounded p-3 mb-2">
              <input
                className="form-check-input"
                type="radio"
                id="pagoTarjeta"
                name="medioPago"
                value="Tarjeta de débito o crédito"
                checked={medioPago === 'tarjeta'}
                onChange={() => setMedioPago('tarjeta')}
              />
              <label className="form-check-label ms-2" htmlFor="pagoTarjeta">
                <i className="bi bi-credit-card me-2" aria-hidden="true"></i>
                Tarjeta de débito o crédito
              </label>
            </div>

            <div className="form-check border rounded p-3">
              <input
                className="form-check-input"
                type="radio"
                id="pagoTransferencia"
                name="medioPago"
                value="Transferencia bancaria"
                checked={medioPago === 'transferencia'}
                onChange={() => setMedioPago('transferencia')}
              />
              <label className="form-check-label ms-2" htmlFor="pagoTransferencia">
                <i className="bi bi-bank me-2" aria-hidden="true"></i>
                Transferencia bancaria
              </label>
            </div>

            <small className="text-muted d-block mt-2">
              Seleccione su medio de pago
            </small>
          </div>

          <Button type="submit" variant="success" className="w-100 mt-3 py-2 fw-bold" >
            Confirmar y Generar Boleta
          </Button>
        </form>
      </div>

      <div className="col-lg-5">
        <div className="card shadow-sm checkout-resumen">
          <div className="card-body">
            <h5 className="card-title mb-3 checkout-resumen-titulo">
              Resumen del Pedido</h5>
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
            <div className="d-flex justify-content-between fs-5 border-top pt-2 checkout-total">
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