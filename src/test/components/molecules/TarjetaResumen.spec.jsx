// src/test/components/molecules/TarjetaResumen.spec.jsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import TarjetaResumen from '../../../components/molecules/TarjetaResumen';

describe('TarjetaResumen', () => {

  it('debe mostrar el título y la cantidad recibidos por props', () => {
    render(
      <TarjetaResumen
        titulo="Productos"
        cantidad={4}
        icono="bi-box-seam"
      />
    );

    expect(screen.getByText('Productos')).toBeTruthy();
    expect(screen.getByText('4')).toBeTruthy();
  });

  it('debe mostrar el icono recibido por props', () => {
    const { container } = render(
      <TarjetaResumen
        titulo="Órdenes"
        cantidad={3}
        icono="bi-cart3"
      />
    );

    const icono = container.querySelector('i.bi-cart3');

    expect(icono).not.toBeNull();
    expect(icono.getAttribute('aria-hidden')).toBe('true');
  });

  it('debe utilizar el color recibido por props', () => {
    const { container } = render(
      <TarjetaResumen
        titulo="Stock crítico"
        cantidad={2}
        icono="bi-exclamation-triangle"
        color="rosa"
      />
    );

    expect(
      container.querySelector('.dashboard-card-rosa')
    ).not.toBeNull();
  });

});
