
// src/services/productoService.js

import api from './api';


// =========================================
// ADAPTAR PRODUCTOS DEL BACKEND AL FRONTEND
// =========================================

const adaptarProducto = (producto) => {

  // Obtener los precios del backend
  const precioOriginal = Number(producto.precioProducto);

  const precioOferta = producto.precioOferta != null
    ? Number(producto.precioOferta)
    : null;

  // Comprobar que la oferta sea válida
  const enOferta =
    producto.enOferta === true &&
    precioOferta !== null &&
    Number.isFinite(precioOferta) &&
    Number.isFinite(precioOriginal) &&
    precioOferta > 0 &&
    precioOferta < precioOriginal;

  // Determinar el precio final
  const precioFinal = enOferta
    ? precioOferta
    : precioOriginal;

  // Calcular porcentaje de descuento
  const porcentajeDescuento = enOferta
    ? Math.round(
        ((precioOriginal - precioOferta) / precioOriginal) * 100
      )
    : 0;

  // Calcular ahorro por unidad
  const ahorro = enOferta
    ? precioOriginal - precioOferta
    : 0;

  return {

    id: producto.idProducto,
    codigo: producto.codigoProducto,
    nombre: producto.nombreProducto,
    descripcion: producto.descripcion,

    // Información de precios y ofertas
    precio: precioFinal,
    precioOriginal: precioOriginal,
    precioOferta: enOferta ? precioOferta : null,
    enOferta: enOferta,
    porcentajeDescuento: porcentajeDescuento,
    ahorro: ahorro,

    // Información de inventario
    stock: producto.stockProducto,
    stockCritico: producto.stockCritico,

    // Información adicional
    peso: producto.pesoProducto,
    pesoVolumetrico: producto.pesoVolumetrico,
    idCategoria: producto.idCategoria,
    categoria: producto.nombreCategoria,

    // Integración de imágenes pendiente
    imagen: null

  };

};


// =========================================
// ADAPTAR DATOS DEL FRONTEND AL BACKEND
// =========================================

const adaptarProductoParaBackend = (producto) => {

  return {

    codigoProducto: producto.codigo.trim(),

    nombreProducto: producto.nombre.trim(),

    descripcion: producto.descripcion.trim(),

    // Enviar siempre el precio normal
    precioProducto: Number(producto.precioOriginal),

    stockProducto: Number(producto.stock),

    stockCritico: Number(producto.stockCritico),

    pesoProducto: Number(producto.peso),

    pesoVolumetrico: Number(producto.pesoVolumetrico),

    categoria: {
      idCategoria: Number(producto.idCategoria)
    }

  };

};


// =========================================
// OBTENER TODOS LOS PRODUCTOS
// =========================================

export const obtenerProductos = async () => {

  const respuesta = await api.get('/api/v1/productos');

  // Si no existen productos registrados
  if (respuesta.status === 204) {
    return [];
  }

  // Verificar formato de respuesta
  if (!Array.isArray(respuesta.data)) {

    throw new Error(
      'La respuesta de productos no es válida.'
    );

  }

  return respuesta.data.map(adaptarProducto);

};


// =========================================
// OBTENER PRODUCTO POR ID
// =========================================

export const obtenerProductoPorId = async (id) => {

  const respuesta = await api.get(
    `/api/v1/productos/${id}`
  );

  return adaptarProducto(respuesta.data);

};


// =========================================
// OBTENER PRODUCTOS EN OFERTA
// =========================================

export const obtenerProductosEnOferta = async () => {

  const productos = await obtenerProductos();

  return productos.filter(
    producto => producto.enOferta
  );

};


// =========================================
// CREAR PRODUCTO
// =========================================

export const crearProducto = async (producto) => {

  const datosProducto = {

    ...adaptarProductoParaBackend(producto),

    // Crear inicialmente sin oferta
    enOferta: false,
    precioOferta: null

  };

  const respuesta = await api.post(
    '/api/v1/productos',
    datosProducto
  );

  return adaptarProducto(respuesta.data);

};


// =========================================
// ACTUALIZAR PRODUCTO
// =========================================

export const actualizarProducto = async (id, producto) => {

  const datosProducto =
    adaptarProductoParaBackend(producto);

  const respuesta = await api.put(
    `/api/v1/productos/${id}`,
    datosProducto
  );

  return adaptarProducto(respuesta.data);

};


// =========================================
// ELIMINAR PRODUCTO
// =========================================

export const eliminarProducto = async (id) => {

  const respuesta = await api.delete(
    `/api/v1/productos/${id}`
  );

  return respuesta.data;

};


// =========================================
// ACTIVAR, MODIFICAR O DESACTIVAR OFERTA
// =========================================

export const actualizarOferta = async (
  id,
  enOferta,
  precioOferta = null
) => {

  // Validar estado de la oferta
  if (typeof enOferta !== 'boolean') {

    throw new Error(
      'El estado de la oferta debe ser verdadero o falso.'
    );

  }

  const precio = enOferta
    ? Number(precioOferta)
    : null;

  // Validar precio de oferta
  if (
    enOferta &&
    (
      precioOferta === null ||
      !Number.isFinite(precio) ||
      precio <= 0
    )
  ) {

    throw new Error(
      'El precio de oferta debe ser mayor a cero.'
    );

  }

  // Construir datos solicitados por OfertaDTO
  const datosOferta = {

    enOferta: enOferta,

    precioOferta: precio

  };

  // Enviar solicitud PATCH al backend
  const respuesta = await api.patch(
    `/api/v1/productos/${id}/oferta`,
    datosOferta
  );

  return adaptarProducto(respuesta.data);

};
