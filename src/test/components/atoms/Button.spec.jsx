// src/test/components/atoms/Button.spec.jsx 
import React from 'react';
import { render , fireEvent} from '@testing-library/react';
import Button from '../../../components/atoms/Button';

describe('Button Component', () => {
  it('renderiza el boton correctamente', () => {
    const { getByText } = render(<Button>Haz click</Button>);
    expect(getByText('Haz click')).toBeTruthy();
  });

  it('aplica la variante de Bootstrap correctamente', () => {
    const { getByText } = render(<Button variant="danger">Eliminar</Button>);
    const button = getByText('Eliminar');
    expect(button.classList.contains('btn-danger')).toBe(true);
  });

  it('llama a la funcion onClick cuando se hace clic', async () => {
    const handleClick = jasmine.createSpy('handleClick');
    const { getByRole } = render(<Button onClick={handleClick}>Guardar</Button>);
    const button = getByRole('button', { name: 'Guardar' });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});