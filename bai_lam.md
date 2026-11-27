# BÀI LÀM – ĐÁNH GIÁ NĂNG LỰC FRONTEND (K24)

- **Mã đề:** 01
- **Họ tên:** Thí sinh K24
- **Lớp:** K24
- **Link repository:** 
- **Hệ điều hành (Windows/macOS):** Windows
- **Mã commit P2 (sau Mục 4.2, trước phút 90):** *(chờ commit P2)*
- **Phiên bản Node.js (gõ `node -v`):** v22.14.0

## 4.1. Giao diện danh sách sản phẩm

> Pha 1 – mức AI-0 (không dùng AI).

> Chấm trực tiếp trên mã nguồn thư mục officemart_admin. Đánh dấu `[x]` vào các mục đã làm để tự kiểm tra.

- [x] 4.1.1. Bố cục trang
- [x] 4.1.2. Bảng sản phẩm
- [x] 4.1.3. Định dạng dữ liệu
- [x] 4.1.4. Hiển thị trên điện thoại

## 4.2. Thêm, sửa, xoá sản phẩm qua API

> Pha 1 – mức AI-0 (không dùng AI).

> Chấm trực tiếp trên mã nguồn thư mục officemart_admin.

- [x] 4.2.1. Tải danh sách
- [x] 4.2.2. Form thêm sản phẩm
- [x] 4.2.3. Gửi form
- [x] 4.2.4. Sửa sản phẩm
- [x] 4.2.5. Xoá sản phẩm

## 4.3. Tìm kiếm, lọc và phân trang

> Pha 2 – mức AI-2 (được dùng AI, ghi nhật ký ở Mục 4.3.5).

> Mục 4.3.1 đến 4.3.3 và ý c của Mục 4.3.4 chấm trực tiếp trên mã nguồn.

*(Chưa thực hiện - chỉ triển khai phạm vi Mục 4.1 và Mục 4.2 theo yêu cầu)*

- [ ] 4.3.1. Tìm kiếm và lọc
- [ ] 4.3.2. Phân trang
- [ ] 4.3.3. Đồng bộ URL

### 4.3.4. Phản biện mã do AI sinh

#### a) Thao tác làm danh sách hiển thị sai

*(Chưa thực hiện)*

#### b) Vì sao hook hiển thị sai

*(Chưa thực hiện)*

#### c) Hook đã sửa

*(Chưa thực hiện)*

### 4.3.5. Nhật ký dùng AI (giữ – sửa – loại bỏ)

Không sử dụng AI (Chỉ làm Mục 4.1 và Mục 4.2 ở mức AI-0).

## Ghi chú (không tính điểm)

Đã hoàn thành toàn diện Mục 4.1 và Mục 4.2:
1. **Mục 4.1**:
   - Header hiển thị "OfficeMart Admin".
   - Tự động chuyển hướng từ `/` sang `/products`.
   - Thẻ main chứa tiêu đề `<h1>Sản phẩm</h1>` và nút `Thêm sản phẩm` (`data-testid="add-button"`).
   - Component `ProductTable` và `ProductRow` hiển thị bảng 7 cột, định dạng giá tiền Việt Nam, nhãn trạng thái Đang bán/Ngừng bán, tồn kho 0 hiển thị "Hết hàng" màu đỏ.
   - Đáp ứng Responsive trên điện thoại dưới 768px dạng thẻ dọc, tại 375px không xuất hiện thanh cuộn ngang.
2. **Mục 4.2**:
   - Tải danh sách sản phẩm từ API `GET /api/products?page=1&limit=10`.
   - Xử lý 3 trạng thái: `loading` (`data-testid="loading"`), `error` (`data-testid="error-message"` + `data-testid="retry-button"`), `empty` (`data-testid="empty-state"`).
   - Bấm nút "Thêm sản phẩm" chuyển sang `/products/new` hiển thị form (`data-testid="product-form"`), danh mục lấy từ `GET /api/categories`.
   - Validate form chặt chẽ (name 3-100 ký tự, sku dạng ABC-1234, category bắt buộc, price > 0, stock nguyên >= 0) và hiển thị lỗi tương ứng dưới từng trường (`field-error-<field>`).
   - Gửi POST thêm mới: khoá nút lưu (`submit-button`), quay về `/products`, hiển thị toast (`data-testid="toast"`). Xử lý lỗi trùng SKU (409) hiển thị lỗi tại `field-error-sku` và giữ nguyên dữ liệu đã nhập.
   - Bấm nút Sửa (`edit-button`) chuyển sang `/products/:id/edit`, điền sẵn dữ liệu từ `GET /api/products/:id`, gửi PUT cập nhật và xử lý 404 nếu không tìm thấy sản phẩm.
   - Bấm nút Xoá (`delete-button`) mở hộp thoại xác nhận xoá tự làm (`confirm-dialog`, `confirm-yes`, `confirm-no`). Huỷ không gọi API, Đồng ý gọi `DELETE /api/products/:id`, sản phẩm biến mất khỏi danh sách và hiển thị toast thông báo.
