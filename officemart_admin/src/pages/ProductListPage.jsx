// src/pages/ProductListPage.jsx
// Quản trị danh sách sản phẩm với Tìm kiếm, Lọc, Phân trang và Đồng bộ URL (Mục 4.1, 4.2, 4.3)
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axiosClient.js';
import ProductTable from '../components/ProductTable.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { useToast } from '../context/ToastContext.jsx';
import useProductSearch from '../hooks/useProductSearch.js';

export default function ProductListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  // 1. Đọc các tham số tìm kiếm, lọc và phân trang từ URL
  const urlQ = searchParams.get('q') || '';
  const urlCategory = searchParams.get('category') || '';
  const urlStatus = searchParams.get('status') || '';
  const rawPage = Number(searchParams.get('page') || 1);
  const safePage = !Number.isInteger(rawPage) || rawPage < 1 ? 1 : rawPage;

  // State cục bộ phục vụ ô tìm kiếm có debounce 400ms
  const [searchTerm, setSearchTerm] = useState(urlQ);
  // Danh sách danh mục từ API
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

  // 2. Tải dữ liệu sản phẩm qua Custom Hook useProductSearch (có xử lý Race Condition và AbortController)
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

  // 3. Xử lý Debounce 400ms khi gõ tìm kiếm
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

    // Nếu page = 1, có thể giữ nguyên hoặc ghi rõ trên URL để kiểm tra
    if (newParams.page === undefined && !nextParams.has('page')) {
      nextParams.set('page', '1');
    }

    setSearchParams(nextParams);
  };

  // Xử lý thay đổi bộ lọc danh mục
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    updateUrlParams({ category: newCategory, page: 1 });
  };

  // Xử lý thay đổi bộ lọc trạng thái
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    updateUrlParams({ status: newStatus, page: 1 });
  };

  // Tính tổng số trang (10 sản phẩm mỗi trang)
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

  // Chuyển sang trang sửa sản phẩm
  const handleEdit = (product) => {
    navigate(`/products/${product.id}/edit`);
  };

  // Mở modal xác nhận xoá
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
      // Nếu là sản phẩm cuối cùng của trang hiện tại (lớn hơn trang 1), lùi về trang trước
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
      {/* Tiêu đề trang & Nút Thêm sản phẩm */}
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
        {/* Ô tìm kiếm theo tên hoặc SKU */}
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

        {/* Ô lọc theo danh mục */}
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

        {/* Ô lọc theo trạng thái */}
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

      {/* 1. Trạng thái Đang tải (Loading) */}
      {loading && (
        <div className="state-container">
          <div data-testid="loading" className="loading-spinner"></div>
          <p>Đang tải danh sách sản phẩm...</p>
        </div>
      )}

      {/* 2. Trạng thái Báo lỗi (Error message + Retry button) */}
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

      {/* 3. Trạng thái Rỗng (Empty state) */}
      {!loading && !error && products.length === 0 && (
        <div className="state-container">
          <p data-testid="empty-state" className="empty-state">
            Không có sản phẩm nào
          </p>
        </div>
      )}

      {/* 4. Hiển thị bảng sản phẩm khi có dữ liệu */}
      {!loading && !error && products.length > 0 && (
        <>
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />

          {/* Phân trang (Mục 4.3.2) */}
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

      {/* Hộp thoại xác nhận xoá tự làm (Modal) */}
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
