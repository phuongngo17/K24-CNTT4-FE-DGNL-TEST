// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Header chính của ứng dụng
 */
export default function Header() {
  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/products" className="header-logo">
          OfficeMart Admin
        </Link>
      </div>
    </header>
  );
}
