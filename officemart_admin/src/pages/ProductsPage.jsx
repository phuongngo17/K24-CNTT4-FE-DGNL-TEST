// src/pages/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axiosClient.js';
import ProductTable from '../components/ProductTable.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { useToast } from '../context/ToastContext.jsx';
import useProductSearch from '../hooks/useProductSearch.js';

/**
 * Trang danh sách sản phẩm quản trị OfficeMart Admin (Mục 4.1, 4.2 & 4.3)
 * - 4.1: Bố cục Header, tiêu đề h1 "Sản phẩm", nút add-button, bảng ProductTable 7 cột
 * - 4.2: Loading, error-message (retry-button), empty-state, edit-button, confirm-dialog xoá sản phẩm, Toast
 * - 4.3: Tìm kiếm có debounce 400ms, lọc danh mục, lọc trạng thái, phân trang (10/trang), đồng bộ URL searchParams
 */
export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  // 1. [Mục 4.3.3] Đọc các tham số tìm kiếm, lọc và phân trang từ URL
  const urlQ = searchParams.get('q') || '';
  const urlCategory = searchParams.get('category') || '';
  const urlStatus = searchParams.get('status') || '';
  const rawPage = Number(searchParams.get('page') || 1);
  const safePage = !Number.isInteger(rawPage) || rawPage < 1 ? 1 : rawPage;

  // State cục bộ phục vụ ô tìm kiếm có debounce 400ms
  const [searchTerm, setSearchTerm] = useState(urlQ);
  // Danh sách danh mục từ API GET /api/categories
  const [categories, setCategories] = useState([]);
  // Sản phẩm chờ xác nhận xoá
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Đồng bộ giá trị ô tìm kiếm khi URL thay đổi từ bên ngoài (Back/Forward hoặc mở link trực tiếp)
  useEffect(() => {
    setSearchTerm(urlQ);
  }, [urlQ]);

  // Tải danh mục từ GET /api/categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get('/categories');
        setCategories(res.data || []);
      } catch (err) {
        console.error('Lỗi khi tải danh mục:', err);
      }
    }
    fetchCategories();
  }, []);

  // 2. [Mục 4.3.4] Tải dữ liệu sản phẩm qua Custom Hook useProductSearch (xử lý Race Condition & AbortController)
  const {
    data: products,
    total,
    loading,
    error,
    refetch,
  } = useProductSearch({
    q: urlQ,
    category: urlCategory,
    status: urlStatus,
    page: safePage,
    limit: 10,
  });

  // 3. [Mục 4.3.1 A] Debounce 400ms cho ô tìm kiếm
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmedSearch = searchTerm.trim();
      // Chỉ cập nhật URL nếu từ khoá khác với URL hiện tại
      if (trimmedSearch !== urlQ) {
        updateUrlParams({ q: trimmedSearch, page: 1 });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, urlQ]);

  // Hàm tiện ích cập nhật SearchParams trên URL
  const updateUrlParams = (newParams) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });

    setSearchParams(nextParams);
  };

  // 4. [Mục 4.3.1 B] Xử lý thay đổi bộ lọc danh mục
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    updateUrlParams({ category: newCategory, page: 1 });
  };

  // 5. [Mục 4.3.1 C] Xử lý thay đổi bộ lọc trạng thái
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    updateUrlParams({ status: newStatus, page: 1 });
  };

  // [Mục 4.3.2] Tính tổng số trang (10 sản phẩm mỗi trang từ total)
  const totalPages = Math.ceil(total / 10) || 1;

  // Chuyển trang trước
  const handlePrevPage = () => {
    if (safePage > 1) {
      updateUrlParams({ page: safePage - 1 });
    }
  };

  // Chuyển sang trang kế tiếp
  const handleNextPage = () => {
    if (safePage < totalPages) {
      updateUrlParams({ page: safePage + 1 });
    }
  };

  // [Mục 4.2.4] Điều hướng sang trang sửa sản phẩm
  const handleEdit = (product) => {
    navigate(`/products/${product.id}/edit`);
  };

  // [Mục 4.2.5] Mở modal xác nhận xoá
  const handleDeleteClick = (product) => {
    setDeleteTarget(product);
  };

  // Huỷ xoá
  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  // Xác nhận xoá sản phẩm
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await api.delete(`/products/${deleteTarget.id}`);
      showToast('Đã xoá sản phẩm');
      // Nếu là sản phẩm duy nhất ở trang hiện tại (lớn hơn trang 1), lùi về trang trước
      if (products.length === 1 && safePage > 1) {
        updateUrlParams({ page: safePage - 1 });
      } else {
        refetch();
      }
    } catch (err) {
      console.error('Lỗi khi xoá sản phẩm:', err);
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <main className="main-content">
      {/* Tiêu đề trang & Nút Thêm sản phẩm (Mục 4.1.1 & 4.2.2) */}
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

      {/* Thanh công cụ Tìm kiếm và Lọc (Mục 4.3.1) */}
      <div className="filter-bar">
        {/* Ô tìm kiếm theo tên hoặc SKU (Mục 4.3.1 A) */}
        <div className="filter-item">
          <input
            type="text"
            data-testid="search-input"
            className="filter-input"
            placeholder="Tìm theo tên hoặc SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Ô lọc theo danh mục (Mục 4.3.1 B) */}
        <div className="filter-item">
          <select
            data-testid="category-filter"
            className="filter-select"
            value={urlCategory}
            onChange={handleCategoryChange}
          >
            <option value="">Tất cả</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ô lọc theo trạng thái (Mục 4.3.1 C) */}
        <div className="filter-item">
          <select
            data-testid="status-filter"
            className="filter-select"
            value={urlStatus}
            onChange={handleStatusChange}
          >
            <option value="">Tất cả</option>
            <option value="active">Đang bán</option>
            <option value="inactive">Ngừng bán</option>
          </select>
        </div>
      </div>

      {/* 1. Trạng thái Đang tải (Mục 4.2.1) */}
      {loading && (
        <div className="state-container">
          <div data-testid="loading" className="loading-spinner"></div>
          <p>Đang tải danh sách sản phẩm...</p>
        </div>
      )}

      {/* 2. Trạng thái Báo lỗi (Mục 4.2.1) */}
      {!loading && error && (
        <div className="state-container">
          <p data-testid="error-message" className="error-message">
            {error}
          </p>
          <button
            type="button"
            data-testid="retry-button"
            className="btn btn-primary"
            onClick={refetch}
          >
            Thử lại
          </button>
        </div>
      )}

      {/* 3. Trạng thái Rỗng (Mục 4.2.1) */}
      {!loading && !error && products.length === 0 && (
        <div className="state-container">
          <p data-testid="empty-state" className="empty-state">
            Không có sản phẩm nào
          </p>
        </div>
      )}

      {/* 4. Hiển thị bảng sản phẩm & Phân trang (Mục 4.1, 4.2, 4.3.2) */}
      {!loading && !error && products.length > 0 && (
        <>
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />

          {/* Vùng phân trang (Mục 4.3.2) */}
          <div data-testid="pagination" className="pagination">
            <button
              type="button"
              data-testid="page-prev"
              className="btn btn-secondary btn-sm"
              disabled={safePage <= 1}
              onClick={handlePrevPage}
            >
              Trước
            </button>
            <span data-testid="page-current" className="page-info">
              {safePage} / {totalPages}
            </span>
            <button
              type="button"
              data-testid="page-next"
              className="btn btn-secondary btn-sm"
              disabled={safePage >= totalPages}
              onClick={handleNextPage}
            >
              Sau
            </button>
          </div>
        </>
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
