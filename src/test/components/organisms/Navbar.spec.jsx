// src/test/components/organisms/Navbar.spec.jsx
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../../../components/organisms/Navbar';

describe('Navbar Component', () => {
  it('renderiza el título y los enlaces de navegación', () => {
    const { getByText } = render(
      <BrowserRouter>
        <Navbar cartCount={3} />
      </BrowserRouter>
    );

    expect(getByText('🌸 IsaFlor')).toBeTruthy();
    expect(getByText('Inicio')).toBeTruthy();
    expect(getByText('3')).toBeTruthy(); // Badge de carrito
  });
});