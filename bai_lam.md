# BÀI LÀM – ĐÁNH GIÁ NĂNG LỰC FRONTEND (K24)

- **Mã đề:** 01
- **Họ tên:** Thí sinh K24
- **Lớp:** K24
- **Link repository:** 
- **Hệ điều hành (Windows/macOS):** Windows
- **Mã commit P2 đã nộp trước phút 90 (gõ `git log --oneline -1`):** cd2064d
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

- [x] 4.3.1. Tìm kiếm và lọc
- [x] 4.3.2. Phân trang
- [x] 4.3.3. Đồng bộ URL

### 4.3.4. Phản biện mã do AI sinh

#### a) Thao tác làm danh sách hiển thị sai

Các bước thao tác:

```text
1. Khởi động API mock ở chế độ mạng chậm: npm run api:cham (ở chế độ này, các request tìm kiếm có từ khoá bắt đầu bằng "ban" sẽ bị trễ 2,5 giây; các request khác chỉ trễ 0,1 giây).
2. Chạy ứng dụng giao diện với npm run dev, sau đó mở trình duyệt tại địa chỉ http://localhost:5173/products.
3. Tại ô tìm kiếm (data-testid="search-input"), nhập từ khoá "ban".
4. Ngay lập tức (trong vòng dưới 1 giây, trước khi request 2,5 giây hoàn thành), xoá ô tìm kiếm và nhập từ khoá mới là "chuot".
```

Kết quả hiển thị:

```text
- Khoảng 0,1 giây sau khi nhập "chuot", danh sách phản hồi nhanh chóng và hiển thị đúng các sản phẩm liên quan đến chuột (Chuột không dây, Chuột công thái học...).
- Tuy nhiên, sau khoảng 2,5 giây, request cũ của từ khoá "ban" mới hoàn thành. Lúc này hook của AI gọi setData(res.data.data) ghi đè lên state.
- Kết quả trên màn hình: Ô tìm kiếm đang hiển thị "chuot", nhưng bảng danh sách bên dưới lại hiển thị sản phẩm của "ban" (Bàn phím cơ K87, Bàn làm việc gỗ...).
```

Kết quả đúng:

```text
- Danh sách sản phẩm bên dưới phải luôn luôn đồng bộ và khớp chính xác với từ khoá tìm kiếm mới nhất hiện tại trên ô nhập liệu (là các sản phẩm liên quan đến "chuot").
- Khi người dùng thay đổi từ khoá hoặc tham số lọc, request cũ đang chờ xử lý của từ khoá "ban" phải bị huỷ bỏ (abort) ngay lập tức, không được phép can thiệp hay ghi đè lên dữ liệu mới nhất.
```

#### b) Vì sao hook hiển thị sai

Hook `src/ai/useProductSearch_ai.js` gặp phải lỗi bất đồng bộ cạnh tranh (Race Condition). Trong hook này, `useEffect` phụ thuộc vào `[params.q, params.category, params.status, params.page]`, nhưng không hề cài đặt hàm dọn dẹp (cleanup function) và không sử dụng cơ chế huỷ request (`AbortController`). Khi người dùng thay đổi tham số liên tục, nhiều request bất đồng bộ được gửi đi song song; do thời gian phản hồi của mạng là ngẫu nhiên (hoặc request cũ phản hồi chậm hơn request mới), kết quả của request cũ đến sau đã gọi `setData` đè lên kết quả của request mới nhất. Ngoài ra, khối `finally { setLoading(false); }` của request cũ hoàn thành muộn cũng làm sai lệch trạng thái loading của ứng dụng.

#### c) Hook đã sửa

> Chấm trực tiếp trên file src/hooks/useProductSearch.js và trang danh sách.

### 4.3.5. Nhật ký dùng AI (giữ – sửa – loại bỏ)

> Ghi ít nhất 2 lần dùng AI có ảnh hưởng đến mã nộp. Không dùng AI trong Pha 2 thì xoá bảng và ghi "Không sử dụng AI trong Pha 2".

| Lần | Câu lệnh chính gửi cho AI | Đoạn mã hoặc ý AI đưa ra (file) | Quyết định (giữ/sửa/loại bỏ) | Lý do | Bằng chứng kiểm chứng (chạy thử gì, kết quả) |
|---|---|---|---|---|---|
| 1 | Viết custom hook useProductSearch tải danh sách sản phẩm theo từ khoá q, danh mục category, trạng thái status và trang page. | Đoạn mã trong `src/ai/useProductSearch_ai.js`: Gọi trực tiếp `api.get('/products', { params })` trong `useEffect` mà không có cơ chế huỷ request. | Loại bỏ | Hook bị lỗi Race Condition nghiêm trọng: khi gõ phím nhanh hoặc mạng chập chờn, request cũ trả về sau sẽ ghi đè dữ liệu mới, làm sai lệch kết quả hiển thị trên bảng sản phẩm. | Chạy API với `npm run api:cham`, gõ `"ban"` rồi gõ nhanh `"chuot"`; sau 2,5 giây bảng sản phẩm bị kết quả của `"ban"` ghi đè lên ô tìm kiếm `"chuot"`. |
| 2 | Hướng dẫn sửa lỗi Race Condition trong React custom hook khi gọi API bằng axios. | Sử dụng `AbortController`, truyền `signal: controller.signal` vào config của axios `api.get`, và gọi `controller.abort()` trong hàm cleanup trả về của `useEffect`. Bắt lỗi `axios.isCancel(err)` để bỏ qua request bị huỷ. | Sửa | Giữ nguyên kiến trúc chuẩn của `AbortController`, nhưng cần sửa đổi bổ sung: thêm biến cờ `isCurrent` để kiểm soát component unmount, bổ sung hàm `refetch` để hỗ trợ nút "Thử lại" khi API lỗi và làm mới danh sách sau khi xoá sản phẩm, đồng thời chuẩn hoá điều kiện `controller.signal.aborted` trong `finally`. | Cập nhật mã vào `src/hooks/useProductSearch.js`, chạy lại với `npm run api:cham`. Kiểm tra DevTools Tab Network thấy request `"ban"` lập tức chuyển trạng thái `(canceled)`, kết quả trên bảng luôn khớp 100% với từ khoá mới nhất `"chuot"`. |

## Ghi chú (không tính điểm)

Các trường hợp biên đã được kiểm soát và xử lý chặt chẽ trong mã nguồn:
1. **Từ khoá chỉ có khoảng trắng**:
   - Sử dụng `searchTerm.trim()` trước khi kích hoạt debounce và gửi lên URL/API.
   - Nếu người dùng nhập toàn khoảng trắng (VD: `"   "`), hệ thống tự động coi như rỗng, không làm phát sinh request sai lệch và hiển thị danh sách đầy đủ.
2. **Số trang trên URL không hợp lệ (VD: `page=-3`, `page=abc`)**:
   - Trong `ProductListPage.jsx`, giá trị `page` từ `searchParams` được kiểm tra qua `!Number.isInteger(rawPage) || rawPage < 1`. Nếu không hợp lệ, hệ thống tự động chuẩn hoá về trang an toàn là `page = 1`.
3. **Số trang vượt quá dữ liệu (VD: `page=999`)**:
   - Tính toán `totalPages = Math.ceil(total / 10) || 1`.
   - Các nút "Trước" (`page-prev`) và "Sau" (`page-next`) được khoá chính xác: nút "Trước" khoá khi `page <= 1`, nút "Sau" khoá khi `page >= totalPages`.
   - Nếu người dùng xoá hết sản phẩm duy nhất ở trang cuối cùng, hệ thống tự động chuyển lùi về trang trước đó.
