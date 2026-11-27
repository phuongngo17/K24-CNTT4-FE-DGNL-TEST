import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import ProductsPage from './pages/ProductsPage.jsx';

export default function App() {
  return (
    <div className="app-container">
      <Header />

      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </div>
  );
}
