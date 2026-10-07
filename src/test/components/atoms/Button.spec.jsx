// src/test/components/atoms/Button.spec.jsx 
import React from 'react';
import { render } from '@testing-library/react';
import Button from '../../../components/atoms/Button';

describe('Button Component', () => {
  it('renderiza el botón correctamente', () => {
    const { getByText } = render(<Button>Haz click</Button>);
    expect(getByText('Haz click')).toBeTruthy();
  });

  it('aplica la variante de Bootstrap correctamente', () => {
    const { getByText } = render(<Button variant="danger">Eliminar</Button>);
    const button = getByText('Eliminar');
    expect(button.classList.contains('btn-danger')).toBe(true);
  });
});