import React from 'react';
import ProductRow from './ProductRow.jsx';

/**
 * @param {Object} props
 * @param {Array} props.products 
 * @param {Function} [props.onEdit]
 * @param {Function} [props.onDelete]
 */
export default function ProductTable({ products = [], onEdit, onDelete }) {
  return (
    <div className="table-responsive">
      <table data-testid="product-table" className="product-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>SKU</th>
            <th>Danh mục</th>
            <th>Giá</th>
            <th>Tồn kho</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
