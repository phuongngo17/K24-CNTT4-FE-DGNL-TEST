// src/pages/ProductListPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosClient.js';
import ProductTable from '../components/ProductTable.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { useToast } from '../context/ToastContext.jsx';

/**
 * Trang danh sách sản phẩm (Mục 4.2)
 */
export default function ProductListPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // State dữ liệu danh sách sản phẩm
  const [products, setProducts] = useState([]);
  // State trạng thái tải dữ liệu
  const [loading, setLoading] = useState(true);
  // State thông báo lỗi từ API
  const [error, setError] = useState(null);
  // State sản phẩm đang chờ xác nhận xoá
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Hàm tải dữ liệu danh sách sản phẩm từ API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/products', {
        params: { page: 1, limit: 10 },
      });
      setProducts(res.data.data || []);
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Lỗi máy chủ, vui lòng thử lại';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Tải danh sách khi component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Điều hướng sang trang sửa sản phẩm
  const handleEdit = (product) => {
    navigate(`/products/${product.id}/edit`);
  };

  // Mở hộp thoại xác nhận xoá
  const handleDeleteClick = (product) => {
    setDeleteTarget(product);
  };

  // Đóng hộp thoại xoá (Huỷ)
  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  // Xác nhận xoá sản phẩm: Gọi DELETE /api/products/:id
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await api.delete(`/products/${deleteTarget.id}`);
      // Cập nhật state danh sách: loại bỏ sản phẩm vừa xoá
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      showToast('Đã xoá sản phẩm');
    } catch (err) {
      console.error('Lỗi khi xoá sản phẩm:', err);
      const message =
        err.response?.data?.message || 'Không thể xoá sản phẩm, vui lòng thử lại';
      alert?.(message); // fallback
    } finally {
      setDeleteTarget(null);
    }
  };

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

      {/* 1. Trạng thái đang tải (Loading) */}
      {loading && (
        <div className="state-container">
          <div data-testid="loading" className="loading-spinner"></div>
          <p>Đang tải danh sách sản phẩm...</p>
        </div>
      )}

      {/* 2. Trạng thái lỗi (Error message + Retry button) */}
      {!loading && error && (
        <div className="state-container">
          <p data-testid="error-message" className="error-message">
            {error}
          </p>
          <button
            type="button"
            data-testid="retry-button"
            className="btn btn-primary"
            onClick={fetchProducts}
          >
            Thử lại
          </button>
        </div>
      )}

      {/* 3. Trạng thái danh sách rỗng (Empty state) */}
      {!loading && !error && products.length === 0 && (
        <div className="state-container">
          <p data-testid="empty-state" className="empty-state">
            Không có sản phẩm nào
          </p>
        </div>
      )}

      {/* 4. Hiển thị bảng sản phẩm khi có dữ liệu */}
      {!loading && !error && products.length > 0 && (
        <ProductTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Hộp thoại xác nhận xoá tự làm (Mục 4.2.5) */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Xác nhận xoá sản phẩm"
        message={`Bạn có chắc chắn muốn xoá sản phẩm "${deleteTarget?.name}" (SKU: ${deleteTarget?.sku}) không? Thao tác này không thể hoàn tác.`}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </main>
  );
}
