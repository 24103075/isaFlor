// src/components/organisms/ProductCard.jsx
import React from 'react';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';
import {formatearPrecio, esProductoAgotado, tieneStockCritico} from '../../utils/validaciones';
import '../../styles/organisms/ProductCard.css';

const ProductCard = ({ producto, onAddToCart }) => {
  const agotado = esProductoAgotado(producto);
  const stockCritico = tieneStockCritico(producto);

  return (
    <div className="card h-100 product-card shadow-sm border-0 rounded-4 overflow-hidden">
      {/* Contenedor de la Imagen y Badges */}
      <div className="position-relative product-card__img-container">
        <img
          src={producto.imagen}
          className="w-100 h-100 product-card__img"
          alt={producto.nombre}
          loading="lazy"
        />

        {/* Badges Flotantes */}
        <div className="position-absolute top-0 start-0 m-2 d-flex flex-column gap-1">
          {producto.enOferta && (
            <Badge bg="isaflor-rose" className="shadow-sm">
              Oferta
            </Badge>
          )}
          {stockCritico && (
            <Badge bg="isaflor-amber" className="shadow-sm">
              Últimas Unidades
            </Badge>
          )}
          {agotado && (
            <Badge bg="secondary" className="shadow-sm">
              Agotado
            </Badge>
          )}
        </div>
      </div>

      {/* Cuerpo de la Tarjeta */}
      <div className="card-body d-flex flex-column p-3">
        <small className="product-card__category text-muted mb-1 text-uppercase fw-semibold">
          {producto.categoria}
        </small>
        
        <h5 className="card-title product-card__title text-truncate fw-bold mb-2">
          {producto.nombre}
        </h5>
        
        <p className="card-text text-muted small flex-grow-1 product-card__description">
          {producto.descripcion}
        </p>

        {/* Pie de Tarjeta: Precio y Botón */}
        <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top">
          <span className="product-card__price fs-5 fw-bold">
            {formatearPrecio(producto.precio)}
          </span>

          <Button
            variant={agotado ? 'secondary' : 'isaflor'}
            onClick={() => onAddToCart(producto)}
            disabled={agotado}
            className="rounded-pill px-3 py-1 btn-sm fw-semibold"
          >
            {agotado ? 'Agotado' : 'Añadir 🛒'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;