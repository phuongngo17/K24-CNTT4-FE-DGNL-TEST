// src/utils/format.js

/**
 * ============================================================================
 * MỤC 4.1.3: ĐỊNH DẠNG DỮ LIỆU
 * Định dạng số thành chuỗi tiền tệ Việt Nam (VD: 1290000 -> 1.290.000 ₫)
 * ============================================================================
 * @param {number|string} price - Giá sản phẩm
 * @returns {string} Chuỗi hiển thị tiền tệ Việt Nam
 */
export function formatPrice(price) {
  const num = Number(price);
  if (isNaN(num)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
}
