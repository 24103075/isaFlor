// src/test/components/organisms/Header.spec.jsx
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../../components/organisms/Header';

describe('Header Component', () => {
  it('renderiza el título y los enlaces de navegación', () => {
    const { getByText } = render(
      <BrowserRouter>
        <Header cartCount={3} />
      </BrowserRouter>
    );

    expect(getByText('IsaFlor')).toBeTruthy();
    expect(getByText('INICIO')).toBeTruthy();
    expect(getByText('3')).toBeTruthy(); // Badge de carrito
  });
});