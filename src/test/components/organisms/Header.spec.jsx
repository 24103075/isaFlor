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
    expect(getByText('3')).toBeTruthy();
  });

  it('muestra las opciones de inicio de sesión y registro cuando no hay usuario', () => {
    const { getByText } = render(
      <BrowserRouter>
        <Header cartCount={0} />
      </BrowserRouter>
    );

    expect(getByText(/Ingresar/i)).toBeTruthy();
    expect(getByText(/Registrarse/i)).toBeTruthy();
  });

  it('muestra el nombre del usuario cuando ha iniciado sesión', () => {
    const usuario = {
      nombre: 'Karol',
      email: 'karol@example.com',
      rol: 'CLIENTE'
    };

    const { getByText } = render(
      <BrowserRouter>
        <Header cartCount={0} usuario={usuario} />
      </BrowserRouter>
    );

    expect(getByText(/Karol/i)).toBeTruthy();
  });
});
