/* Este archivo se creo para que la pagina valide la 
informacion que ingresa el cliente y le de formato correcto.*/

// src/utils/validaciones.js

export const validarRut = (rut) => {
  if (!rut || typeof rut !== 'string') return false;
  const valor = rut.replace(/\./g, '').replace('-', '').trim().toUpperCase();
  if (valor.length < 8) return false;
  
  const cuerpo = valor.slice(0, -1);
  const dv = valor.slice(-1);

  if (!/^\d+$/.test(cuerpo)) return false;

  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplicador;
    multiplicador = multiplicador < 7 ? multiplicador + 1 : 2;
  }

  const dvesperado = 11 - (suma % 11);
  let dvCalculado = dvesperado === 11 ? '0' : dvesperado === 10 ? 'K' : dvesperado.toString();

  return dv === dvCalculado;
};

export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const formatearPrecio = (precio) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(precio);
};

// 1. Obtener lista de usuarios dinámicos desde localStorage
export const obtenerUsuariosRegistrados = () => {
  const usuarios = localStorage.getItem('isaflor_usuarios');
  return usuarios ? JSON.parse(usuarios) : [];
};

// 2. Registrar un nuevo usuario dinámico
export const registrarNuevoUsuario = (datosUsuario) => {
  const usuariosExistentes = obtenerUsuariosRegistrados();

  // Validar si el correo ya está registrado en la lista
  const existe = usuariosExistentes.some(
    (u) => u.email.toLowerCase() === datosUsuario.email.toLowerCase()
  );

  if (existe || datosUsuario.email === 'admin@isaflor.cl' || datosUsuario.email === 'cliente@isaflor.cl') {
    return { exito: false, mensaje: 'El correo electrónico ya se encuentra registrado.' };
  }

  const nuevoUsuario = {
    id: Date.now(),
    nombre: datosUsuario.nombre.trim(),
    email: datosUsuario.email.trim().toLowerCase(),
    password: datosUsuario.password,
    rol: 'CLIENTE',
    fechaRegistro: new Date().toISOString()
  };

  usuariosExistentes.push(nuevoUsuario);
  localStorage.setItem('isaflor_usuarios', JSON.stringify(usuariosExistentes));

  return { exito: true, mensaje: '¡Cuenta creada con éxito! Redirigiendo...' };
};

// 3. Login de usuario (Soporta demo y cuentas registradas nuevas)
export const loginUsuario = (email, password) => {
  // Cuentas fijas / demo
  if (email === 'admin@isaflor.cl' && password === 'admin123') {
    return { nombre: 'Administrador IsaFlor', email, rol: 'ADMIN', rut: '11111111-1' };
  }
  if (email === 'cliente@isaflor.cl' && password === '123456') {
    return { nombre: 'Cliente Demo', email, rol: 'CLIENTE', rut: '22222222-2' };
  }

  // Buscar en usuarios dinámicos guardados al registrarse
  const usuariosRegistrados = obtenerUsuariosRegistrados();
  const usuarioEncontrado = usuariosRegistrados.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (usuarioEncontrado) {
    return {
      nombre: usuarioEncontrado.nombre,
      email: usuarioEncontrado.email,
      rol: usuarioEncontrado.rol
    };
  }

  return null;
};