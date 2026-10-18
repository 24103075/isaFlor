// src/test/components/molecules/FormInput.spec.jsx

import React from 'react';
import { render } from '@testing-library/react';
import FormInput from '../../../components/molecules/FormInput';

describe('FormInput Component', () => {
  it('renderiza la etiqueta y el campo de texto', () => {
    const { getByLabelText } = render(
      <FormInput
        label="Nombre"
        name="nombre"
        value=""
        onChange={() => {}}
      />
    );

    expect(getByLabelText('Nombre')).toBeTruthy();
  });

  it('marca el campo como obligatorio', () => {
    const { getByLabelText } = render(<FormInput
        label="Correo"
        name="correo"
        type="email"
        value=""
        onChange={() => {}}
        required
      />
    );

    expect(getByLabelText('Correo *').required).toBe(true);
  });

  it('muestra el mensaje de error cuando existe uno', () => {
    const { getByText } = render(<FormInput
        label="Nombre"
        name="nombre"
        value=""
        onChange={() => {}}
        error="El nombre es obligatorio"
      />
    );

    expect(getByText('El nombre es obligatorio')).toBeTruthy();
  });
});