// src/hooks/useProductSearch.js
// Custom Hook tải danh sách sản phẩm có xử lý Race Condition bằng AbortController (Mục 4.3.4 c)
import { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api/axiosClient.js';

/**
 * Hook tìm kiếm, lọc và phân trang sản phẩm với cơ chế huỷ request cũ khi tham số thay đổi
 * @param {Object} params - Tham số truy vấn { q, category, status, page, limit }
 * @returns {Object} { data, total, loading, error, refetch }
 */
export default function useProductSearch(params) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Hàm kích hoạt tải lại dữ liệu (dùng cho nút Thử lại hoặc sau khi xoá sản phẩm)
  const refetch = () => {
    setRefreshIndex((prev) => prev + 1);
  };

  useEffect(() => {
    // 1. Tạo AbortController để huỷ request cũ khi tham số thay đổi
    const controller = new AbortController();
    let isCurrent = true;

    async function load() {
      setLoading(true);
      setError(null);

      // Chuẩn hoá tham số: loại bỏ khoảng trắng thừa ở từ khoá tìm kiếm
      const queryParams = { ...params };
      if (typeof queryParams.q === 'string') {
        queryParams.q = queryParams.q.trim();
      }

      try {
        // Gửi request kèm signal của AbortController
        const res = await api.get('/products', {
          params: queryParams,
          signal: controller.signal,
        });

        // Chỉ cập nhật state nếu đây là request mới nhất và component vẫn còn mount
        if (isCurrent && !controller.signal.aborted) {
          setData(res.data?.data || []);
          setTotal(res.data?.total || 0);
        }
      } catch (err) {
        // Nếu lỗi do AbortController huỷ request hoặc request bị cancel -> Bỏ qua, không báo lỗi
        if (axios.isCancel(err) || err.name === 'CanceledError' || controller.signal.aborted) {
          return;
        }

        if (isCurrent) {
          const message =
            err.response?.data?.message || err.message || 'Lỗi máy chủ, vui lòng thử lại';
          setError(message);
        }
      } finally {
        // Chỉ tắt loading nếu request này vẫn là request hợp lệ mới nhất
        if (isCurrent && !controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();

    // 2. Cleanup function: Huỷ ngay request đang chạy khi dependency thay đổi
    return () => {
      isCurrent = false;
      controller.abort();
    };
  }, [params.q, params.category, params.status, params.page, params.limit, refreshIndex]);

  return { data, total, loading, error, refetch };
}
