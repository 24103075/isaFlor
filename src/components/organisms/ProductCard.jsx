// src/components/organisms/ProductCard.jsx
import React from 'react';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';
import { formatearPrecio } from '../../utils/validaciones';

const ProductCard = ({ producto, onAddToCart }) => {
  return (
    <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
      <div className="position-relative bg-light" style={{ height: '275px' }}>
        <img
          src={producto.imagen}
          className="w-100 h-100"
          alt={producto.nombre}
          style={{ objectFit: 'contain', objectPosition: 'center' }}
          loading="block"
        />
        {producto.enOferta && (
          <Badge bg="warning" className="position-absolute top-0 start-0 m-2">
            Oferta
          </Badge>
        )}
        {producto.stock <= producto.stockCritico && (
          <Badge bg="warning" className="position-absolute top-0 end-0 m-2 text-dark">
            Stock Bajo
          </Badge>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <small className="text-muted mb-1 text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>
          {producto.categoria}
        </small>
        <h5 className="card-title text-truncate fw-bold" style={{ color: '#292523' }}>
          {producto.nombre}
        </h5>
        <p className="card-text text-muted small flex-grow-1">
          {producto.descripcion}
        </p>

        <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top">
          <span className="fs-5 fw-bold text-success">
            {formatearPrecio(producto.precio)}
          </span>
          <Button
            variant="primary"
            onClick={() => onAddToCart(producto)}
            disabled={producto.stock === 0}
            className="rounded-pill px-3"
          >
            {producto.stock === 0 ? 'Agotado' : 'Añadir'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;