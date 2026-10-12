// src/pages/Registro.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registrarNuevoUsuario } from '../utils/validaciones';
import FormInput from '../components/molecules/FormInput';
import Button from '../components/atoms/Button';
import '../styles/pages/Registro.css';

const Registro = ({ setUsuario }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    
    if (!formData.nombre.trim() || !formData.email.trim() || !formData.password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    // Registrar mediante el helper de validaciones
    const resultado = registrarNuevoUsuario({
      nombre: formData.nombre,
      email: formData.email,
      password: formData.password
    });

    if (resultado.exito) {
      setExito(resultado.mensaje);
      
      const datosSesion = { nombre: formData.nombre, email: formData.email, rol: 'CLIENTE' };
      localStorage.setItem('isaflor_sesion', JSON.stringify(datosSesion));
      if (setUsuario) setUsuario(datosSesion);

      setTimeout(() => {
        navigate('/'); // Redirige al inicio tras crear la cuenta
      }, 1500);
    } else {
      setError(resultado.mensaje);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-7">
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div className="registro-header">
              <h3 className="registro-titulo">Crear Cuenta</h3>
              <p className="registro-descripcion">
                Regístrate para comprar en IsaFlor
              </p>
            </div>

            <div className="card-body p-4">
              {error && <div className="alert alert-danger py-2 small">{error}</div>}
              {exito && <div className="alert alert-success py-2 small">{exito}</div>}

              <form onSubmit={handleSubmit}>
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <FormInput
                      label="Nombre Completo"
                      name="nombre"
                      type="text"
                      placeholder="Ej: María González"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <FormInput
                      label="Correo Electrónico"
                      name="email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-6">
                    <FormInput
                      label="Contraseña"
                      name="password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <FormInput
                      label="Confirmar Contraseña"
                      name="confirmPassword"
                      type="password"
                      placeholder="Repite tu contraseña"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" variant="success" className="w-100 py-2 fw-bold">
                  Registrarme
                </Button>
              </form>
              <hr className="my-4" />
              <p className="text-center small mb-0">
                ¿Ya tienes cuenta?{' '}
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