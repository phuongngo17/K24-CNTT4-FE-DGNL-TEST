// src/utils/format.js
// Các hàm tiện ích định dạng dữ liệu theo chuẩn Việt Nam

/**
 * Định dạng số thành chuỗi tiền tệ Việt Nam (VD: 1290000 -> 1.290.000 ₫)
 * @param {number|string} price - Giá sản phẩm
 * @returns {string} Chuỗi giá đã định dạng
 */
export function formatPrice(price) {
  const num = Number(price);
  if (isNaN(num)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
}
