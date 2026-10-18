// src/test/components/organisms/Footer.spec.jsx

import React from 'react';
import { render } from '@testing-library/react';
import Footer from '../../../components/organisms/Footer';
import { INFO_CONTACTO } from '../../../data/datosIsaflor';

describe('Footer Component', () => {
  it('renderiza el nombre de la florería', () => {
    const { getByText } = render(<Footer />);

    expect(
      getByText('IsaFlor - Florería Artesanal')
    ).toBeTruthy();
  });

  
    it('muestra la información de contacto', () => {
    const { container } = render(<Footer />);
    const texto = container.textContent;

    expect(texto).toContain(INFO_CONTACTO.telefono);
    expect(texto).toContain(INFO_CONTACTO.correo);
    expect(texto).toContain(INFO_CONTACTO.direccion);
    expect(texto).toContain(INFO_CONTACTO.horario);
    });


  it('muestra los enlaces de Instagram y WhatsApp', () => {
    const { getByRole } = render(<Footer />);

    const instagram = getByRole('link', { name: /Instagram/i });
    const whatsapp = getByRole('link', { name: /WhatsApp/i });

    expect(instagram.getAttribute('href')).toBe(INFO_CONTACTO.instagram);
    expect(whatsapp.getAttribute('href')).toBe(INFO_CONTACTO.whatsapp);
  });
});
