// src/components/ProductRow.jsx
import React from 'react';
import { categoryNames } from '../data/sample.js';
import { formatPrice } from '../utils/format.js';

/**
 * Component hiển thị một dòng hoặc một thẻ sản phẩm
 * @param {Object} props
 * @param {Object} props.product - Dữ liệu sản phẩm
 * @param {Function} [props.onEdit] - Hàm callback khi bấm Sửa
 * @param {Function} [props.onDelete] - Hàm callback khi bấm Xóa
 */
export default function ProductRow({ product, onEdit, onDelete }) {
  // Lấy tên danh mục tiếng Việt từ categoryNames
  const categoryLabel = categoryNames[product.category] || product.category;

  // Xác định trạng thái hiển thị
  const isActive = product.status === 'active';
  const statusLabel = isActive ? 'Đang bán' : 'Ngừng bán';
  const statusClass = isActive ? 'status-badge status-active' : 'status-badge status-inactive';

  // Xác định tồn kho: bằng 0 thì báo "Hết hàng" màu đỏ
  const isOutOfStock = Number(product.stock) === 0;

  return (
    <tr data-testid="product-row" className="product-row">
      <td data-label="Tên" className="col-name">
        <span className="product-name">{product.name}</span>
      </td>
      <td data-label="SKU" className="col-sku">
        <span className="product-sku">{product.sku}</span>
      </td>
      <td data-label="Danh mục" className="col-category">
        {categoryLabel}
      </td>
      <td data-label="Giá" className="col-price">
        {formatPrice(product.price)}
      </td>
      <td data-label="Tồn kho" className="col-stock">
        {isOutOfStock ? (
          <span className="out-of-stock">Hết hàng</span>
        ) : (
          product.stock
        )}
      </td>
      <td data-label="Trạng thái" className="col-status">
        <span data-testid="product-status" className={statusClass}>
          {statusLabel}
        </span>
      </td>
      <td data-label="Thao tác" className="col-actions">
        <div className="action-buttons">
          <button
            type="button"
            data-testid="edit-button"
            className="btn btn-sm btn-edit"
            onClick={() => onEdit && onEdit(product)}
          >
            Sửa
          </button>
          <button
            type="button"
            data-testid="delete-button"
            className="btn btn-sm btn-delete"
            onClick={() => onDelete && onDelete(product)}
          >
            Xoá
          </button>
        </div>
      </td>
    </tr>
  );
}
