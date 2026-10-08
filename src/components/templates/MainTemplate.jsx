// src/components/templates/MainTemplate.jsx
import React from 'react';
import Header from '../organisms/Header';
import Footer from '../organisms/Footer';

const MainTemplate = ({ children, cartCount, usuario, onLogout }) => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header cartCount={cartCount} usuario={usuario} onLogout={onLogout} />
      <main className="container-fluid px-4 my-4 flex-grow-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainTemplate;