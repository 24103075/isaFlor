
// src/App.jsx

import React, { useState, useRef, useEffect } from 'react';

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

// Servicios
import { obtenerProductos } from './services/productoService';
import { obtenerSesion, cerrarSesion } from './services/sessionService';

// Validaciones
import { esProductoAgotado } from './utils/validaciones';

// Estilos
import './styles/global.css';


function App() {

  // =========================================
  // ESTADOS DEL CARRITO
  // =========================================

  const [estadoCarrito, setEstadoCarrito] = useState({
    productos: [],
    mensaje: '',
    tipo: 'success'
  });

  const [actualizandoCarrito, setActualizandoCarrito] =
    useState(false);

  const consultaEnCurso = useRef(false);

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


  // =========================================
  // ESTADO DEL USUARIO
  // =========================================

  const [sesion, setSesion] = useState(obtenerSesion);

  // Mantener los datos del usuario accesibles para los componentes.
  const usuario = sesion ? {
    ...sesion.usuario,
    email: sesion.usuario.correo,
    rol: sesion.rol
  } : null;

  // Sincronizar la sesion con el navegador y el interceptor de Axios.
  useEffect(() => {
    const sincronizarSesion = () => setSesion(obtenerSesion());
    const alCambiarStorage = (evento) => {
      if (evento.key === 'isaflor_sesion' || evento.key === null) {
        sincronizarSesion();
      }
    };

    window.addEventListener('isaflor:sesion-expirada', sincronizarSesion);
    window.addEventListener('storage', alCambiarStorage);
    window.addEventListener('focus', sincronizarSesion);

    return () => {
      window.removeEventListener('isaflor:sesion-expirada', sincronizarSesion);
      window.removeEventListener('storage', alCambiarStorage);
      window.removeEventListener('focus', sincronizarSesion);
    };
  }, []);

  // Cerrar la sesion cuando llegue la fecha de expiracion.
  useEffect(() => {
    if (!sesion) return;

    const tiempoRestante = Math.max(0, sesion.expiresAt - Date.now());
    const temporizador = window.setTimeout(() => {
      setSesion(obtenerSesion());
    }, tiempoRestante);

    return () => window.clearTimeout(temporizador);
  }, [sesion]);


  // =========================================
  // AÑADIR PRODUCTOS AL CARRITO
  // =========================================

  const handleAddToCart = (producto, cantidad = 1) => {

    const cantidadSolicitada = Number(cantidad);

    setEstadoCarrito(prev => {

      // Validar disponibilidad
      if (esProductoAgotado(producto)) {

        return {
          ...prev,
          mensaje: 'Este producto no se encuentra disponible.',
          tipo: 'warning'
        };

      }


      // Validar precio del producto
      if (
        producto.precio == null ||
        !Number.isFinite(Number(producto.precio)) ||
        Number(producto.precio) <= 0
      ) {

        return {
          ...prev,
          mensaje: 'El producto no tiene un precio válido.',
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


      // Buscar producto existente
      const existe = prev.productos.find(
        item => item.id === producto.id
      );


      const cantidadActual = existe
        ? Number(existe.cantidad)
        : 0;


      const nuevaCantidad =
        cantidadActual + cantidadSolicitada;


      // Comprobar disponibilidad de stock
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

        const cambioPrecio =
          Number(existe.precio) !== Number(producto.precio);

        return {

          productos: prev.productos.map(item =>

            item.id === producto.id

              ? {
                  ...item,

                  // Actualizar todos los datos del producto
                  ...producto,

                  precio: Number(producto.precio),
                  stock: stockDisponible,
                  cantidad: nuevaCantidad
                }

              : item

          ),

          mensaje: cambioPrecio

            ? `Se actualizó el precio de ${producto.nombre} y se añadieron ${cantidadSolicitada} unidad(es) al carrito.`

            : `Se añadieron ${cantidadSolicitada} unidad(es) de ${producto.nombre} al carrito.`,

          tipo: cambioPrecio ? 'warning' : 'success'

        };

      }


      // Añadir producto nuevo
      return {

        productos: [

          ...prev.productos,

          {
            ...producto,
            precio: Number(producto.precio),
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
  // ACTUALIZAR PRECIOS, OFERTAS Y STOCK
  // DESDE EL BACKEND
  // =========================================

  const actualizarCarrito = async () => {

    // Evitar consultas simultáneas
    if (consultaEnCurso.current) {
      return false;
    }

    consultaEnCurso.current = true;
    setActualizandoCarrito(true);

    try {

      // Consultar productos reales desde el backend
      const productosActualizados = await obtenerProductos();

      // Organizar productos por identificador
      const productosPorId = new Map(

        productosActualizados.map(producto => [
          producto.id,
          producto
        ])

      );


      setEstadoCarrito(prev => {

        let huboCambios = false;
        let hayProblemas = false;


        const carritoActualizado = prev.productos.map(item => {

          const productoActual = productosPorId.get(item.id);


          // Producto eliminado del inventario
          if (!productoActual) {

            huboCambios = true;
            hayProblemas = true;

            return {
              ...item,
              stock: 0,
              noDisponible: true
            };

          }


          // Detectar cambios de precio, oferta o stock
          if (
            Number(item.precio) !== Number(productoActual.precio) ||
            Number(item.precioOriginal) !== Number(productoActual.precioOriginal) ||
            item.precioOferta !== productoActual.precioOferta ||
            item.enOferta !== productoActual.enOferta ||
            Number(item.stock) !== Number(productoActual.stock) ||
            item.noDisponible === true
          ) {

            huboCambios = true;

          }


          // Comprobar disponibilidad de las unidades
          if (
            esProductoAgotado(productoActual) ||
            Number(item.cantidad) > Number(productoActual.stock) ||
            !Number.isInteger(Number(item.cantidad)) ||
            Number(item.cantidad) < 1 ||
            !Number.isFinite(Number(productoActual.precio)) ||
            Number(productoActual.precio) <= 0
          ) {

            hayProblemas = true;

          }


          // Actualizar datos manteniendo cantidad seleccionada
          return {

            ...item,
            ...productoActual,

            cantidad: item.cantidad,
            noDisponible: false

          };

        });


        // Informar problemas de disponibilidad
        if (hayProblemas) {

          return {

            productos: carritoActualizado,

            mensaje: 'Algunos productos del carrito presentan cambios de disponibilidad, stock o precio. Revisa tu compra antes de continuar.',

            tipo: 'warning'

          };

        }


        // Informar cambios de precios u ofertas
        if (huboCambios) {

          return {

            productos: carritoActualizado,

            mensaje: 'Se actualizaron los precios, ofertas o stock de los productos de tu carrito.',

            tipo: 'warning'

          };

        }


        // Mantener el carrito actualizado
        return {

          ...prev,
          productos: carritoActualizado

        };

      });

      return true;

    } catch (error) {

      console.error(
        'Error al actualizar el carrito:',
        error
      );

      setEstadoCarrito(prev => ({

        ...prev,

        mensaje: 'No fue posible verificar los precios y el stock del carrito. Intenta nuevamente antes de continuar con la compra.',

        tipo: 'danger'

      }));

      return false;

    } finally {

      consultaEnCurso.current = false;
      setActualizandoCarrito(false);

    }

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

    cerrarSesion();

    setSesion(null);

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
                actualizarCarrito={actualizarCarrito}
                actualizandoCarrito={actualizandoCarrito}
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
                actualizarCarrito={actualizarCarrito}
                actualizandoCarrito={actualizandoCarrito}
              />
            }
          />


          {/* Login */}

          <Route
            path="/login"
            element={
              <Login setUsuario={setSesion} />
            }
          />


          {/* Registro */}

          <Route
            path="/registro"
            element={
              <Registro />
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
              usuario && usuario.rol === 'ADMINISTRADOR'
                ? <Dashboard />
                : <Navigate to="/login" replace />
            }
          />


          {/* Inventario */}

          <Route
            path="/admin/inventario"
            element={
              usuario && usuario.rol === 'ADMINISTRADOR'
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
              usuario && usuario.rol === 'ADMINISTRADOR'
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
