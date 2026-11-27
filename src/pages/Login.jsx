
// src/pages/Login.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import FormInput from '../components/molecules/FormInput';
import Button from '../components/atoms/Button';

import { validarEmail } from '../utils/validaciones';
import { iniciarSesion } from '../services/authService';
import { guardarSesion } from '../services/sessionService';

import '../styles/pages/Login.css';


const Login = ({ setUsuario }) => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errores, setErrores] = useState({});
  const [errorLogin, setErrorLogin] = useState('');
  const [cargando, setCargando] = useState(false);


  // Actualizar los campos del formulario
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData(anterior => ({
      ...anterior,
      [name]: value
    }));

    setErrores(anterior => ({
      ...anterior,
      [name]: ''
    }));

    setErrorLogin('');
  };


  // Iniciar sesion mediante JWT
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (cargando) return;

    setErrorLogin('');

    const nuevosErrores = {};

    const correo = formData.email.trim().toLowerCase();


    // Validar correo
    if (!validarEmail(correo)) {

      nuevosErrores.email = 'Ingrese un correo válido.';
    }


    // Validar contraseña
    if (!formData.password) {

      nuevosErrores.password = 'La contraseña es requerida.';
    }

    setErrores(nuevosErrores);


    // Detener el proceso si existen errores
    if (Object.keys(nuevosErrores).length > 0) {

      return;
    }


    setCargando(true);

    try {

      // Enviar credenciales al backend
      const respuesta = await iniciarSesion(
        correo,
        formData.password
      );


      // Guardar token y datos de la sesion
      const sesion = guardarSesion(respuesta);


      // Actualizar el usuario en App.jsx
      setUsuario(sesion);


      // Limpiar la contraseña del formulario
      setFormData(anterior => ({
        ...anterior,
        password: ''
      }));


      // Redirigir segun el rol del usuario
      if (sesion.rol === 'ADMINISTRADOR') {

        navigate('/admin', { replace: true });

      } else {

        navigate('/', { replace: true });
      }


    } catch (error) {

      const estado = error.response?.status;


      if (estado === 401) {

        setErrorLogin(
          'Correo o contraseña incorrectos. Intente nuevamente.'
        );

      } else if (estado === 400) {

        setErrorLogin(
          'Los datos ingresados no son válidos.'
        );

      } else if (estado === 403) {

        setErrorLogin(
          'No tiene autorización para acceder.'
        );

      } else if (error.code === 'ECONNABORTED') {

        setErrorLogin(
          'El servidor está tardando en responder. Intente nuevamente.'
        );

      } else if (error.request && !error.response) {

        setErrorLogin(
          'No se pudo conectar con el servidor. Verifique su conexión.'
        );

      } else {

        setErrorLogin(
          'Ocurrió un error al iniciar sesión. Intente nuevamente.'
        );
      }

    } finally {

      setCargando(false);
    }
  };


  return (

    <div className="row justify-content-center login-contenedor">

      <div className="col-md-5">

        <div className="card login-tarjeta">

          <h3 className="login-titulo">
            Iniciar Sesión
          </h3>


          {errorLogin && (

            <div
              className="alert alert-danger login-error"
              role="alert"
            >
              {errorLogin}
            </div>

          )}


          <form onSubmit={handleSubmit} noValidate>

            <fieldset disabled={cargando}>

              <FormInput
                label="Correo Electrónico"
                type="email"
                name="email"
                placeholder="ejemplo@correo.cl"
                value={formData.email}
                onChange={handleChange}
                error={errores.email}
                required
              />

              <FormInput
                label="Contraseña"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errores.password}
                required
              />

              <Button
                type="submit"
                variant="success"
                className="w-100 py-2 fw-bold mt-3"
                disabled={cargando}
              >

                {cargando
                  ? 'Iniciando sesión...'
                  : 'Ingresar'}

              </Button>

            </fieldset>

          </form>


          <div className="text-center mt-3">

            <small>

              ¿No tienes una cuenta?{' '}

              <Link
                to="/registro"
                className="fw-bold"
              >
                Regístrate aquí
              </Link>

            </small>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;
