// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FormInput from '../components/molecules/FormInput';
import { validarEmail, loginUsuario } from '../utils/validaciones';
import Button from '../components/atoms/Button';
import '../styles/pages/Login.css';

const Login = ({ setUsuario }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errores, setErrores] = useState({});
  const [errorLogin, setErrorLogin] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorLogin('');

    const nuevosErrores = {};

    if (!validarEmail(formData.email)) nuevosErrores.email = 'Ingrese un correo válido.';
    if (!formData.password) nuevosErrores.password = 'La contraseña es requerida.';

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    const usuarioValido = loginUsuario(formData.email, formData.password);
    if (usuarioValido) {
      localStorage.setItem('isaflor_sesion', JSON.stringify(usuarioValido));
      setUsuario(usuarioValido);
      navigate(usuarioValido.rol === 'ADMIN' ? '/admin' : '/');
    } else {
      setErrorLogin('Credenciales incorrectas. Intente nuevamente.');
    }
  };

  return (
    <div className="row justify-content-center login-contenedor">
      <div className="col-md-5">
        <div className="card login-tarjeta">
          <h3 className="login-titulo">Iniciar Sesión</h3>

          {errorLogin && (<div className="alert alert-danger login-error">{errorLogin}</div>)}

          <form onSubmit={handleSubmit} noValidate>
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
            <Button type="submit" variant="success" className="w-100 py-2 fw-bold mt-3" >
              Ingresar
            </Button>
          </form>

          <div className="text-center mt-3">
            <small className="login-demo">
              <strong>Admin Demo:</strong> admin@isaflor.cl / admin123
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;