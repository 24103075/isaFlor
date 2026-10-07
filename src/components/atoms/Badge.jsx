// src/components/atoms/Badge.jsx
import React from 'react';

const Badge = ({ children, bg = 'primary', className = '' }) => {
  return (
    <span className={`badge bg-${bg} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;