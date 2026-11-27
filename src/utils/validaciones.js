
// ======================================================
// VALIDACIONES DE USUARIOS
// ======================================================

// Valida el RUN chileno mediante el algoritmo Módulo 11
export const validarRut = (rut) => {

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


// Valida el formato del correo electrónico
export const validarEmail = (email) => {

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(email);
};


// Valida los criterios de seguridad de una contraseña
export const validarPassword = (password) => {

  // Mínimo 8 caracteres, una mayúscula,
  // una minúscula y un número
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  return regex.test(password);
};


// Valida el nombre de usuario
export const validarNombreUsuario = (nombre) => {

  const regex = /^[A-Za-z\s]{3,}$/;

  return regex.test(nombre);
};


// ======================================================
// FORMATO DE PRECIOS
// ======================================================

// Formatea los precios en pesos chilenos
export const formatearPrecio = (precio) => {

  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(precio);
};


// ======================================================
// AUTENTICACIÓN SIMULADA
// Pendiente de reemplazar por autenticación real con JWT
// ======================================================

// Obtener usuarios registrados desde localStorage
export const obtenerUsuariosRegistrados = () => {

  const usuarios = localStorage.getItem('isaflor_usuarios');

  return usuarios ? JSON.parse(usuarios) : [];
};


// Registrar un usuario de manera local
export const registrarNuevoUsuario = (datosUsuario) => {

  const usuariosExistentes = obtenerUsuariosRegistrados();

  // Verificar si el correo ya está registrado
  const existe = usuariosExistentes.some(
    (u) =>
      u.email.toLowerCase() ===
      datosUsuario.email.toLowerCase()
  );

  if (
    existe ||
    datosUsuario.email === 'admin@isaflor.cl' ||
    datosUsuario.email === 'cliente@isaflor.cl'
  ) {

    return {
      exito: false,
      mensaje: 'El correo electrónico ya se encuentra registrado.'
    };
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

  localStorage.setItem(
    'isaflor_usuarios',
    JSON.stringify(usuariosExistentes)
  );

  return {
    exito: true,
    mensaje: '¡Cuenta creada con éxito! Redirigiendo...'
  };
};


// Inicio de sesión simulado
export const loginUsuario = (email, password) => {

  // Cuenta de administrador de demostración
  if (
    email === 'admin@isaflor.cl' &&
    password === 'admin123'
  ) {

    return {
      nombre: 'Administrador IsaFlor',
      email,
      rol: 'ADMIN',
      rut: '11111111-1'
    };
  }

  // Cuenta de cliente de demostración
  if (
    email === 'cliente@isaflor.cl' &&
    password === '123456'
  ) {

    return {
      nombre: 'Cliente Demo',
      email,
      rol: 'CLIENTE',
      rut: '22222222-2'
    };
  }

  // Buscar usuarios registrados localmente
  const usuariosRegistrados = obtenerUsuariosRegistrados();

  const usuarioEncontrado = usuariosRegistrados.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
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


// ======================================================
// VALIDACIONES DE STOCK
// ======================================================

// Valida si un producto está agotado
// o no tiene información de stock válida
export const esProductoAgotado = (producto) => {

  if (!producto || producto.stock == null) {
    return true;
  }

  const stock = Number(producto.stock);

  return !Number.isInteger(stock) || stock <= 0;
};


// Valida si un producto tiene stock crítico
export const tieneStockCritico = (producto) => {

  if (!producto || producto.stock == null) {
    return false;
  }

  const stock = Number(producto.stock);

  // Utilizar el límite configurado para cada producto
  // Si no existe, utilizar 3 como valor predeterminado
  const stockCritico = Number(
    producto.stockCritico ?? 3
  );

  // Verificar que los valores sean válidos
  if (
    !Number.isInteger(stock) ||
    !Number.isInteger(stockCritico) ||
    stock < 0 ||
    stockCritico < 0
  ) {
    return false;
  }

  return stock <= stockCritico;
};


// Obtiene los productos que tienen stock bajo o agotado
export const obtenerProductosStockBajo = (productos = []) => {

  return productos.filter(
    producto => tieneStockCritico(producto)
  );
};


// ======================================================
// VALIDACIONES DEL FORMULARIO DE PRODUCTOS
// ======================================================

// Devuelve un mensaje si encuentra un error
// y null cuando los datos son válidos
export const validarFormularioProducto = (form) => {

  // Validar nombre
  if (!form.nombre || form.nombre.trim() === '') {

    return 'El nombre es obligatorio.';
  }

  // Validar categoría
  if (!form.categoria || form.categoria.trim() === '') {

    return 'Debes seleccionar una categoría.';
  }

  // Validar precio
  if (
    form.precio === '' ||
    !Number.isFinite(Number(form.precio)) ||
    Number(form.precio) <= 0
  ) {

    return 'El precio debe ser un número mayor a 0.';
  }

  // Validar stock
  if (
    form.stock === '' ||
    !Number.isInteger(Number(form.stock)) ||
    Number(form.stock) < 0
  ) {

    return 'El stock debe ser un número entero igual o mayor a 0.';
  }

  return null;
};


// ======================================================
// CONFIGURACIÓN DEL CARRITO
// ======================================================

export const CONFIG_CARRITO = {

  COSTO_ENVIO: 0,

  TEXTO_ENVIO_GRATIS: 'Gratis',

  MENSAJE_CARRITO_VACIO: 'Tu carrito está vacío',

  SUBTITULO_CARRITO_VACIO:
    'Aún no añades productos a tu carrito'

};


// ======================================================
// FUNCIONES DEL CARRITO DE COMPRAS
// ======================================================

// Calcula el total de los productos del carrito
export const calcularTotalCarrito = (carrito = []) => {

  return carrito.reduce(
    (acc, item) =>
      acc + (Number(item.precio) * Number(item.cantidad)),
    0
  );
};


// Actualiza la cantidad de un producto sin superar su stock
// ni permitir cantidades inferiores a 1
export const actualizarCantidadItem = (carrito, id, delta) => {

  return carrito.map(item => {

    // Conservar los productos que no se están modificando
    if (item.id !== id) {
      return item;
    }

    // Obtener los valores actuales
    const cantidadActual = Number(item.cantidad);
    const stockDisponible = Number(item.stock);
    const cambio = Number(delta);

    const nuevaCantidad = cantidadActual + cambio;

    // Validar que los valores sean correctos
    if (
      item.stock == null ||
      item.cantidad == null ||
      delta == null ||
      !Number.isInteger(cantidadActual) ||
      !Number.isInteger(stockDisponible) ||
      !Number.isInteger(cambio) ||
      stockDisponible < 0
    ) {
      return item;
    }

    // Impedir cantidades inferiores a 1
    // o superiores al stock disponible
    if (
      nuevaCantidad < 1 ||
      nuevaCantidad > stockDisponible
    ) {
      return item;
    }

    // Actualizar la cantidad del producto
    return {
      ...item,
      cantidad: nuevaCantidad
    };

  });
};


// Elimina un producto del carrito mediante su ID
export const eliminarItemCarrito = (carrito, id) => {

  return carrito.filter(item => item.id !== id);
};


// ======================================================
// ADMINISTRACIÓN SIMULADA DE PRODUCTOS
// Pendiente de integración con la API REST
// ======================================================

// Valores iniciales del formulario de productos
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


// Actualiza o crea un producto en la lista local
export const procesarGuardarProducto = (
  productos,
  form,
  editando
) => {

  // Actualizar producto existente
  if (editando) {

    return productos.map(p =>

      p.id === form.id

        ? {
            ...form,
            precio: Number(form.precio),
            stock: Number(form.stock)
          }

        : p

    );
  }

  // Crear un producto nuevo
  const nuevoProducto = {

    ...form,

    id: Date.now(),

    precio: Number(form.precio),

    stock: Number(form.stock)

  };

  return [...productos, nuevoProducto];
};


// Elimina un producto de la lista local mediante su ID
export const eliminarProductoPorId = (productos, id) => {

  return productos.filter(p => p.id !== id);
};
