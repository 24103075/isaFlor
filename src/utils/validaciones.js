
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

// Esta es la función que te faltaba exportar:
export const loginUsuario = (email, password) => {
  if (email === 'admin@isaflor.cl' && password === 'admin123') {
    return { nombre: 'Administrador IsaFlor', email, rol: 'ADMIN', rut: '11111111-1' };
  }
  if (email === 'cliente@isaflor.cl' && password === '123456') {
    return { nombre: 'Cliente Demo', email, rol: 'CLIENTE', rut: '22222222-2' };
  }
  return null;
};