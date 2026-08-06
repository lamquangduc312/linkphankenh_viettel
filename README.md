# Trang demo Gói cước Viettel (Internet/Truyền hình + Sim số + Gói Data/5G + Đăng nhập OTP + Kênh nhân viên KD)

## Nội dung thư mục
- `index.html` — Trang web tĩnh, tự chứa (không cần server, không cần internet). Mở trực tiếp bằng trình duyệt (double-click file hoặc kéo vào Chrome).
- `data.json` — Dữ liệu gốc dạng JSON, tách riêng để dễ cập nhật/tái sử dụng cho các mục đích khác (đã được nhúng sẵn vào `index.html`, không cần liên kết ngoài).
- `build_goidata.py` — Script Python đã dùng để sinh nhóm dữ liệu `goiData` (gói Data/5G) vào `data.json`. Giữ lại để tham khảo cách cập nhật dữ liệu sau này.
- `build_roaming.py` — Script Python đã dùng để sinh nhóm dữ liệu `goiRoaming` (gói Roaming) vào `data.json`.
- `build_hot_mxh_uudai.py` — Script Python đã dùng để sinh 3 nhóm dữ liệu `goiHot` (Gói cước HOT), `goiMXH` (Miễn phí MXH), `goiSieuUuDai` (Siêu ưu đãi thoại/data) vào `data.json`.

Tính năng "Kênh nhân viên KD" (đăng nhập NVKD, tổng quan bán hàng, quản lý CTV, mã QR, xuất báo cáo) không có script build riêng vì dữ liệu được sinh trực tiếp bằng JavaScript ngay trong `index.html` (không qua `data.json`) — xem chi tiết ở mục "Kênh nhân viên kinh doanh địa bàn" bên dưới.

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
Header có 2 lớp điều hướng:
- **Thanh nav trên cùng**: Tin tức sự kiện, Sản phẩm dịch vụ, Viettel++, Viettel Shop, Hỗ trợ khách hàng, My Viettel, **Hỗ trợ nhân viên** (mục mới — xem bên dưới), và nút **Đăng nhập** ngoài cùng bên phải.
- **Thanh page-tabs** (3 tab dịch vụ khách hàng): Internet/Truyền hình, Di động/Sim số, Gói cước Data/5G.

1. **Internet/Truyền hình**: banner giới thiệu + 4 tab (Gói Internet, Mesh Wifi tốc độ cao, Combo Internet - Truyền hình, Combo Internet - Camera), mỗi tab hiển thị dạng thẻ (card) giống bố cục gốc: mã gói, tốc độ, khu vực áp dụng, chu kỳ đóng cước, giá/tháng, nút Đăng ký + Chi tiết gói cước.
2. **Di động/Sim số**: toggle Trả trước/Trả sau, ô tìm kiếm theo số, bảng danh sách sim (chọn bằng click vào dòng), liên kết "Chọn số khác", dropdown "Chọn gói cước chính".
3. **Gói cước Data/5G**: breadcrumb + 6 tab danh mục. 5 tab có dữ liệu demo:
   - *Gói cước HOT*: 3 gói (nhóm "1 ngày") — ảnh chụp gốc mới cho xem preview "Tất cả", chưa mở hết các nhóm thời hạn khác nên dữ liệu còn hạn chế.
   - *Gói cước 5G*: bộ lọc theo thời hạn (Tất cả/7 ngày/30 ngày/Dài ngày), 34 gói cước với Data/Thoại/Tiện ích, giá kèm giá gốc gạch ngang + % giảm.
   - *Miễn phí MXH*: bộ lọc theo thời hạn (Tất cả/1 ngày/7 ngày/30 ngày/Dài ngày), 12 gói ưu đãi data Facebook/Instagram, Youtube, TikTok riêng biệt.
   - *Siêu ưu đãi thoại/data*: bộ lọc theo thời hạn (Tất cả/1 ngày/3 ngày/7 ngày/15 ngày/30 ngày/Dài ngày/Khác), 20 gói kết hợp Data + Thoại + SMS + Tiện ích (TV360...).
   - *Gói roaming*: bộ lọc riêng theo thời hạn (Tất cả/Ngày/Tuần/Tháng), 37 gói cước với Ưu đãi/Phạm vi quốc gia áp dụng.
   Tab còn lại (Gói tặng) hiển thị ghi chú "chưa có dữ liệu demo". Tất cả tab có dữ liệu đều dùng chung nút sắp xếp theo giá (tăng/giảm), nhưng bộ lọc thời hạn tự đổi nhãn theo từng danh mục; nếu bộ lọc đang chọn không có gói nào khớp, trang hiển thị ghi chú "Chưa có dữ liệu demo cho bộ lọc này" thay vì để trống.

**Modal "Chi tiết gói cước" / "Xem chi tiết"** (mới) — áp dụng cho **mọi** loại thẻ gói cước trên toàn trang (Gói Internet, Mesh Wifi, Combo Internet-Truyền hình, Combo Internet-Camera, Gói cước HOT, Gói cước 5G, Miễn phí MXH, Siêu ưu đãi thoại/data, Gói roaming): bấm nút "Chi tiết gói cước"/"Xem chi tiết" trên bất kỳ thẻ nào sẽ mở modal giới thiệu chi tiết gồm:
- Tên gói + nhóm gói, giá (kèm giá gốc gạch ngang + % giảm nếu có).
- Đoạn mô tả ngắn — ưu tiên lấy trường mô tả có sẵn trong dữ liệu, nếu gói không có sẵn mô tả thì tự tổng hợp một câu giới thiệu từ các thông số nổi bật (tốc độ/data/thoại/ưu đãi) của chính gói đó.
- Danh sách **"Thông số gói cước"**: chỉ hiển thị những trường thực sự có dữ liệu cho gói đó (tốc độ, dung lượng data, thoại, SMS, ưu đãi kèm theo, tiện ích, thiết bị đi kèm, khu vực áp dụng, chu kỳ thanh toán, thời hạn sử dụng, phạm vi áp dụng) — mỗi gói một danh sách khác nhau tùy loại, không hiển thị trường rỗng.
- Danh sách **"Quyền lợi khi đăng ký"**: 4 quyền lợi chung áp dụng cho mọi gói (đăng ký nhanh/không phụ phí ẩn/hỗ trợ 24/7/đổi-hủy gói linh hoạt).
- Nút "Đăng ký ngay" trong modal dùng lại đúng luồng xác nhận minh hoạ của nút "Đăng ký" ngoài thẻ (đóng modal + hiện khối xác nhận tương ứng), và nút "Đóng"/bấm ra ngoài modal để thoát.

**Chia sẻ gói cước + ghi nhận giới thiệu (mới)** — khép kín vòng "NVKD/CTV chia sẻ → khách hàng xem → đăng ký → ghi nhận công giới thiệu", hoàn toàn mô phỏng phía trình duyệt (không cần backend):
- **🔗 Chia sẻ gói này tới khách hàng**: khi đang đăng nhập vai trò NVKD hoặc CTV (xem mục "Hỗ trợ nhân viên" bên dưới), modal "Chi tiết gói cước" của **bất kỳ gói nào** sẽ có thêm khối này, gồm mã QR + link riêng cho **đúng gói đang xem** (dạng `https://viettel.vn/vx/gioithieu?NV=<mã định danh của bạn>&SP=<mã gói>`), nút "Sao chép liên kết", và nút "⭳ Tải mã QR" (xuất file PNG thật để tải về máy, tiện gửi qua Zalo/tin nhắn cho khách). Khối này **không hiển thị** với khách hàng thường (chưa đăng nhập vai trò NVKD/CTV).
- **Khách hàng bấm vào link chia sẻ**: mở `index.html` kèm `?NV=...&SP=...` trên URL sẽ tự động — nhận diện đúng NVKD/CTV đã chia sẻ, điều hướng thẳng tới đúng trang/tab chứa gói được chia sẻ, và tự mở sẵn modal "Chi tiết gói cước" của đúng gói đó (khách vào là thấy ngay sản phẩm được giới thiệu, không cần tự tìm).
- **Huy hiệu nổi "Được giới thiệu bởi"** (góc dưới bên phải, hiện xuyên suốt mọi trang trong phiên xem): ảnh đại diện, họ tên, vai trò (Nhân viên kinh doanh Viettel kèm địa bàn / Cộng tác viên Viettel), huy hiệu "✔ Đã xác thực bởi Viettel", số liệu "Đã hỗ trợ N+ khách hàng đăng ký" (lấy từ đúng số đơn hàng demo đã có của người đó, không phải số bịa), mã QR, và 2 nút liên hệ trực tiếp "📞 Gọi điện" (mở `tel:`) / "💬 Nhắn Zalo" (mở `https://zalo.me/<sđt>`) — mục đích tạo cảm giác có người thật đứng sau, tăng độ tin cậy khi khách quyết định đăng ký. Cùng 1 khối này cũng được NVKD/CTV dùng để tự xem trước qua nút "👁 Xem trang liên kết"/"👁 Xem trang dịch vụ" ở tab quản lý của họ.
- **Ghi nhận đơn khi đăng ký**: nếu khách hàng đăng ký (dù bấm "Đăng ký" ngoài thẻ hay "Đăng ký ngay" trong modal) trong lúc đang xem qua link chia sẻ, khối xác nhận minh hoạ sẽ hiện thêm dòng "Đơn đăng ký này đã được ghi nhận cho NVKD/CTV \<tên\>", đồng thời một đơn hàng demo mới (đúng mã gói, đúng giá, trạng thái "Đang thực hiện") được thêm vào bảng "Danh sách đơn hàng chi tiết" của đúng người đó — NVKD/CTV đăng nhập lại sẽ thấy ngay đơn mới này trong dashboard của họ.
- Toàn bộ cơ chế này chỉ tồn tại trong bộ nhớ trình duyệt của phiên hiện tại (giống mọi dữ liệu demo khác) — tải lại trang sẽ mất "phiên giới thiệu" đang hoạt động và các đơn hàng vừa ghi nhận.
4. **Hỗ trợ nhân viên** (không còn nằm trong hàng page-tabs — xem mục riêng bên dưới): dành cho Nhân viên kinh doanh (NVKD) địa bàn và Cộng tác viên (CTV), đăng nhập chung qua nút "Đăng nhập" trên header.

**Đăng nhập theo số điện thoại**: nút "Đăng nhập" trên header mở modal với 4 tab vai trò/dịch vụ: 📱 Di động, 📺 Internet/TV (2 tab dành cho khách hàng, như trước), và 2 tab mới 👔 Nhân viên KD, 🤝 Cộng tác viên (dẫn vào trang "Hỗ trợ nhân viên" — xem mục riêng bên dưới). Cả 4 tab dùng chung 1 luồng OTP 2 bước (nhập số điện thoại hợp lệ → nhập mã OTP 6 số), có đồng hồ đếm "Gửi lại OTP" và "OTP hết hạn", giống luồng thật của viettel.vn. Vì đây là trang demo tĩnh không có backend/API SMS, mã OTP được sinh ngẫu nhiên ngay trên trình duyệt và hiển thị công khai trong khung gợi ý để test — **không dùng cách này cho môi trường production**. Modal tự chọn sẵn tab phù hợp theo ngữ cảnh: đang xem trang "Hỗ trợ nhân viên" → mặc định tab Nhân viên KD; các trang khác → Di động/Internet-TV theo trang đang xem. Đăng nhập khách hàng thành công sẽ đổi nút "Đăng nhập" thành chip hiển thị số điện thoại đã ẩn bớt; bấm lại để đăng xuất (trạng thái chỉ lưu trong bộ nhớ, mất khi tải lại trang).

**Menu "Hỗ trợ khách hàng" / "My Viettel" (chỉ mở sau khi đăng nhập)**: hai mục này trên header giờ là dropdown thật, lấy đúng danh sách mục từ ảnh chụp màn hình:
- *Hỗ trợ khách hàng* (13 mục, 2 cột): Câu hỏi thường gặp, Video hướng dẫn, Cửa hàng Viettel, Góp ý sản phẩm dịch vụ, Chat online với CSKH, Cộng đồng Viettel giải đáp Online, Tra cứu bảo hành, Tra cứu đơn hàng, Đặt lịch hẹn xác minh, Hỗ trợ dịch vụ, Tra cứu báo cáo đơn hàng, Tra cứu lịch sử không nhận quảng cáo, Tra cứu chuẩn hoá theo nghị định 49.
- *My Viettel* (20 mục, 3 cột: Quản lý cước / Tiện ích / Lan tỏa): Tra cứu cước, Tra cứu thông báo cước, Thanh toán Online, Hoá đơn bán hàng, Mua thẻ cào, Thông tin thuê bao, Dịch vụ đang sử dụng, Khuyến mại dành cho bạn, Đổi sim, Thay đổi giấy tờ, Chuyển sang trả sau, Chuyển mạng giữ số, Xác nhận thuê bao, Hoàn thiện đơn hàng Internet, Quản lý multi-sim, Đổi eSim, Lan tỏa Di động, Lan tỏa Cố định, Lan tỏa Thanh toán cước, Lan tỏa dịch vụ doanh nghiệp.

Khi **chưa đăng nhập**, di chuột vào 2 mục này chỉ hiện tooltip nhỏ "Đăng nhập để xem đầy đủ" (không mở được menu). Khi **đã đăng nhập**, di chuột vào sẽ hiện đầy đủ dropdown như trên; panel "My Viettel" được canh phải (thay vì canh trái mặc định) vì đây là mục ngoài cùng bên phải header, tránh bị tràn ra ngoài màn hình. Các link trong dropdown chỉ là minh hoạ (không điều hướng thật).

Các nút "Đăng ký" chỉ là thao tác minh hoạ (hiển thị thông báo trong trang), **không gửi yêu cầu hay giao dịch thật** tới hệ thống Viettel.

## Hỗ trợ nhân viên (NVKD địa bàn + Cộng tác viên) — mới
Mục "Hỗ trợ nhân viên" trên thanh nav header (ngang hàng với My Viettel và nút Đăng nhập, không còn nằm trong hàng page-tabs) mô phỏng một cổng nội bộ dùng chung cho 2 vai trò: **Nhân viên kinh doanh (NVKD)** địa bàn quản lý đội nhóm, và **Cộng tác viên (CTV)** xem kết quả của riêng mình. Đây là tính năng được **sinh mới hoàn toàn theo mô tả yêu cầu**, không dựa trên ảnh chụp màn hình hệ thống thật của Viettel, nên số liệu bán hàng, hồ sơ NVKD và danh sách CTV mẫu đều là **dữ liệu demo** (sinh ngẫu nhiên có seed để ổn định giữa các lần thao tác, không lấy từ CSDL/API thật).

**Đăng nhập chung qua nút "Đăng nhập"**: cả NVKD và CTV đều đăng nhập bằng chính modal đăng nhập ở header (không có nút đăng nhập riêng nữa) — chọn tab 👔 **Nhân viên KD** hoặc 🤝 **Cộng tác viên**, nhập số điện thoại, xác thực OTP demo như bình thường:
- **Vai trò Nhân viên KD**: số điện thoại hợp lệ bất kỳ sẽ vào vai hồ sơ NVKD demo cố định "Nguyễn Văn A — NVKD00123", thấy đầy đủ dashboard quản lý đội (mục tiếp theo).
- **Vai trò Cộng tác viên**: chỉ đăng nhập được bằng số điện thoại **đã được một NVKD tạo tài khoản CTV trước đó** (mô phỏng đúng quan hệ CTV trực thuộc NVKD) — 3 số demo có sẵn để test: `0912000111` (Trần Thị B), `0987000222` (Lê Văn C), `0977000333` (Phạm Thị D). Nhập số chưa đăng ký sẽ báo lỗi rõ ràng và không cấp quyền xem dữ liệu.
- Trang "Hỗ trợ nhân viên" ở trạng thái chưa đăng nhập chỉ có nút "Đăng nhập ngay" mở đúng modal này (mặc định chọn sẵn tab Nhân viên KD).

**Giao diện NVKD gồm 3 tab ngang hàng**: **Dashboard**, **Quản lý cộng tác viên (CTV) trực thuộc**, và **Tài khoản của tôi** — chỉ 1 tab hiển thị nội dung tại 1 thời điểm; đăng nhập lại luôn quay về tab Dashboard.

**Tab Dashboard** — tổng quan kết quả bán hàng cả đội:
- 4 nút chọn nhanh **Tháng này / Tháng trước / 3 tháng / 12 tháng** lọc số liệu doanh số, thuê bao mới, hoa hồng — 4 thẻ tổng quan (doanh số cá nhân, doanh số toàn đội CTV, tổng cộng, số CTV có phát sinh doanh số).
- **2 biểu đồ trực quan** (xem mục "Biểu đồ trực quan" bên dưới): xu hướng doanh số 12 tháng (đường, so sánh Bạn với Toàn đội) và đóng góp doanh số theo từng người (cột ngang, kỳ đang chọn).
- Bảng "Chi tiết theo từng người" liệt kê NVKD + từng CTV, kèm nút xuất báo cáo riêng.
- **Danh sách đơn hàng chi tiết** (xem mục riêng bên dưới): bảng đơn hàng theo mã đơn, có bộ lọc trạng thái + bộ lọc theo người bán, và nút xuất CSV riêng.

**Tab Tài khoản của tôi** — hồ sơ cá nhân của NVKD:
- Thẻ hồ sơ (ảnh đại diện, họ tên + mã NV, địa bàn) và nút đăng xuất — tách khỏi Dashboard để gọn giao diện.
- **Cập nhật ảnh đại diện**: bấm icon 📷 trên ảnh đại diện để chọn ảnh từ máy (giống luồng đổi ảnh đại diện CTV), ảnh chỉ lưu tạm trong bộ nhớ trình duyệt.
- **Link phân kênh theo dịch vụ** (mới): 3 thẻ tương ứng 3 nhóm dịch vụ (Internet/Truyền hình, Di động/Sim số, Gói cước Data/5G), mỗi thẻ có **mã QR** và nút sao chép, và nút "👁 Xem trang dịch vụ" điều hướng thẳng tới trang dịch vụ tương ứng. Cả 3 thẻ dùng **chung một liên kết định danh theo NVKD** — đúng cấu trúc nghiệp vụ thật: `https://viettel.vn/vx/gioithieu?NV=CNKD_<mã tỉnh/thành>_<email nội bộ>` (ví dụ demo: `NV=CNKD_HCM_AVN1`, ứng với NVKD "Nguyễn Văn A" tại TP.HCM) — mã này gắn theo **nhân viên**, không đổi theo dịch vụ, nên 3 thẻ hiển thị cùng 1 link/QR và chỉ khác nhau ở trang dịch vụ đích của nút "Xem trang dịch vụ".

**Tab Quản lý cộng tác viên (CTV) trực thuộc**: 3 CTV mẫu có sẵn; nút "+ Tạo cộng tác viên mới" mở luồng nhập Họ tên + SĐT → OTP demo → sinh **liên kết giới thiệu** (`https://viettel.vn/vx/gioithieu?NV=<số điện thoại CTV>` — dùng thẳng SĐT làm mã định danh, khác với NVKD) kèm **mã QR**. Mỗi thẻ CTV có huy hiệu trạng thái (**Hoạt động** xanh / **Đã khóa** đỏ) và cho phép:
  - xem/sao chép liên kết, xem QR phóng to, **cập nhật ảnh đại diện** (icon 📷, ảnh chỉ lưu tạm trong bộ nhớ trình duyệt), xuất báo cáo riêng, "👁 Xem trang liên kết" (mô phỏng có người truy cập qua liên kết CTV — huy hiệu nổi góc phải màn hình, giữ nguyên khi chuyển trang tới khi đóng);
  - **✏️ Sửa**: NVKD chỉnh lại Họ tên/SĐT của CTV qua modal riêng (không cần lại OTP vì NVKD đã xác thực); có kiểm tra hợp lệ số điện thoại và chặn trùng SĐT với CTV khác; tên/SĐT hiển thị trong bảng đơn hàng chi tiết cũng được cập nhật theo;
  - **🔒 Khóa / 🔓 Mở khóa**: chuyển trạng thái hoạt động — CTV bị khóa **không thể đăng nhập** vào dashboard của họ nữa (báo lỗi rõ ràng khi thử đăng nhập), nhưng dữ liệu bán hàng lịch sử vẫn giữ nguyên trong báo cáo của NVKD (khác với xóa);
  - **🗑️ Xóa**: xóa hẳn CTV khỏi danh sách kèm modal xác nhận riêng (không dùng hộp thoại `confirm()` mặc định của trình duyệt) vì đây là thao tác không thể hoàn tác — sau khi xóa, CTV biến mất khỏi bảng "Chi tiết theo từng người", bộ lọc "theo người bán" của bảng đơn hàng, và các biểu đồ.
  CTV vừa tạo xuất hiện ngay trong bộ lọc "theo người bán" của bảng đơn hàng và đã có đơn hàng demo ngay từ tháng hiện tại.

**Dashboard CTV** — chỉ xem kết quả của riêng mình: hồ sơ (kèm ảnh đại diện, xem bên dưới) + 4 nút chọn nhanh kỳ (giống NVKD nhưng tách trạng thái riêng), 2 thẻ tổng quan (doanh số, hoa hồng), 1 biểu đồ xu hướng doanh số cá nhân 12 tháng, khối liên kết giới thiệu của chính CTV đó (link + mã QR + nút sao chép + nút xuất báo cáo riêng), và **danh sách đơn hàng chi tiết của riêng mình** (bộ lọc trạng thái, không có bộ lọc người bán vì chỉ xem dữ liệu của chính họ).

- **CTV tự cập nhật ảnh đại diện của mình**: sau khi đăng nhập, CTV bấm icon 📷 trên ảnh đại diện ở đầu dashboard của họ để chọn ảnh từ máy — không cần nhờ NVKD chỉnh hộ (giống hệt luồng đổi ảnh NVKD tự làm ở tab "Tài khoản của tôi" và luồng NVKD đổi ảnh hộ CTV ở tab quản lý). Vì dùng chung 1 record CTV, ảnh CTV tự đổi cũng hiển thị ngay khi NVKD xem lại thẻ CTV đó ở tab "Quản lý cộng tác viên (CTV) trực thuộc" — chỉ tồn tại trong bộ nhớ trình duyệt của phiên hiện tại, tải lại trang sẽ mất.

**Danh sách đơn hàng chi tiết** — bổ sung theo yêu cầu "số liệu bán hàng chi tiết theo mã đơn hàng": mỗi đơn hàng demo có đủ các trường mã đơn hàng (vd. `DH2607-3272`), ngày phát sinh, loại dịch vụ (Internet cáp quang / Truyền hình / Combo Internet-Truyền hình / Di động trả trước-trả sau / Gói cước Data/5G / Gói Roaming), họ tên + số điện thoại khách hàng, tên nhân viên kinh doanh, tên + SĐT cộng tác viên (tra theo số điện thoại CTV — để trống nếu là đơn NVKD bán trực tiếp không qua CTV), tên nhân viên kỹ thuật (chỉ gán cho các dịch vụ **cần lắp đặt**: Internet cáp quang, Truyền hình, Combo — dịch vụ SIM/Data/Roaming không có kỹ thuật viên), và trạng thái đơn hàng với đúng 4 giá trị **Đang thực hiện / Đang triển khai / Hoàn thành / Đã hủy** (hiển thị dạng huy hiệu màu kèm nhãn chữ, không chỉ dựa vào màu sắc). Đơn hàng của tháng hiện tại chỉ được sinh trong khoảng ngày 1 đến hôm nay (không có đơn hàng "trong tương lai"). Quy tắc nghiệp vụ demo: **doanh số/hoa hồng chỉ ghi nhận từ các đơn đã "Hoàn thành"** (đơn đang xử lý hoặc đã hủy chưa tính vào doanh số) — đơn hàng càng cũ càng có xu hướng đã hoàn thành, đơn của tháng hiện tại phần lớn vẫn đang xử lý, phản ánh vòng đời đơn hàng thực tế. Bảng chỉ hiển thị tối đa 60 đơn gần nhất (có ghi chú số lượng còn lại); bấm nút xuất CSV để lấy đầy đủ toàn bộ đơn hàng trong kỳ đang chọn.

**Xuất báo cáo (CSV)** — có 2 loại báo cáo tách riêng:
- *Báo cáo tổng hợp*: NVKD có nút "Xuất báo cáo toàn bộ" (tất cả NVKD + CTV theo kỳ đang chọn) và nút "Xuất" riêng theo từng dòng/thẻ CTV; CTV tự đăng nhập cũng có nút xuất báo cáo của riêng mình theo kỳ họ đang xem. Cột: Đối tượng, Số điện thoại, Doanh số, Thuê bao mới, Hoa hồng, Kỳ báo cáo.
- *Danh sách đơn hàng chi tiết*: nút "Xuất danh sách đơn hàng (CSV)" ở cả 2 dashboard, xuất đầy đủ toàn bộ đơn hàng trong kỳ đang chọn (không giới hạn 60 dòng như bảng hiển thị, và không phụ thuộc bộ lọc trạng thái/người bán đang chọn trên bảng). Cột: Mã đơn hàng, Ngày, Loại dịch vụ, Họ tên khách hàng, SĐT khách hàng, Nhân viên KD, Cộng tác viên, SĐT CTV, NV kỹ thuật, Trạng thái, Giá trị.

Cả 2 loại CSV đều mã hoá UTF-8 kèm BOM để mở đúng dấu tiếng Việt trong Excel.

**Biểu đồ trực quan** (dựng theo phương pháp thiết kế dataviz nội bộ — chọn dạng biểu đồ theo đúng mục đích, màu đã kiểm tra an toàn cho người mù màu, có chú giải/nhãn trực tiếp/tooltip khi di chuột):
- *Xu hướng doanh số 12 tháng*: biểu đồ đường 2 chuỗi (Bạn — đỏ thương hiệu `#EE0033`, Toàn đội CTV — xanh dương `#2a78d6`, đã kiểm tra tương phản CVD an toàn), có chú giải, nhãn giá trị ở điểm cuối, lưới ngang mờ, và tooltip kèm đường gióng dọc khi rê chuột qua từng tháng.
- *Đóng góp doanh số theo người*: biểu đồ cột ngang theo kiểu "nhấn mạnh" — thanh của NVKD tô đỏ thương hiệu (nổi bật vì đây là góc nhìn của người đang xem), các thanh CTV tô xám trung tính, sắp xếp giảm dần theo doanh số, nhãn giá trị ở đầu mỗi thanh, tooltip khi rê chuột.
- Cả 2 biểu đồ đều có bảng số liệu chi tiết đi kèm bên dưới (bảng "Chi tiết theo từng người") nên không phụ thuộc hoàn toàn vào biểu đồ để đọc số.

**Thư viện mã QR**: mã QR được sinh bằng thuật toán "QRCode for JavaScript" của Kazuhiko Arase (2009, giấy phép MIT), lấy phần lõi mã hoá thuần JavaScript (không phụ thuộc Flash/Node) từ gói mã nguồn mở `qrcode-terminal`, gộp lại thành một khối script nhúng thẳng trong `index.html` (biến toàn cục `QRCode`) để chạy được ngay cả khi mở file cục bộ (không cần gọi API/CDN tạo QR bên ngoài). "QR Code" là nhãn hiệu đã đăng ký của DENSO WAVE INCORPORATED.

## Cập nhật dữ liệu
Muốn đổi giá/gói cước: sửa file `data.json`, sau đó nhúng lại vào `index.html` bằng cách thay toàn bộ khối `const DATA = { ... };` trong thẻ `<script>` bằng nội dung JSON mới (có thể yêu cầu dựng lại trang, hoặc chạy đoạn Python tương tự `build_goidata.py`).

## Giới hạn
- Đây là bản demo trình bày lại giao diện, không phải bản sao chính xác pixel-by-pixel của viettel.vn và không kết nối API/CSDL thật (phù hợp quy tắc bảo mật dự án: không hardcode API Key/Token/Sheet ID thật).
- Một số gói (ví dụ nhóm "Mesh Wifi tốc độ cao") gộp cả dữ liệu lấy từ 2 ảnh khác nhau (32 Tỉnh & Nội thành HNI/HCM) — xem cột "khu vực" trong `data.json` để phân biệt.
- Một vài gói dài ngày (ví dụ 6T5G330B, 6T5G380B, 12T5G180B) không xuất hiện trong ảnh chụp màn hình gốc nên chưa có trong `data.json` — có thể bổ sung sau nếu có thêm dữ liệu.
- Tính năng đăng nhập OTP là mô phỏng phía trình duyệt, không xác thực với hệ thống Viettel thật.
- Toàn bộ dữ liệu ở "Hỗ trợ nhân viên" (hồ sơ NVKD, danh sách CTV mẫu, số liệu doanh số/thuê bao mới/hoa hồng theo tháng, số liệu trên 2 biểu đồ, và danh sách đơn hàng chi tiết) là **dữ liệu demo sinh ngẫu nhiên có seed**, không lấy từ hệ thống báo cáo bán hàng thật của Viettel; chỉ nhằm minh hoạ luồng nghiệp vụ (đăng nhập NVKD/CTV, xem tổng quan theo kỳ, tạo CTV, sinh mã QR/liên kết giới thiệu, xem/xuất đơn hàng chi tiết, xuất báo cáo).
- Tên khách hàng, số điện thoại khách hàng, mã đơn hàng và giá trị đơn hàng trong bảng "Danh sách đơn hàng chi tiết" đều là dữ liệu sinh ngẫu nhiên (có seed ổn định theo từng NVKD/CTV) — không phải khách hàng thật, chỉ dùng để minh hoạ cấu trúc dữ liệu đơn hàng.
- Ảnh đại diện CTV, CTV mới tạo/sửa/xóa/khóa, và trạng thái đăng nhập NVKD/CTV chỉ tồn tại trong bộ nhớ của phiên trình duyệt hiện tại (không có backend lưu trữ) — tải lại trang sẽ mất các thay đổi này và quay về 3 CTV mẫu ban đầu (đều ở trạng thái Hoạt động).
- Đăng nhập vai trò Cộng tác viên chỉ hoạt động với số điện thoại đã tồn tại trong danh sách CTV (do NVKD tạo) và đang ở trạng thái Hoạt động (chưa bị khóa) — đây là chủ đích thiết kế để mô phỏng đúng quan hệ CTV trực thuộc NVKD, không phải lỗi.
- Thao tác "Xóa" CTV là xóa cứng ngay trên dữ liệu demo phía trình duyệt (không có thùng rác/khôi phục) — có modal xác nhận riêng để tránh xóa nhầm, nhưng không thể hoàn tác sau khi đã xác nhận.
- Cơ chế "chia sẻ gói cước + ghi nhận giới thiệu" (link `?NV=...&SP=...`, huy hiệu "Được giới thiệu bởi", đơn hàng tự ghi nhận) hoàn toàn xử lý phía trình duyệt bằng JavaScript đọc query string — không có backend theo dõi link thật, không gửi dữ liệu đi đâu cả, và chỉ tồn tại trong phiên trình duyệt hiện tại (tải lại trang sẽ mất "phiên giới thiệu" đang hoạt động lẫn các đơn hàng vừa được ghi nhận). Số điện thoại liên hệ của NVKD (`0909000123`) trong huy hiệu tin tưởng cũng là số demo, không phải số thật.
