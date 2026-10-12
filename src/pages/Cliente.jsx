
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/molecules/FormInput';
import Button from '../components/atoms/Button';
import { Cliente as ModeloCliente } from '../data/Cliente';
import { obtenerUsuariosRegistrados } from '../utils/validaciones';
import { regionesYComunas } from '../data/regionesComunas';
import { obtenerComprasCliente } from '../data/datosIsaflor';
import '../styles/pages/Cliente.css';

const Cliente = ({ usuario }) => {
  const navigate = useNavigate();

  const [datos, setDatos] = useState(new ModeloCliente());
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    if (!usuario || usuario.rol !== 'CLIENTE') {
      navigate('/login', { replace: true });
      return;
    }

    const usuarios = obtenerUsuariosRegistrados();

    const guardado = usuarios.find(
      (u) => u.email.toLowerCase() === usuario.email.toLowerCase()
    );

    const perfil = guardado?.perfil || {};

    setDatos(
      new ModeloCliente({
        id: guardado?.id ?? usuario.id ?? null,
        nombre: perfil.nombre ?? guardado?.nombre ?? usuario.nombre ?? '',
        email: guardado?.email ?? usuario.email ?? '',
        rut: perfil.rut ?? usuario.rut ?? '',
        telefono: perfil.telefono ?? '',
        direccion: perfil.direccion ?? '',
        region: perfil.region ?? '',
        comuna: perfil.comuna ?? ''
      })
    );

    setCompras(obtenerComprasCliente(usuario.email));
  }, [usuario, navigate]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setDatos((anterior) => {
      const actualizado = new ModeloCliente(anterior.obtenerDatos());
      actualizado[name] = value;

      if (name === 'region') {
        actualizado.comuna = '';
      }

      return actualizado;
    });

    setMensaje('');
    setError('');
  };

  const guardarPerfil = (e) => {
    e.preventDefault();

    if (!datos.nombre.trim() || !datos.direccion.trim()) {
      setError('Completa tu nombre y dirección.');
      setMensaje('');
      return;
    }

    const usuarios = obtenerUsuariosRegistrados();

    const indice = usuarios.findIndex(
      (u) => u.email.toLowerCase() === usuario.email.toLowerCase()
    );

    if (indice === -1) {
      setError(
        'No se encontró una cuenta registrada. Si utilizas la cuenta demo, no puedes guardar cambios en este perfil.'
      );
      setMensaje('');
      return;
    }

    usuarios[indice] = {
      ...usuarios[indice],
      nombre: datos.nombre.trim(),
      perfil: {
        rut: datos.rut.trim(),
        telefono: datos.telefono.trim(),
        direccion: datos.direccion.trim(),
        region: datos.region,
        comuna: datos.comuna
      }
    };

    localStorage.setItem('isaflor_usuarios', JSON.stringify(usuarios));

    setMensaje('Tus datos se guardaron correctamente.');
    setError('');
  };

  const regiones = Object.keys(regionesYComunas || {});
  const comunas = datos.region
    ? regionesYComunas[datos.region] || []
    : [];

  return (
    <div className="container cliente-contenedor">
      <section className="cliente-tarjeta">

        <header className="cliente-encabezado">
          <h2 className="cliente-titulo">Mi perfil</h2>
          <p className="cliente-descripcion">
            Mantén actualizados tus datos para facilitar tus compras en IsaFlor.
          </p>
        </header>

        {mensaje && (
          <div className="alert alert-success" role="status">
            {mensaje}
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={guardarPerfil}>
          <h5 className="cliente-subtitulo">Datos personales</h5>

          <div className="row">
            <div className="col-md-6 mb-3">
              <FormInput
                label="Nombre completo"
                name="nombre"
                value={datos.nombre}
                onChange={manejarCambio}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <FormInput
                label="Correo electrónico"
                name="email"
                type="email"
                value={datos.email}
                disabled
              />
            </div>

            <div className="col-md-6 mb-3">
              <FormInput
                label="RUT"
                name="rut"
                value={datos.rut}
                onChange={manejarCambio}
                placeholder="Ej. 12345678-5"
              />
            </div>

            <div className="col-md-6 mb-3">
              <FormInput
                label="Teléfono"
                name="telefono"
                type="tel"
                value={datos.telefono}
                onChange={manejarCambio}
                placeholder="Ej. +56 9 1234 5678"
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
              value={datos.direccion}
              onChange={manejarCambio}
              placeholder="Calle y número"
              required
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <FormInput
                label="Región"
                name="region"
                type="select"
                value={datos.region}
                onChange={manejarCambio}
                options={regiones.map((region) => ({
                  value: region,
                  label: region
                }))}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <FormInput
                label="Comuna"
                name="comuna"
                type="select"
                value={datos.comuna}
                onChange={manejarCambio}
                options={comunas.map((comuna) => ({
                  value: comuna,
                  label: comuna
                }))}
                disabled={!datos.region}
                required
              />
            </div>
          </div>

          <div className="cliente-acciones">
            <Button type="submit" variant="isaflor">
              Guardar mis datos
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/')}
            >
              Volver al inicio
            </Button>
          </div>
        </form>

        {/* Historial de compras del cliente */}
        <section className="cliente-compras">
          <h5 className="cliente-subtitulo">Mis compras</h5>

          {compras.length === 0 ? (
            <p className="cliente-compras-vacio">
              Todavía no tienes compras registradas.
            </p>
          ) : (
            compras.map((compra) => (
              <article className="cliente-compra" key={compra.id}>
                <div className="cliente-compra-encabezado">
                  <div>
                    <strong>Boleta: {compra.id}</strong>
                    <p className="mb-1">Fecha: {compra.fecha}</p>
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
