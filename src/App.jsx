
// src/App.jsx

import React, { useState } from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

// Plantilla principal
import MainTemplate from './components/templates/MainTemplate';

// Páginas
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Carrito from './pages/Carrito';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Registro from './pages/Registro';
import Cliente from './pages/Cliente';
import Contacto from './pages/Contacto';
import Nosotros from './pages/Nosotros';
import Dashboard from './pages/Dashboard';
import Ofertas from './pages/Ofertas';
import Ordenes from './pages/Ordenes';

// Validaciones
import { esProductoAgotado } from './utils/validaciones';

// Estilos
import './styles/global.css';


function App() {

  // Estado del carrito y sus mensajes
  const [estadoCarrito, setEstadoCarrito] = useState({
    productos: [],
    mensaje: '',
    tipo: 'success'
  });

  const cart = estadoCarrito.productos;


  // Mantener compatibilidad con Carrito y Checkout
  const setCart = (actualizacion) => {

    setEstadoCarrito(prev => ({
      ...prev,

      productos:
        typeof actualizacion === 'function'
          ? actualizacion(prev.productos)
          : actualizacion,

      mensaje: ''
    }));

  };


  // Estado del usuario
  const [usuario, setUsuario] = useState(() => {

    return JSON.parse(
      localStorage.getItem('isaflor_sesion')
    ) || null;

  });


  // =========================================
  // AÑADIR PRODUCTOS AL CARRITO
  // =========================================

  const handleAddToCart = (producto, cantidad = 1) => {

    const cantidadSolicitada = Number(cantidad);

    setEstadoCarrito(prev => {

      // Validar disponibilidad del producto
      if (esProductoAgotado(producto)) {

        return {
          ...prev,
          mensaje: 'Este producto no se encuentra disponible.',
          tipo: 'warning'
        };

      }


      // Validar cantidad solicitada
      if (
        !Number.isInteger(cantidadSolicitada) ||
        cantidadSolicitada < 1
      ) {

        return {
          ...prev,
          mensaje: 'Debes seleccionar una cantidad válida.',
          tipo: 'warning'
        };

      }


      const stockDisponible = Number(producto.stock);


      // Buscar si el producto ya existe en el carrito
      const existe = prev.productos.find(
        item => item.id === producto.id
      );


      // Obtener cantidad actual
      const cantidadActual = existe
        ? Number(existe.cantidad)
        : 0;


      // Calcular nueva cantidad
      const nuevaCantidad =
        cantidadActual + cantidadSolicitada;


      // Comprobar que no supere el stock disponible
      if (nuevaCantidad > stockDisponible) {

        const unidadesRestantes = Math.max(
          0,
          stockDisponible - cantidadActual
        );

        return {

          ...prev,

          mensaje: unidadesRestantes === 0

            ? `Has alcanzado el máximo de unidades disponibles de ${producto.nombre}.`

            : `Ya tienes ${cantidadActual} unidades de ${producto.nombre} en el carrito. Solo puedes añadir ${unidadesRestantes} más.`,

          tipo: 'warning'

        };

      }


      // Actualizar producto existente
      if (existe) {

        return {

          productos: prev.productos.map(item =>

            item.id === producto.id

              ? {
                  ...item,
                  stock: stockDisponible,
                  stockCritico: producto.stockCritico,
                  cantidad: nuevaCantidad
                }

              : item

          ),

          mensaje: `Se añadieron ${cantidadSolicitada} unidad(es) de ${producto.nombre} al carrito.`,

          tipo: 'success'

        };

      }


      // Añadir un producto nuevo
      return {

        productos: [

          ...prev.productos,

          {
            ...producto,
            stock: stockDisponible,
            cantidad: cantidadSolicitada
          }

        ],

        mensaje: `Se añadieron ${cantidadSolicitada} unidad(es) de ${producto.nombre} al carrito.`,

        tipo: 'success'

      };

    });

  };


  // =========================================
  // CERRAR MENSAJE DEL CARRITO
  // =========================================

  const cerrarMensajeCarrito = () => {

    setEstadoCarrito(prev => ({
      ...prev,
      mensaje: ''
    }));

  };


  // =========================================
  // CERRAR SESIÓN
  // =========================================

  const handleLogout = () => {

    localStorage.removeItem('isaflor_sesion');

    setUsuario(null);

    cerrarMensajeCarrito();

  };


  // Calcular cantidad total de productos
  const cartCount = cart.reduce(
    (acc, item) => acc + Number(item.cantidad),
    0
  );


  return (

    <BrowserRouter>

      <MainTemplate
        cartCount={cartCount}
        usuario={usuario}
        onLogout={handleLogout}
      >

        {/* MENSAJES DEL CARRITO */}

        {estadoCarrito.mensaje && (

          <div
            className={`alert alert-${estadoCarrito.tipo} alert-dismissible fade show mx-3 mt-3`}
            role="alert"
          >

            <i
              className={
                estadoCarrito.tipo === 'success'
                  ? 'bi bi-check-circle me-2'
                  : 'bi bi-exclamation-triangle me-2'
              }
              aria-hidden="true"
            ></i>

            {estadoCarrito.mensaje}

            <button
              type="button"
              className="btn-close"
              aria-label="Cerrar"
              onClick={cerrarMensajeCarrito}
            ></button>

          </div>

        )}


        {/* RUTAS DE LA APLICACIÓN */}

        <Routes>

          {/* Inicio */}

          <Route
            path="/"
            element={
              <Home onAddToCart={handleAddToCart} />
            }
          />


          {/* Catálogo */}

          <Route
            path="/catalogo"
            element={
              <Catalogo onAddToCart={handleAddToCart} />
            }
          />


          {/* Carrito */}

          <Route
            path="/carrito"
            element={
              <Carrito
                cart={cart}
                setCart={setCart}
              />
            }
          />


          {/* Checkout */}

          <Route
            path="/checkout"
            element={
              <Checkout
                cart={cart}
                setCart={setCart}
                usuario={usuario}
              />
            }
          />


          {/* Login */}

          <Route
            path="/login"
            element={
              <Login setUsuario={setUsuario} />
            }
          />


          {/* Registro */}

          <Route
            path="/registro"
            element={
              <Registro setUsuario={setUsuario} />
            }
          />


          {/* Perfil del cliente */}

          <Route
            path="/perfil"
            element={
              usuario && usuario.rol === 'CLIENTE'
                ? <Cliente usuario={usuario} />
                : <Navigate to="/login" replace />
            }
          />


          {/* Contacto */}

          <Route
            path="/contacto"
            element={<Contacto />}
          />


          {/* Nosotros */}

          <Route
            path="/nosotros"
            element={<Nosotros />}
          />


          {/* Dashboard administrativo */}

          <Route
            path="/admin"
            element={
              usuario && usuario.rol === 'ADMIN'
                ? <Dashboard />
                : <Navigate to="/login" replace />
            }
          />


          {/* Inventario */}

          <Route
            path="/admin/inventario"
            element={
              usuario && usuario.rol === 'ADMIN'
                ? <Admin />
                : <Navigate to="/login" replace />
            }
          />


          {/* Ofertas */}

          <Route
            path="/ofertas"
            element={
              <Ofertas onAddToCart={handleAddToCart} />
            }
          />


          {/* Administración de órdenes */}

          <Route
            path="/admin/ordenes"
            element={
              usuario && usuario.rol === 'ADMIN'
                ? <Ordenes />
                : <Navigate to="/login" replace />
            }
          />

        </Routes>

      </MainTemplate>

    </BrowserRouter>

  );

}

export default App;
