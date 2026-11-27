import React from 'react';

export default function ConfirmDialog({
  isOpen,
  title = 'Xác nhận xoá',
  message = 'Bạn có chắc chắn muốn xoá sản phẩm này không? Thao tác này không thể hoàn tác.',
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div data-testid="confirm-dialog" className="confirm-dialog">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="dialog-actions">
          <button
            type="button"
            data-testid="confirm-no"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Huỷ
          </button>
          <button
            type="button"
            data-testid="confirm-yes"
            className="btn btn-delete"
            onClick={onConfirm}
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
}
