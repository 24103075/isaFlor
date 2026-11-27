
import api from './api';

// Adaptar las categorias del backend al formato del frontend
const adaptarCategoria = (categoria) => {

  return {
    id: categoria.idCategoria,
    nombre: categoria.nombreCategoria,
    descripcion: categoria.descripcion ?? ''
  };

};


// Obtener todas las categorias almacenadas en Neon
export const obtenerCategorias = async () => {

  const respuesta = await api.get('/api/v1/categorias');

  // Si no existen categorias registradas
  if (respuesta.status === 204) {
    return [];
  }

  // Verificar el formato de la respuesta
  if (!Array.isArray(respuesta.data)) {
    throw new Error('La respuesta de categorias no es valida.');
  }

  // Adaptar y ordenar las categorias alfabeticamente
  return respuesta.data
    .map(adaptarCategoria)
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

};
