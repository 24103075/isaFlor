
// src/pages/Carrito.jsx

import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import Button from '../components/atoms/Button';

import {
  CONFIG_CARRITO,
  formatearPrecio,
  calcularTotalCarrito,
  actualizarCantidadItem,
  eliminarItemCarrito,
  esProductoAgotado
} from '../utils/validaciones';

import '../styles/pages/Carrito.css';


const Carrito = ({ cart = [], setCart }) => {

  const navigate = useNavigate();

  // Controlar imágenes que no pudieron cargarse
  const [imagenesFallidas, setImagenesFallidas] = useState({});

  // Asegurar que el carrito sea un arreglo
  const listaCarrito = Array.isArray(cart) ? cart : [];


  // Actualizar cantidad de un producto
  const handleCantidad = (id, delta) => {

    setCart(prev =>
      actualizarCantidadItem(prev, id, delta)
    );

  };


  // Eliminar producto del carrito
  const handleEliminar = (id) => {

    setCart(prev =>
      eliminarItemCarrito(prev, id)
    );

  };


  // Registrar errores de carga de imágenes
  const handleErrorImagen = (item) => {

    setImagenesFallidas(prev => ({
      ...prev,
      [item.id]: item.imagen
    }));

  };


  // Calcular total del carrito
  const total = calcularTotalCarrito(listaCarrito);


  // Verificar si existen productos con cantidades inválidas
  const hayProblemasStock = listaCarrito.some(item => {

    const cantidad = Number(item.cantidad);
    const stock = Number(item.stock);

    return (
      esProductoAgotado(item) ||
      !Number.isInteger(cantidad) ||
      cantidad < 1 ||
      cantidad > stock
    );

  });


  // Continuar hacia Checkout
  const handleProcederPago = () => {

    if (listaCarrito.length === 0 || hayProblemasStock) {
      return;
    }

    navigate('/checkout');

  };


  // ====================================================
  // CARRITO VACÍO
  // ====================================================

  if (listaCarrito.length === 0) {

    return (

      <div className="text-center py-5 isaflor-carrito-vacio">

        <h2 className="mb-3 fw-bold text-isaflor-green">

          {CONFIG_CARRITO.MENSAJE_CARRITO_VACIO}

        </h2>

        <p className="text-muted">

          {CONFIG_CARRITO.SUBTITULO_CARRITO_VACIO}

        </p>

        <Link to="/catalogo">

          <Button
            variant="isaflor"
            className="mt-3 px-4 py-2"
          >

            Explorar Catálogo

          </Button>

        </Link>

      </div>

    );

  }


  // ====================================================
  // CARRITO CON PRODUCTOS
  // ====================================================

  return (

    <div className="container py-4 isaflor-carrito-container">

      <h2 className="mb-4 text-isaflor-green border-bottom pb-2 fw-bold">

        Carrito de Compras

      </h2>


      {/* Advertencia general de stock */}

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

                      // Obtener cantidades numéricas
                      const cantidad = Number(item.cantidad);
                      const stock = Number(item.stock);

                      // Validar disponibilidad
                      const agotado = esProductoAgotado(item);

                      // Comprobar cantidad válida
                      const cantidadValida =
                        Number.isInteger(cantidad) &&
                        cantidad >= 1;

                      // Comprobar si alcanzó el stock máximo
                      const limiteAlcanzado =
                        !agotado &&
                        cantidadValida &&
                        cantidad >= stock;

                      // Comprobar si supera el stock
                      const superaStock =
                        !agotado &&
                        cantidadValida &&
                        cantidad > stock;

                      // Comprobar disponibilidad de imagen
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


                              <div className="d-flex flex-column">

                                <span className="fw-semibold text-dark">

                                  {item.nombre}

                                </span>


                                {/* Información de stock */}

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

                            {formatearPrecio(item.precio)}

                          </td>


                          {/* CANTIDAD */}

                          <td>

                            <div
                              className="btn-group btn-group-sm"
                              role="group"
                              aria-label={`Cantidad de ${item.nombre}`}
                            >

                              {/* Disminuir cantidad */}

                              <Button
                                variant="outline-secondary"
                                onClick={() =>
                                  handleCantidad(item.id, -1)
                                }
                                disabled={
                                  !cantidadValida ||
                                  cantidad <= 1 ||
                                  agotado ||
                                  cantidad - 1 > stock
                                }
                              >

                                -

                              </Button>


                              {/* Cantidad actual */}

                              <span className="btn btn-light disabled px-3 text-dark fw-bold">

                                {item.cantidad}

                              </span>


                              {/* Aumentar cantidad */}

                              <Button
                                variant="outline-secondary"
                                onClick={() =>
                                  handleCantidad(item.id, 1)
                                }
                                disabled={
                                  agotado ||
                                  !cantidadValida ||
                                  limiteAlcanzado
                                }
                              >

                                +

                              </Button>

                            </div>


                            {/* Mensajes de disponibilidad */}

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


                          {/* SUBTOTAL */}

                          <td className="fw-bold text-isaflor-green">

                            {formatearPrecio(
                              Number(item.precio) * cantidad
                            )}

                          </td>


                          {/* ELIMINAR PRODUCTO */}

                          <td className="text-center">

                            <Button
                              variant="outline-danger"
                              className="btn-sm border-0"
                              onClick={() =>
                                handleEliminar(item.id)
                              }
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


          {/* Continuar comprando */}

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


              {/* Subtotal */}

              <div className="d-flex justify-content-between mb-2">

                <span className="text-muted">

                  Subtotal:

                </span>

                <span className="fw-semibold">

                  {formatearPrecio(total)}

                </span>

              </div>


              {/* Envío */}

              <div className="d-flex justify-content-between mb-2">

                <span className="text-muted">

                  Envío:

                </span>

                <span className="text-success fw-bold">

                  {CONFIG_CARRITO.TEXTO_ENVIO_GRATIS}

                </span>

              </div>


              <hr className="my-3" />


              {/* Total */}

              <div className="d-flex justify-content-between mb-4 fs-5 fw-bold">

                <span>Total:</span>

                <span className="text-isaflor-green">

                  {formatearPrecio(total)}

                </span>

              </div>


              {/* Botón de pago */}

              <Button
                variant="isaflor"
                className="w-100 py-2 fs-6 fw-bold shadow-sm"
                onClick={handleProcederPago}
                disabled={hayProblemasStock}
              >

                Proceder al Pago 💳

              </Button>


              {/* Advertencia de pago bloqueado */}

              {hayProblemasStock && (

                <small className="d-block text-danger text-center mt-2">

                  Revisa la disponibilidad de los productos
                  antes de continuar.

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
