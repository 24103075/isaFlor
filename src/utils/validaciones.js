

// Validación de RUT chileno
// Valida el RUN mediante el algoritmo Módulo 11
export const validarRut = (rut) => {

  // Primero normalizamos el RUN
  const rutNormalizado = normalizarRut(rut);

  if (!rutNormalizado) return false;

  const [cuerpo, dv] = rutNormalizado.split('-');

  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {

    suma += Number(cuerpo[i]) * multiplicador;

    multiplicador = multiplicador === 7
      ? 2
      : multiplicador + 1;
  }

  const resultado = 11 - (suma % 11);

  const dvCalculado =
    resultado === 11 ? '0' :
    resultado === 10 ? 'K' :
    String(resultado);

  return dv === dvCalculado;
};

// Estandariza el formato del RUN chileno
export const normalizarRut = (rut) => {

  if (!rut || typeof rut !== 'string') return '';

  const valor = rut
    .replace(/[.\s-]/g, '')
    .toUpperCase();

  if (!/^\d{7,8}[\dK]$/.test(valor)) return '';

  const cuerpo = valor.slice(0, -1);
  const dv = valor.slice(-1);

  return `${cuerpo}-${dv}`;
};


// Valida si un correo electrónico tiene un formato válido
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};


// Valida si una contraseña cumple con los criterios de seguridad
export const validarPassword = (password) => {
  // Al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};
// Valida si un nombre de usuario es válido (solo letras y espacios, mínimo 3 caracteres)
export const validarNombreUsuario = (nombre) => {
  const regex = /^[A-Za-z\s]{3,}$/;
  return regex.test(nombre);
};
export const formatearPrecio = (precio) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(precio);
};

// Obtener lista de usuarios dinámicos desde localStorage
export const obtenerUsuariosRegistrados = () => {
  const usuarios = localStorage.getItem('isaflor_usuarios');
  return usuarios ? JSON.parse(usuarios) : [];
};

// Registrar un nuevo usuario dinámico
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

// Login de usuario (Soporta demo y cuentas registradas nuevas)
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

// Valida si un producto está agotado
 
export const esProductoAgotado = (producto) => {
  return !producto || producto.stock <= 0;
};

// Valida si un producto tiene stock crítico
export const tieneStockCritico = (producto) => {
  if (!producto) return false;
  return Number(producto.stock) <= Number(producto.stockCritico || 3);
};

// Obtiene los productos que tienen stock crítico
export const obtenerProductosStockBajo = (productos = []) => {
  return productos.filter(producto => tieneStockCritico(producto));
};

//Esta modificación conserva el funcionamiento 
// actual: devuelve un mensaje cuando encuentra un error y null cuando los datos son válidos.
export const validarFormularioProducto = (form) => {
  if (!form.nombre || form.nombre.trim() === '') {
    return 'El nombre es obligatorio.';
  }

  if (!form.categoria || form.categoria.trim() === '') {
    return 'Debes seleccionar una categoría.';
  }

  if (
    form.precio === '' ||
    !Number.isFinite(Number(form.precio)) ||
    Number(form.precio) <= 0
  ) {
    return 'El precio debe ser un número mayor a 0.';
  }

  if (
    form.stock === '' ||
    !Number.isInteger(Number(form.stock)) ||
    Number(form.stock) < 0
  ) {
    return 'El stock debe ser un número entero igual o mayor a 0.';
  }

  return null;
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
 
 // Actualiza la cantidad de un producto sin superar su stock
// ni permitir cantidades inferiores a 1.
export const actualizarCantidadItem = (carrito, id, delta) => {
  return carrito.map(item => {
    if (item.id === id) {
      const nuevaCantidad = Number(item.cantidad) + delta;
      const stockDisponible = Number(item.stock);

      if (nuevaCantidad < 1 || nuevaCantidad > stockDisponible) {
        return item;
      }

      return { ...item, cantidad: nuevaCantidad };
    }

    return item;
  });
};

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
