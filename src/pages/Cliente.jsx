
// src/pages/Cliente.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

import FormInput from '../components/molecules/FormInput';
import Button from '../components/atoms/Button';

import { useUbicaciones } from '../hooks/useUbicaciones';
import { obtenerComprasCliente } from '../data/datosIsaflor';

import '../styles/pages/Cliente.css';


const Cliente = ({ usuario }) => {

  const navigate = useNavigate();


  // Recuperar los datos reales del usuario autenticado
  const perfil = usuario?.usuario ?? usuario ?? {};


  // Consultar regiones y comunas desde el backend
  const {
    comunas,
    cargando,
    error: errorUbicaciones
  } = useUbicaciones();


  // Identificar la comuna registrada por el cliente
  const comunaCliente = comunas.find(
    comuna =>
      String(comuna.idComuna) === String(perfil.idComuna)
  );


  // Obtener los datos personales
  const nombreCompleto = [
    perfil.nombre,
    perfil.apellidoPaterno,
    perfil.apellidoMaterno
  ].filter(Boolean).join(' ');


  const correo = perfil.correo ?? perfil.email ?? '';

  const rut = perfil.run ?? perfil.rut ?? '';

  const direccion = perfil.direccion ?? '';

  const fechaNacimiento = perfil.fechaNacimiento ?? '';

  const region = comunaCliente?.region?.nombreRegion ?? '';

  const comuna = comunaCliente?.nombreComuna ?? '';


  // Historial local de compras
  // Pendiente de conectar con el backend de pedidos
  const compras = correo
    ? obtenerComprasCliente(correo)
    : [];


  // Verificar el rol del usuario
  if (!usuario || usuario.rol !== 'CLIENTE') {

    return (
      <div className="container mt-4">

        <div className="alert alert-warning">
          Debes iniciar sesión como cliente para acceder
          a tu perfil.
        </div>

        <Button
          variant="success"
          onClick={() => navigate('/login', { replace: true })}
        >
          Iniciar sesión
        </Button>

      </div>
    );
  }


  return (

    <div className="container cliente-contenedor">

      <section className="cliente-tarjeta">

        <header className="cliente-encabezado">

          <h2 className="cliente-titulo">
            Mi perfil
          </h2>

          <p className="cliente-descripcion">
            Consulta los datos registrados en tu cuenta de IsaFlor.
          </p>

        </header>


        <div className="alert alert-info" role="status">

          <i
            className="bi bi-info-circle me-2"
            aria-hidden="true"
          ></i>

          Estos son los datos registrados en tu cuenta.
          La edición del perfil aún no se encuentra habilitada.

        </div>


        <h5 className="cliente-subtitulo">
          Datos personales
        </h5>


        <fieldset disabled>

          <div className="row">

            <div className="col-md-6 mb-3">

              <FormInput
                label="Nombre completo"
                name="nombre"
                value={nombreCompleto}
                disabled
              />

            </div>


            <div className="col-md-6 mb-3">

              <FormInput
                label="Correo electrónico"
                name="email"
                type="email"
                value={correo}
                disabled
              />

            </div>


            <div className="col-md-6 mb-3">

              <FormInput
                label="RUT"
                name="rut"
                value={rut}
                disabled
              />

            </div>


            <div className="col-md-6 mb-3">

              <FormInput
                label="Fecha de nacimiento"
                name="fechaNacimiento"
                type="date"
                value={fechaNacimiento}
                disabled
              />

            </div>

          </div>


          <h5 className="cliente-subtitulo mt-4">
            Datos de facturación y envío
          </h5>


          <div className="mb-3">

            <FormInput
              label="Dirección"
              name="direccion"
              value={direccion}
              disabled
            />

          </div>


          {cargando && (

            <p className="text-muted">
              Cargando información de ubicación...
            </p>

          )}


          {errorUbicaciones && (

            <div className="alert alert-warning">

              No fue posible obtener la información
              de regiones y comunas.

            </div>

          )}


          {!cargando &&
            !errorUbicaciones &&
            !comunaCliente && (

              <div className="alert alert-warning">
                No se encontró la comuna registrada.
              </div>

          )}


          <div className="row">

            <div className="col-md-6 mb-3">

              <FormInput
                label="Región"
                name="region"
                value={region}
                disabled
              />

            </div>


            <div className="col-md-6 mb-3">

              <FormInput
                label="Comuna"
                name="comuna"
                value={comuna}
                disabled
              />

            </div>

          </div>

        </fieldset>


        <div className="cliente-acciones">

          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/')}
          >
            Volver al inicio
          </Button>

        </div>


        {/* Historial local de compras del cliente */}

        <section className="cliente-compras">

          <h5 className="cliente-subtitulo">
            Mis compras
          </h5>


          <p className="text-muted small">

            Historial de compras simuladas almacenadas
            en este navegador.

          </p>


          {compras.length === 0 ? (

            <p className="cliente-compras-vacio">
              Todavía no tienes compras registradas
              en este navegador.
            </p>

          ) : (

            compras.map((compra) => (

              <article
                className="cliente-compra"
                key={compra.id}
              >

                <div className="cliente-compra-encabezado">

                  <div>

                    <strong>
                      Comprobante: {compra.id}
                    </strong>

                    <p className="mb-1">
                      Fecha: {compra.fecha}
                    </p>

                  </div>


                  <span className="cliente-compra-estado">
                    {compra.estado || 'Recibido'}
                  </span>

                </div>


                <ul className="cliente-compra-productos">

                  {compra.items.map((item, indice) => (

                    <li key={`${compra.id}-${item.id}-${indice}`}>

                      {item.nombre} × {item.cantidad}

                    </li>

                  ))}

                </ul>


                <div className="cliente-compra-total">

                  Total: {new Intl.NumberFormat('es-CL', {
                    style: 'currency',
                    currency: 'CLP',
                    maximumFractionDigits: 0
                  }).format(compra.total)}

                </div>

              </article>

            ))

          )}

        </section>

      </section>

    </div>
  );
};

export default Cliente;
