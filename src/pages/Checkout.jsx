
// src/pages/Checkout.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import FormInput from '../components/molecules/FormInput';
import Button from '../components/atoms/Button';

import {
  validarRut,
  normalizarRut,
  validarEmail,
  formatearPrecio,
  calcularTotalCarrito
} from '../utils/validaciones';

import { guardarOrden } from '../data/datosIsaflor';
import { useUbicaciones } from '../hooks/useUbicaciones';

import '../styles/pages/Checkout.css';


const Checkout = ({ cart, setCart, usuario }) => {

  const navigate = useNavigate();

  // Datos iniciales del formulario
  const [formData, setFormData] = useState({
    nombre: usuario?.nombre || '',
    rut: usuario?.rut || '',
    email: usuario?.email || '',
    direccion: '',
    idRegion: '',
    idComuna: ''
  });

  // Obtener ubicaciones desde el backend
  const {
    regiones,
    obtenerComunasPorRegion,
    cargando: cargandoUbicaciones,
    error: errorUbicaciones
  } = useUbicaciones();

  // Filtrar comunas según la región seleccionada
  const comunasFiltradas = obtenerComunasPorRegion(
    formData.idRegion
  );

  // Estados del Checkout
  const [errores, setErrores] = useState({});
  const [medioPago, setMedioPago] = useState('tarjeta');
  const [ordenCompletada, setOrdenCompletada] = useState(null);

  // Calcular total del carrito
  const total = calcularTotalCarrito(cart);


  // Manejar cambios en el formulario
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData(anterior => ({
      ...anterior,
      [name]: value,

      // Reiniciar comuna cuando cambia la región
      ...(name === 'idRegion' ? { idComuna: '' } : {})
    }));

    // Limpiar errores del campo modificado
    setErrores(anterior => ({
      ...anterior,
      [name]: '',
      ...(name === 'idRegion' ? { idComuna: '' } : {})
    }));
  };


  // Validar formulario y generar pedido
  const handleSubmit = (e) => {

    e.preventDefault();
    setErrores({});

    const nuevosErrores = {};

    // Validar carrito
    if (!cart || cart.length === 0) {
      setErrores({
        general: 'No puedes realizar una compra con el carrito vacío.'
      });
      return;
    }

    // Validar total de la compra
    if (total <= 0) {
      setErrores({
        general: 'El total de la compra debe ser mayor a $0.'
      });
      return;
    }

    // Validar nombre
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio.';
    }

    // Validar RUN
    if (!validarRut(formData.rut)) {
      nuevosErrores.rut = 'Ingrese un RUN chileno válido.';
    }

    // Validar correo electrónico
    if (!validarEmail(formData.email)) {
      nuevosErrores.email =
        'Ingrese un correo electrónico válido.';
    }

    // Validar dirección
    if (!formData.direccion.trim()) {
      nuevosErrores.direccion =
        'La dirección de entrega es obligatoria.';
    }

    // Validar disponibilidad de las ubicaciones
    if (cargandoUbicaciones || errorUbicaciones) {
      nuevosErrores.general =
        'No fue posible verificar las ubicaciones.';
    }

    // Obtener región seleccionada
    const regionSeleccionada = regiones.find(region =>
      String(region.idRegion) === formData.idRegion
    );

    // Obtener comuna seleccionada
    const comunaSeleccionada = comunasFiltradas.find(comuna =>
      String(comuna.idComuna) === formData.idComuna
    );

    // Validar región
    if (!regionSeleccionada) {
      nuevosErrores.idRegion =
        'Selecciona una región válida.';
    }

    // Validar comuna
    if (!comunaSeleccionada) {
      nuevosErrores.idComuna =
        'Selecciona una comuna válida.';
    }

    // Detener el proceso si existen errores
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    // Construir los datos del pedido
    const nuevaOrden = {
      cliente: {
        ...formData,
        nombre: formData.nombre.trim(),
        rut: normalizarRut(formData.rut),
        email: formData.email.trim().toLowerCase(),
        direccion: formData.direccion.trim(),

        region: regionSeleccionada.nombreRegion,
        comuna: comunaSeleccionada.nombreComuna,

        idRegion: Number(formData.idRegion),
        idComuna: Number(formData.idComuna)
      },

      items: cart,
      total: total,
      medioPago: medioPago
    };

    // Guardar pedido simulado
    try {

      const ordenGuardada = guardarOrden(nuevaOrden);

      setOrdenCompletada(ordenGuardada);

      // Vaciar carrito después de generar el pedido
      setCart([]);

    } catch (error) {

      setErrores({
        general: error.message
      });

    }
  };


  // Mostrar boleta cuando la compra ha sido completada
  if (ordenCompletada) {

    return (

      <div className="card shadow checkout-boleta">

        <div className="text-success fs-1 mb-2">
          <i
            className="bi bi-check-circle-fill"
            aria-hidden="true"
          ></i>
        </div>

        <h3 className="text-success mb-2">
          ¡Compra Realizada con Éxito!
        </h3>

        <p className="text-muted mb-4">
          Número de Boleta:{' '}
          <strong>{ordenCompletada.id}</strong>
        </p>

        <div className="checkout-boleta-detalles mb-4">

          <h5 className="border-bottom pb-2">
            Detalles de la Boleta
          </h5>

          <p className="mb-1">
            <strong>Cliente:</strong>{' '}
            {ordenCompletada.cliente.nombre}
          </p>

          <p className="mb-1">
            <strong>RUT:</strong>{' '}
            {ordenCompletada.cliente.rut}
          </p>

          <p className="mb-1">
            <strong>Fecha:</strong>{' '}
            {ordenCompletada.fecha}
          </p>

          <p className="mb-1">

            <strong>Medio de pago:</strong>{' '}

            {ordenCompletada.medioPago === 'tarjeta'
              ? 'Tarjeta de débito o crédito'
              : ordenCompletada.medioPago === 'transferencia'
                ? 'Transferencia bancaria'
                : ordenCompletada.medioPago || 'No especificado'}

          </p>

          <p className="mb-1">
            <strong>Dirección:</strong>{' '}
            {ordenCompletada.cliente.direccion}
          </p>

          <p className="mb-1">
            <strong>Comuna:</strong>{' '}
            {ordenCompletada.cliente.comuna}
          </p>

          <p className="mb-3">
            <strong>Región:</strong>{' '}
            {ordenCompletada.cliente.region}
          </p>

          <h6>Productos:</h6>

          <ul className="list-group mb-3">

            {ordenCompletada.items.map(item => (

              <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >

                {item.nombre} (x{item.cantidad})

                <span>
                  {formatearPrecio(item.precio * item.cantidad)}
                </span>

              </li>

            ))}

          </ul>

          <div className="d-flex justify-content-between fs-5 checkout-total">

            <span>Total Pagado:</span>

            <span>
              {formatearPrecio(ordenCompletada.total)}
            </span>

          </div>

        </div>

        <Button
          variant="success"
          onClick={() => navigate('/')}
        >
          Volver al inicio
        </Button>

      </div>

    );
  }


  // Formulario principal del Checkout
  return (

    <div className="row g-4 checkout-contenedor">

      {/* Datos de facturación y envío */}
      <div className="col-lg-7">

        <h2 className="mb-4 border-bottom pb-2 checkout-titulo">
          Datos de Facturación y Envío
        </h2>

        <form onSubmit={handleSubmit} noValidate>

          {/* Errores generales */}
          {errores.general && (

            <div className="alert alert-danger py-2">
              {errores.general}
            </div>

          )}

          {/* Nombre del cliente */}
          <FormInput
            label="Nombre Completo"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            error={errores.nombre}
            required
          />

          {/* RUN del cliente */}
          <FormInput
            label="RUN"
            name="rut"
            placeholder="Ej: 12.345.678-5"
            value={formData.rut}
            onChange={handleChange}
            error={errores.rut}
            required
          />

          <small className="text-muted d-block mb-3">
            Puedes ingresar tu RUN con o sin puntos y guion.
          </small>

          {/* Correo electrónico */}
          <FormInput
            label="Correo Electrónico"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errores.email}
            required
          />

          {/* Dirección de entrega */}
          <FormInput
            label="Dirección de Entrega"
            name="direccion"
            placeholder="Av. Principal 123, Depto 45"
            value={formData.direccion}
            onChange={handleChange}
            error={errores.direccion}
            required
          />

          {/* Error de conexión con las ubicaciones */}
          {errorUbicaciones && (

            <div className="alert alert-warning py-2">
              {errorUbicaciones}
            </div>

          )}

          {/* Selectores dinámicos de región y comuna */}
          <div className="row g-3 mb-3">

            {/* Selector de regiones */}
            <div className="col-12 col-md-6">

              <FormInput
                label="Región"
                name="idRegion"
                type="select"
                value={formData.idRegion}
                onChange={handleChange}
                disabled={
                  cargandoUbicaciones || !!errorUbicaciones
                }
                options={[
                  {
                    value: '',
                    label: cargandoUbicaciones
                      ? 'Cargando regiones...'
                      : 'Selecciona una región'
                  },

                  ...regiones.map(region => ({
                    value: String(region.idRegion),
                    label: region.nombreRegion
                  }))
                ]}
                error={errores.idRegion}
                required
              />

            </div>

            {/* Selector de comunas */}
            <div className="col-12 col-md-6">

              <FormInput
                label="Comuna"
                name="idComuna"
                type="select"
                value={formData.idComuna}
                onChange={handleChange}
                disabled={
                  !formData.idRegion ||
                  cargandoUbicaciones ||
                  !!errorUbicaciones
                }
                options={[
                  {
                    value: '',
                    label: 'Selecciona una comuna'
                  },

                  ...comunasFiltradas.map(comuna => ({
                    value: String(comuna.idComuna),
                    label: comuna.nombreComuna
                  }))
                ]}
                error={errores.idComuna}
                required
              />

            </div>

          </div>


          {/* Medios de pago */}
          <div className="mt-4 mb-3">

            <h5 className="mb-3">
              Medio de pago
            </h5>

            {/* Pago con tarjeta */}
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

              <label
                className="form-check-label ms-2"
                htmlFor="pagoTarjeta"
              >

                <i
                  className="bi bi-credit-card me-2"
                  aria-hidden="true"
                ></i>

                Tarjeta de débito o crédito

              </label>

            </div>

            {/* Pago mediante transferencia */}
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

              <label
                className="form-check-label ms-2"
                htmlFor="pagoTransferencia"
              >

                <i
                  className="bi bi-bank me-2"
                  aria-hidden="true"
                ></i>

                Transferencia bancaria

              </label>

            </div>

            <small className="text-muted d-block mt-2">
              Seleccione su medio de pago
            </small>

          </div>

          {/* Botón de confirmación */}
          <Button
            type="submit"
            variant="success"
            className="w-100 mt-3 py-2 fw-bold"
            disabled={
              cargandoUbicaciones || !!errorUbicaciones
            }
          >

            Confirmar y Generar Boleta

          </Button>

        </form>

      </div>


      {/* Resumen del pedido */}
      <div className="col-lg-5">

        <div className="card shadow-sm checkout-resumen">

          <div className="card-body">

            <h5 className="card-title mb-3 checkout-resumen-titulo">
              Resumen del Pedido
            </h5>

            <ul className="list-group list-group-flush mb-3">

              {cart.map(item => (

                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between align-items-center px-0"
                >

                  <div>

                    <h6 className="my-0">
                      {item.nombre}
                    </h6>

                    <small className="text-muted">
                      Cant: {item.cantidad}
                    </small>

                  </div>

                  <span className="text-muted">
                    {formatearPrecio(item.precio * item.cantidad)}
                  </span>

                </li>

              ))}

            </ul>

            <div className="d-flex justify-content-between fs-5 border-top pt-2 checkout-total">

              <span>Total:</span>

              <span>
                {formatearPrecio(total)}
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
};

export default Checkout;
