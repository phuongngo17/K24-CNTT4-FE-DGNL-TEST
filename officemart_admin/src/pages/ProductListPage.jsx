// src/pages/ProductListPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductTable from '../components/ProductTable.jsx';
import sampleProducts from '../data/sample.js';

/**
 * Trang danh sách sản phẩm (Mục 4.1)
 */
export default function ProductListPage() {
  const navigate = useNavigate();

  return (
    <main className="main-content">
      <div className="page-header">
        <h1 className="page-title">Sản phẩm</h1>
        <button
          type="button"
          data-testid="add-button"
          className="btn btn-primary"
          onClick={() => navigate('/products/new')}
        >
          Thêm sản phẩm
        </button>
      </div>

      <ProductTable products={sampleProducts} />
    </main>
  );
}
