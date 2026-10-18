// src/test/components/organisms/ProductCard.spec.jsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ProductCard from '../../../components/organisms/ProductCard';

describe('ProductCard Component', () => {
  const productoEjemplo = {
    id: 1,
    nombre: 'Ramo de Rosas',
    categoria: 'Rosas',
    precio: 24990,
    stock: 10,
    stockCritico: 3,
    descripcion: 'Rosas rojas frescas',
    imagen: 'https://via.placeholder.com/150',
    enOferta: true
  };

  it('renderiza la información del producto correctamente', () => {
    const { getByText } = render(<ProductCard producto={productoEjemplo} onAddToCart={() => {}} />);
    
    expect(getByText('Ramo de Rosas')).toBeTruthy();
    expect(getByText('$24.990')).toBeTruthy();
    expect(getByText('Oferta')).toBeTruthy();
  });

  it('llama a la función onAddToCart al hacer click en el botón', () => {
    const onAddToCartSpy = jasmine.createSpy('onAddToCart');
    const { getByRole } = render(<ProductCard producto={productoEjemplo} onAddToCart={onAddToCartSpy} />);
    const button = getByRole('button', { name: /Añadir/ });
    fireEvent.click(button);
    
    expect(onAddToCartSpy).toHaveBeenCalledWith(productoEjemplo);
  });
  
  it('muestra la descripción del producto', () => {
    const { getByText } = render(
      <ProductCard
        producto={productoEjemplo}
        onAddToCart={() => {}}
      />
    );

    expect(getByText('Rosas rojas frescas')).toBeTruthy();
  });
});