// src/components/ProductTable.jsx
import React from 'react';
import ProductRow from './ProductRow.jsx';

/**
 * Component hiển thị bảng danh sách sản phẩm
 * @param {Object} props
 * @param {Array} props.products - Danh sách sản phẩm cần hiển thị
 * @param {Function} [props.onEdit] - Hàm callback khi click Sửa
 * @param {Function} [props.onDelete] - Hàm callback khi click Xóa
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
