// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; 
import MainTemplate from './components/templates/MainTemplate';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Carrito from './pages/Carrito';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Admin from './pages/Admin';
import  './styles/global.css';
import Registro from './pages/Registro';

function App() {
  const [cart, setCart] = useState([]);
  const [usuario, setUsuario] = useState(() => {
    return JSON.parse(localStorage.getItem('isaflor_sesion')) || null;
  });

  const handleAddToCart = (producto) => {
    setCart(prevCart => {
      const existe = prevCart.find(item => item.id === producto.id);
      if (existe) {
        return prevCart.map(item =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prevCart, { ...producto, cantidad: 1 }];
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('isaflor_sesion');
    setUsuario(null);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <BrowserRouter>
      <MainTemplate cartCount={cartCount} usuario={usuario} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
          <Route path="/catalogo" element={<Catalogo onAddToCart={handleAddToCart} />} />
          <Route path="/carrito" element={<Carrito cart={cart} setCart={setCart} />} />
          <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} usuario={usuario} />} />
          <Route path="/login" element={<Login setUsuario={setUsuario} />} />
          <Route path="/registro" element={<Registro setUsuario={setUsuario} />} />
          
          <Route
            path="/admin"
            element={
              usuario && usuario.rol === 'ADMIN' ? (
                <Admin />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </MainTemplate>
    </BrowserRouter>
  );
}

export default App;