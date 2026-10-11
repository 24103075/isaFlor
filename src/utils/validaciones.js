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

/**
 * Valida si un producto está agotado
 */
export const esProductoAgotado = (producto) => {
  return !producto || producto.stock <= 0;
};

// Valida si un producto tiene stock crítico
export const tieneStockCritico = (producto) => {
  if (!producto) return false;
  return Number(producto.stock) <= Number(producto.stockCritico || 3);
};

// Valida los datos del formulario de administración
export const validarFormularioProducto = (form) => {
  if (!form.nombre || form.nombre.trim() === '') return 'El nombre es obligatorio.';
  if (isNaN(form.precio) || Number(form.precio) <= 0) return 'El precio debe ser un número mayor a 0.';
  if (isNaN(form.stock) || Number(form.stock) < 0) return 'El stock no puede ser negativo.';
  return null; // Null significa que NO hay errores
};

export const CONFIG_CARRITO  = {
  COSTO_ENVIO:0,
  TEXTO_ENVIO_GRATIS:"Gratis",
  MENSAJE_CARRITO_VACIO: "Tu carrito esta vacio",
  SUBTITULO_CARRITO_VACIO:"Aun no añades productos a tu carrito",
}
 // Suma el precio por la cantidad de productos
 export const calcularTotalCarrito = (carrito = []) => {
  return carrito.reduce((acc, item) => acc + (Number(item.precio) * Number(item.cantidad)), 0);
 }
 
 //Aumenta o reduce la cantidad de productos respetando el limite
export const actualizarCantidadItem = (carrito,id,delta) =>{
  return carrito.map(item => {
    if(item.id === id){
      const nuevaCantidad = item.cantidad + delta;
      return nuevaCANTIDAD > 0 ? {...item, cantidad: nuevaCantidad} : item;
    }

    return item;
  });
}

//Elimina un producto por su id
export const eliminarItemCarrito = (carrito,id) => {
  return carrito.filter(item => item.id !== id);
}


//  Formulario de registro de producto
  export const REGISTRO_PRODUCTO = {
    id: null,
    nombre: '',
    categoria: 'Rosas',
    precio: '',
    stock: '',
    stockCritico: 3,
    descripcion: '',
    imagen: '',
    enOferta: false
  };

  // Actualiza o crea un producto en la lista
export const procesarGuardarProducto = (productos, form, editando) => {
  if (editando) {
    return productos.map(p => 
      p.id === form.id 
        ? { ...form, precio: Number(form.precio), stock: Number(form.stock) } 
        : p
    );
  }
  
  const nuevoProducto = {
    ...form,
    id: Date.now(),
    precio: Number(form.precio),
    stock: Number(form.stock)
  };
  return [...productos, nuevoProducto];
};

// Filtra la lista eliminando por ID
export const eliminarProductoPorId = (productos, id) => {
  return productos.filter(p => p.id !== id);
};
