# Trang demo Gói cước Viettel (Internet/Truyền hình + Sim số + Gói Data/5G + Đăng nhập OTP)

## Nội dung thư mục
- `index.html` — Trang web tĩnh, tự chứa (không cần server, không cần internet). Mở trực tiếp bằng trình duyệt (double-click file hoặc kéo vào Chrome).
- `data.json` — Dữ liệu gốc dạng JSON, tách riêng để dễ cập nhật/tái sử dụng cho các mục đích khác (đã được nhúng sẵn vào `index.html`, không cần liên kết ngoài).
- `build_goidata.py` — Script Python đã dùng để sinh nhóm dữ liệu `goiData` (gói Data/5G) vào `data.json`. Giữ lại để tham khảo cách cập nhật dữ liệu sau này.
- `build_roaming.py` — Script Python đã dùng để sinh nhóm dữ liệu `goiRoaming` (gói Roaming) vào `data.json`.
- `build_hot_mxh_uudai.py` — Script Python đã dùng để sinh 3 nhóm dữ liệu `goiHot` (Gói cước HOT), `goiMXH` (Miễn phí MXH), `goiSieuUuDai` (Siêu ưu đãi thoại/data) vào `data.json`.

## Nguồn dữ liệu
Dữ liệu được tổng hợp thủ công từ ảnh chụp màn hình do người dùng cung cấp, chụp từ:
- https://viettel.vn/vx/internet-truyenhinh/ (tab Gói Internet)
- https://viettel.vn/vx/internet-truyenhinh/toan-trinh/ (Mesh Wifi tốc độ cao)
- https://viettel.vn/vx/internet-truyenhinh/combo (Combo Internet - TV360, Combo Internet - Camera)
- https://viettel.vn/vx/di-dong/sim-so/ (Sim số trả trước/trả sau)
- https://viettel.vn/vx/di-dong/goi-data-1/ (Danh sách gói cước 5G: 7 ngày / 30 ngày / Dài ngày 90-180-360 ngày)
- https://viettel.vn/vx/di-dong/goi-data-1/ (tab Gói roaming: Ngày / Tuần / Tháng)

Ngày thu thập: 02/07/2026.

## Cấu trúc trang
Trang có 3 tab lớn ở header:

1. **Internet/Truyền hình**: banner giới thiệu + 4 tab (Gói Internet, Mesh Wifi tốc độ cao, Combo Internet - Truyền hình, Combo Internet - Camera), mỗi tab hiển thị dạng thẻ (card) giống bố cục gốc: mã gói, tốc độ, khu vực áp dụng, chu kỳ đóng cước, giá/tháng, nút Đăng ký + Chi tiết gói cước.
2. **Di động/Sim số**: toggle Trả trước/Trả sau, ô tìm kiếm theo số, bảng danh sách sim (chọn bằng click vào dòng), liên kết "Chọn số khác", dropdown "Chọn gói cước chính".
3. **Gói cước Data/5G**: breadcrumb + 6 tab danh mục. 5 tab có dữ liệu demo:
   - *Gói cước HOT*: 3 gói (nhóm "1 ngày") — ảnh chụp gốc mới cho xem preview "Tất cả", chưa mở hết các nhóm thời hạn khác nên dữ liệu còn hạn chế.
   - *Gói cước 5G*: bộ lọc theo thời hạn (Tất cả/7 ngày/30 ngày/Dài ngày), 34 gói cước với Data/Thoại/Tiện ích, giá kèm giá gốc gạch ngang + % giảm.
   - *Miễn phí MXH*: bộ lọc theo thời hạn (Tất cả/1 ngày/7 ngày/30 ngày/Dài ngày), 12 gói ưu đãi data Facebook/Instagram, Youtube, TikTok riêng biệt.
   - *Siêu ưu đãi thoại/data*: bộ lọc theo thời hạn (Tất cả/1 ngày/3 ngày/7 ngày/15 ngày/30 ngày/Dài ngày/Khác), 20 gói kết hợp Data + Thoại + SMS + Tiện ích (TV360...).
   - *Gói roaming*: bộ lọc riêng theo thời hạn (Tất cả/Ngày/Tuần/Tháng), 37 gói cước với Ưu đãi/Phạm vi quốc gia áp dụng.
   Tab còn lại (Gói tặng) hiển thị ghi chú "chưa có dữ liệu demo". Tất cả tab có dữ liệu đều dùng chung nút sắp xếp theo giá (tăng/giảm), nhưng bộ lọc thời hạn tự đổi nhãn theo từng danh mục; nếu bộ lọc đang chọn không có gói nào khớp, trang hiển thị ghi chú "Chưa có dữ liệu demo cho bộ lọc này" thay vì để trống.

**Đăng nhập theo số điện thoại**: nút "Đăng nhập" trên header mở modal 2 bước (nhập số điện thoại hợp lệ → nhập mã OTP 6 số), có đồng hồ đếm "Gửi lại OTP" và "OTP hết hạn", giống luồng thật của viettel.vn. Vì đây là trang demo tĩnh không có backend/API SMS, mã OTP được sinh ngẫu nhiên ngay trên trình duyệt và hiển thị công khai trong khung gợi ý để test — **không dùng cách này cho môi trường production**. Đăng nhập thành công sẽ đổi nút "Đăng nhập" thành chip hiển thị số điện thoại đã ẩn bớt; bấm lại để đăng xuất (trạng thái chỉ lưu trong bộ nhớ, mất khi tải lại trang).

**Menu "Hỗ trợ khách hàng" / "My Viettel" (chỉ mở sau khi đăng nhập)**: hai mục này trên header giờ là dropdown thật, lấy đúng danh sách mục từ ảnh chụp màn hình:
- *Hỗ trợ khách hàng* (13 mục, 2 cột): Câu hỏi thường gặp, Video hướng dẫn, Cửa hàng Viettel, Góp ý sản phẩm dịch vụ, Chat online với CSKH, Cộng đồng Viettel giải đáp Online, Tra cứu bảo hành, Tra cứu đơn hàng, Đặt lịch hẹn xác minh, Hỗ trợ dịch vụ, Tra cứu báo cáo đơn hàng, Tra cứu lịch sử không nhận quảng cáo, Tra cứu chuẩn hoá theo nghị định 49.
- *My Viettel* (20 mục, 3 cột: Quản lý cước / Tiện ích / Lan tỏa): Tra cứu cước, Tra cứu thông báo cước, Thanh toán Online, Hoá đơn bán hàng, Mua thẻ cào, Thông tin thuê bao, Dịch vụ đang sử dụng, Khuyến mại dành cho bạn, Đổi sim, Thay đổi giấy tờ, Chuyển sang trả sau, Chuyển mạng giữ số, Xác nhận thuê bao, Hoàn thiện đơn hàng Internet, Quản lý multi-sim, Đổi eSim, Lan tỏa Di động, Lan tỏa Cố định, Lan tỏa Thanh toán cước, Lan tỏa dịch vụ doanh nghiệp.

Khi **chưa đăng nhập**, di chuột vào 2 mục này chỉ hiện tooltip nhỏ "Đăng nhập để xem đầy đủ" (không mở được menu). Khi **đã đăng nhập**, di chuột vào sẽ hiện đầy đủ dropdown như trên; panel "My Viettel" được canh phải (thay vì canh trái mặc định) vì đây là mục ngoài cùng bên phải header, tránh bị tràn ra ngoài màn hình. Các link trong dropdown chỉ là minh hoạ (không điều hướng thật).

Các nút "Đăng ký" chỉ là thao tác minh hoạ (hiển thị thông báo trong trang), **không gửi yêu cầu hay giao dịch thật** tới hệ thống Viettel.

## Cập nhật dữ liệu
Muốn đổi giá/gói cước: sửa file `data.json`, sau đó nhúng lại vào `index.html` bằng cách thay toàn bộ khối `const DATA = { ... };` trong thẻ `<script>` bằng nội dung JSON mới (có thể yêu cầu dựng lại trang, hoặc chạy đoạn Python tương tự `build_goidata.py`).

## Giới hạn
- Đây là bản demo trình bày lại giao diện, không phải bản sao chính xác pixel-by-pixel của viettel.vn và không kết nối API/CSDL thật (phù hợp quy tắc bảo mật dự án: không hardcode API Key/Token/Sheet ID thật).
- Một số gói (ví dụ nhóm "Mesh Wifi tốc độ cao") gộp cả dữ liệu lấy từ 2 ảnh khác nhau (32 Tỉnh & Nội thành HNI/HCM) — xem cột "khu vực" trong `data.json` để phân biệt.
- Một vài gói dài ngày (ví dụ 6T5G330B, 6T5G380B, 12T5G180B) không xuất hiện trong ảnh chụp màn hình gốc nên chưa có trong `data.json` — có thể bổ sung sau nếu có thêm dữ liệu.
- Tính năng đăng nhập OTP là mô phỏng phía trình duyệt, không xác thực với hệ thống Viettel thật.
