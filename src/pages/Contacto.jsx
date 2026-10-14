import React from 'react';
import { INFO_CONTACTO } from '../data/datosIsaflor';

const Contacto = () => {
  return (
    <section className="container py-4">
      <h1>Contáctanos</h1>
      <p>Estamos aquí para ayudarte.</p>

      <p>
        <strong>Teléfono:</strong>{' '}
        <a href={`tel:${INFO_CONTACTO.telefono.replace(/\s/g, '')}`}>
          {INFO_CONTACTO.telefono}
        </a>
      </p>

      <p>
        <strong>Correo:</strong>{' '}
        <a href={`mailto:${INFO_CONTACTO.correo}`}>
          {INFO_CONTACTO.correo}
        </a>
      </p>

      <p><strong>Dirección:</strong> {INFO_CONTACTO.direccion}</p>
      <p><strong>Horario:</strong> {INFO_CONTACTO.horario}</p>

      <a href={INFO_CONTACTO.whatsapp} target="_blank" rel="noreferrer">
        Escríbenos por WhatsApp
      </a>
    </section>
  );
};

export default Contacto;