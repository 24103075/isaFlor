/*Este archivo sera nuestra "base de datos" simulada y manejara 
toda la logica de CRUD (Crear, Leer, Actualizar, Eliminar) con 
localStorage para que las modificaciones de productos, usuarios, 
categorias y carrito no se pierdan al recargar la pagina. */





// src/data/datosIsaflor.js

export const productosIniciales = [
  {
    id: 1,
    nombre: "Ramo de Rosas Rojas",
    categoria: "Rosas",
    precio: 24990,
    stock: 10,
    stockCritico: 3,
    descripcion: "Hermoso ramo de 12 rosas rojas frescas.",
    imagen: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500",
    enOferta: true
  },
  {
    id: 2,
    nombre: "Orquídea Blanca",
    categoria: "Plantas",
    precio: 18990,
    stock: 2,
    stockCritico: 3,
    descripcion: "Elegante orquídea blanca en maceta.",
    imagen: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=500",
    enOferta: false
  },
  {
    id: 3,
    nombre: "Arreglo Silvestre",
    categoria: "Arreglos",
    precio: 29990,
    stock: 5,
    stockCritico: 2,
    descripcion: "Mezcla de flores de estación con diseño único.",
    imagen: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500",
    enOferta: true
  }
];

export const categorias = [
  { id: 'todas', nombre: 'Todas' },
  { id: 'rosas', nombre: 'Rosas' },
  { id: 'plantas', nombre: 'Plantas' },
  { id: 'arreglos', nombre: 'Arreglos' }
];

export const getProductos = () => {
  const guardados = localStorage.getItem('isaflor_productos');
  return guardados ? JSON.parse(guardados) : productosIniciales;
};

// Exportación requerida para el Panel Admin
export const guardarProductos = (productos) => {
  localStorage.setItem('isaflor_productos', JSON.stringify(productos));
};

// Exportación requerida para las categorías en Admin
export const getCategorias = () => categorias;

// Exportación requerida para la generación de boletas
export const guardarOrden = (orden) => {
  const ordenes = JSON.parse(localStorage.getItem('isaflor_ordenes')) || [];
  const nuevaOrden = {
    ...orden,
    id: `BOL-${Math.floor(100000 + Math.random() * 900000)}`,
    fecha: new Date().toLocaleDateString('es-CL')
  };
  ordenes.push(nuevaOrden);
  localStorage.setItem('isaflor_ordenes', JSON.stringify(ordenes));
  return nuevaOrden;
};