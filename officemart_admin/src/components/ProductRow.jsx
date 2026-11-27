import React from 'react';
import { categoryNames } from '../data/sample.js';
import { formatPrice } from '../utils/format.js';

/**
 * @param {Object} props
 * @param {Object} props.product
 * @param {Function} [props.onEdit]
 * @param {Function} [props.onDelete]
 */
export default function ProductRow({ product, onEdit, onDelete }) {
  const categoryLabel = categoryNames[product.category] || product.category;

  const isActive = product.status === 'active';
  const statusLabel = isActive ? 'Đang bán' : 'Ngừng bán';
  const statusClass = isActive ? 'status-badge status-active' : 'status-badge status-inactive';

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
