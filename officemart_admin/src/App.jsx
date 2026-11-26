// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import ProductListPage from './pages/ProductListPage.jsx';
import ProductFormPage from './pages/ProductFormPage.jsx';
import { ToastProvider } from './context/ToastContext.jsx';

/**
 * Ứng dụng quản trị OfficeMart Admin (Mục 4.1 & 4.2)
 */
export default function App() {
  return (
    <ToastProvider>
      <div className="app-container">
        <Header />
        <Routes>
          {/* Đường dẫn / chuyển sang /products */}
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/new" element={<ProductFormPage />} />
          <Route path="/products/:id/edit" element={<ProductFormPage />} />
          {/* Bắt tất cả các đường dẫn khác chuyển về /products */}
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </div>
    </ToastProvider>
  );
}
