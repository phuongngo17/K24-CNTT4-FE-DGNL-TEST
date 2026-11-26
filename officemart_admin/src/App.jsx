// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import ProductListPage from './pages/ProductListPage.jsx';

/**
 * Ứng dụng quản trị OfficeMart Admin
 */
export default function App() {
  return (
    <div className="app-container">
      <Header />
      <Routes>
        {/* Đường dẫn / chuyển sang /products */}
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductListPage />} />
        {/* Route bắt tất cả các đường dẫn khác chuyển về /products */}
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </div>
  );
}
