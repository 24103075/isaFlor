
import api from './api';

// Adaptar los productos del backend al formato del frontend para mantener consistencia y evitar errores de referencia
const adaptarProducto = (producto) => {
  return {
    id: producto.idProducto,
    codigo: producto.codigoProducto,
    nombre: producto.nombreProducto,
    descripcion: producto.descripcion,
    precio: Number(producto.precioProducto),
    stock: producto.stockProducto,
    stockCritico: producto.stockCritico,
    peso: producto.pesoProducto,
    pesoVolumetrico: producto.pesoVolumetrico,
    idCategoria: producto.idCategoria,
    categoria: producto.nombreCategoria,
    imagen: null
  };
};

// Obtener todos los productos, consulta todos los productos almacenados en Neon.
export const obtenerProductos = async () => {

  const respuesta = await api.get('/api/v1/productos');

  // Si no existen productos registrados
  if (respuesta.status === 204) {
    return [];
  }

  // Verificar el formato de la respuesta
  if (!Array.isArray(respuesta.data)) {
    throw new Error('La respuesta de productos no es válida.');
  }

  return respuesta.data.map(adaptarProducto);
};

// Obtener un producto por su ID , consultando un producto específico mediante su identificador
export const obtenerProductoPorId = async (id) => {

  const respuesta = await api.get(`/api/v1/productos/${id}`);

  return adaptarProducto(respuesta.data);
};
