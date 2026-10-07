// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FormInput from '../components/molecules/FormInput';
import { validarEmail, loginUsuario } from '../utils/validaciones';

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
    <div className="row justify-content-center my-4">
      <div className="col-md-5">
        <div className="card shadow-sm border-0 p-4">
          <h3 className="text-center text-success mb-4">Iniciar Sesión</h3>

          {errorLogin && <div className="alert alert-danger">{errorLogin}</div>}

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
            <button type="submit" className="btn btn-success w-100 py-2 fw-bold mt-3">
              Ingresar
            </button>
          </form>

          <div className="text-center mt-3">
            <small className="text-muted d-block mb-2">
              <strong>Admin Demo:</strong> admin@isaflor.cl / admin123
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;