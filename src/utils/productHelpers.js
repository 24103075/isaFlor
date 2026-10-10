// src/utils/productHelpers.js
import { getProductos } from '../data/datosIsaflor';

/**
 * Obtiene y valida los productos en oferta para garantizar que
 * existan y cumplan con los requisitos antes de renderizarlos.
 */
export const obtenerOfertasValidas = () => {
  const productos = getProductos();

  // Validar que productos sea un arreglo
  if (!Array.isArray(productos)) {
    return [];
  }

  // Filtrar y validar que los productos tengan los datos mínimos requeridos
  return productos.filter(p => 
    p && 
    p.enOferta === true && 
    p.precio > 0 && 
    p.nombre
  );
};