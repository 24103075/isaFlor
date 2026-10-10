/*Este archivo sera nuestra "base de datos" simulada y manejara 
toda la logica de CRUD (Crear, Leer, Actualizar, Eliminar) con 
localStorage para que las modificaciones de productos, usuarios, 
categorias y carrito no se pierdan al recargar la pagina. */


// src/data/datosIsaflor.js

export const productosIniciales = [
  {
    id: 1,
    nombre: "Mini Cartera Floral Rosa Pastel",
    precio: 18990,
    imagen: "https://i.ibb.co/yjndKHL/imagen-6.jpg",
    categoria: "Arreglos",
    descripcion: "Cartera floral trasportable con flores frescas en tonos pastel."
  },
  {
    id: 2,
    nombre: "Cartera floral de campo",
    precio: 21990,
    imagen: "https://i.ibb.co/VWv5VC7L/imagen-7.jpg",
    categoria: "Arreglos",
    descripcion: "Flores de campo recién cortadas ,puestas en esponja floral en cartera transportable especial."
  },
  {
    id: 3,
    nombre: "Ramo Amanecer ",
    precio: 15990,
    imagen: "https://i.ibb.co/KjyVBwky/imagen-8.jpg",
    categoria: "Arreglos",
    descripcion: "Ramo floral titulacion."
  },
 
  {
    id: 4,
    nombre: "Ramo Zinnias",
    precio: 9990,
    imagen: "https://i.ibb.co/zWdCfxF0/imagen-11.jpg",
    categoria: "Ramos",
    descripcion: "Zinnias frescas y coloridas en un ramo compacto y alegre."
  },
  {
    id: 5,
    nombre: "12 Craspedias Amarillas",
    precio: 7990,
    imagen: "https://i.ibb.co/q32XrMwx/imagen-12.jpg",
    categoria: "Ramos",
    descripcion: "Ramo fresco de Craspedias, adecuadas para almacenar en seco , tiene una duracion de por vida."
  },
  {
    id: 6,
    nombre: "Ramo Lisianthus Carmine ",
    precio: 9990,
    imagen: "https://i.ibb.co/pj8zbRs7/imagen-13.jpg",
    categoria: "Ramos",
    descripcion: "Frescos Lisianthus de nuestra produccion."
  },
  {
    id: 7,
    nombre: "Arreglo Floral Primaveral",
    precio: 26990,
    imagen: "https://i.ibb.co/gFJfYks3/imagen-14.jpg",
    categoria: "Arreglos",
    descripcion: "Flores variadas listas para decorar cualquier espacio."
  },
  {
    id: 8,
    nombre: "Ramo Mix de Estación",
    precio: 25990,
    imagen: "https://i.ibb.co/k2njBBtZ/imagen-15.jpg",
    categoria: "Arreglos",
    descripcion: "Combinación fresca de las mejores flores del día."
  },
  {
    id: 9,
    nombre: "Ramo Floral Girasoles",
    precio: 24990,
    imagen: "https://i.ibb.co/Fkf6PZ6H/imagen-16.jpg",
    categoria: "Ramos",
    descripcion: "Diseño abundante de girasoles de temporada."
  },
  {
    id: 10,
    nombre: "Ramo Surtido Alstroemerias",
    precio: 7990,
    imagen: "https://i.ibb.co/C506mLZX/imagen-17.jpg",
    categoria: "Ramos",
    descripcion: "Arreglo exclusivo en tonos pastel seleccionados."
  }
];

export const categorias = [
  { id: 'arreglos', nombre: 'Arreglos' },
  { id: 'ramos', nombre: 'Ramos' }
  
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