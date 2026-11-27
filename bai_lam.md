# BÀI LÀM – ĐÁNH GIÁ NĂNG LỰC FRONTEND (K24)

- **Mã đề:** 01
- **Họ tên:** Thí sinh K24
- **Lớp:** K24
- **Link repository:** 
- **Hệ điều hành (Windows/macOS):** Windows
- **Mã commit P1 (sau Mục 4.1):** *(chờ commit P1)*
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

*(Chưa thực hiện - chỉ triển khai phạm vi Mục 4.1 theo yêu cầu)*

- [ ] 4.2.1. Tải danh sách
- [ ] 4.2.2. Form thêm sản phẩm
- [ ] 4.2.3. Gửi form
- [ ] 4.2.4. Sửa sản phẩm
- [ ] 4.2.5. Xoá sản phẩm

## 4.3. Tìm kiếm, lọc và phân trang

> Pha 2 – mức AI-2 (được dùng AI, ghi nhật ký ở Mục 4.3.5).

> Mục 4.3.1 đến 4.3.3 và ý c của Mục 4.3.4 chấm trực tiếp trên mã nguồn.

*(Chưa thực hiện - chỉ triển khai phạm vi Mục 4.1 theo yêu cầu)*

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

Không sử dụng AI (Chỉ làm Mục 4.1 ở mức AI-0).

## Ghi chú (không tính điểm)

Đã hoàn thành toàn diện Mục 4.1 theo chuẩn quy định:
- Header hiển thị "OfficeMart Admin".
- Tự động chuyển hướng từ `/` sang `/products`.
- Thẻ main chứa tiêu đề `<h1>Sản phẩm</h1>` và nút `Thêm sản phẩm` (`data-testid="add-button"`).
- Component `ProductTable` và `ProductRow` hiển thị đủ 8 sản phẩm mẫu trong `src/data/sample.js` qua props.
- Đầy đủ 7 cột theo đúng thứ tự.
- Định dạng tiền tệ Việt Nam (`1.290.000 ₫`).
- Trạng thái `active` -> "Đang bán" (nền xanh), `inactive` -> "Ngừng bán" (nền xám) với `data-testid="product-status"`.
- Tồn kho bằng 0 hiển thị "Hết hàng" màu đỏ.
- Đáp ứng Responsive trên điện thoại dưới 768px dạng thẻ dọc, tại 375px không xuất hiện thanh cuộn ngang.
