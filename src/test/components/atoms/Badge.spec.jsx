// src/test/components/atoms/Badge.spec.jsx 


import React from 'react';
import { render } from '@testing-library/react';
import Badge from '../../../components/atoms/Badge';

describe('Badge Component', () => {
  it('renderiza el contenido correctamente', () => {
    const { getByText } = render(<Badge>Nuevo</Badge>);
    expect(getByText('Nuevo')).toBeTruthy();
  });

  it('aplica el color primary por defecto', () => {
    const { getByText } = render(<Badge>Producto</Badge>);
    const badge = getByText('Producto');
    expect(badge.classList.contains('bg-primary')).toBe(true);
  });

  it('aplica un color y una clase personalizados', () => {
    const { getByText } = render(<Badge bg="success" className="mi-badge">Disponible</Badge>);
    const badge = getByText('Disponible');

    expect(badge.classList.contains('bg-success')).toBe(true);
    expect(badge.classList.contains('mi-badge')).toBe(true);
  });
});
