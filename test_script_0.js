 cuối trang) để tránh lặp lại
     logic đếm ngược Gửi lại OTP / OTP hết hạn đã có ở modal đăng nhập khách hàng phía trên. -->
<div class="login-overlay" id="otp-modal-overlay">
  <div class="login-modal">
    <button class="login-close" id="otp-modal-close" aria-label="Đóng">&times;</button>

    <!-- Bước 1: nhập thông tin (tuỳ ngữ cảnh: chỉ SĐT, hoặc SĐT + Họ tên) -->
    <div class="login-step" id="otp-modal-step-info">
      <h3 class="login-title" id="otp-modal-title"></h3>
      <p class="login-subtitle" id="otp-modal-subtitle"></p>
      <div id="otp-modal-fields"></div>
      <div class="login-error" id="otp-modal-info-error"></div>
      <div class="login-actions">
        <button class="btn-outline" id="otp-modal-info-cancel">Hủy</button>
        <button class="btn-primary" id="otp-modal-info-next" disabled>Tiếp tục</button>
      </div>
    </div>

    <!-- Bước 2: nhập mã OTP -->
    <div class="login-step" id="otp-modal-step-otp" style="display:none;">
      <button class="login-back" id="otp-modal-back" aria-label="Quay lại">&larr;</button>
      <h3 class="login-title">Nhập mã xác nhận</h3>
      <p class="login-subtitle login-otp-subtitle">
        Vui lòng nhập mã OTP được gửi về số điện thoại
        <b id="otp-modal-otp-phone-display"></b>.
      </p>

      <div class="otp-boxes" id="otp-modal-otp-boxes">
        <input type="text" inputmode="numeric" maxlength="1" class="otp-box" data-idx="0">
        <input type="text" inputmode="numeric" maxlength="1" class="otp-box" data-idx="1">
        <input type="text" inputmode="numeric" maxlength="1" class="otp-box" data-idx="2">
        <input type="text" inputmode="numeric" maxlength="1" class="otp-box" data-idx="3">
        <input type="text" inputmode="numeric" maxlength="1" class="otp-box" data-idx="4">
        <input type="text" inputmode="numeric" maxlength="1" class="otp-box" data-idx="5">
      </div>

      <div class="otp-meta">
        <span id="otp-modal-resend">Gửi lại OTP (<b id="otp-modal-resend-count">57</b>s)</span>
        <span id="otp-modal-expire">OTP hết hạn sau <b id="otp-modal-expire-count">4:57</b></span>
      </div>

      <div class="login-demo-hint" id="otp-modal-demo-hint"></div>
      <div class="login-error" id="otp-modal-otp-error"></div>

      <div class="login-actions">
        <button class="btn-outline" id="otp-modal-otp-cancel">Hủy</button>
        <button class="btn-primary" id="otp-modal-otp-confirm" disabled>Xác nhận</button>
      </div>
    </div>

    <!-- Bước 3: thành công (nội dung tuỳ biến theo ngữ cảnh, gán động bằng JS) -->
    <div class="login-step" id="otp-modal-step-success" style="display:none;">
      <div class="login-success-ico">
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <path d="M6 16l6 6L24 9" stroke="#1EAF58" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div id="otp-modal-success-body"></div>
      <button class="btn-primary" id="otp-modal-done">Đóng</button>
    </div>
  </div>
</div>

<!-- ================= MODAL: XEM MÃ QR PHÓNG TO ================= -->
<div class="qr-zoom-overlay" id="qr-zoom-overlay">
  <div class="qr-zoom-box">
    <button class="qr-zoom-close" id="qr-zoom-close" aria-label="Đóng">&times;</button>
    <div id="qr-zoom-content"></div>
    <div style="font-weight:700;margin-top:12px;" id="qr-zoom-title"></div>
    <div style="font-size:12.5px;color:var(--text-muted);margin-top:2px;" id="qr-zoom-link"></div>
  </div>
</div>

<!-- ================= MODAL: SỬA THÔNG TIN CỘNG TÁC VIÊN ================= -->
<div class="login-overlay" id="ctv-edit-overlay">
  <div class="login-modal" style="max-width:380px;">
    <button class="login-close" id="ctv-edit-close" aria-label="Đóng">&times;</button>
    <h3 class="login-title" style="margin-bottom:4px;">Sửa thông tin cộng tác viên</h3>
    <p class="login-subtitle" style="margin-bottom:18px;">Cập nhật thông tin chi tiết của CTV</p>
    
    <div class="login-field" style="text-align:left;margin-bottom:16px;">
      <label style="display:block;margin-bottom:8px;font-size:13.5px;font-weight:600;color:var(--text-main);">Ảnh đại diện CTV</label>
      <div style="display:flex;align-items:center;gap:14px;">
        <div class="ctv-avatar" id="ctv-edit-avatar-preview" style="width:52px;height:52px;font-size:18px;"></div>
        <button type="button" class="btn-outline" id="btn-ctv-edit-upload" style="font-size:12.5px;padding:6px 12px;">📷 Chọn / Thay đổi ảnh</button>
        <input type="file" id="ctv-edit-avatar-file" accept="image/*" style="display:none;">
      </div>
    </div>

    <div class="login-field" style="text-align:left;">
      <label for="ctv-edit-hoten" style="display:block;margin-bottom:6px;font-size:13.5px;font-weight:600;color:var(--text-main);">Họ và tên</label>
      <input type="text" id="ctv-edit-hoten" placeholder="Họ và tên CTV" autocomplete="off">
    </div>
    <div class="login-field" style="text-align:left;">
      <label for="ctv-edit-sdt" style="display:block;margin-bottom:6px;font-size:13.5px;font-weight:600;color:var(--text-main);">Số điện thoại</label>
      <input type="tel" id="ctv-edit-sdt" placeholder="Số điện thoại CTV" inputmode="numeric" maxlength="10" autocomplete="off">
    </div>
    <div class="login-error" id="ctv-edit-error"></div>
    <button class="btn-primary" id="ctv-edit-save" style="width:100%;">Lưu thay đổi</button>
  </div>
</div>

<!-- ================= MODAL: XÁC NHẬN THAO TÁC DÙNG CHUNG (xóa CTV...) ================= -->
<div class="login-overlay" id="confirm-modal-overlay">
  <div class="login-modal" style="max-width:360px;text-align:center;">
    <h3 class="login-title" id="confirm-modal-title" style="margin-bottom:8px;"></h3>
    <p style="font-size:13.5px;color:var(--text-muted);line-height:1.5;margin-bottom:22px;" id="confirm-modal-message"></p>
    <div style="display:flex;gap:10px;">
      <button class="btn-outline" id="confirm-modal-cancel" style="flex:1;">Hủy</button>
      <button class="btn-primary" id="confirm-modal-confirm" style="flex:1;">Xác nhận</button>
    </div>
  </div>
</div>

<!-- ================= MODAL: XEM TRƯỚC TÀI LIỆU ================= -->
<div class="login-overlay" id="doc-preview-modal-overlay">
  <div class="login-modal" style="max-width:800px; width:90%; padding:20px; height:85vh; display:flex; flex-direction:column;">
    <button class="login-close" id="doc-preview-modal-close" aria-label="Đóng">&times;</button>
    <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1px solid var(--border); padding-bottom:16px; margin-bottom:20px; gap:20px; padding-right:32px;">
      <div style="flex:1;">
        <h3 class="login-title" id="doc-preview-title" style="margin:0 0 6px 0;font-size:18px;text-align:left;"></h3>
        <p style="font-size:13px;color:var(--text-muted);margin:0;line-height:1.4;" id="doc-preview-meta"></p>
      </div>
      <a class="btn-primary" id="doc-preview-download-btn" href="#" target="_blank" rel="noopener" style="text-decoration:none; display:inline-flex; align-items:center; justify-content:center; padding:9px 20px; white-space:nowrap; flex-shrink:0; border-radius:8px; font-size:14px; box-shadow:0 2px 4px rgba(238,0,51,0.2);">⭳ Tải về</a>
    </div>
    <div style="flex:1; background:#f0f2f5; border-radius:8px; overflow-y:auto; padding:24px; display:flex; flex-direction:column; align-items:center;">
      <div id="doc-preview-content" style="width:100%; max-width:680px; background:#fff; padding:32px; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.05); box-sizing:border-box; min-height:100%;"></div>
    </div>
  </div>
</div>

<!-- ================= MODAL: CHI TIẾT GIỚI THIỆU GÓI CƯỚC ================= -->
<div class="login-overlay" id="pkg-detail-overlay">
  <div class="login-modal pkg-detail-modal">
    <button class="login-close" id="pkg-detail-close" aria-label="Đóng">&times;</button>
    
    <!-- Float right block cho Chia sẻ (Chỉ hiển thị khi đang đăng nhập NVKD/CTV) -->
    <div id="pkg-detail-share-section" class="pkg-share-float" style="display:none;">
      <div class="pkg-detail-section-title" style="text-align:center;font-size:12.5px;">🔗 Chia sẻ gói cước này</div>
      <div class="pkg-share-box">
        <div class="pkg-share-qr" id="pkg-share-qr"></div>
        <div class="pkg-share-right">
          <input type="text" readonly id="pkg-share-link">
          <div class="pkg-share-btn-row">
            <button class="btn-outline" id="pkg-share-copy" title="Sao chép liên kết" style="flex:0 0 36px;padding:7px;display:flex;align-items:center;justify-content:center;font-size:14px;">📋</button>
            <button class="btn-outline" id="pkg-share-download">⭳ Tải mã QR</button>
          </div>
        </div>
      </div>
      <div class="pkg-share-note" style="text-align:center;margin-bottom:0;">
        Khách vào link/mã QR sẽ mở thẳng gói <b id="pkg-share-note-ma"></b>. Đơn hàng sẽ tự động ghi nhận cho bạn.
      </div>
      <div style="margin-top:16px; border-top:1px dashed var(--border); padding-top:16px;">
        <div class="pkg-detail-section-title" style="text-align:center;font-size:12.5px;">💬 Gửi lời mời SMS</div>
        <div style="display:flex; gap:8px;">
          <input type="tel" id="pkg-invite-phone" class="order-person-filter" placeholder="Nhập SĐT khách..." style="flex:1; padding:6px 10px; height:auto; margin:0;" pattern="[0-9]*" maxlength="11">
          <button class="btn-primary" id="pkg-invite-btn" style="padding:6px 12px; font-size:13px; white-space:nowrap;">Mời</button>
        </div>
        <div id="pkg-invite-error" style="color:var(--viettel-red); font-size:11.5px; margin-top:6px; text-align:center; display:none;"></div>
        <div id="pkg-invite-success" style="color:#1E7A45; font-size:11.5px; margin-top:6px; text-align:center; display:none;"></div>
      </div>
    </div>

    <!-- Thông tin gói cước sẽ tự động text-wrap xung quanh thẻ float -->
    <h3 class="pkg-detail-title" id="pkg-detail-title" style="padding-right:30px;"></h3>
    <div class="pkg-detail-sub" id="pkg-detail-sub"></div>
    <div class="pkg-detail-price-row" id="pkg-detail-price"></div>
    <p class="pkg-detail-desc" id="pkg-detail-desc"></p>
    
    <div class="pkg-detail-section-title">Thông số gói cước</div>
    <ul class="pkg-detail-list" id="pkg-detail-specs"></ul>
    <div class="pkg-detail-section-title">Quyền lợi khi đăng ký</div>
    <ul class="pkg-detail-list pkg-detail-benefits" id="pkg-detail-benefits"></ul>

    <div style="clear:both;"></div>

    <div class="pkg-detail-actions">
      <button class="btn-outline" id="pkg-detail-close-btn">Đóng</button>
      <button class="btn-primary" id="pkg-detail-register">Đăng ký ngay</button>
    </div>
  </div>
</div>

<!-- ================= PAGE 1: INTERNET / TRUYỀN HÌNH ================= -->
<section class="page active" id="page-internet">
  <div class="section">
    <h2>Danh sách gói Internet - Truyền hình</h2>
    <div class="tabs">
      <button class="tab-btn active" data-tab="tab-goi-internet">Gói Internet</button>
      <button class="tab-btn" data-tab="tab-mesh-cao">Mesh Wifi tốc độ cao</button>
      <button class="tab-btn" data-tab="tab-combo">Combo Internet - Truyền hình</button>
      <button class="tab-btn" data-tab="tab-camera">Combo Internet - Camera</button>
    </div>

    <div class="tab-panel active" id="tab-goi-internet">
      <div class="card-grid" id="grid-goi-internet"></div>
    </div>
    <div class="tab-panel" id="tab-mesh-cao">
      <div class="card-grid" id="grid-mesh-cao"></div>
    </div>
    <div class="tab-panel" id="tab-combo">
      <div class="card-grid" id="grid-combo"></div>
    </div>
    <div class="tab-panel" id="tab-camera">
      <div class="card-grid" id="grid-camera"></div>
    </div>
  </div>

  <div class="selection-summary" id="internet-summary"></div>

  <!-- Banner giới thiệu — theo yêu cầu, chuyển xuống cuối trang thay vì đầu trang -->
  <div class="hero">
    <div class="hero-card">
      <div class="hero-inner hero-split">
        <div class="hero-content">
          <h1>Đăng ký Internet cho ngôi nhà của bạn</h1>
          <p class="hero-subtitle">Trải nghiệm internet tốc độ cao, ổn định cho cả gia đình.</p>
          <div class="hero-features">
            <div class="feat"><span class="ico">💳</span>Giá cước ưu đãi, hấp dẫn nhất thị trường</div>
            <div class="feat"><span class="ico">📶</span>Tốc độ truy cập internet cao và ổn định</div>
            <div class="feat"><span class="ico">✳️</span>Tích hợp nhiều dịch vụ trên 01 đường dây</div>
            <div class="feat"><span class="ico">⚡</span>Lắp đặt nhanh chóng, hỗ trợ 24/7</div>
          </div>
        </div>
        <div class="hero-media" aria-hidden="true">
          <svg viewBox="0 0 260 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="130" cy="112" r="100" fill="#fff" fill-opacity=".08"/>
            <path d="M50 130 L130 68 L210 130 V196 H50 Z" fill="#fff" fill-opacity=".94"/>
            <path d="M34 138 L130 62 L226 138" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="112" y="152" width="36" height="44" rx="4" fill="var(--viettel-red)" fill-opacity=".28"/>
            <rect x="72" y="146" width="26" height="26" rx="4" fill="var(--viettel-red)" fill-opacity=".18"/>
            <rect x="162" y="146" width="26" height="26" rx="4" fill="var(--viettel-red)" fill-opacity=".18"/>
            <path d="M104 56 a38 38 0 0 1 52 0" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".85"/>
            <path d="M116 42 a20 20 0 0 1 28 0" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none"/>
            <circle cx="130" cy="32" r="5" fill="#fff"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ================= PAGE 2: SIM SO ================= -->
<section class="page" id="page-sim">
  <!-- Thanh chọn nhanh — giữ nguyên vị trí đầu trang theo yêu cầu, tách khỏi banner trang trí
       để banner có thể chuyển xuống cuối trang mà không ảnh hưởng đến việc truy cập nhanh 4 dịch vụ. -->
  <div class="section" style="padding-bottom:0;">
    <div class="quick-nav-card">
      <div class="quick-nav-title">Chọn nhanh dịch vụ di động</div>
      <div class="hero-pills">
        <button class="hero-pill" data-target="goi-cuoc"><span class="pill-ico">📱</span>Gói cước di động</button>
        <button class="hero-pill" data-target="sim-so"><span class="pill-ico">💳</span>Dịch vụ SIM số</button>
        <button class="hero-pill" data-target="gtgt"><span class="pill-ico">🎁</span>Dịch vụ GTGT</button>
        <button class="hero-pill" data-target="quoc-te"><span class="pill-ico">🌐</span>Dịch vụ quốc tế</button>
      </div>
      <div class="hero-pill-note" id="hero-pill-note" style="display:none;font-size:12px;color:var(--text-muted);margin-top:10px;"></div>
    </div>
  </div>

  <div class="section" id="sim-so">
    <h2>Chọn Sim số trả sau / trả trước</h2>

    <div class="sim-toggle">
      <button class="active" data-loai="Trả trước">Trả trước</button>
      <button data-loai="Trả sau">Trả sau</button>
    </div>

    <div class="search-row">
      <input type="text" id="sim-search" placeholder="Tìm kiếm theo số điện thoại...">
      <button id="sim-search-btn">Tìm kiếm</button>
    </div>

    <table class="sim-table">
      <thead>
        <tr>
          <th style="width:60px;">Stt</th>
          <th>Sim số</th>
          <th>Giá sim</th>
          <th>Thời gian sử dụng</th>
          <th style="width:50px;"></th>
        </tr>
      </thead>
      <tbody id="sim-tbody"></tbody>
    </table>

    <div class="sim-footer">
      <span class="link-muted" id="chon-so-khac">Chọn số khác</span>
      <span id="loai-thue-bao-hien-tai" style="font-size:13px;color:var(--text-muted);">Đang xem: <b>Trả trước</b></span>
    </div>

    <div class="plan-select-row">
      <label>Chọn gói cước chính (1 chu kỳ 30 ngày)</label>
      <select id="goi-cuoc-chinh">
        <option value="">-- Số nữa --</option>
        <option value="SD70">SD70 - 70.000đ/tháng</option>
        <option value="MXH120">MXH120 - 120.000đ/tháng</option>
        <option value="VD149">VD149 - 149.000đ/tháng</option>
        <option value="V90B">V90B - 90.000đ/tháng</option>
      </select>
    </div>

    <div class="selection-summary" id="sim-summary"></div>
  </div>

  <!-- Banner giới thiệu — theo yêu cầu, chuyển xuống cuối trang; 4 nút chọn nhanh vẫn giữ nguyên ở đầu trang -->
  <div class="hero">
    <div class="hero-card hero-mobile">
      <div class="hero-inner hero-split">
        <div class="hero-content hero-text">
          <h1>Dịch vụ di động</h1>
          <p class="hero-subtitle">Kết nối không giới hạn, theo cách của bạn.</p>
        </div>
        <div class="hero-media" aria-hidden="true">
          <svg viewBox="0 0 260 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="130" cy="112" r="100" fill="#fff" fill-opacity=".08"/>
            <path d="M130 196C82 176 40 142 40 100 40 70 62 48 90 48c22 0 38 13 40 30 2-17 18-30 40-30 28 0 50 22 50 52 0 42-42 76-90 96Z" fill="#fff" fill-opacity=".14"/>
            <rect x="88" y="58" width="52" height="94" rx="12" fill="#fff" fill-opacity=".95"/>
            <rect x="98" y="72" width="32" height="56" rx="4" fill="var(--viettel-red)" fill-opacity=".25"/>
            <circle cx="114" cy="140" r="5" fill="var(--viettel-red)"/>
            <rect x="150" y="86" width="40" height="68" rx="10" fill="#fff" fill-opacity=".82"/>
            <rect x="158" y="96" width="24" height="40" rx="3" fill="var(--viettel-red)" fill-opacity=".2"/>
            <circle cx="170" cy="146" r="4" fill="var(--viettel-red)"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ================= PAGE 3: GÓI CƯỚC DATA / 5G ================= -->
<section class="page" id="page-data">
  <div class="section">
    <div class="breadcrumb">Trang chủ &gt; Di động &gt; <b>Danh sách gói cước</b></div>

    <div class="data-cat-tabs">
      <button class="data-cat-tab" data-cat="hot">Gói cước HOT</button>
      <button class="data-cat-tab active" data-cat="5g">Gói cước 5G</button>
      <button class="data-cat-tab" data-cat="mxh">Miễn phí MXH</button>
      <button class="data-cat-tab" data-cat="uudai">Siêu ưu đãi thoại/data</button>
      <button class="data-cat-tab" data-cat="roaming">Gói roaming</button>
      <button class="data-cat-tab" data-cat="tang">Gói tặng</button>
    </div>

    <div class="data-filter-row">
      <button class="data-sort-btn" id="data-sort-btn">Giá <span id="data-sort-arrow">↓</span></button>
      <div class="data-duration-filters" id="data-duration-filters"></div>
    </div>

    <div class="data-empty-note" id="data-empty-note" style="display:none;">
      Danh mục <b>Gói tặng</b> chưa có dữ liệu demo — các danh mục còn lại (Gói cước HOT, Gói cước 5G, Miễn phí MXH, Siêu ưu đãi thoại/data, Gói roaming) đã được tổng hợp từ ảnh chụp màn hình bạn cung cấp.
    </div>

    <div class="card-grid" id="grid-goi-data"></div>
  </div>

  <div class="selection-summary" id="data-summary"></div>
</section>

<!-- ================= PAGE 4: HỖ TRỢ NHÂN VIÊN (Kênh NVKD địa bàn + Cộng tác viên) ================= -->
<section class="page" id="page-staff">
  <div class="section">

    <!-- Trạng thái CHƯA đăng nhập (cả NVKD lẫn CTV) -->
    <div class="staff-locked" id="staff-locked">
      <div class="staff-locked-icon">🔒</div>
      <h3 class="login-title" style="margin-bottom:10px;">Hỗ trợ nhân viên kinh doanh &amp; cộng tác viên</h3>
      <p style="color:var(--text-muted);font-size:14px;margin-bottom:18px;">
        Dành cho Nhân viên kinh doanh địa bàn xem kết quả bán hàng, quản lý cộng tác viên (CTV) trực thuộc,
        và cho CTV xem kết quả của riêng mình. Bấm nút <b>"Đăng nhập"</b> ở góc trên bên phải, chọn vai trò
        <b>Nhân viên KD</b> hoặc <b>Cộng tác viên</b>, rồi xác thực bằng OTP như bình thường.
      </p>
      <div class="login-error" id="staff-locked-error" style="min-height:auto;"></div>
      <button class="btn-primary" id="btn-open-login-from-staff" style="max-width:220px;margin:8px auto 0;padding:12px 26px;">Đăng nhập ngay</button>
    </div>

    <!-- Trạng thái ĐÃ đăng nhập NVKD (đầy đủ: tổng quan đội + quản lý CTV) -->
    <div class="staff-dashboard" id="staff-dashboard" style="display:none;">

      <div class="staff-main-tabs" id="staff-main-tabs">
        <button class="staff-main-tab-btn active" data-staff-tab="dashboard">Dashboard</button>
        <button class="staff-main-tab-btn" data-staff-tab="ctv">Quản lý cộng tác viên</button>
        <button class="staff-main-tab-btn" data-staff-tab="leads">🎯 Khách hàng tiềm năng</button>
        <button class="staff-main-tab-btn" data-staff-tab="tailieu">📁 Tài liệu Marketing</button>
        <button class="staff-main-tab-btn" data-staff-tab="account">Tài khoản của tôi</button>
      </div>

      <div class="staff-tab-panel active" id="staff-tab-dashboard">
        <div class="staff-range-tabs" id="staff-range-tabs">
          <button class="staff-range-btn active" data-range="thang-nay">Tháng này</button>
          <button class="staff-range-btn" data-range="thang-truoc">Tháng trước</button>
          <button class="staff-range-btn" data-range="3-thang">3 tháng</button>
          <button class="staff-range-btn" data-range="12-thang">12 tháng</button>
        </div>

        <div class="staff-stats" id="staff-stats"></div>

        <div class="chart-card" style="margin-bottom:18px;">
          <h3 style="font-size:14px;font-weight:700;margin-bottom:2px;">Số lượng đơn hàng theo trạng thái</h3>
          <div class="chart-sub" id="staff-status-summary-sub">Kỳ: Tháng này</div>
          <div id="staff-status-summary"></div>
        </div>

        <div class="charts-row">
          <div class="chart-card">
            <h3>Xu hướng doanh số 12 tháng gần nhất</h3>
            <div class="chart-sub">Bạn (NVKD) so với tổng doanh số toàn đội CTV, theo từng tháng</div>
            <div id="staff-trend-chart"></div>
          </div>
          <div class="chart-card">
            <h3>Đóng góp doanh số theo người</h3>
            <div class="chart-sub" id="staff-contrib-sub">Kỳ: Tháng này</div>
            <div id="staff-contrib-chart"></div>
          </div>
        </div>
        <div class="charts-row" style="grid-template-columns: 1fr; margin-top: -12px;">
          <div class="chart-card">
            <h3>Kết quả bán theo Loại dịch vụ</h3>
            <div class="chart-sub" id="staff-service-type-sub">Kỳ: Tháng này</div>
            <div id="staff-service-type-chart"></div>
          </div>
        </div>

        <div class="staff-breakdown-head">
          <h3 style="font-size:15px;">Doanh thu sắp ghi nhận (Đơn hàng đang thực hiện)</h3>
        </div>
        <div style="overflow-x:auto;">
          <table class="sim-table" style="margin-bottom:28px;">
            <thead>
              <tr><th>Đối tượng</th><th>Doanh thu dự kiến</th><th>Số lượng đơn</th></tr>
            </thead>
            <tbody id="staff-pending-revenue-body"></tbody>
          </table>
        </div>

        <div class="staff-breakdown-head">
          <h3 style="font-size:15px;">Chi tiết theo từng người</h3>
          <button class="btn-outline" id="btn-export-all">⭳ Xuất báo cáo toàn bộ (CSV)</button>
        </div>
        <div style="overflow-x:auto;">
          <table class="sim-table" id="staff-breakdown-table">
            <thead>
              <tr><th>Đối tượng</th><th>Doanh số</th><th>Thuê bao mới</th><th>Tổng đơn hàng</th><th></th></tr>
            </thead>
            <tbody id="staff-breakdown-body"></tbody>
          </table>
        </div>

        <div class="staff-breakdown-head" style="margin-top:34px;">
          <h3 style="font-size:15px;">Danh sách đơn hàng chi tiết</h3>
          <button class="btn-outline" id="btn-export-orders-all">⭳ Xuất danh sách đơn hàng (CSV)</button>
        </div>
        <div class="order-filter-row">
          <div class="order-status-filters" id="order-status-filters">
            <button class="order-filter-btn active" data-status="all">Tất cả</button>
            <button class="order-filter-btn" data-status="Đang thực hiện">Đang thực hiện</button>
            <button class="order-filter-btn" data-status="Đang triển khai">Đang triển khai</button>
            <button class="order-filter-btn" data-status="Hoàn thành">Hoàn thành</button>
            <button class="order-filter-btn" data-status="Đã hủy">Đã hủy</button>
          </div>
          <select class="order-person-filter" id="order-person-filter">
            <option value="all">Tất cả (bạn + CTV)</option>
            <option value="staff">Chỉ mình bạn (bán trực tiếp)</option>
          </select>
        </div>
        <div style="overflow-x:auto;">
          <table class="sim-table" id="orders-table">
            <thead>
              <tr>
                <th>Mã đơn hàng</th><th>Ngày</th><th>Loại dịch vụ</th><th>Tên gói cước</th><th>Khách hàng</th><th>SĐT KH</th>
                <th>NVKD</th><th>CTV</th><th>NV kỹ thuật</th><th>Trạng thái</th><th>Giá trị</th>
              </tr>
            </thead>
            <tbody id="orders-table-body"></tbody>
          </table>
        </div>
        <div class="order-table-note" id="orders-table-note"></div>
      </div>

      <div class="staff-tab-panel" id="staff-tab-ctv">
        <div class="staff-ctv-head" style="justify-content:flex-end;">
          <button class="btn-primary" id="btn-open-ctv-create" style="padding:10px 18px;">+ Tạo cộng tác viên mới</button>
        </div>

        <div class="ctv-grid" id="ctv-grid"></div>
      </div>

      <!-- Tab "Khách hàng tiềm năng": khách truy cập qua link phân kênh (của NVKD hoặc bất kỳ CTV nào),
           đối chiếu với đơn hàng + lịch sử truy cập, loại trừ SĐT nội bộ (NVKD/CTV), phân loại + khuyến nghị. -->
      <div class="staff-tab-panel" id="staff-tab-leads">
        <p style="font-size:12.5px;color:var(--text-muted);margin:-4px 0 16px;">
          Danh sách khách hàng đã truy cập qua link phân kênh của bạn hoặc của các CTV trực thuộc — đã tự động loại trừ số điện thoại nội bộ (NVKD/CTV).
        </p>
        <div class="order-filter-row" style="margin-bottom:12px; display:flex; flex-wrap:wrap; gap:10px; align-items:center; justify-content:space-between;">
          <div class="staff-range-tabs" style="margin-bottom:0;">
            <button class="staff-range-btn active" data-lead-range="thang-nay">Tháng này</button>
            <button class="staff-range-btn" data-lead-range="thang-truoc">Tháng trước</button>
            <button class="staff-range-btn" data-lead-range="3-thang">3 tháng trước</button>
          </div>
          <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="font-size:13px;color:var(--text-muted);">Từ ngày</span>
              <input type="date" class="order-person-filter" style="padding:6px 10px;height:auto;" id="staff-lead-from-date">
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="font-size:13px;color:var(--text-muted);">Đến ngày</span>
              <input type="date" class="order-person-filter" style="padding:6px 10px;height:auto;" id="staff-lead-to-date">
            </div>
            <button class="btn-outline" style="padding:7px 14px;" id="btn-export-staff-leads">⭳ Export dữ liệu</button>
          </div>
        </div>
        <div style="overflow-x:auto;">
          <table class="sim-table">
            <thead>
              <tr>
                <th>Số điện thoại</th><th>Nguồn giới thiệu</th><th>Lần ghé gần nhất</th><th>Số lần ghé</th>
                <th>Dịch vụ đã xem</th><th>Phân loại</th><th>Ghi chú</th><th>Hành động</th>
              </tr>
            </thead>
            <tbody id="staff-leads-table-body"></tbody>
          </table>
        </div>
        <div class="lead-empty-note" id="staff-leads-empty" style="display:none;margin-top:12px;">
          Chưa có khách hàng nào truy cập qua link phân kênh trong phiên làm việc này.
        </div>
      </div>

      <!-- Tab "Tài liệu Marketing": kho tài liệu do các phòng ban quản lý sản phẩm (Di động/Cố định)
           đăng tải — tài liệu giới thiệu SP, content chia sẻ MXH (FB/Zalo/YouTube/TikTok), hình ảnh SP —
           để NVKD/CTV tải về sử dụng khi bán hàng/làm nội dung. -->
      <div class="staff-tab-panel" id="staff-tab-tailieu">
        <p style="font-size:12.5px;color:var(--text-muted);margin:-4px 0 16px;">
          Tài liệu do phòng ban quản lý sản phẩm Di động/Cố định đăng tải. Tải về để sử dụng khi tư vấn khách hàng hoặc đăng nội dung lên mạng xã hội.
        </p>
        <div class="doc-filter-row">
          <input type="text" class="order-person-filter" id="staff-doc-search" placeholder="🔍 Tìm kiếm tài liệu..." style="flex:1; min-width:200px; padding:6px 12px; height:auto;">
          <select class="order-person-filter" id="staff-doc-filter-dichvu">
            <option value="all">Tất cả dịch vụ</option>
            <option value="Di động">Di động</option>
            <option value="Cố định">Cố định</option>
          </select>
          <select class="order-person-filter" id="staff-doc-filter-loai">
            <option value="all">Tất cả loại nội dung</option>
            <option value="Tài liệu giới thiệu SP">Tài liệu giới thiệu SP</option>
            <option value="Content MXH">Content MXH</option>
            <option value="Hình ảnh SP">Hình ảnh SP</option>
          </select>
        </div>
        <div class="doc-card-grid" id="staff-doc-grid"></div>
        <div class="lead-empty-note" id="staff-doc-empty" style="display:none;margin-top:12px;">
          Không có tài liệu nào khớp với bộ lọc đã chọn.
        </div>
      </div>

      <div class="staff-tab-panel" id="staff-tab-account">
        <div class="staff-profile-bar">
          <div style="display:flex;align-items:center;gap:14px;">
            <div class="ctv-avatar" id="staff-avatar" style="width:64px;height:64px;font-size:22px;">NV</div>
            <div>
              <div style="font-weight:700;font-size:15px;" id="staff-name-display"></div>
              <div style="font-size:12.5px;color:var(--text-muted);" id="staff-diaban-display"></div>
              <button type="button" class="btn-outline" id="btn-staff-avatar-upload-direct" style="margin-top:6px;font-size:12px;padding:4px 10px;">📷 Thay đổi ảnh đại diện</button>
            </div>
          </div>
          <button class="btn-icon-logout" id="btn-staff-logout" title="Đăng xuất" aria-label="Đăng xuất">⏻</button>
        </div>

        <div class="staff-breakdown-head" style="margin-top:28px;">
          <h3 style="font-size:15px;">Link phân kênh theo dịch vụ</h3>
        </div>
        <p style="font-size:12.5px;color:var(--text-muted);margin:-6px 0 16px;">
          Mỗi dịch vụ có 1 liên kết &amp; mã QR riêng để bạn chia sẻ — khách hàng đăng ký qua đúng liên kết sẽ được ghi nhận về bạn.
        </p>
        <div class="ctv-grid" id="staff-channel-grid"></div>

        <input type="file" id="staff-avatar-file-input" accept="image/*" style="display:none;">
      </div>

      <input type="file" id="ctv-avatar-file-input" accept="image/*" style="display:none;">
    </div>

    <!-- Trạng thái ĐÃ đăng nhập CTV (chỉ xem kết quả của riêng mình) -->
    <div class="staff-dashboard" id="ctv-dashboard" style="display:none;">

      <div class="staff-profile-bar">
        <div style="display:flex;align-items:center;gap:12px;">
          <div class="ctv-avatar" id="ctv-self-avatar" style="width:44px;height:44px;"></div>
          <div>
            <div style="font-weight:700;font-size:15px;" id="ctv-self-name-display"></div>
            <div style="font-size:12.5px;color:var(--text-muted);">Cộng tác viên</div>
          </div>
        </div>
        <button class="btn-icon-logout" id="btn-ctv-logout" title="Đăng xuất" aria-label="Đăng xuất">⏻</button>
      </div>

      <!-- CTV Tabs -->
      <div class="staff-nav" style="margin-bottom:20px;border-bottom:1px solid var(--border);padding:0;">
        <span class="staff-nav-link tab-btn active" data-tab="ctv-tab-sales" style="padding-bottom:10px;margin-right:20px;cursor:pointer;font-weight:600;">Kết quả bán hàng</span>
        <span class="staff-nav-link tab-btn" data-tab="ctv-tab-leads" style="padding-bottom:10px;margin-right:20px;cursor:pointer;font-weight:600;">🎯 Khách hàng tiềm năng</span>
        <span class="staff-nav-link tab-btn" data-tab="ctv-tab-tailieu" style="padding-bottom:10px;margin-right:20px;cursor:pointer;font-weight:600;">📁 Tài liệu Marketing</span>
        <span class="staff-nav-link tab-btn" data-tab="ctv-tab-account" style="padding-bottom:10px;cursor:pointer;font-weight:600;">Tài khoản của bạn</span>
      </div>

      <!-- Tab 1: Kết quả bán hàng -->
      <div class="tab-panel active" id="ctv-tab-sales">
        <div class="staff-range-tabs" id="ctv-range-tabs">
          <button class="staff-range-btn active" data-range="thang-nay">Tháng này</button>
          <button class="staff-range-btn" data-range="thang-truoc">Tháng trước</button>
          <button class="staff-range-btn" data-range="3-thang">3 tháng</button>
          <button class="staff-range-btn" data-range="12-thang">12 tháng</button>
        </div>

        <div class="staff-stats" id="ctv-self-stats"></div>

        <div class="chart-card" style="margin-bottom:18px;max-width:640px;">
          <h3 style="font-size:14px;font-weight:700;margin-bottom:2px;">Số lượng đơn hàng theo trạng thái</h3>
          <div class="chart-sub" id="ctv-self-status-summary-sub">Kỳ: Tháng này</div>
          <div id="ctv-self-status-summary"></div>
        </div>

        <div class="charts-row" style="grid-template-columns:1fr;max-width:640px;">
          <div class="chart-card">
            <h3>Xu hướng doanh số 12 tháng gần nhất</h3>
            <div class="chart-sub">Doanh số cá nhân theo từng tháng</div>
            <div id="ctv-self-trend-chart"></div>
          </div>
        </div>

        <div class="staff-breakdown-head" style="margin-top:34px;">
          <h3 style="font-size:15px;">Danh sách đơn hàng chi tiết</h3>
          <button class="btn-outline" id="btn-export-orders-self">⭳ Xuất danh sách đơn hàng (CSV)</button>
        </div>
        <div class="order-filter-row">
          <div class="order-status-filters" id="ctv-order-status-filters">
            <button class="order-filter-btn active" data-status="all">Tất cả</button>
            <button class="order-filter-btn" data-status="Đang thực hiện">Đang thực hiện</button>
            <button class="order-filter-btn" data-status="Đang triển khai">Đang triển khai</button>
            <button class="order-filter-btn" data-status="Hoàn thành">Hoàn thành</button>
            <button class="order-filter-btn" data-status="Đã hủy">Đã hủy</button>
          </div>
        </div>
        <div style="overflow-x:auto;">
          <table class="sim-table" id="ctv-orders-table">
            <thead>
              <tr>
                <th>Mã đơn hàng</th><th>Ngày</th><th>Loại dịch vụ</th><th>Tên gói cước</th><th>Khách hàng</th><th>SĐT KH</th>
                <th>NVKD phụ trách</th><th>NV kỹ thuật</th><th>Trạng thái</th><th>Giá trị</th>
              </tr>
            </thead>
            <tbody id="ctv-orders-table-body"></tbody>
          </table>
        </div>
        <div class="order-table-note" id="ctv-orders-table-note"></div>
      </div>

      <!-- Tab "Khách hàng tiềm năng" của riêng CTV này — chỉ hiện lead phát sinh từ đúng link giới thiệu
           của CTV đang đăng nhập (không thấy lead của NVKD hay CTV khác). -->
      <div class="tab-panel" id="ctv-tab-leads">
        <p style="font-size:12.5px;color:var(--text-muted);margin:-4px 0 16px;">
          Danh sách khách hàng đã truy cập qua liên kết giới thiệu của riêng bạn.
        </p>
        <div class="order-filter-row" style="margin-bottom:12px; display:flex; flex-wrap:wrap; gap:10px; align-items:center; justify-content:space-between;">
          <div class="staff-range-tabs" style="margin-bottom:0;">
            <button class="staff-range-btn active" data-lead-range="thang-nay">Tháng này</button>
            <button class="staff-range-btn" data-lead-range="thang-truoc">Tháng trước</button>
            <button class="staff-range-btn" data-lead-range="3-thang">3 tháng trước</button>
          </div>
          <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="font-size:13px;color:var(--text-muted);">Từ ngày</span>
              <input type="date" class="order-person-filter" style="padding:6px 10px;height:auto;" id="ctv-lead-from-date">
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="font-size:13px;color:var(--text-muted);">Đến ngày</span>
              <input type="date" class="order-person-filter" style="padding:6px 10px;height:auto;" id="ctv-lead-to-date">
            </div>
            <button class="btn-outline" style="padding:7px 14px;" id="btn-export-ctv-leads">⭳ Export dữ liệu</button>
          </div>
        </div>
        <div style="overflow-x:auto;">
          <table class="sim-table">
            <thead>
              <tr>
                <th>Số điện thoại</th><th>Lần ghé gần nhất</th><th>Số lần ghé</th>
                <th>Dịch vụ đã xem</th><th>Phân loại</th><th>Ghi chú</th><th>Hành động</th>
              </tr>
            </thead>
            <tbody id="ctv-leads-table-body"></tbody>
          </table>
        </div>
        <div class="lead-empty-note" id="ctv-leads-empty" style="display:none;margin-top:12px;">
          Chưa có khách hàng nào truy cập qua liên kết giới thiệu của bạn.
        </div>
      </div>

      <!-- Tab "Tài liệu Marketing" của CTV — cùng kho tài liệu với NVKD. -->
      <div class="tab-panel" id="ctv-tab-tailieu">
        <p style="font-size:12.5px;color:var(--text-muted);margin:-4px 0 16px;">
          Tài liệu do phòng ban quản lý sản phẩm Di động/Cố định đăng tải. Tải về để sử dụng khi tư vấn khách hàng hoặc đăng nội dung lên mạng xã hội.
        </p>
        <div class="doc-filter-row">
          <input type="text" class="order-person-filter" id="ctv-doc-search" placeholder="🔍 Tìm kiếm tài liệu..." style="flex:1; min-width:200px; padding:6px 12px; height:auto;">
          <select class="order-person-filter" id="ctv-doc-filter-dichvu">
            <option value="all">Tất cả dịch vụ</option>
            <option value="Di động">Di động</option>
            <option value="Cố định">Cố định</option>
          </select>
          <select class="order-person-filter" id="ctv-doc-filter-loai">
            <option value="all">Tất cả loại nội dung</option>
            <option value="Tài liệu giới thiệu SP">Tài liệu giới thiệu SP</option>
            <option value="Content MXH">Content MXH</option>
            <option value="Hình ảnh SP">Hình ảnh SP</option>
          </select>
        </div>
        <div class="doc-card-grid" id="ctv-doc-grid"></div>
        <div class="lead-empty-note" id="ctv-doc-empty" style="display:none;margin-top:12px;">
          Không có tài liệu nào khớp với bộ lọc đã chọn.
        </div>
      </div>

      <!-- Tab 2: Tài khoản của bạn -->
      <div class="tab-panel" id="ctv-tab-account">
        <div class="staff-breakdown-head">
          <h3 style="font-size:15px;">Liên kết giới thiệu chung</h3>
          <button class="btn-outline" id="btn-ctv-export-self">⭳ Xuất báo cáo tổng quan (CSV)</button>
        </div>
        <div class="ctv-card ctv-self-link-card" style="max-width:280px;margin-bottom:34px;">
          <div class="ctv-qr-wrap" id="ctv-self-qr-wrap" style="cursor:pointer;" title="Xem mã QR phóng to"></div>
          <div class="ctv-link-row">
            <input type="text" readonly id="ctv-self-link-input">
            <button class="btn-outline" id="btn-ctv-self-copy" style="padding:7px 10px;font-size:14px;" title="Sao chép">📋</button>
          </div>
        </div>

        <div class="staff-breakdown-head">
          <h3 style="font-size:15px;">Liên kết nhanh đến dịch vụ/gói cước</h3>
        </div>
        <p style="font-size:13px;color:var(--text-muted);margin-top:-10px;margin-bottom:16px;">
          Mã QR hoặc liên kết bên dưới sẽ đưa khách hàng trực tiếp đến thông tin gói cước và vẫn được tự động ghi nhận đơn hàng cho bạn.
        </p>
        <div class="ctv-grid" id="ctv-quick-links-grid" style="grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:16px;">
          <!-- Rendered via JS -->
        </div>
      </div>
      <input type="file" id="ctv-self-avatar-file-input" accept="image/*" style="display:none;">
    </div>
  </div>
</section>

<footer class="site-footer">
  Trang demo dựng lại giao diện &amp; dữ liệu gói cước Viettel &middot; Dự án Viettel Tammi &middot; Dữ liệu tham khảo, không dùng để giao dịch thật.
</footer>

<script>
/* ======================================================
   THƯ VIỆN TẠO MÃ QR (nhúng offline, không gọi API ngoài)
   Nguồn: "QRCode for JavaScript" của Kazuhiko Arase (2009), MIT License
   (http://www.opensource.org/licenses/mit-license.php), lấy phần lõi thuật toán
   mã hoá QR (không phụ thuộc Flash/Node) từ gói qrcode-terminal, gộp lại thành
   1 file để chạy trực tiếp trên trình duyệt (không cần require/module).
   "QR Code" là nhãn hiệu đã đăng ký của DENSO WAVE INCORPORATED.
   ====================================================== */
var QRCode = (function(){
// ---- QRMode.js ----
var QRMode = {
    MODE_NUMBER :       1 << 0,
    MODE_ALPHA_NUM :    1 << 1,
    MODE_8BIT_BYTE :    1 << 2,
    MODE_KANJI :        1 << 3
};

// ---- QRErrorCorrectLevel.js ----
var QRErrorCorrectLevel = {
	L : 1,
	M : 0,
	Q : 3,
	H : 2
};

// ---- QRMaskPattern.js ----
var QRMaskPattern = {
	PATTERN000 : 0,
	PATTERN001 : 1,
	PATTERN010 : 2,
	PATTERN011 : 3,
	PATTERN100 : 4,
	PATTERN101 : 5,
	PATTERN110 : 6,
	PATTERN111 : 7
};

// ---- QRMath.js ----
var QRMath = {

	glog : function(n) {
	
		if (n < 1) {
			throw new Error("glog(" + n + ")");
		}
		
		return QRMath.LOG_TABLE[n];
	},
	
	gexp : function(n) {
	
		while (n < 0) {
			n += 255;
		}
	
		while (n >= 256) {
			n -= 255;
		}
	
		return QRMath.EXP_TABLE[n];
	},
	
	EXP_TABLE : new Array(256),
	
	LOG_TABLE : new Array(256)

};
	
for (var i = 0; i < 8; i++) {
	QRMath.EXP_TABLE[i] = 1 << i;
}
for (var i = 8; i < 256; i++) {
	QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4]
		^ QRMath.EXP_TABLE[i - 5]
		^ QRMath.EXP_TABLE[i - 6]
		^ QRMath.EXP_TABLE[i - 8];
}
for (var i = 0; i < 255; i++) {
	QRMath.LOG_TABLE[QRMath.EXP_TABLE[i] ] = i;
}

// ---- QRPolynomial.js ----
function QRPolynomial(num, shift) {
	if (num.length === undefined) {
		throw new Error(num.length + "/" + shift);
	}

	var offset = 0;

	while (offset < num.length && num[offset] === 0) {
		offset++;
	}

	this.num = new Array(num.length - offset + shift);
	for (var i = 0; i < num.length - offset; i++) {
		this.num[i] = num[i + offset];
	}
}

QRPolynomial.prototype = {

	get : function(index) {
		return this.num[index];
	},
	
	getLength : function() {
		return this.num.length;
	},
	
	multiply : function(e) {
	
		var num = new Array(this.getLength() + e.getLength() - 1);
	
		for (var i = 0; i < this.getLength(); i++) {
			for (var j = 0; j < e.getLength(); j++) {
				num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i) ) + QRMath.glog(e.get(j) ) );
			}
		}
	
		return new QRPolynomial(num, 0);
	},
	
	mod : function(e) {
	
		if (this.getLength() - e.getLength() < 0) {
			return this;
		}
	
		var ratio = QRMath.glog(this.get(0) ) - QRMath.glog(e.get(0) );
	
		var num = new Array(this.getLength() );
		
		for (var i = 0; i < this.getLength(); i++) {
			num[i] = this.get(i);
		}
		
		for (var x = 0; x < e.getLength(); x++) {
			num[x] ^= QRMath.gexp(QRMath.glog(e.get(x) ) + ratio);
		}
	
		// recursive call
		return new QRPolynomial(num, 0).mod(e);
	}
};

// ---- QRUtil.js ----
var QRUtil = {

    PATTERN_POSITION_TABLE : [
        [],
        [6, 18],
        [6, 22],
        [6, 26],
        [6, 30],
        [6, 34],
        [6, 22, 38],
        [6, 24, 42],
        [6, 26, 46],
        [6, 28, 50],
        [6, 30, 54],        
        [6, 32, 58],
        [6, 34, 62],
        [6, 26, 46, 66],
        [6, 26, 48, 70],
        [6, 26, 50, 74],
        [6, 30, 54, 78],
        [6, 30, 56, 82],
        [6, 30, 58, 86],
        [6, 34, 62, 90],
        [6, 28, 50, 72, 94],
        [6, 26, 50, 74, 98],
        [6, 30, 54, 78, 102],
        [6, 28, 54, 80, 106],
        [6, 32, 58, 84, 110],
        [6, 30, 58, 86, 114],
        [6, 34, 62, 90, 118],
        [6, 26, 50, 74, 98, 122],
        [6, 30, 54, 78, 102, 126],
        [6, 26, 52, 78, 104, 130],
        [6, 30, 56, 82, 108, 134],
        [6, 34, 60, 86, 112, 138],
        [6, 30, 58, 86, 114, 142],
        [6, 34, 62, 90, 118, 146],
        [6, 30, 54, 78, 102, 126, 150],
        [6, 24, 50, 76, 102, 128, 154],
        [6, 28, 54, 80, 106, 132, 158],
        [6, 32, 58, 84, 110, 136, 162],
        [6, 26, 54, 82, 110, 138, 166],
        [6, 30, 58, 86, 114, 142, 170]
    ],

    G15 : (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0),
    G18 : (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0),
    G15_MASK : (1 << 14) | (1 << 12) | (1 << 10)    | (1 << 4) | (1 << 1),

    getBCHTypeInfo : function(data) {
        var d = data << 10;
        while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
            d ^= (QRUtil.G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) ) );    
        }
        return ( (data << 10) | d) ^ QRUtil.G15_MASK;
    },

    getBCHTypeNumber : function(data) {
        var d = data << 12;
        while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
            d ^= (QRUtil.G18 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) ) );    
        }
        return (data << 12) | d;
    },

    getBCHDigit : function(data) {

        var digit = 0;

        while (data !== 0) {
            digit++;
            data >>>= 1;
        }

        return digit;
    },

    getPatternPosition : function(typeNumber) {
        return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
    },

    getMask : function(maskPattern, i, j) {
        
        switch (maskPattern) {
            
        case QRMaskPattern.PATTERN000 : return (i + j) % 2 === 0;
        case QRMaskPattern.PATTERN001 : return i % 2 === 0;
        case QRMaskPattern.PATTERN010 : return j % 3 === 0;
        case QRMaskPattern.PATTERN011 : return (i + j) % 3 === 0;
        case QRMaskPattern.PATTERN100 : return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 === 0;
        case QRMaskPattern.PATTERN101 : return (i * j) % 2 + (i * j) % 3 === 0;
        case QRMaskPattern.PATTERN110 : return ( (i * j) % 2 + (i * j) % 3) % 2 === 0;
        case QRMaskPattern.PATTERN111 : return ( (i * j) % 3 + (i + j) % 2) % 2 === 0;

        default :
            throw new Error("bad maskPattern:" + maskPattern);
        }
    },

    getErrorCorrectPolynomial : function(errorCorrectLength) {

        var a = new QRPolynomial([1], 0);

        for (var i = 0; i < errorCorrectLength; i++) {
            a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0) );
        }

        return a;
    },

    getLengthInBits : function(mode, type) {

        if (1 <= type && type < 10) {

            // 1 - 9

            switch(mode) {
            case QRMode.MODE_NUMBER     : return 10;
            case QRMode.MODE_ALPHA_NUM  : return 9;
            case QRMode.MODE_8BIT_BYTE  : return 8;
            case QRMode.MODE_KANJI      : return 8;
            default :
                throw new Error("mode:" + mode);
            }

        } else if (type < 27) {

            // 10 - 26

            switch(mode) {
            case QRMode.MODE_NUMBER     : return 12;
            case QRMode.MODE_ALPHA_NUM  : return 11;
            case QRMode.MODE_8BIT_BYTE  : return 16;
            case QRMode.MODE_KANJI      : return 10;
            default :
                throw new Error("mode:" + mode);
            }

        } else if (type < 41) {

            // 27 - 40

            switch(mode) {
            case QRMode.MODE_NUMBER     : return 14;
            case QRMode.MODE_ALPHA_NUM  : return 13;
            case QRMode.MODE_8BIT_BYTE  : return 16;
            case QRMode.MODE_KANJI      : return 12;
            default :
                throw new Error("mode:" + mode);
            }

        } else {
            throw new Error("type:" + type);
        }
    },

    getLostPoint : function(qrCode) {
        
        var moduleCount = qrCode.getModuleCount();
        var lostPoint = 0;
        var row = 0; 
        var col = 0;

        
        // LEVEL1
        
        for (row = 0; row < moduleCount; row++) {

            for (col = 0; col < moduleCount; col++) {

                var sameCount = 0;
                var dark = qrCode.isDark(row, col);

                for (var r = -1; r <= 1; r++) {

                    if (row + r < 0 || moduleCount <= row + r) {
                        continue;
                    }

                    for (var c = -1; c <= 1; c++) {

                        if (col + c < 0 || moduleCount <= col + c) {
                            continue;
                        }

                        if (r === 0 && c === 0) {
                            continue;
                        }

                        if (dark === qrCode.isDark(row + r, col + c) ) {
                            sameCount++;
                        }
                    }
                }

                if (sameCount > 5) {
                    lostPoint += (3 + sameCount - 5);
                }
            }
        }

        // LEVEL2

        for (row = 0; row < moduleCount - 1; row++) {
            for (col = 0; col < moduleCount - 1; col++) {
                var count = 0;
                if (qrCode.isDark(row,     col    ) ) count++;
                if (qrCode.isDark(row + 1, col    ) ) count++;
                if (qrCode.isDark(row,     col + 1) ) count++;
                if (qrCode.isDark(row + 1, col + 1) ) count++;
                if (count === 0 || count === 4) {
                    lostPoint += 3;
                }
            }
        }

        // LEVEL3

        for (row = 0; row < moduleCount; row++) {
            for (col = 0; col < moduleCount - 6; col++) {
                if (qrCode.isDark(row, col) && 
                        !qrCode.isDark(row, col + 1) && 
                         qrCode.isDark(row, col + 2) && 
                         qrCode.isDark(row, col + 3) && 
                         qrCode.isDark(row, col + 4) && 
                        !qrCode.isDark(row, col + 5) && 
                         qrCode.isDark(row, col + 6) ) {
                    lostPoint += 40;
                }
            }
        }

        for (col = 0; col < moduleCount; col++) {
            for (row = 0; row < moduleCount - 6; row++) {
                if (qrCode.isDark(row, col) &&
                        !qrCode.isDark(row + 1, col) &&
                         qrCode.isDark(row + 2, col) &&
                         qrCode.isDark(row + 3, col) &&
                         qrCode.isDark(row + 4, col) &&
                        !qrCode.isDark(row + 5, col) &&
                         qrCode.isDark(row + 6, col) ) {
                    lostPoint += 40;
                }
            }
        }

        // LEVEL4
        
        var darkCount = 0;

        for (col = 0; col < moduleCount; col++) {
            for (row = 0; row < moduleCount; row++) {
                if (qrCode.isDark(row, col) ) {
                    darkCount++;
                }
            }
        }
        
        var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
        lostPoint += ratio * 10;

        return lostPoint;       
    }

};

// ---- QRRSBlock.js ----
function QRRSBlock(totalCount, dataCount) {
	this.totalCount = totalCount;
	this.dataCount  = dataCount;
}

QRRSBlock.RS_BLOCK_TABLE = [

	// L
	// M
	// Q
	// H

	// 1
	[1, 26, 19],
	[1, 26, 16],
	[1, 26, 13],
	[1, 26, 9],
	
	// 2
	[1, 44, 34],
	[1, 44, 28],
	[1, 44, 22],
	[1, 44, 16],

	// 3
	[1, 70, 55],
	[1, 70, 44],
	[2, 35, 17],
	[2, 35, 13],

	// 4		
	[1, 100, 80],
	[2, 50, 32],
	[2, 50, 24],
	[4, 25, 9],
	
	// 5
	[1, 134, 108],
	[2, 67, 43],
	[2, 33, 15, 2, 34, 16],
	[2, 33, 11, 2, 34, 12],
	
	// 6
	[2, 86, 68],
	[4, 43, 27],
	[4, 43, 19],
	[4, 43, 15],
	
	// 7		
	[2, 98, 78],
	[4, 49, 31],
	[2, 32, 14, 4, 33, 15],
	[4, 39, 13, 1, 40, 14],
	
	// 8
	[2, 121, 97],
	[2, 60, 38, 2, 61, 39],
	[4, 40, 18, 2, 41, 19],
	[4, 40, 14, 2, 41, 15],
	
	// 9
	[2, 146, 116],
	[3, 58, 36, 2, 59, 37],
	[4, 36, 16, 4, 37, 17],
	[4, 36, 12, 4, 37, 13],
	
	// 10		
	[2, 86, 68, 2, 87, 69],
	[4, 69, 43, 1, 70, 44],
	[6, 43, 19, 2, 44, 20],
	[6, 43, 15, 2, 44, 16],

	// 11
	[4, 101, 81],
	[1, 80, 50, 4, 81, 51],
	[4, 50, 22, 4, 51, 23],
	[3, 36, 12, 8, 37, 13],

	// 12
	[2, 116, 92, 2, 117, 93],
	[6, 58, 36, 2, 59, 37],
	[4, 46, 20, 6, 47, 21],
	[7, 42, 14, 4, 43, 15],

	// 13
	[4, 133, 107],
	[8, 59, 37, 1, 60, 38],
	[8, 44, 20, 4, 45, 21],
	[12, 33, 11, 4, 34, 12],

	// 14
	[3, 145, 115, 1, 146, 116],
	[4, 64, 40, 5, 65, 41],
	[11, 36, 16, 5, 37, 17],
	[11, 36, 12, 5, 37, 13],

	// 15
	[5, 109, 87, 1, 110, 88],
	[5, 65, 41, 5, 66, 42],
	[5, 54, 24, 7, 55, 25],
	[11, 36, 12],

	// 16
	[5, 122, 98, 1, 123, 99],
	[7, 73, 45, 3, 74, 46],
	[15, 43, 19, 2, 44, 20],
	[3, 45, 15, 13, 46, 16],

	// 17
	[1, 135, 107, 5, 136, 108],
	[10, 74, 46, 1, 75, 47],
	[1, 50, 22, 15, 51, 23],
	[2, 42, 14, 17, 43, 15],

	// 18
	[5, 150, 120, 1, 151, 121],
	[9, 69, 43, 4, 70, 44],
	[17, 50, 22, 1, 51, 23],
	[2, 42, 14, 19, 43, 15],

	// 19
	[3, 141, 113, 4, 142, 114],
	[3, 70, 44, 11, 71, 45],
	[17, 47, 21, 4, 48, 22],
	[9, 39, 13, 16, 40, 14],

	// 20
	[3, 135, 107, 5, 136, 108],
	[3, 67, 41, 13, 68, 42],
	[15, 54, 24, 5, 55, 25],
	[15, 43, 15, 10, 44, 16],

	// 21
	[4, 144, 116, 4, 145, 117],
	[17, 68, 42],
	[17, 50, 22, 6, 51, 23],
	[19, 46, 16, 6, 47, 17],

	// 22
	[2, 139, 111, 7, 140, 112],
	[17, 74, 46],
	[7, 54, 24, 16, 55, 25],
	[34, 37, 13],

	// 23
	[4, 151, 121, 5, 152, 122],
	[4, 75, 47, 14, 76, 48],
	[11, 54, 24, 14, 55, 25],
	[16, 45, 15, 14, 46, 16],

	// 24
	[6, 147, 117, 4, 148, 118],
	[6, 73, 45, 14, 74, 46],
	[11, 54, 24, 16, 55, 25],
	[30, 46, 16, 2, 47, 17],

	// 25
	[8, 132, 106, 4, 133, 107],
	[8, 75, 47, 13, 76, 48],
	[7, 54, 24, 22, 55, 25],
	[22, 45, 15, 13, 46, 16],

	// 26
	[10, 142, 114, 2, 143, 115],
	[19, 74, 46, 4, 75, 47],
	[28, 50, 22, 6, 51, 23],
	[33, 46, 16, 4, 47, 17],

	// 27
	[8, 152, 122, 4, 153, 123],
	[22, 73, 45, 3, 74, 46],
	[8, 53, 23, 26, 54, 24],
	[12, 45, 15, 28, 46, 16],

	// 28
	[3, 147, 117, 10, 148, 118],
	[3, 73, 45, 23, 74, 46],
	[4, 54, 24, 31, 55, 25],
	[11, 45, 15, 31, 46, 16],

	// 29
	[7, 146, 116, 7, 147, 117],
	[21, 73, 45, 7, 74, 46],
	[1, 53, 23, 37, 54, 24],
	[19, 45, 15, 26, 46, 16],

	// 30
	[5, 145, 115, 10, 146, 116],
	[19, 75, 47, 10, 76, 48],
	[15, 54, 24, 25, 55, 25],
	[23, 45, 15, 25, 46, 16],

	// 31
	[13, 145, 115, 3, 146, 116],
	[2, 74, 46, 29, 75, 47],
	[42, 54, 24, 1, 55, 25],
	[23, 45, 15, 28, 46, 16],

	// 32
	[17, 145, 115],
	[10, 74, 46, 23, 75, 47],
	[10, 54, 24, 35, 55, 25],
	[19, 45, 15, 35, 46, 16],

	// 33
	[17, 145, 115, 1, 146, 116],
	[14, 74, 46, 21, 75, 47],
	[29, 54, 24, 19, 55, 25],
	[11, 45, 15, 46, 46, 16],

	// 34
	[13, 145, 115, 6, 146, 116],
	[14, 74, 46, 23, 75, 47],
	[44, 54, 24, 7, 55, 25],
	[59, 46, 16, 1, 47, 17],

	// 35
	[12, 151, 121, 7, 152, 122],
	[12, 75, 47, 26, 76, 48],
	[39, 54, 24, 14, 55, 25],
	[22, 45, 15, 41, 46, 16],

	// 36
	[6, 151, 121, 14, 152, 122],
	[6, 75, 47, 34, 76, 48],
	[46, 54, 24, 10, 55, 25],
	[2, 45, 15, 64, 46, 16],

	// 37
	[17, 152, 122, 4, 153, 123],
	[29, 74, 46, 14, 75, 47],
	[49, 54, 24, 10, 55, 25],
	[24, 45, 15, 46, 46, 16],

	// 38
	[4, 152, 122, 18, 153, 123],
	[13, 74, 46, 32, 75, 47],
	[48, 54, 24, 14, 55, 25],
	[42, 45, 15, 32, 46, 16],

	// 39
	[20, 147, 117, 4, 148, 118],
	[40, 75, 47, 7, 76, 48],
	[43, 54, 24, 22, 55, 25],
	[10, 45, 15, 67, 46, 16],

	// 40
	[19, 148, 118, 6, 149, 119],
	[18, 75, 47, 31, 76, 48],
	[34, 54, 24, 34, 55, 25],
	[20, 45, 15, 61, 46, 16]
];

QRRSBlock.getRSBlocks = function(typeNumber, errorCorrectLevel) {
	
	var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
	
	if (rsBlock === undefined) {
		throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel);
	}

	var length = rsBlock.length / 3;
	
	var list = [];
	
	for (var i = 0; i < length; i++) {

		var count = rsBlock[i * 3 + 0];
		var totalCount = rsBlock[i * 3 + 1];
		var dataCount  = rsBlock[i * 3 + 2];

		for (var j = 0; j < count; j++) {
			list.push(new QRRSBlock(totalCount, dataCount) );	
		}
	}
	
	return list;
};

QRRSBlock.getRsBlockTable = function(typeNumber, errorCorrectLevel) {

	switch(errorCorrectLevel) {
	case QRErrorCorrectLevel.L :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
	case QRErrorCorrectLevel.M :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
	case QRErrorCorrectLevel.Q :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
	case QRErrorCorrectLevel.H :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
	default :
		return undefined;
	}
};

// ---- QRBitBuffer.js ----
function QRBitBuffer() {
	this.buffer = [];
	this.length = 0;
}

QRBitBuffer.prototype = {

	get : function(index) {
		var bufIndex = Math.floor(index / 8);
		return ( (this.buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
	},
	
	put : function(num, length) {
		for (var i = 0; i < length; i++) {
			this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
		}
	},
	
	getLengthInBits : function() {
		return this.length;
	},
	
	putBit : function(bit) {
	
		var bufIndex = Math.floor(this.length / 8);
		if (this.buffer.length <= bufIndex) {
			this.buffer.push(0);
		}
	
		if (bit) {
			this.buffer[bufIndex] |= (0x80 >>> (this.length % 8) );
		}
	
		this.length++;
	}
};

// ---- QR8bitByte.js ----
function QR8bitByte(data) {
	this.mode = QRMode.MODE_8BIT_BYTE;
	this.data = data;
}

QR8bitByte.prototype = {

	getLength : function() {
		return this.data.length;
	},
	
	write : function(buffer) {
		for (var i = 0; i < this.data.length; i++) {
			// not JIS ...
			buffer.put(this.data.charCodeAt(i), 8);
		}
	}
};

// ---- index.js ----
//---------------------------------------------------------------------
// QRCode for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//   http://www.opensource.org/licenses/mit-license.php
//
// The word "QR Code" is registered trademark of 
// DENSO WAVE INCORPORATED
//   http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------
// Modified to work in node for this project (and some refactoring)
//---------------------------------------------------------------------






function QRCode(typeNumber, errorCorrectLevel) {
	this.typeNumber = typeNumber;
	this.errorCorrectLevel = errorCorrectLevel;
	this.modules = null;
	this.moduleCount = 0;
	this.dataCache = null;
	this.dataList = [];
}

QRCode.prototype = {
	
	addData : function(data) {
		var newData = new QR8bitByte(data);
		this.dataList.push(newData);
		this.dataCache = null;
	},
	
	isDark : function(row, col) {
		if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
			throw new Error(row + "," + col);
		}
		return this.modules[row][col];
	},

	getModuleCount : function() {
		return this.moduleCount;
	},
	
	make : function() {
		// Calculate automatically typeNumber if provided is < 1
		if (this.typeNumber < 1 ){
			var typeNumber = 1;
			for (typeNumber = 1; typeNumber < 40; typeNumber++) {
				var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, this.errorCorrectLevel);

				var buffer = new QRBitBuffer();
				var totalDataCount = 0;
				for (var i = 0; i < rsBlocks.length; i++) {
					totalDataCount += rsBlocks[i].dataCount;
				}

				for (var x = 0; x < this.dataList.length; x++) {
					var data = this.dataList[x];
					buffer.put(data.mode, 4);
					buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber) );
					data.write(buffer);
				}
				if (buffer.getLengthInBits() <= totalDataCount * 8)
					break;
			}
			this.typeNumber = typeNumber;
		}
		this.makeImpl(false, this.getBestMaskPattern() );
	},
	
	makeImpl : function(test, maskPattern) {
		
		this.moduleCount = this.typeNumber * 4 + 17;
		this.modules = new Array(this.moduleCount);
		
		for (var row = 0; row < this.moduleCount; row++) {
			
			this.modules[row] = new Array(this.moduleCount);
			
			for (var col = 0; col < this.moduleCount; col++) {
				this.modules[row][col] = null;//(col + row) % 3;
			}
		}
	
		this.setupPositionProbePattern(0, 0);
		this.setupPositionProbePattern(this.moduleCount - 7, 0);
		this.setupPositionProbePattern(0, this.moduleCount - 7);
		this.setupPositionAdjustPattern();
		this.setupTimingPattern();
		this.setupTypeInfo(test, maskPattern);
		
		if (this.typeNumber >= 7) {
			this.setupTypeNumber(test);
		}
	
		if (this.dataCache === null) {
			this.dataCache = QRCode.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
		}
	
		this.mapData(this.dataCache, maskPattern);
	},

	setupPositionProbePattern : function(row, col)  {
		
		for (var r = -1; r <= 7; r++) {
			
			if (row + r <= -1 || this.moduleCount <= row + r) continue;
			
			for (var c = -1; c <= 7; c++) {
				
				if (col + c <= -1 || this.moduleCount <= col + c) continue;
				
				if ( (0 <= r && r <= 6 && (c === 0 || c === 6) ) || 
                     (0 <= c && c <= 6 && (r === 0 || r === 6) ) || 
                     (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
					this.modules[row + r][col + c] = true;
				} else {
					this.modules[row + r][col + c] = false;
				}
			}		
		}		
	},
	
	getBestMaskPattern : function() {
	
		var minLostPoint = 0;
		var pattern = 0;
	
		for (var i = 0; i < 8; i++) {
			
			this.makeImpl(true, i);
	
			var lostPoint = QRUtil.getLostPoint(this);
	
			if (i === 0 || minLostPoint >  lostPoint) {
				minLostPoint = lostPoint;
				pattern = i;
			}
		}
	
		return pattern;
	},
	
	createMovieClip : function(target_mc, instance_name, depth) {
	
		var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth);
		var cs = 1;
	
		this.make();

		for (var row = 0; row < this.modules.length; row++) {
			
			var y = row * cs;
			
			for (var col = 0; col < this.modules[row].length; col++) {
	
				var x = col * cs;
				var dark = this.modules[row][col];
			
				if (dark) {
					qr_mc.beginFill(0, 100);
					qr_mc.moveTo(x, y);
					qr_mc.lineTo(x + cs, y);
					qr_mc.lineTo(x + cs, y + cs);
					qr_mc.lineTo(x, y + cs);
					qr_mc.endFill();
				}
			}
		}
		
		return qr_mc;
	},

	setupTimingPattern : function() {
		
		for (var r = 8; r < this.moduleCount - 8; r++) {
			if (this.modules[r][6] !== null) {
				continue;
			}
			this.modules[r][6] = (r % 2 === 0);
		}
	
		for (var c = 8; c < this.moduleCount - 8; c++) {
			if (this.modules[6][c] !== null) {
				continue;
			}
			this.modules[6][c] = (c % 2 === 0);
		}
	},
	
	setupPositionAdjustPattern : function() {
	
		var pos = QRUtil.getPatternPosition(this.typeNumber);
		
		for (var i = 0; i < pos.length; i++) {
		
			for (var j = 0; j < pos.length; j++) {
			
				var row = pos[i];
				var col = pos[j];
				
				if (this.modules[row][col] !== null) {
					continue;
				}
				
				for (var r = -2; r <= 2; r++) {
				
					for (var c = -2; c <= 2; c++) {
					
						if (Math.abs(r) === 2 || 
                            Math.abs(c) === 2 ||
                            (r === 0 && c === 0) ) {
							this.modules[row + r][col + c] = true;
						} else {
							this.modules[row + r][col + c] = false;
						}
					}
				}
			}
		}
	},
	
	setupTypeNumber : function(test) {
	
		var bits = QRUtil.getBCHTypeNumber(this.typeNumber);
        var mod;
	
		for (var i = 0; i < 18; i++) {
			mod = (!test && ( (bits >> i) & 1) === 1);
			this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
		}
	
		for (var x = 0; x < 18; x++) {
			mod = (!test && ( (bits >> x) & 1) === 1);
			this.modules[x % 3 + this.moduleCount - 8 - 3][Math.floor(x / 3)] = mod;
		}
	},
	
	setupTypeInfo : function(test, maskPattern) {
	
		var data = (this.errorCorrectLevel << 3) | maskPattern;
		var bits = QRUtil.getBCHTypeInfo(data);
        var mod;
	
		// vertical		
		for (var v = 0; v < 15; v++) {
	
			mod = (!test && ( (bits >> v) & 1) === 1);
	
			if (v < 6) {
				this.modules[v][8] = mod;
			} else if (v < 8) {
				this.modules[v + 1][8] = mod;
			} else {
				this.modules[this.moduleCount - 15 + v][8] = mod;
			}
		}
	
		// horizontal
		for (var h = 0; h < 15; h++) {
	
			mod = (!test && ( (bits >> h) & 1) === 1);
			
			if (h < 8) {
				this.modules[8][this.moduleCount - h - 1] = mod;
			} else if (h < 9) {
				this.modules[8][15 - h - 1 + 1] = mod;
			} else {
				this.modules[8][15 - h - 1] = mod;
			}
		}
	
		// fixed module
		this.modules[this.moduleCount - 8][8] = (!test);
	
	},
	
	mapData : function(data, maskPattern) {
		
		var inc = -1;
		var row = this.moduleCount - 1;
		var bitIndex = 7;
		var byteIndex = 0;
		
		for (var col = this.moduleCount - 1; col > 0; col -= 2) {
	
			if (col === 6) col--;
	
			while (true) {
	
				for (var c = 0; c < 2; c++) {
					
					if (this.modules[row][col - c] === null) {
						
						var dark = false;
	
						if (byteIndex < data.length) {
							dark = ( ( (data[byteIndex] >>> bitIndex) & 1) === 1);
						}
	
						var mask = QRUtil.getMask(maskPattern, row, col - c);
	
						if (mask) {
							dark = !dark;
						}
						
						this.modules[row][col - c] = dark;
						bitIndex--;
	
						if (bitIndex === -1) {
							byteIndex++;
							bitIndex = 7;
						}
					}
				}
								
				row += inc;
	
				if (row < 0 || this.moduleCount <= row) {
					row -= inc;
					inc = -inc;
					break;
				}
			}
		}
		
	}

};

QRCode.PAD0 = 0xEC;
QRCode.PAD1 = 0x11;

QRCode.createData = function(typeNumber, errorCorrectLevel, dataList) {
	
	var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
	
	var buffer = new QRBitBuffer();
	
	for (var i = 0; i < dataList.length; i++) {
		var data = dataList[i];
		buffer.put(data.mode, 4);
		buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber) );
		data.write(buffer);
	}

	// calc num max data.
	var totalDataCount = 0;
	for (var x = 0; x < rsBlocks.length; x++) {
		totalDataCount += rsBlocks[x].dataCount;
	}

	if (buffer.getLengthInBits() > totalDataCount * 8) {
		throw new Error("code length overflow. (" + 
            buffer.getLengthInBits() + 
            ">" +  
            totalDataCount * 8 + 
            ")");
	}

	// end code
	if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
		buffer.put(0, 4);
	}

	// padding
	while (buffer.getLengthInBits() % 8 !== 0) {
		buffer.putBit(false);
	}

	// padding
	while (true) {
		
		if (buffer.getLengthInBits() >= totalDataCount * 8) {
			break;
		}
		buffer.put(QRCode.PAD0, 8);
		
		if (buffer.getLengthInBits() >= totalDataCount * 8) {
			break;
		}
		buffer.put(QRCode.PAD1, 8);
	}

	return QRCode.createBytes(buffer, rsBlocks);
};

QRCode.createBytes = function(buffer, rsBlocks) {

	var offset = 0;
	
	var maxDcCount = 0;
	var maxEcCount = 0;
	
	var dcdata = new Array(rsBlocks.length);
	var ecdata = new Array(rsBlocks.length);
	
	for (var r = 0; r < rsBlocks.length; r++) {

		var dcCount = rsBlocks[r].dataCount;
		var ecCount = rsBlocks[r].totalCount - dcCount;

		maxDcCount = Math.max(maxDcCount, dcCount);
		maxEcCount = Math.max(maxEcCount, ecCount);
		
		dcdata[r] = new Array(dcCount);
		
		for (var i = 0; i < dcdata[r].length; i++) {
			dcdata[r][i] = 0xff & buffer.buffer[i + offset];
		}
		offset += dcCount;
		
		var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
		var rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);

		var modPoly = rawPoly.mod(rsPoly);
		ecdata[r] = new Array(rsPoly.getLength() - 1);
		for (var x = 0; x < ecdata[r].length; x++) {
            var modIndex = x + modPoly.getLength() - ecdata[r].length;
			ecdata[r][x] = (modIndex >= 0)? modPoly.get(modIndex) : 0;
		}

	}
	
	var totalCodeCount = 0;
	for (var y = 0; y < rsBlocks.length; y++) {
		totalCodeCount += rsBlocks[y].totalCount;
	}

	var data = new Array(totalCodeCount);
	var index = 0;

	for (var z = 0; z < maxDcCount; z++) {
		for (var s = 0; s < rsBlocks.length; s++) {
			if (z < dcdata[s].length) {
				data[index++] = dcdata[s][z];
			}
		}
	}

	for (var xx = 0; xx < maxEcCount; xx++) {
		for (var t = 0; t < rsBlocks.length; t++) {
			if (xx < ecdata[t].length) {
				data[index++] = ecdata[t][xx];
			}
		}
	}

	return data;

};

QRCode.ErrorCorrectLevel = QRErrorCorrectLevel;
return QRCode;
})();
