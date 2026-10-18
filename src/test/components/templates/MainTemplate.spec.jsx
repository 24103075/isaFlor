// src/test/components/templates/MainTemplate.spec.jsx

import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MainTemplate from '../../../components/templates/MainTemplate';

describe('MainTemplate Component', () => {
  it('renderiza el encabezado de IsaFlor', () => {
    const { getByText } = render(
      <BrowserRouter>
        <MainTemplate>
          <p>Contenido de prueba</p>
        </MainTemplate>
      </BrowserRouter>
    );

    expect(getByText('IsaFlor')).toBeTruthy();
  });

  it('muestra el contenido recibido mediante children', () => {
    const { getByText } = render(
      <BrowserRouter>
        <MainTemplate>
          <p>Contenido de prueba</p>
        </MainTemplate>
      </BrowserRouter>
    );

    expect(getByText('Contenido de prueba')).toBeTruthy();
  });

  it('renderiza el pie de página de IsaFlor', () => {
    const { getByText } = render(
      <BrowserRouter>
        <MainTemplate>
          <p>Contenido de prueba</p>
        </MainTemplate>
      </BrowserRouter>
    );

    expect(getByText('IsaFlor - Florería Artesanal')).toBeTruthy();
  });
});
