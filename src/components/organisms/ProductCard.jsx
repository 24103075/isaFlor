
// src/components/organisms/ProductCard.jsx

import React, { useState } from 'react';

import Button from '../atoms/Button';
import Badge from '../atoms/Badge';

import {
  formatearPrecio,
  esProductoAgotado,
  tieneStockCritico
} from '../../utils/validaciones';

import '../../styles/organisms/ProductCard.css';


const ProductCard = ({ producto, onAddToCart }) => {

  // =========================================
  // ESTADOS DEL COMPONENTE
  // =========================================

  const [cantidad, setCantidad] = useState(1);
  const [imagenFallida, setImagenFallida] = useState(null);


  // =========================================
  // VALIDACIONES DE STOCK
  // =========================================

  const agotado = esProductoAgotado(producto);
  const stockCritico = tieneStockCritico(producto);
  const stockDisponible = Number(producto.stock);


  // =========================================
  // INFORMACION DE PRECIOS Y OFERTAS
  // =========================================

  const precioFinal = Number(producto.precio);

  const precioOriginal = Number(
    producto.precioOriginal ?? producto.precio
  );

  const enOferta =
    producto.enOferta === true &&
    Number.isFinite(precioOriginal) &&
    Number.isFinite(precioFinal) &&
    precioFinal > 0 &&
    precioFinal < precioOriginal;

  const porcentajeDescuento = enOferta
    ? Math.round(
        ((precioOriginal - precioFinal) / precioOriginal) * 100
      )
    : 0;

  const ahorroUnitario = enOferta
    ? precioOriginal - precioFinal
    : 0;


  // =========================================
  // DISPONIBILIDAD DE IMAGEN
  // =========================================

  const tieneImagen =
    Boolean(producto.imagen) &&
    imagenFallida !== producto.imagen;


  // =========================================
  // VALIDAR CANTIDAD SELECCIONADA
  // =========================================

  const cantidadValida =
    cantidad !== '' &&
    Number.isInteger(Number(cantidad)) &&
    Number(cantidad) >= 1 &&
    Number(cantidad) <= stockDisponible;


  // Calcular subtotal y ahorro total

  const subtotal = cantidadValida
    ? precioFinal * Number(cantidad)
    : 0;

  const ahorroTotal = cantidadValida
    ? ahorroUnitario * Number(cantidad)
    : 0;


  // =========================================
  // AUMENTAR CANTIDAD
  // =========================================

  const aumentarCantidad = () => {

    if (!agotado) {

      setCantidad(prev =>
        Math.min(
          stockDisponible,
          (Number(prev) || 0) + 1
        )
      );

    }

  };


  // =========================================
  // DISMINUIR CANTIDAD
  // =========================================

  const disminuirCantidad = () => {

    setCantidad(prev =>
      Math.max(1, Number(prev) - 1)
    );

  };


  // =========================================
  // INGRESAR CANTIDAD MANUALMENTE
  // =========================================

  const handleCantidadChange = (e) => {

    const valor = e.target.value;

    if (valor === '') {

      setCantidad('');
      return;

    }

    const numero = Number(valor);

    if (Number.isInteger(numero)) {

      setCantidad(
        Math.max(1, Math.min(numero, stockDisponible))
      );

    }

  };


  // =========================================
  // AÑADIR PRODUCTO AL CARRITO
  // =========================================

  const handleAgregarCarrito = () => {

    if (agotado || !cantidadValida) {
      return;
    }

    onAddToCart(producto, Number(cantidad));

    // Restablecer el selector
    setCantidad(1);

  };


  return (

    <div className="card h-100 product-card shadow-sm border-0 rounded-4 overflow-hidden">


      {/* CONTENEDOR DE IMAGEN */}

      <div className="position-relative product-card__img-container">

        {tieneImagen ? (

          <img
            src={producto.imagen}
            className="w-100 h-100 product-card__img"
            alt={producto.nombre}
            loading="lazy"
            onError={() => setImagenFallida(producto.imagen)}
          />

        ) : (

          <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-light text-muted">

            <i
              className="bi bi-image fs-1 mb-2"
              aria-hidden="true"
            ></i>

            <small>Imagen no disponible</small>

          </div>

        )}


        {/* ETIQUETAS FLOTANTES */}

        <div className="position-absolute top-0 start-0 m-2 d-flex flex-column gap-1">

          {/* Etiqueta de oferta */}

          {enOferta && (

            <Badge
              bg="isaflor-rose"
              className="shadow-sm"
            >

              {porcentajeDescuento > 0
                ? `-${porcentajeDescuento}% OFERTA`
                : 'Oferta'}

            </Badge>

          )}


          {/* Etiqueta de stock critico */}

          {stockCritico && !agotado && (

            <Badge
              bg="isaflor-amber"
              className="shadow-sm"
            >
              Últimas Unidades
            </Badge>

          )}


          {/* Etiqueta de producto agotado */}

          {agotado && (

            <Badge
              bg="secondary"
              className="shadow-sm"
            >
              Agotado
            </Badge>

          )}

        </div>

      </div>


      {/* CUERPO DE LA TARJETA */}

      <div className="card-body d-flex flex-column p-3">


        {/* Categoria */}

        <small className="product-card__category text-muted mb-1 text-uppercase fw-semibold">

          {producto.categoria}

        </small>


        {/* Nombre */}

        <h5 className="card-title product-card__title text-truncate fw-bold mb-2">

          {producto.nombre}

        </h5>


        {/* Descripcion */}

        <p className="card-text text-muted small flex-grow-1 product-card__description">

          {producto.descripcion}

        </p>


        {/* DISPONIBILIDAD DE STOCK */}

        <div className="mb-2">

          {agotado ? (

            <small className="text-danger fw-semibold">

              <i className="bi bi-x-circle me-1"></i>

              Producto no disponible

            </small>

          ) : stockCritico ? (

            <small className="text-warning-emphasis fw-semibold">

              <i className="bi bi-exclamation-circle me-1"></i>

              ¡Solo quedan {stockDisponible} unidades!

            </small>

          ) : (

            <small className="text-success fw-semibold">

              <i className="bi bi-check-circle me-1"></i>

              {stockDisponible} unidades disponibles

            </small>

          )}

        </div>


        {/* PRECIO Y CONTROLES DE COMPRA */}

        <div className="product-card__purchase mt-3 pt-3 border-top">


          {/* CONTENEDOR DE PRECIOS */}

          <div className="product-card__prices d-flex flex-column">


            {/* Precio original tachado */}

            {enOferta && (

              <span className="product-card__original-price text-muted text-decoration-line-through">

                {formatearPrecio(precioOriginal)}

              </span>

            )}


            {/* Precio final del producto */}

            <span className="product-card__price fs-4 fw-bold">

              {formatearPrecio(precioFinal)}

            </span>


            {/* Ahorro por unidad */}

            {enOferta && (

              <span className="product-card__saving text-success small fw-semibold">

                <i
                  className="bi bi-tag-fill me-1"
                  aria-hidden="true"
                ></i>

                Ahorras {formatearPrecio(ahorroUnitario)} por unidad

              </span>

            )}

          </div>


          {/* SELECTOR DE CANTIDAD */}

          {!agotado && (

            <div className="product-card__quantity-section">

              <label className="product-card__quantity-label">

                Cantidad

              </label>

              <div className="product-card__quantity-control">


                {/* Disminuir cantidad */}

                <Button
                  variant="outline-secondary"
                  className="product-card__quantity-button"
                  onClick={disminuirCantidad}
                  disabled={Number(cantidad) <= 1}
                >

                  −

                </Button>


                {/* Recuadro numerico */}

                <input
                  type="number"
                  min="1"
                  max={stockDisponible}
                  step="1"
                  value={cantidad}
                  onChange={handleCantidadChange}
                  onBlur={() => {
                    if (cantidad === '') {
                      setCantidad(1);
                    }
                  }}
                  className="product-card__quantity-input"
                  aria-label={`Cantidad de ${producto.nombre}`}
                />


                {/* Aumentar cantidad */}

                <Button
                  variant="outline-secondary"
                  className="product-card__quantity-button"
                  onClick={aumentarCantidad}
                  disabled={Number(cantidad) >= stockDisponible}
                >

                  +

                </Button>

              </div>

            </div>

          )}


          {/* SUBTOTAL DE LAS UNIDADES SELECCIONADAS */}

          {!agotado && cantidadValida && Number(cantidad) > 1 && (

            <div className="product-card__subtotal-container">


              {/* Subtotal con el precio final */}

              <div className="product-card__subtotal">

                <span>Subtotal:</span>

                <strong>

                  {formatearPrecio(subtotal)}

                </strong>

              </div>


              {/* Ahorro total de la compra */}

              {enOferta && (

                <div className="product-card__total-saving text-success small fw-semibold d-flex justify-content-between mt-2">

                  <span>Ahorro total:</span>

                  <strong>

                    {formatearPrecio(ahorroTotal)}

                  </strong>

                </div>

              )}

            </div>

          )}


          {/* BOTON AÑADIR AL CARRITO */}

          <Button
            variant={agotado ? 'secondary' : 'isaflor'}
            className="product-card__add-button"
            onClick={handleAgregarCarrito}
            disabled={agotado || !cantidadValida}
          >

            {agotado ? (

              'Producto agotado'

            ) : (

              <>

                <i
                  className="bi bi-cart-plus me-2"
                  aria-hidden="true"
                ></i>

                Añadir al carrito

              </>

            )}

          </Button>

        </div>

      </div>

    </div>

  );

};

export default ProductCard;
