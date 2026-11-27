
// src/pages/Carrito.jsx

import React, { useState, useEffect, useRef } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import Button from '../components/atoms/Button';
import Badge from '../components/atoms/Badge';

import {
  CONFIG_CARRITO,
  formatearPrecio,
  calcularTotalCarrito,
  actualizarCantidadItem,
  eliminarItemCarrito,
  esProductoAgotado
} from '../utils/validaciones';

import '../styles/pages/Carrito.css';


// Comprobar si un producto tiene una oferta válida
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


const Carrito = ({
  cart = [],
  setCart,
  actualizarCarrito,
  actualizandoCarrito = false
}) => {

  const navigate = useNavigate();

  // =========================================
  // ESTADOS DEL COMPONENTE
  // =========================================

  const [imagenesFallidas, setImagenesFallidas] =
    useState({});

  const [carritoVerificado, setCarritoVerificado] =
    useState(false);

  const [verificandoPago, setVerificandoPago] =
    useState(false);

  const [solicitudPago, setSolicitudPago] =
    useState(false);

  const consultaInicial = useRef(false);

  const listaCarrito = Array.isArray(cart) ? cart : [];

  const hayProductos = listaCarrito.length > 0;


  // =========================================
  // ACTUALIZAR CARRITO AL INGRESAR
  // =========================================

  useEffect(() => {

    if (
      hayProductos &&
      !consultaInicial.current &&
      typeof actualizarCarrito === 'function'
    ) {

      consultaInicial.current = true;

      actualizarCarrito().then(resultado => {

        setCarritoVerificado(resultado === true);

      });

    }

  }, [hayProductos, actualizarCarrito]);


  // =========================================
  // ACTUALIZACIÓN MANUAL
  // =========================================

  const handleActualizarCarrito = async () => {

    if (actualizandoCarrito || verificandoPago) {
      return;
    }

    setCarritoVerificado(false);

    const resultado = await actualizarCarrito();

    setCarritoVerificado(resultado === true);

  };


  // =========================================
  // ACTUALIZAR CANTIDAD
  // =========================================

  const handleCantidad = (id, delta) => {

    if (actualizandoCarrito || verificandoPago) {
      return;
    }

    setCart(prev => {

      // Permitir disminuir cantidades cuando baja el stock
      if (delta === -1) {

        return prev.map(item => {

          if (item.id !== id) {
            return item;
          }

          const cantidad = Number(item.cantidad);

          if (
            !Number.isInteger(cantidad) ||
            cantidad <= 1
          ) {
            return item;
          }

          return {
            ...item,
            cantidad: cantidad - 1
          };

        });

      }

      // Mantener la validación existente para aumentar
      return actualizarCantidadItem(prev, id, delta);

    });

  };


  // =========================================
  // ELIMINAR PRODUCTO
  // =========================================

  const handleEliminar = (id) => {

    if (actualizandoCarrito || verificandoPago) {
      return;
    }

    setCart(prev =>
      eliminarItemCarrito(prev, id)
    );

  };


  // =========================================
  // CONTROL DE IMÁGENES
  // =========================================

  const handleErrorImagen = (item) => {

    setImagenesFallidas(prev => ({
      ...prev,
      [item.id]: item.imagen
    }));

  };


  // =========================================
  // CÁLCULOS DE PRECIOS Y DESCUENTOS
  // =========================================

  // Subtotal con los descuentos aplicados
  const subtotal = calcularTotalCarrito(listaCarrito);


  // Subtotal antes de aplicar descuentos
  const subtotalOriginal = listaCarrito.reduce(
    (acumulado, item) => {

      const precio = tieneOfertaValida(item)
        ? Number(item.precioOriginal)
        : Number(item.precio);

      return acumulado + precio * Number(item.cantidad);

    },
    0
  );


  // Ahorro total de todos los productos
  const ahorroTotal = Math.max(
    0,
    subtotalOriginal - subtotal
  );


  // Costo de envío
  const costoEnvio = CONFIG_CARRITO.COSTO_ENVIO;


  // Total definitivo mostrado al cliente
  const total = subtotal + costoEnvio;


  // =========================================
  // VALIDAR DISPONIBILIDAD Y STOCK
  // =========================================

  const hayProblemasStock = listaCarrito.some(item => {

    const cantidad = Number(item.cantidad);
    const stock = Number(item.stock);

    return (
      item.noDisponible === true ||
      esProductoAgotado(item) ||
      !Number.isInteger(cantidad) ||
      cantidad < 1 ||
      cantidad > stock
    );

  });


  // Validar precios
  const hayProblemasPrecio = listaCarrito.some(item => {

    return (
      item.precio == null ||
      !Number.isFinite(Number(item.precio)) ||
      Number(item.precio) <= 0
    );

  });


  const hayProblemas =
    hayProblemasStock || hayProblemasPrecio;


  const controlesBloqueados =
    actualizandoCarrito || verificandoPago;


  // =========================================
  // VERIFICAR ANTES DE CONTINUAR AL PAGO
  // =========================================

  const handleProcederPago = async () => {

    if (
      !hayProductos ||
      hayProblemas ||
      controlesBloqueados ||
      !carritoVerificado
    ) {
      return;
    }

    setVerificandoPago(true);

    // Guardar los precios y cantidades antes de consultar
    const compraAnterior = listaCarrito.map(item => ({
      id: item.id,
      precio: Number(item.precio),
      cantidad: Number(item.cantidad)
    }));

    compraAnteriorRef.current = compraAnterior;

    const resultado = await actualizarCarrito();

    setCarritoVerificado(resultado === true);

    if (resultado === true) {

      setSolicitudPago(true);

    } else {

      setVerificandoPago(false);

    }

  };


  const compraAnteriorRef = useRef([]);


  // Esperar que React actualice los datos del carrito
  useEffect(() => {

    if (!solicitudPago || actualizandoCarrito) {
      return;
    }

    setSolicitudPago(false);
    setVerificandoPago(false);

    if (
      !hayProductos ||
      hayProblemas ||
      !carritoVerificado
    ) {
      return;
    }

    // Detectar cambios de precio o cantidad
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

    // Si cambió el precio, permitir que el cliente
    // revise el nuevo total antes de continuar
    if (huboCambios) {
      return;
    }

    navigate('/checkout');

  }, [
    solicitudPago,
    actualizandoCarrito,
    hayProductos,
    hayProblemas,
    carritoVerificado,
    listaCarrito,
    navigate
  ]);


  // =========================================
  // CARRITO VACÍO
  // =========================================

  if (!hayProductos) {

    return (

      <div className="text-center py-5 isaflor-carrito-vacio">

        <h2 className="mb-3 fw-bold text-isaflor-green">

          {CONFIG_CARRITO.MENSAJE_CARRITO_VACIO}

        </h2>

        <p className="text-muted">

          {CONFIG_CARRITO.SUBTITULO_CARRITO_VACIO}

        </p>

        <Link
          to="/catalogo"
          className="btn btn-isaflor mt-3 px-4 py-2"
        >

          Explorar Catálogo

        </Link>

      </div>

    );

  }


  // =========================================
  // CARRITO CON PRODUCTOS
  // =========================================

  return (

    <div className="container py-4 isaflor-carrito-container">


      {/* ENCABEZADO */}

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 border-bottom pb-3 mb-4">

        <h2 className="text-isaflor-green fw-bold mb-0">

          Carrito de Compras

        </h2>

        <Button
          variant="outline-success"
          className="carrito-actualizar-button"
          onClick={handleActualizarCarrito}
          disabled={controlesBloqueados}
        >

          <i
            className="bi bi-arrow-clockwise me-2"
            aria-hidden="true"
          ></i>

          Actualizar precios

        </Button>

      </div>


      {/* INDICADOR DE ACTUALIZACIÓN */}

      {actualizandoCarrito && (

        <div className="alert alert-info d-flex align-items-center gap-2" role="status">

          <span
            className="spinner-border spinner-border-sm"
            aria-hidden="true"
          ></span>

          Verificando precios, ofertas y stock disponible...

        </div>

      )}


      {/* ERROR DE VERIFICACIÓN */}

      {!actualizandoCarrito && !carritoVerificado && (

        <div className="alert alert-warning" role="alert">

          <i
            className="bi bi-exclamation-circle me-2"
            aria-hidden="true"
          ></i>

          Debes verificar los precios y el stock
          antes de continuar con tu compra.

        </div>

      )}


      {/* ADVERTENCIA DE STOCK */}

      {hayProblemasStock && (

        <div className="alert alert-warning" role="alert">

          <i
            className="bi bi-exclamation-triangle me-2"
            aria-hidden="true"
          ></i>

          Algunos productos no tienen suficiente stock.
          Ajusta las cantidades o elimina los productos
          no disponibles antes de continuar.

        </div>

      )}


      {/* ADVERTENCIA DE PRECIO */}

      {hayProblemasPrecio && (

        <div className="alert alert-danger" role="alert">

          Algunos productos no tienen un precio válido.
          Actualiza el carrito o elimina dichos productos.

        </div>

      )}


      <div className="row g-4">


        {/* LISTA DE PRODUCTOS */}

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

                      <th className="text-center">
                        Acciones
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {listaCarrito.map(item => {

                      const cantidad = Number(item.cantidad);
                      const stock = Number(item.stock);

                      const agotado =
                        item.noDisponible === true ||
                        esProductoAgotado(item);

                      const cantidadValida =
                        Number.isInteger(cantidad) &&
                        cantidad >= 1;

                      const limiteAlcanzado =
                        !agotado &&
                        cantidadValida &&
                        cantidad >= stock;

                      const superaStock =
                        !agotado &&
                        cantidadValida &&
                        cantidad > stock;


                      // Información de oferta
                      const enOferta = tieneOfertaValida(item);

                      const precioFinal = Number(item.precio);

                      const precioOriginal = enOferta
                        ? Number(item.precioOriginal)
                        : precioFinal;

                      const porcentajeDescuento = enOferta
                        ? Math.round(
                            (
                              (precioOriginal - precioFinal) /
                              precioOriginal
                            ) * 100
                          )
                        : 0;

                      const ahorroProducto = enOferta
                        ? (precioOriginal - precioFinal) * cantidad
                        : 0;


                      // Disponibilidad de imagen
                      const tieneImagen =
                        Boolean(item.imagen) &&
                        imagenesFallidas[item.id] !== item.imagen;


                      return (

                        <tr key={item.id}>


                          {/* PRODUCTO */}

                          <td>

                            <div className="d-flex align-items-center gap-3">

                              {tieneImagen ? (

                                <img
                                  src={item.imagen}
                                  alt={item.nombre}
                                  className="img-carrito-thumb rounded-3 shadow-sm"
                                  loading="lazy"
                                  onError={() => handleErrorImagen(item)}
                                />

                              ) : (

                                <div
                                  className="img-carrito-thumb rounded-3 shadow-sm bg-light d-flex align-items-center justify-content-center text-muted"
                                  role="img"
                                  aria-label="Imagen no disponible"
                                >

                                  <i
                                    className="bi bi-image fs-4"
                                    aria-hidden="true"
                                  ></i>

                                </div>

                              )}


                              <div className="d-flex flex-column gap-1">

                                <span className="fw-semibold text-dark">

                                  {item.nombre}

                                </span>


                                {/* ETIQUETA DE OFERTA */}

                                {enOferta && !agotado && (

                                  <div className="carrito-oferta-badge">

                                    <Badge bg="isaflor-rose">

                                      {porcentajeDescuento > 0
                                        ? `-${porcentajeDescuento}% OFERTA`
                                        : 'Oferta'}

                                    </Badge>

                                  </div>

                                )}


                                {/* INFORMACIÓN DE STOCK */}

                                {agotado ? (

                                  <small className="text-danger">

                                    Producto no disponible

                                  </small>

                                ) : (

                                  <small className="text-muted">

                                    Stock disponible: {stock}

                                  </small>

                                )}

                              </div>

                            </div>

                          </td>


                          {/* PRECIO UNITARIO */}

                          <td>

                            <div className="carrito-precios d-flex flex-column">

                              {enOferta && (

                                <small className="carrito-precio-original text-muted text-decoration-line-through">

                                  {formatearPrecio(precioOriginal)}

                                </small>

                              )}

                              <span className="carrito-precio-final fw-semibold">

                                {formatearPrecio(precioFinal)}

                              </span>

                            </div>

                          </td>


                          {/* CANTIDAD */}

                          <td>

                            <div
                              className="btn-group btn-group-sm"
                              role="group"
                              aria-label={`Cantidad de ${item.nombre}`}
                            >

                              <Button
                                variant="outline-secondary"
                                onClick={() =>
                                  handleCantidad(item.id, -1)
                                }
                                disabled={
                                  controlesBloqueados ||
                                  !cantidadValida ||
                                  cantidad <= 1
                                }
                              >

                                −

                              </Button>


                              <span className="btn btn-light disabled px-3 text-dark fw-bold">

                                {item.cantidad}

                              </span>


                              <Button
                                variant="outline-secondary"
                                onClick={() =>
                                  handleCantidad(item.id, 1)
                                }
                                disabled={
                                  controlesBloqueados ||
                                  agotado ||
                                  !cantidadValida ||
                                  limiteAlcanzado
                                }
                              >

                                +

                              </Button>

                            </div>


                            {/* MENSAJES DE DISPONIBILIDAD */}

                            {superaStock ? (

                              <small className="d-block text-danger mt-1">

                                Stock insuficiente

                              </small>

                            ) : limiteAlcanzado ? (

                              <small className="d-block text-warning-emphasis mt-1">

                                Máximo disponible

                              </small>

                            ) : null}

                          </td>


                          {/* SUBTOTAL DEL PRODUCTO */}

                          <td>

                            <div className="d-flex flex-column">

                              <span className="fw-bold text-isaflor-green">

                                {formatearPrecio(
                                  precioFinal * cantidad
                                )}

                              </span>

                              {enOferta && (

                                <small className="carrito-ahorro-producto text-success">

                                  Ahorras {formatearPrecio(ahorroProducto)}

                                </small>

                              )}

                            </div>

                          </td>


                          {/* ELIMINAR PRODUCTO */}

                          <td className="text-center">

                            <Button
                              variant="outline-danger"
                              className="btn-sm border-0"
                              onClick={() =>
                                handleEliminar(item.id)
                              }
                              disabled={controlesBloqueados}
                            >

                              Eliminar

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


          {/* CONTINUAR COMPRANDO */}

          <div className="mt-3">

            <Link
              to="/catalogo"
              className="text-decoration-none text-isaflor-green fw-semibold"
            >

              <i
                className="bi bi-arrow-left me-2"
                aria-hidden="true"
              ></i>

              Continuar comprando

            </Link>

          </div>

        </div>


        {/* RESUMEN DE COMPRA */}

        <div className="col-lg-4">

          <div className="card shadow-sm border-0 rounded-4">

            <div className="card-body p-4">

              <h5 className="card-title mb-3 fw-bold text-isaflor-green">

                Resumen de Compra

              </h5>


              {/* SUBTOTAL SIN DESCUENTOS */}

              <div className="d-flex justify-content-between mb-2">

                <span className="text-muted">

                  {ahorroTotal > 0
                    ? 'Subtotal sin descuento:'
                    : 'Subtotal:'}

                </span>

                <span className="fw-semibold">

                  {formatearPrecio(subtotalOriginal)}

                </span>

              </div>


              {/* DESCUENTOS APLICADOS */}

              {ahorroTotal > 0 && (

                <div className="d-flex justify-content-between mb-2">

                  <span className="text-success">

                    Descuentos aplicados:

                  </span>

                  <span className="text-success fw-bold">

                    −{formatearPrecio(ahorroTotal)}

                  </span>

                </div>

              )}


              {/* ENVÍO */}

              <div className="d-flex justify-content-between mb-2">

                <span className="text-muted">

                  Envío:

                </span>

                <span className="text-success fw-bold">

                  {costoEnvio === 0
                    ? CONFIG_CARRITO.TEXTO_ENVIO_GRATIS
                    : formatearPrecio(costoEnvio)}

                </span>

              </div>


              <hr className="my-3" />


              {/* TOTAL DE LA COMPRA */}

              <div className="d-flex justify-content-between mb-3 fs-5 fw-bold">

                <span>Total:</span>

                <span className="text-isaflor-green">

                  {formatearPrecio(total)}

                </span>

              </div>


              {/* MENSAJE DE AHORRO TOTAL */}

              {ahorroTotal > 0 && (

                <div className="carrito-ahorro-total alert alert-success py-2 mb-3 text-center">

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


              {/* BOTÓN DE PAGO */}

              <Button
                variant="isaflor"
                className="carrito-pago-button w-100 py-2 fs-6 fw-bold shadow-sm"
                onClick={handleProcederPago}
                disabled={
                  hayProblemas ||
                  controlesBloqueados ||
                  !carritoVerificado
                }
              >

                {controlesBloqueados ? (

                  <>

                    <span
                      className="spinner-border spinner-border-sm me-2"
                      aria-hidden="true"
                    ></span>

                    Verificando compra...

                  </>

                ) : (

                  <>

                    <i
                      className="bi bi-credit-card me-2"
                      aria-hidden="true"
                    ></i>

                    Proceder al Pago

                  </>

                )}

              </Button>


              {/* ADVERTENCIA DE PAGO BLOQUEADO */}

              {hayProblemas && (

                <small className="d-block text-danger text-center mt-2">

                  Revisa los productos antes de continuar.

                </small>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Carrito;
