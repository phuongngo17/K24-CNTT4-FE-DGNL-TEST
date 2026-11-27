import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/axiosClient.js';
import { useToast } from '../context/ToastContext.jsx';

const SKU_REGEX = /^[A-Z]{3}-\d{4}$/;

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    stock: '',
    status: 'active'
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  useEffect(() => {
    if (!isEditMode) return;

    async function fetchProduct() {
      setInitialLoading(true);
      setNotFound(false);
      try {
        const res = await api.get(`/products/${id}`);
        const product = res.data;
        setForm({
          name: product.name ?? '',
          sku: product.sku ?? '',
          category: product.category ?? '',
          price: product.price !== undefined ? String(product.price) : '',
          stock: product.stock !== undefined ? String(product.stock) : '',
          status: product.status ?? 'active',
        });
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setNotFound(true);
        } else {
          console.error('Lỗi khi tải thông tin sản phẩm:', err);
        }
      } finally {
        setInitialLoading(false);
      }
    }

    fetchProduct();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    const trimmedName = form.name.trim();
    if (!trimmedName) {
      newErrors.name = 'Tên sản phẩm không được để trống';
    } else if (trimmedName.length < 3 || trimmedName.length > 100) {
      newErrors.name = 'Tên sản phẩm từ 3 đến 100 ký tự';
    }

    const trimmedSku = form.sku.trim();
    if (!trimmedSku) {
      newErrors.sku = 'Mã SKU không được để trống';
    } else if (!SKU_REGEX.test(trimmedSku)) {
      newErrors.sku = 'SKU có dạng ABC-1234 (3 chữ hoa, gạch ngang, 4 số)';
    }
    if (!form.category) {
      newErrors.category = 'Vui lòng chọn danh mục';
    }

    const priceNum = Number(form.price);
    if (form.price === '' || form.price === null || isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = 'Giá phải là số lớn hơn 0';
    }

    const stockNum = Number(form.stock);
    if (
      form.stock === '' ||
      form.stock === null ||
      isNaN(stockNum) ||
      !Number.isInteger(stockNum) ||
      stockNum < 0
    ) {
      newErrors.stock = 'Tồn kho phải là số nguyên không âm';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    if (!validate()) return;

    setSubmitting(true);

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      status: form.status,
    };

    try {
      if (isEditMode) {
        await api.put(`/products/${id}`, payload);
        showToast('Đã cập nhật sản phẩm');
      } else {
        await api.post('/products', payload);
        showToast('Đã thêm sản phẩm');
      }
      navigate('/products');
    } catch (err) {
      if (err.response && err.response.status === 409) {
        const serverMessage = err.response.data?.message || 'SKU đã tồn tại';
        setErrors((prev) => ({ ...prev, sku: serverMessage }));
      } else if (err.response && err.response.data?.field) {
        const { field, message } = err.response.data;
        setErrors((prev) => ({ ...prev, [field]: message }));
      } else {
        console.error('Lỗi khi gửi form:', err);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (notFound) {
    return (
      <main className="main-content">
        <div className="state-container">
          <p className="error-message">Không tìm thấy sản phẩm</p>
          <Link to="/products" className="btn btn-primary">
            Quay lại danh sách
          </Link>
        </div>
      </main>
    );
  }

  if (initialLoading) {
    return (
      <main className="main-content">
        <div className="state-container">
          <div data-testid="loading" className="loading-spinner"></div>
          <p>Đang tải thông tin sản phẩm...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content">
      <div className="page-header">
        <h1 className="page-title">{isEditMode ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h1>
      </div>

      <div className="form-card">
        <form data-testid="product-form" onSubmit={handleSubmit}>
          {/* 1. Tên sản phẩm */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Tên sản phẩm
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="Nhập tên sản phẩm (3 - 100 ký tự)"
            />
            {errors.name && (
              <div data-testid="field-error-name" className="field-error">
                {errors.name}
              </div>
            )}
          </div>

          {/* 2. Mã SKU */}
          <div className="form-group">
            <label htmlFor="sku" className="form-label">
              Mã SKU
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              className={`form-control ${errors.sku ? 'is-invalid' : ''}`}
              placeholder="VD: ABC-1234"
            />
            {errors.sku && (
              <div data-testid="field-error-sku" className="field-error">
                {errors.sku}
              </div>
            )}
          </div>

          {/* 3. Danh mục */}
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Danh mục
            </label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className={`form-control ${errors.category ? 'is-invalid' : ''}`}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <div data-testid="field-error-category" className="field-error">
                {errors.category}
              </div>
            )}
          </div>

          {/* 4. Giá */}
          <div className="form-group">
            <label htmlFor="price" className="form-label">
              Giá (₫)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={form.price}
              onChange={handleChange}
              className={`form-control ${errors.price ? 'is-invalid' : ''}`}
              placeholder="Nhập giá sản phẩm > 0"
            />
            {errors.price && (
              <div data-testid="field-error-price" className="field-error">
                {errors.price}
              </div>
            )}
          </div>

          {/* 5. Tồn kho */}
          <div className="form-group">
            <label htmlFor="stock" className="form-label">
              Tồn kho
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className={`form-control ${errors.stock ? 'is-invalid' : ''}`}
              placeholder="Nhập số lượng tồn kho (>= 0)"
            />
            {errors.stock && (
              <div data-testid="field-error-stock" className="field-error">
                {errors.stock}
              </div>
            )}
          </div>

          {/* 6. Trạng thái */}
          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Trạng thái
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="form-control"
            >
              <option value="active">Đang bán</option>
              <option value="inactive">Ngừng bán</option>
            </select>
          </div>

          {/* Nút thao tác */}
          <div className="form-actions">
            <Link to="/products" className="btn btn-secondary">
              Huỷ
            </Link>
            <button
              type="submit"
              data-testid="submit-button"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
