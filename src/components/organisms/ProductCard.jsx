// src/components/organisms/ProductCard.jsx
import React from 'react';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';
import { formatearPrecio } from '../../utils/validaciones';

const ProductCard = ({ producto, onAddToCart }) => {
  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="position-relative">
        <img
          src={producto.imagen}
          className="card-img-top"
          alt={producto.nombre}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        {producto.enOferta && (
          <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
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
        <small className="text-muted mb-1">{producto.categoria}</small>
        <h5 className="card-title text-truncate">{producto.nombre}</h5>
        <p className="card-text text-muted small flex-grow-1">
          {producto.descripcion}
        </p>
        <div className="d-flex align-items-center justify-content-between mt-3">
          <span className="fs-5 fw-bold text-success">
            {formatearPrecio(producto.precio)}
          </span>
          <Button
            variant="primary"
            onClick={() => onAddToCart(producto)}
            disabled={producto.stock === 0}
          >
            {producto.stock === 0 ? 'Agotado' : 'Añadir'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;