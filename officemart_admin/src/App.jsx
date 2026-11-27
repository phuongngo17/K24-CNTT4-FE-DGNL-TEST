import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductFormPage from './pages/ProductFormPage.jsx';
import { ToastProvider } from './context/ToastContext.jsx';


export default function App() {
  return (
    <ToastProvider>
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/new" element={<ProductFormPage />} />
          <Route path="/products/:id/edit" element={<ProductFormPage />} />
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </div>
    </ToastProvider>
  );
}
