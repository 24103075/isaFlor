
// src/pages/Checkout.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import FormInput from '../components/molecules/FormInput';
import Button from '../components/atoms/Button';
import Badge from '../components/atoms/Badge';

import {
  validarRut,
  normalizarRut,
  validarEmail,
  formatearPrecio,
  calcularTotalCarrito,
  esProductoAgotado,
  CONFIG_CARRITO
} from '../utils/validaciones';

import { guardarOrden } from '../data/datosIsaflor';
import { useUbicaciones } from '../hooks/useUbicaciones';

import '../styles/pages/Checkout.css';


// =========================================
// FUNCIONES AUXILIARES
// =========================================

// Comprobar que el producto tiene una oferta válida
const tieneOfertaValida = (item) => {

  const precioOriginal = Number(item.precioOriginal);
  const precioFinal = Number(item.precio);

  return (
    item.enOferta === true &&
    Number.isFinite(precioOriginal) &&
    Number.isFinite(precioFinal) &&
    precioFinal > 0 &&
    precioOriginal > precioFinal
  );

};


// Validar disponibilidad, cantidad y precio
const productoInvalido = (item) => {

  const cantidad = Number(item.cantidad);
  const stock = Number(item.stock);
  const precio = Number(item.precio);

  return (
    item.noDisponible === true ||
    esProductoAgotado(item) ||
    !Number.isInteger(cantidad) ||
    cantidad < 1 ||
    cantidad > stock ||
    !Number.isFinite(precio) ||
    precio <= 0
  );

};


// Calcular subtotal, descuentos y total
const calcularResumen = (productos) => {

  const subtotal = calcularTotalCarrito(productos);

  const subtotalOriginal = productos.reduce(
    (acumulado, item) => {

      const precio = tieneOfertaValida(item)
        ? Number(item.precioOriginal)
        : Number(item.precio);

      return acumulado + precio * Number(item.cantidad);

    },
    0
  );

  const ahorroTotal = Math.max(
    0,
    subtotalOriginal - subtotal
  );

  const costoEnvio = CONFIG_CARRITO.COSTO_ENVIO;

  return {
    subtotal,
    subtotalOriginal,
    ahorroTotal,
    costoEnvio,
    total: subtotal + costoEnvio
  };

};


const Checkout = ({
  cart = [],
  setCart,
  usuario,
  actualizarCarrito,
  actualizandoCarrito = false
}) => {

  const navigate = useNavigate();


  // =========================================
  // DATOS DEL FORMULARIO
  // =========================================

  const [formData, setFormData] = useState({
    nombre: usuario?.nombre || '',
    rut: usuario?.rut || usuario?.run || '',
    email: usuario?.email || usuario?.correo || '',
    direccion: '',
    idRegion: '',
    idComuna: ''
  });


  // =========================================
  // UBICACIONES DESDE EL BACKEND
  // =========================================

  const {
    regiones,
    obtenerComunasPorRegion,
    cargando: cargandoUbicaciones,
    error: errorUbicaciones
  } = useUbicaciones();

  const comunasFiltradas = obtenerComunasPorRegion(
    formData.idRegion
  );


  // =========================================
  // ESTADOS DEL CHECKOUT
  // =========================================

  const [errores, setErrores] = useState({});

  const [medioPago, setMedioPago] = useState('tarjeta');

  const [ordenCompletada, setOrdenCompletada] =
    useState(null);

  const [carritoVerificado, setCarritoVerificado] =
    useState(false);

  const [confirmandoPedido, setConfirmandoPedido] =
    useState(false);

  const [solicitudConfirmacion, setSolicitudConfirmacion] =
    useState(false);

  const consultaInicial = useRef(false);

  const compraAnteriorRef = useRef([]);

  const datosPedidoRef = useRef(null);

  const confirmacionEnCurso = useRef(false);


  // =========================================
  // CÁLCULOS DEL PEDIDO
  // =========================================

  const listaCarrito = Array.isArray(cart) ? cart : [];

  const hayProductos = listaCarrito.length > 0;

  const {
    subtotalOriginal,
    ahorroTotal,
    costoEnvio,
    total
  } = calcularResumen(listaCarrito);

  const hayProblemasCarrito =
    listaCarrito.some(productoInvalido);

  const controlesBloqueados =
    actualizandoCarrito || confirmandoPedido;


  // =========================================
  // VERIFICACIÓN INICIAL DEL CARRITO
  // =========================================

  useEffect(() => {

    if (
      hayProductos &&
      !ordenCompletada &&
      !consultaInicial.current &&
      typeof actualizarCarrito === 'function'
    ) {

      consultaInicial.current = true;

      actualizarCarrito().then(resultado => {

        setCarritoVerificado(resultado === true);

      });

    }

  }, [
    hayProductos,
    ordenCompletada,
    actualizarCarrito
  ]);


  // =========================================
  // ACTUALIZACIÓN MANUAL DE PRECIOS
  // =========================================

  const handleActualizarCarrito = async () => {

    if (
      controlesBloqueados ||
      typeof actualizarCarrito !== 'function'
    ) {
      return;
    }

    setCarritoVerificado(false);

    setErrores(anterior => ({
      ...anterior,
      general: ''
    }));

    const resultado = await actualizarCarrito();

    setCarritoVerificado(resultado === true);

    if (resultado !== true) {

      setErrores(anterior => ({
        ...anterior,
        general: 'No fue posible verificar el carrito. Intenta nuevamente.'
      }));

    }

  };


  // =========================================
  // CAMBIOS DEL FORMULARIO
  // =========================================

  const handleChange = (e) => {

    if (controlesBloqueados) {
      return;
    }

    const { name, value } = e.target;

    setFormData(anterior => ({
      ...anterior,
      [name]: value,

      ...(name === 'idRegion'
        ? { idComuna: '' }
        : {})
    }));

    setErrores(anterior => ({
      ...anterior,
      [name]: '',

      ...(name === 'idRegion'
        ? { idComuna: '' }
        : {})
    }));

  };


  // =========================================
  // VALIDAR FORMULARIO Y CONFIRMAR PEDIDO
  // =========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      controlesBloqueados ||
      confirmacionEnCurso.current
    ) {
      return;
    }

    setErrores({});

    const nuevosErrores = {};


    // Validar carrito
    if (!hayProductos) {

      setErrores({
        general: 'No puedes realizar una compra con el carrito vacío.'
      });

      return;

    }


    // Validar verificación del carrito
    if (
      !carritoVerificado ||
      typeof actualizarCarrito !== 'function'
    ) {

      setErrores({
        general: 'Debes verificar los precios y el stock antes de confirmar.'
      });

      return;

    }


    // Validar disponibilidad
    if (hayProblemasCarrito) {

      setErrores({
        general: 'Existen productos no disponibles o con datos inválidos. Revisa tu carrito.'
      });

      return;

    }


    // Validar total
    if (!Number.isFinite(total) || total <= 0) {

      setErrores({
        general: 'El total de la compra debe ser mayor a $0.'
      });

      return;

    }


    // Validar nombre
    if (!formData.nombre.trim()) {

      nuevosErrores.nombre =
        'El nombre es obligatorio.';

    }


    // Validar RUN
    if (!validarRut(formData.rut)) {

      nuevosErrores.rut =
        'Ingrese un RUN chileno válido.';

    }


    // Validar correo
    if (!validarEmail(formData.email)) {

      nuevosErrores.email =
        'Ingrese un correo electrónico válido.';

    }


    // Validar dirección
    if (!formData.direccion.trim()) {

      nuevosErrores.direccion =
        'La dirección de entrega es obligatoria.';

    }


    // Validar ubicaciones
    if (cargandoUbicaciones || errorUbicaciones) {

      nuevosErrores.general =
        'No fue posible verificar las ubicaciones.';

    }


    const regionSeleccionada = regiones.find(
      region =>
        String(region.idRegion) === formData.idRegion
    );

    const comunaSeleccionada = comunasFiltradas.find(
      comuna =>
        String(comuna.idComuna) === formData.idComuna
    );


    if (!regionSeleccionada) {

      nuevosErrores.idRegion =
        'Selecciona una región válida.';

    }


    if (!comunaSeleccionada) {

      nuevosErrores.idComuna =
        'Selecciona una comuna válida.';

    }


    // Validar medio de pago
    if (!['tarjeta', 'transferencia'].includes(medioPago)) {

      nuevosErrores.general =
        'Selecciona un medio de pago válido.';

    }


    // Detener proceso si existen errores
    if (Object.keys(nuevosErrores).length > 0) {

      setErrores(nuevosErrores);

      return;

    }


    // Bloquear confirmaciones simultáneas
    confirmacionEnCurso.current = true;

    setConfirmandoPedido(true);


    // Guardar los precios antes de la verificación
    compraAnteriorRef.current = listaCarrito.map(
      item => ({
        id: item.id,
        precio: Number(item.precio),
        cantidad: Number(item.cantidad)
      })
    );


    // Guardar datos del formulario validados
    datosPedidoRef.current = {

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

      medioPago

    };


    // Consultar precios y stock vigentes
    const resultado = await actualizarCarrito();

    setCarritoVerificado(resultado === true);


    if (resultado !== true) {

      setErrores({
        general: 'No fue posible verificar los precios y el stock. Intenta nuevamente.'
      });

      setConfirmandoPedido(false);

      confirmacionEnCurso.current = false;

      datosPedidoRef.current = null;

      return;

    }


    // Esperar la actualización del estado de React
    setSolicitudConfirmacion(true);

  };


  // =========================================
  // GENERAR PEDIDO DESPUÉS DE VERIFICAR
  // =========================================

  useEffect(() => {

    if (
      !solicitudConfirmacion ||
      actualizandoCarrito ||
      !confirmacionEnCurso.current
    ) {
      return;
    }

    setSolicitudConfirmacion(false);


    const finalizarConfirmacion = () => {

      setConfirmandoPedido(false);

      confirmacionEnCurso.current = false;

      datosPedidoRef.current = null;

    };


    // Comprobar nuevamente el carrito
    if (
      !hayProductos ||
      hayProblemasCarrito ||
      !carritoVerificado ||
      !Number.isFinite(total) ||
      total <= 0
    ) {

      setErrores({
        general: 'Algunos productos cambiaron su disponibilidad. Regresa al carrito para revisar tu compra.'
      });

      finalizarConfirmacion();

      return;

    }


    // Detectar cambios en precios o cantidades
    const compraAnterior = compraAnteriorRef.current;

    const huboCambios =

      compraAnterior.length !== listaCarrito.length ||

      listaCarrito.some(item => {

        const anterior = compraAnterior.find(
          producto => producto.id === item.id
        );

        return (
          !anterior ||
          anterior.precio !== Number(item.precio) ||
          anterior.cantidad !== Number(item.cantidad)
        );

      });


    // Solicitar una nueva confirmación si cambió el precio
    if (huboCambios) {

      setErrores({
        general: 'Los precios de tu compra han cambiado. Revisa el nuevo total y confirma nuevamente el pedido.'
      });

      finalizarConfirmacion();

      return;

    }


    if (!datosPedidoRef.current) {

      finalizarConfirmacion();

      return;

    }


    // Construir pedido con los datos actualizados
    const nuevaOrden = {

      ...datosPedidoRef.current,

      items: listaCarrito.map(item => ({
        ...item
      })),

      subtotalOriginal,

      descuento: ahorroTotal,

      costoEnvio,

      total

    };


    // Guardar pedido simulado
    try {

      const ordenGuardada = guardarOrden(nuevaOrden);

      setOrdenCompletada({

        ...nuevaOrden,

        ...ordenGuardada

      });

      // Vaciar carrito
      setCart([]);

    } catch (error) {

      setErrores({
        general:
          error.message ||
          'No fue posible generar el pedido.'
      });

    } finally {

      finalizarConfirmacion();

    }

  }, [
    solicitudConfirmacion,
    actualizandoCarrito,
    hayProductos,
    hayProblemasCarrito,
    carritoVerificado,
    listaCarrito,
    subtotalOriginal,
    ahorroTotal,
    costoEnvio,
    total,
    setCart
  ]);


  // =========================================
  // COMPROBANTE DEL PEDIDO
  // =========================================

  if (ordenCompletada) {

    const resumenOrden = calcularResumen(
      ordenCompletada.items
    );

    return (

      <div className="card shadow checkout-boleta">

        <div className="text-success fs-1 mb-2">

          <i
            className="bi bi-check-circle-fill"
            aria-hidden="true"
          ></i>

        </div>

        <h3 className="text-success mb-2">

          ¡Pedido generado con éxito!

        </h3>

        <p className="text-muted mb-4">

          Número de pedido:{' '}

          <strong>{ordenCompletada.id}</strong>

        </p>

        <div className="alert alert-info py-2">

          Comprobante de prueba. No se ha realizado
          ningún cobro real.

        </div>

        <div className="checkout-boleta-detalles mb-4">

          <h5 className="border-bottom pb-2">

            Detalles del Pedido

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

            <strong>Medio de pago seleccionado:</strong>{' '}

            {ordenCompletada.medioPago === 'tarjeta'
              ? 'Tarjeta de débito o crédito'
              : 'Transferencia bancaria'}

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
                className="list-group-item d-flex justify-content-between align-items-center gap-2"
              >

                <div>

                  {item.nombre} (x{item.cantidad})

                  {tieneOfertaValida(item) && (

                    <small className="d-block text-success">

                      Descuento aplicado

                    </small>

                  )}

                </div>

                <span>

                  {formatearPrecio(
                    item.precio * item.cantidad
                  )}

                </span>

              </li>

            ))}

          </ul>


          {/* Descuentos del pedido */}

          {resumenOrden.ahorroTotal > 0 && (

            <>

              <div className="d-flex justify-content-between mb-2">

                <span>Subtotal sin descuento:</span>

                <span>

                  {formatearPrecio(
                    resumenOrden.subtotalOriginal
                  )}

                </span>

              </div>

              <div className="d-flex justify-content-between text-success mb-2">

                <span>Descuentos aplicados:</span>

                <strong>

                  −{formatearPrecio(
                    resumenOrden.ahorroTotal
                  )}

                </strong>

              </div>

            </>

          )}

          <div className="d-flex justify-content-between mb-2">

            <span>Envío:</span>

            <span>

              {resumenOrden.costoEnvio === 0
                ? 'Gratis'
                : formatearPrecio(resumenOrden.costoEnvio)}

            </span>

          </div>

          <div className="d-flex justify-content-between fs-5 checkout-total border-top pt-3">

            <span>Total del pedido:</span>

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


  // =========================================
  // CHECKOUT SIN PRODUCTOS
  // =========================================

  if (!hayProductos) {

    return (

      <div className="text-center py-5">

        <i
          className="bi bi-cart-x display-4 text-muted"
          aria-hidden="true"
        ></i>

        <h3 className="mt-3">

          Tu carrito está vacío

        </h3>

        <p className="text-muted">

          Añade productos antes de continuar con tu compra.

        </p>

        <Link
          to="/catalogo"
          className="btn btn-success"
        >

          Explorar catálogo

        </Link>

      </div>

    );

  }


  // =========================================
  // FORMULARIO PRINCIPAL
  // =========================================

  return (

    <div className="row g-4 checkout-contenedor">

      {/* DATOS DE FACTURACIÓN Y ENVÍO */}

      <div className="col-lg-7">

        <h2 className="mb-4 border-bottom pb-2 checkout-titulo">

          Datos de Facturación y Envío

        </h2>


        {/* Verificación de productos */}

        {actualizandoCarrito && (

          <div className="alert alert-info" role="status">

            <span
              className="spinner-border spinner-border-sm me-2"
              aria-hidden="true"
            ></span>

            Verificando precios, ofertas y stock...

          </div>

        )}


        {/* Error de disponibilidad */}

        {hayProblemasCarrito && (

          <div className="alert alert-warning">

            Algunos productos no están disponibles
            en las cantidades seleccionadas o presentan
            datos inválidos.

            <Link
              to="/carrito"
              className="d-block mt-2 fw-semibold"
            >

              Regresar al carrito

            </Link>

          </div>

        )}


        {/* Formulario */}

        <form onSubmit={handleSubmit} noValidate>

          {errores.general && (

            <div
              className="alert alert-warning py-2"
              role="alert"
            >

              {errores.general}

            </div>

          )}

          <fieldset disabled={controlesBloqueados}>

            {/* Nombre */}

            <FormInput
              label="Nombre Completo"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              error={errores.nombre}
              required
            />


            {/* RUN */}

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


            {/* Correo */}

            <FormInput
              label="Correo Electrónico"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errores.email}
              required
            />


            {/* Dirección */}

            <FormInput
              label="Dirección de Entrega"
              name="direccion"
              placeholder="Av. Principal 123, Depto 45"
              value={formData.direccion}
              onChange={handleChange}
              error={errores.direccion}
              required
            />


            {/* Error de ubicaciones */}

            {errorUbicaciones && (

              <div className="alert alert-warning py-2">

                {errorUbicaciones}

              </div>

            )}


            {/* Región y comuna */}

            <div className="row g-3 mb-3">

              <div className="col-12 col-md-6">

                <FormInput
                  label="Región"
                  name="idRegion"
                  type="select"
                  value={formData.idRegion}
                  onChange={handleChange}
                  disabled={
                    cargandoUbicaciones ||
                    !!errorUbicaciones
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


            {/* MEDIOS DE PAGO */}

            <div className="mt-4 mb-3">

              <h5 className="mb-3">

                Medio de pago

              </h5>

              <div className="form-check border rounded p-3 mb-2">

                <input
                  className="form-check-input"
                  type="radio"
                  id="pagoTarjeta"
                  name="medioPago"
                  value="tarjeta"
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

              <div className="form-check border rounded p-3">

                <input
                  className="form-check-input"
                  type="radio"
                  id="pagoTransferencia"
                  name="medioPago"
                  value="transferencia"
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

                Medio de pago simulado. No se realizará
                ningún cobro real.

              </small>

            </div>

          </fieldset>


          {/* BOTÓN DE CONFIRMACIÓN */}

          <Button
            type="submit"
            variant="success"
            className="checkout-confirmar-button w-100 mt-3 py-2 fw-bold"
            disabled={
              controlesBloqueados ||
              cargandoUbicaciones ||
              !!errorUbicaciones ||
              !carritoVerificado ||
              hayProblemasCarrito ||
              !Number.isFinite(total) ||
              total <= 0
            }
          >

            {controlesBloqueados ? (

              <>

                <span
                  className="spinner-border spinner-border-sm me-2"
                  aria-hidden="true"
                ></span>

                Verificando pedido...

              </>

            ) : (

              <>

                <i
                  className="bi bi-check-circle me-2"
                  aria-hidden="true"
                ></i>

                Confirmar pedido

              </>

            )}

          </Button>

          <Link
            to="/carrito"
            className="d-block text-center mt-3 text-decoration-none"
          >

            <i
              className="bi bi-arrow-left me-2"
              aria-hidden="true"
            ></i>

            Volver al carrito

          </Link>

        </form>

      </div>


      {/* =====================================
          RESUMEN DEL PEDIDO
      ===================================== */}

      <div className="col-lg-5">

        <div className="card shadow-sm checkout-resumen">

          <div className="card-body">

            <h5 className="card-title mb-3 checkout-resumen-titulo">

              Resumen del Pedido

            </h5>


            {/* Actualizar precios */}

            <Button
              variant="outline-success"
              className="checkout-actualizar-button w-100 mb-3"
              onClick={handleActualizarCarrito}
              disabled={controlesBloqueados}
            >

              <i
                className="bi bi-arrow-clockwise me-2"
                aria-hidden="true"
              ></i>

              Actualizar precios

            </Button>


            {!carritoVerificado && !actualizandoCarrito && (

              <div className="alert alert-warning py-2">

                Debes verificar los precios antes de confirmar.

              </div>

            )}


            {/* PRODUCTOS */}

            <ul className="list-group list-group-flush mb-3">

              {listaCarrito.map(item => {

                const enOferta = tieneOfertaValida(item);

                const precioFinal = Number(item.precio);

                const precioOriginal = enOferta
                  ? Number(item.precioOriginal)
                  : precioFinal;

                const porcentaje = enOferta
                  ? Math.round(
                      (
                        (precioOriginal - precioFinal) /
                        precioOriginal
                      ) * 100
                    )
                  : 0;

                return (

                  <li
                    key={item.id}
                    className="list-group-item d-flex justify-content-between align-items-center gap-3 px-0 py-3"
                  >

                    <div>

                      <h6 className="my-0">

                        {item.nombre}

                      </h6>

                      {enOferta && (

                        <div className="checkout-oferta-badge my-1">

                          <Badge bg="isaflor-rose">

                            {porcentaje > 0
                              ? `-${porcentaje}% OFERTA`
                              : 'Oferta'}

                          </Badge>

                        </div>

                      )}

                      <small className="text-muted d-block">

                        Cantidad: {item.cantidad}

                      </small>

                      <small className="text-muted d-block">

                        Precio unitario:{' '}

                        {formatearPrecio(precioFinal)}

                      </small>

                      {productoInvalido(item) && (

                        <small className="text-danger d-block">

                          Revisar disponibilidad

                        </small>

                      )}

                    </div>


                    {/* Precios */}

                    <div className="checkout-precios text-end">

                      {enOferta && (

                        <small className="checkout-precio-original d-block text-muted text-decoration-line-through">

                          {formatearPrecio(
                            precioOriginal * item.cantidad
                          )}

                        </small>

                      )}

                      <strong className="checkout-precio-final">

                        {formatearPrecio(
                          precioFinal * item.cantidad
                        )}

                      </strong>

                    </div>

                  </li>

                );

              })}

            </ul>


            {/* SUBTOTAL */}

            <div className="d-flex justify-content-between mb-2">

              <span className="text-muted">

                {ahorroTotal > 0
                  ? 'Subtotal sin descuento:'
                  : 'Subtotal:'}

              </span>

              <strong>

                {formatearPrecio(subtotalOriginal)}

              </strong>

            </div>


            {/* DESCUENTOS */}

            {ahorroTotal > 0 && (

              <div className="d-flex justify-content-between text-success mb-2">

                <span>Descuentos aplicados:</span>

                <strong>

                  −{formatearPrecio(ahorroTotal)}

                </strong>

              </div>

            )}


            {/* ENVÍO */}

            <div className="d-flex justify-content-between mb-3">

              <span className="text-muted">

                Envío:

              </span>

              <strong className="text-success">

                {costoEnvio === 0
                  ? CONFIG_CARRITO.TEXTO_ENVIO_GRATIS
                  : formatearPrecio(costoEnvio)}

              </strong>

            </div>


            {/* TOTAL */}

            <div className="d-flex justify-content-between fs-5 border-top pt-3 checkout-total">

              <span>Total:</span>

              <span>

                {formatearPrecio(total)}

              </span>

            </div>


            {/* AHORRO TOTAL */}

            {ahorroTotal > 0 && (

              <div className="checkout-ahorro-total alert alert-success text-center mt-3 mb-0">

                <i
                  className="bi bi-tag-fill me-2"
                  aria-hidden="true"
                ></i>

                ¡Estás ahorrando{' '}

                <strong>

                  {formatearPrecio(ahorroTotal)}

                </strong>

                {' '}en tu compra!

              </div>

            )}

          </div>

        </div>

      </div>

    </div>

  );

};

export default Checkout;
