# TÀI LIỆU NGHIỆP VỤ: TÍNH NĂNG LINK PHÂN KÊNH & QUẢN LÝ CỘNG TÁC VIÊN
**Dự án**: Viettel Tammi - Link Phân Kênh
**Đối tượng**: Đội ngũ Phát triển (Dev) / Phân tích nghiệp vụ (BA)

Tài liệu này thống kê toàn bộ các tính năng đặc biệt, logic nghiệp vụ và luồng thao tác của hệ thống Link Phân Kênh, tập trung vào 3 nhóm đối tượng: Nhân viên kinh doanh (NVKD), Cộng tác viên (CTV) và Khách hàng.

---

## 1. LUỒNG DÀNH CHO NHÂN VIÊN KINH DOANH (NVKD)

NVKD là tài khoản quản trị cấp cơ sở, có quyền quản lý hệ thống đại lý/CTV tuyến dưới và xem toàn bộ báo cáo doanh thu.

### 1.1. Quản lý Cộng tác viên (CTV)
- **Thêm mới CTV**: NVKD có thể tạo tài khoản cho CTV mới bằng cách nhập Họ tên, Số điện thoại và cấu hình **Tỷ lệ chia sẻ hoa hồng** (Mặc định 50%).
- **Sửa thông tin**: Cho phép thay đổi thông tin cá nhân và đặc biệt là điều chỉnh linh hoạt tỷ lệ chia sẻ hoa hồng của từng CTV dựa trên thỏa thuận.
- **Tạm khóa / Mở khóa**: Khóa tài khoản không cho CTV đăng nhập nhưng vẫn giữ lại toàn bộ dữ liệu lịch sử đơn hàng.
- **Xóa CTV**: Hủy bỏ tài khoản của CTV khỏi hệ thống.

### 1.2. Công cụ phân kênh và Bán hàng
- **Sinh liên kết cá nhân (Referral Link)**: Mỗi NVKD có một định danh (Mã nhân viên hoặc SĐT). Hệ thống sẽ sinh đường link có chứa định danh dạng `?NV={ID}`.
- **Mã QR Code**: Hỗ trợ tự động tạo QR Code từ link giới thiệu, hỗ trợ NVKD tải QR Code về máy để in ấn hoặc chia sẻ.
- **Giao diện Modal chia sẻ tối ưu**: Khi NVKD/CTV bấm vào chi tiết một gói cước, khối chức năng "Chia sẻ" (Link & QR Code) được thiết kế thu nhỏ và neo (float) ở góc trên cùng bên phải. Cách bố trí này giúp phần thông tin chính của gói cước (thông số, quyền lợi) được mở rộng tối đa trên màn hình, mang lại trải nghiệm đọc trực quan và chuyên nghiệp.

### 1.3. Thống kê và Báo cáo Doanh thu
- **Dashboard Tổng quan**: Xem tổng doanh số, tổng số thuê bao mới và hoa hồng (Tự bán + CTV bán).
- **Phân loại thời gian**: Lọc số liệu theo Tháng này, Tháng trước, 3 Tháng, và 12 Tháng.
- **Biểu đồ xu hướng**: Theo dõi biến động doanh số 12 tháng của toàn bộ nhánh (bao gồm cả NVKD và các CTV).
- **Chi tiết đơn hàng**: Danh sách toàn bộ các đơn hàng đã phát sinh từ Link phân kênh, kèm theo trạng thái xử lý thực tế (Đang triển khai, Hoàn thành...). Có hỗ trợ xuất file CSV.

---

## 2. LUỒNG DÀNH CHO CỘNG TÁC VIÊN (CTV)

CTV là các đối tác tuyến dưới của NVKD. Hệ thống cung cấp cho CTV công cụ để theo dõi minh bạch quyền lợi của mình.

### 2.1. Đăng nhập và Cá nhân hóa
- **Đăng nhập không cần mật khẩu**: CTV chỉ cần sử dụng Số điện thoại để đăng nhập (Hệ thống giả lập luồng gửi mã OTP để xác thực). Không yêu cầu mật khẩu phức tạp.
- **Cập nhật hình ảnh**: CTV có thể tự tải lên ảnh đại diện để hệ thống hiển thị chuyên nghiệp hơn khi khách hàng truy cập vào link của họ.

### 2.2. Giao diện làm việc (Dashboard CTV)
Giao diện của CTV được tối ưu hóa hiển thị, chia thành 2 Tab chính:
- **Tab "Kết quả bán hàng"**:
  - Xem thống kê chi tiết các đơn hàng **chỉ do chính CTV đó bán được**.
  - Xem số tiền hoa hồng được nhận dựa trên tỷ lệ chia sẻ đã chốt với NVKD (Hiển thị rõ mức tỷ lệ chia sẻ hiện tại).
  - Biểu đồ xu hướng 12 tháng cá nhân và bảng danh sách đơn hàng chi tiết.
- **Tab "Tài khoản của bạn" (Công cụ bán hàng)**:
  - **Liên kết tổng**: Link QR dùng chung trỏ về trang chủ.
  - **Liên kết nhanh (Deep-link)**: Chứa sẵn các thẻ liên kết đến trực tiếp các Gói cước nổi bật (SUN1T, STAR1T, 5G230B...). Các link này được gắn kèm tham số `?NV={SDT_CTV}&SP={Mã_Gói}`. CTV chỉ cần nhấn nút 📋 "Sao chép" để gửi thẳng cho khách.

---

## 3. LUỒNG DÀNH CHO KHÁCH HÀNG (Người mua)

Đây là luồng trải nghiệm quan trọng nhất khi Khách hàng bấm vào Link hoặc quét Mã QR từ NVKD/CTV. Hệ thống chú trọng việc xây dựng niềm tin để tăng tỷ lệ chuyển đổi.

### 3.1. Theo dõi Định danh & Huy hiệu tin cậy (Trust Badge)
- Khi khách hàng truy cập vào một URL có chứa tham số `?NV={ID}`, hệ thống tự động giải mã ID này để biết người giới thiệu là ai (NVKD hay CTV).
- **Huy hiệu "Được giới thiệu bởi" (Trust Badge)**: Một popup/badge nổi sẽ xuất hiện ở góc phải bên dưới màn hình.
  - Hiển thị Ảnh đại diện, Tên, và Vai trò của người giới thiệu (NVKD Viettel hoặc CTV Viettel).
  - Hiển thị dấu tích xanh: **"✔ Đã xác thực bởi Viettel"**.
  - Hiển thị mức độ uy tín: VD *"Đã hỗ trợ 150+ khách hàng đăng ký"*.
  - Tích hợp nút gọi điện (Call) và nhắn tin Zalo trực tiếp cho người giới thiệu để khách hàng nhờ tư vấn.

### 3.2. Điều hướng Sản phẩm (Smart Routing)
- Nếu link truy cập chứa thêm tham số `?SP={Mã_Gói}` (ví dụ do CTV dùng tính năng *Liên kết nhanh*).
- Hệ thống sẽ **tự động chuyển hướng** (scroll) đến đúng danh mục chứa gói cước đó, đồng thời **tự động bật Modal chi tiết** của gói cước lên ngay trước mắt khách hàng. Khách hàng không cần phải tự tìm kiếm sản phẩm trong danh sách dài.

### 3.3. Ghi nhận Đơn hàng tự động
- Trạng thái người giới thiệu (Referral State) được lưu trữ xuyên suốt quá trình khách hàng lướt web.
- Khi khách hàng tiến hành bấm "Đăng ký" bất kỳ gói cước nào, hệ thống tự động nội suy và gán **Mã NVKD / Mã CTV** vào biên bản của Đơn hàng.
- NVKD và CTV ngay lập tức sẽ thấy đơn hàng mới này (ở trạng thái *Đang thực hiện*) hiển thị trong Dashboard thống kê của mình.

### 3.4. Kịch bản Demo trải nghiệm Khách hàng
Để trực tiếp kiểm thử mức độ thuyết phục của hệ thống đối với khách hàng, có thể thực hiện theo kịch bản sau:
1. Đăng nhập với tư cách NVKD hoặc CTV.
2. Mở chi tiết một gói cước bất kỳ, chọn nút **"Sao chép liên kết"**.
3. Mở một trình duyệt ẩn danh mới (Incognito Mode) để giả lập là khách hàng mới hoàn toàn, dán link vừa copy và truy cập.
4. **Kết quả mong đợi:** Trang tự động mở gói cước tương ứng. Đồng thời, "Huy hiệu tin cậy" tự động hiển thị ở góc màn hình với đầy đủ hình ảnh, chức danh, con dấu xác thực của Viettel và các nút liên hệ. Khi bấm "Đăng ký", đơn hàng lập tức được cộng vào doanh số của người đã copy link.

---

## 4. CHÍNH SÁCH VÀ GHI NHẬN DOANH SỐ (SALES LOGIC)

Chính sách tính toán doanh số được quy định chặt chẽ như sau:
1. **Ghi nhận Đơn hàng**: Chỉ các đơn hàng ở trạng thái **Hoàn thành** mới được cộng vào tổng doanh số.
2. Hệ thống tách bạch kết quả: NVKD sẽ nhìn thấy tổng Doanh số và Số lượng đơn hàng của cả cá nhân tự bán và toàn bộ CTV cấp dưới bán. CTV chỉ nhìn thấy thông tin của chính mình.
