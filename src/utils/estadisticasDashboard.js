// src/utils/estadisticasDashboard.js

import { getProductos } from '../data/datosIsaflor';

export const obtenerEstadisticasDashboard = () => {
  const productos = getProductos();

  const ordenes = JSON.parse(
    localStorage.getItem('isaflor_ordenes') || '[]'
  );

  return {
    totalProductos: productos.length,
    totalOrdenes: ordenes.length,
    totalUsuarios: 0,
    productosStockBajo: productos.filter(
      (producto) =>
        producto.stock !== undefined &&
        producto.stockCritico !== undefined &&
        Number(producto.stock) <= Number(producto.stockCritico)
    ).length
  };
};
