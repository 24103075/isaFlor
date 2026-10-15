import React from 'react';
import { INFO_CONTACTO } from '../data/datosIsaflor';
import '../styles/pages/Contacto.css';

const Contacto = () => {
  return (
    <main className="contacto-page container py-4 py-md-5">
      <header className="contacto-page__encabezado mb-4">
        <p className="contacto-page__etiqueta">ISAFLOR · MELIPILLA</p>
        <h1 className="contacto-page__titulo">Contáctanos</h1>
        <p>Estamos aquí para ayudarte con tu pedido o resolver tus dudas.</p>
      </header>

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <section className="contacto-page__datos">
            <h2>Información de contacto</h2>

            <dl className="contacto-page__lista mb-0">
              <div>
                <dt>Teléfono</dt>
                <dd>
                  <a href={`tel:${INFO_CONTACTO.telefono.replace(/\s/g, '')}`}>
                    {INFO_CONTACTO.telefono}
                  </a>
                </dd>
              </div>

              <div>
                <dt>Correo electrónico</dt>
                <dd>
                  <a href={`mailto:${INFO_CONTACTO.correo}`}>
                    {INFO_CONTACTO.correo}
                  </a>
                </dd>
              </div>

              <div>
                <dt>Dirección</dt>
                <dd>{INFO_CONTACTO.direccion}</dd>
              </div>

              <div>
                <dt>Horario</dt>
                <dd>{INFO_CONTACTO.horario}</dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="col-12 col-lg-5">
          <aside className="contacto-page__canales">
            <h2>Escríbenos</h2>
            <p>También puedes contactarnos por nuestras redes.</p>

            <div className="d-flex flex-wrap gap-2">
              <a
                className="btn btn-outline-success"
                href={INFO_CONTACTO.whatsapp}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>

              <a
                className="btn btn-outline-danger"
                href={INFO_CONTACTO.instagram}
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Contacto;