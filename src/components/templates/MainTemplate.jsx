// src/components/templates/MainTemplate.jsx
import React from 'react';
import Navbar from '../organisms/Navbar';
import Footer from '../organisms/Footer';

const MainTemplate = ({ children, cartCount, usuario, onLogout }) => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar cartCount={cartCount} usuario={usuario} onLogout={onLogout} />
      <main className="container my-4 flex-grow-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainTemplate;