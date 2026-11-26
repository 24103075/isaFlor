
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useUbicaciones } from '../hooks/useUbicaciones';
import { registrarCliente } from '../services/authService';
import { validarRut, normalizarRut } from '../utils/validaciones';

import FormInput from '../components/molecules/FormInput';
import Button from '../components/atoms/Button';

import '../styles/pages/Registro.css';

const Registro = () => {

  // Datos del formulario
  const [formData, setFormData] = useState({
    run: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
    fechaNacimiento: '',
    direccion: '',
    idRegion: '',
    idComuna: '',
    password: '',
    confirmPassword: ''
  });

  // Estados de la aplicación
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [registrando, setRegistrando] = useState(false);

  // Obtener ubicaciones mediante el Hook compartido
  const {
    regiones,
    obtenerComunasPorRegion,
    cargando: cargandoComunas,
    error: errorComunas
  } = useUbicaciones();

  const comunasFiltradas = obtenerComunasPorRegion(formData.idRegion);

  // Actualizar los campos del formulario
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData(anterior => ({
      ...anterior,
      [name]: value,

      // Reiniciar la comuna cuando cambia la región
      ...(name === 'idRegion' ? { idComuna: '' } : {})
    }));

    setError('');
  };

  // Enviar formulario al backend
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (registrando || exito) return;

    setError('');

    // Validar campos obligatorios
    if (
      !formData.run.trim() ||
      !formData.nombre.trim() ||
      !formData.apellidoPaterno.trim() ||
      !formData.correo.trim() ||
      !formData.fechaNacimiento ||
      !formData.direccion.trim() ||
      !formData.idRegion ||
      !formData.idComuna ||
      !formData.password
    ) {
      setError('Completa todos los campos obligatorios.');
      return;
    }

    // Validar disponibilidad y relación de las ubicaciones
    if (cargandoComunas || errorComunas) {
      setError('No fue posible verificar las ubicaciones.');
      return;
    }

    if (!regiones.some(region =>
      String(region.idRegion) === formData.idRegion
    )) {
      setError('Selecciona una región válida.');
      return;
    }

    if (!comunasFiltradas.some(comuna =>
      String(comuna.idComuna) === formData.idComuna
    )) {
      setError('Selecciona una comuna válida.');
      return;
    }

    // Validar RUN chileno
    if (!validarRut(formData.run)) {
      setError('El RUN ingresado no es válido.');
      return;
    }

    // Validar contraseña
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (new TextEncoder().encode(formData.password).length > 72) {
      setError('La contraseña supera la longitud permitida.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    // Validar fecha de nacimiento
    const hoy = new Date();
    const fechaNacimiento = new Date(
      formData.fechaNacimiento + 'T00:00:00'
    );

    hoy.setHours(0, 0, 0, 0);

    if (Number.isNaN(fechaNacimiento.getTime()) || fechaNacimiento >= hoy) {
      setError('Ingresa una fecha de nacimiento válida.');
      return;
    }

    // Construir el objeto requerido por RegistroUsuarioDTO
    const datosCliente = {
      run: normalizarRut(formData.run),
      nombre: formData.nombre.trim(),
      apellidoPaterno: formData.apellidoPaterno.trim(),
      apellidoMaterno: formData.apellidoMaterno.trim(),
      correo: formData.correo.trim().toLowerCase(),
      password: formData.password,
      fechaNacimiento: formData.fechaNacimiento,
      direccion: formData.direccion.trim(),
      idComuna: Number(formData.idComuna)
    };

    try {

      setRegistrando(true);

      await registrarCliente(datosCliente);

      setExito('Tu cuenta ha sido creada correctamente.');

      // Limpiar las contraseñas después del registro
      setFormData(anterior => ({
        ...anterior,
        password: '',
        confirmPassword: ''
      }));

    } catch (err) {

      const estado = err.response?.status;

      if (estado === 409) {
        setError('El RUN o correo ya se encuentra registrado.');

      } else if (estado === 400) {
        setError('Revisa los datos ingresados en el formulario.');

      } else if (estado === 403) {
        setError('El servidor ha denegado la solicitud.');

      } else if (!err.response) {
        setError('No fue posible conectar con el servidor.');

      } else {
        setError('No fue posible completar el registro.');
      }

    } finally {
      setRegistrando(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-7">

          <div className="card shadow-sm border-0 rounded-4 overflow-hidden">

            <div className="registro-header">
              <h3 className="registro-titulo">
                Crear Cuenta
              </h3>

              <p className="registro-descripcion">
                Regístrate para comprar en IsaFlor
              </p>
            </div>

            <div className="card-body p-4">

              {error && (
                <div className="alert alert-danger py-2 small">
                  {error}
                </div>
              )}

              {errorComunas && (
                <div className="alert alert-warning py-2 small">
                  {errorComunas}
                </div>
              )}

              {exito && (
                <div className="alert alert-success py-2 small">
                  {exito}
                </div>
              )}

              {!exito && (
                <form onSubmit={handleSubmit}>

                  <fieldset disabled={registrando}>

                    <div className="row g-3 mb-3">

                      <div className="col-12 col-md-6">
                        <FormInput
                          label="RUN"
                          name="run"
                          placeholder="Ej: 12.345.678-5"
                          value={formData.run}
                          onChange={handleChange}
                          required
                        />

                        <small className="text-muted">
                          Puedes ingresar tu RUN con o sin puntos y guion.
                        </small>
                      </div>

                      <div className="col-12 col-md-6">
                        <FormInput
                          label="Nombre"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-12 col-md-6">
                        <FormInput
                          label="Apellido paterno"
                          name="apellidoPaterno"
                          value={formData.apellidoPaterno}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-12 col-md-6">
                        <FormInput
                          label="Apellido materno"
                          name="apellidoMaterno"
                          value={formData.apellidoMaterno}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-12 col-md-6">
                        <FormInput
                          label="Correo electrónico"
                          name="correo"
                          type="email"
                          placeholder="correo@ejemplo.com"
                          value={formData.correo}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-12 col-md-6">
                        <FormInput
                          label="Fecha de nacimiento"
                          name="fechaNacimiento"
                          type="date"
                          value={formData.fechaNacimiento}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-12 col-md-6">
                        <FormInput
                          label="Región"
                          name="idRegion"
                          type="select"
                          value={formData.idRegion}
                          onChange={handleChange}
                          disabled={cargandoComunas || !!errorComunas}
                          options={[
                            {
                              value: '',
                              label: cargandoComunas
                                ? 'Cargando regiones...'
                                : 'Selecciona una región'
                            },
                            ...regiones.map(region => ({
                              value: String(region.idRegion),
                              label: region.nombreRegion
                            }))
                          ]}
                          required
                        />
                      </div>

                      <div className="col-12 col-md-6">
                        <FormInput
                          label="Comuna"
                          name="idComuna"
                          type="select"
                          value={formData.idComuna}
                          onChange={handleChange}
                          disabled={!formData.idRegion || cargandoComunas || !!errorComunas}
                          options={[
                            {
                              value: '',
                              label: 'Selecciona una comuna'
                            },
                            ...comunasFiltradas.map(comuna => ({
                              value: String(comuna.idComuna),
                              label: comuna.nombreComuna
                            }))
                          ]}
                          required
                        />
                      </div>

                      <div className="col-12">
                        <FormInput
                          label="Dirección"
                          name="direccion"
                          placeholder="Calle, número y departamento"
                          value={formData.direccion}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-12 col-md-6">
                        <FormInput
                          label="Contraseña"
                          name="password"
                          type="password"
                          placeholder="Mínimo 8 caracteres"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-12 col-md-6">
                        <FormInput
                          label="Confirmar contraseña"
                          name="confirmPassword"
                          type="password"
                          placeholder="Repite tu contraseña"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>

                    </div>

                    <Button
                      type="submit"
                      variant="success"
                      className="w-100 py-2 fw-bold"
                      disabled={
                        registrando ||
                        cargandoComunas ||
                        !!errorComunas
                      }
                    >
                      {registrando
                        ? 'Registrando...'
                        : 'Registrarme'}
                    </Button>

                  </fieldset>
                </form>
              )}

              <hr className="my-4" />

              <p className="text-center small mb-0">
                {exito
                  ? 'Tu cuenta está lista. '
                  : '¿Ya tienes cuenta? '}

                <Link to="/login" className="registro-enlace">
                  Inicia Sesión aquí
                </Link>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;
