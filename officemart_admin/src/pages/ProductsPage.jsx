import React from 'react';
import ProductTable from '../components/ProductTable.jsx';
import sampleProducts from '../data/sample.js';

export default function ProductsPage() {
  return (
    <main className="main-content">
      <div className="page-header">
        <h1 className="page-title">Sản phẩm</h1>
        <button
          type="button"
          data-testid="add-button"
          className="btn btn-primary"
        >
          Thêm sản phẩm
        </button>
      </div>
      <ProductTable products={sampleProducts} />
    </main>
  );
}
