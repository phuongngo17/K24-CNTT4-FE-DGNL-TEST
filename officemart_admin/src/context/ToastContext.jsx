// src/context/ToastContext.jsx
import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext(null);

/**
 * Provider quản lý hiển thị thông báo toast thành công trên toàn ứng dụng
 */
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  /**
   * Hiển thị thông báo toast
   * @param {string} message - Nội dung thông báo
   */
  const showToast = (message) => {
    setToast(message);
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div data-testid="toast" className="toast">
          {toast}
        </div>
      )}
    </ToastContext.Provider>
  );
}

/**
 * Hook tiện ích để gọi showToast từ bất kỳ component nào
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast phải được sử dụng bên trong ToastProvider');
  }
  return context;
}
