
/* ======================================================
   KÊNH NHÂN VIÊN KINH DOANH ĐỊA BÀN (demo)
   - Đăng nhập NVKD bằng OTP (dùng chung modal OtpModal tái sử dụng bên dưới,
     đồng thời phục vụ luôn bước "Tạo cộng tác viên mới" để tránh lặp code đếm
     ngược Gửi lại OTP / OTP hết hạn đã viết cho modal đăng nhập khách hàng).
   - Tổng quan kết quả bán hàng: bộ lọc nhanh Tháng này / Tháng trước / 3 tháng / 12 tháng,
     áp dụng cho cả doanh số cá nhân NVKD lẫn từng CTV trực thuộc.
   - Quản lý CTV: tạo mới (SĐT + Họ tên + OTP) -> sinh mã/liên kết giới thiệu + mã QR,
     cho phép cập nhật ảnh đại diện.
   - Xuất báo cáo CSV: toàn bộ hoặc theo từng CTV.
   - Huy hiệu "đang xem qua liên kết giới thiệu" hiển thị ở mọi trang khi bấm "Xem trang liên kết".
   Toàn bộ dữ liệu (nhân viên, danh sách CTV, số liệu bán hàng) đều là DỮ LIỆU DEMO
   sinh ngẫu nhiên có seed (không lấy từ hệ thống thật của Viettel).
   ====================================================== */
(function(){

  const PHONE_REGEX = /^0(3|5|7|8|9)[0-9]{8}$/;

  /* ---------- Seeded RNG (mulberry32) — để số liệu demo ổn định giữa các lần render ---------- */
  function mulberry32(seed){
    return function(){
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hashSeed(str){
    let h = 0;
    for(let i=0;i<str.length;i++){ h = (h*31 + str.charCodeAt(i)) | 0; }
    return h;
  }

  /* ---------- Vẽ mã QR dạng SVG từ chuỗi text (dùng thư viện QRCode nhúng offline phía trên) ---------- */
  function qrSvg(text, opts){
    opts = opts || {};
    const size = opts.size || 120;
    const margin = opts.margin != null ? opts.margin : 2;
    const qr = new QRCode(-1, QRCode.ErrorCorrectLevel.M);
    qr.addData(text);
    qr.make();
    const n = qr.getModuleCount();
    const cell = size / (n + margin * 2);
    let rects = '';
    for(let r=0;r<n;r++){
      for(let c=0;c<n;c++){
        if(qr.isDark(r,c)){
          const x = (c + margin) * cell, y = (r + margin) * cell;
          rects += `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${(cell+0.6).toFixed(2)}" height="${(cell+0.6).toFixed(2)}" fill="#1A1A1A"/>`;
        }
      }
    }
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="background:#fff;border-radius:6px;">${rects}</svg>`;
  }

  /* ================= HÀM TIỆN ÍCH DÙNG CHUNG (helpers) =================
     FIX LỖI: các hàm bên dưới (escapeHtml, formatVND, formatCompact, formatVNDate,
     initialsOf, referralLink, positionTooltip, statusBadgeHtml, orderRowHtml,
     renderTrendChart) được gọi ở rất nhiều nơi trong khối script Kênh NVKD/CTV
     (dashboard, bảng đơn hàng, thẻ CTV, biểu đồ...) nhưng lại CHƯA từng được khai báo
     trong file gốc. Do đó ngay khi đăng nhập NVKD/CTV thành công và các hàm render...()
     được gọi, trình duyệt gặp lỗi "X is not defined" và dừng thực thi giữa chừng
     -> toàn bộ dashboard hiện ra trống trơn (không có số liệu/bảng biểu) dù đăng
     nhập OTP đã thành công. Bổ sung đầy đủ các hàm còn thiếu ở đây để khắc phục. */

  // Escape ký tự đặc biệt HTML để chống lỗi hiển thị/XSS khi chèn tên KH, NVKD, CTV... vào innerHTML
  function escapeHtml(str){
    return String(str ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // Định dạng tiền VNĐ đầy đủ, có dấu phân cách nghìn — dùng cho số liệu doanh số, giá trị đơn hàng
  function formatVND(n){
    return (Number(n) || 0).toLocaleString('vi-VN') + 'đ';
  }

  // Định dạng rút gọn (vd. 1,2tr / 850k) — dùng cho nhãn trên biểu đồ, nơi không đủ chỗ hiển thị số đầy đủ
  function formatCompact(n){
    n = Number(n) || 0;
    const abs = Math.abs(n);
    if(abs >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, '').replace('.', ',') + ' tỷ';
    if(abs >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '').replace('.', ',') + ' tr';
    if(abs >= 1e3) return Math.round(n / 1e3) + 'k';
    return String(Math.round(n));
  }

  // Chuyển ngày ISO "YYYY-MM-DD" sang định dạng Việt Nam "dd/mm/yyyy" dùng trong bảng/CSV
  function formatVNDate(isoStr){
    if(!isoStr) return '';
    const parts = String(isoStr).split('-');
    if(parts.length !== 3) return String(isoStr);
    const [y, m, d] = parts;
    return `${d}/${m}/${y}`;
  }

  // Chữ cái đầu tên (tối đa 2 ký tự) dùng làm avatar mặc định khi NVKD/CTV chưa có ảnh đại diện
  function initialsOf(name){
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if(parts.length === 0) return '?';
    const first = parts[0][0] || '';
    const last = parts.length > 1 ? (parts[parts.length - 1][0] || '') : '';
    return (first + last).toUpperCase();
  }

  // Dựng link giới thiệu/phân kênh theo mã định danh NVKD hoặc SĐT của CTV
  function referralLink(code){
    return 'https://viettel.vn/vx/gioithieu?NV=' + encodeURIComponent(code);
  }

  // Dựng link mở cửa sổ chat Zalo tới đúng SĐT của NVKD/CTV — Zalo nhận dạng số điện thoại theo
  // định dạng quốc tế không có dấu "+" (vd. 0989866666 -> 84989866666), theo đúng chuẩn "zalo.me/<sđt>".
  function zaloChatLink(phone){
    const digits = String(phone || '').replace(/\D/g, '');
    const intlPhone = digits.replace(/^0/, '84');
    return 'https://zalo.me/' + intlPhone;
  }

  // Định vị tooltip theo vị trí con trỏ, tương đối với phần tử cha có position (vd. .chart-card)
  function positionTooltip(tooltip, container, e){
    const parent = tooltip.offsetParent || container || document.body;
    const rect = parent.getBoundingClientRect();
    let x = e.clientX - rect.left + 14;
    let y = e.clientY - rect.top - 12;
    const maxX = rect.width - (tooltip.offsetWidth || 0) - 8;
    if(maxX > 0 && x > maxX) x = maxX;
    if(x < 0) x = 0;
    if(y < 0) y = 0;
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
  }

  // Ánh xạ trạng thái đơn hàng -> class màu badge (dùng chung style .status-badge sẵn có trong CSS)
  function statusBadgeHtml(trangThai){
    const map = {
      'Hoàn thành': 'status-hoan-thanh',
      'Đang thực hiện': 'status-dang-thuc-hien',
      'Đang triển khai': 'status-dang-trien-khai',
      'Đã hủy': 'status-da-huy'
    };
    const cls = map[trangThai] || 'status-dang-thuc-hien';
    return `<span class="status-badge ${cls}">${escapeHtml(trangThai)}</span>`;
  }

  // Dựng 1 dòng <tr> cho bảng đơn hàng. isFullView=true (dashboard NVKD): hiện cả cột NVKD + CTV (10 cột).
  // isFullView=false (dashboard CTV tự xem): chỉ hiện 1 cột "NVKD phụ trách" (9 cột) — đúng số cột với
  // header bảng tương ứng trong HTML (#orders-table vs #ctv-orders-table).
  function orderRowHtml(o, isFullView){
    const identityCells = isFullView
      ? `<td>${escapeHtml(o.tenNVKD || '-')}</td><td>${o.tenCTV ? escapeHtml(o.tenCTV) : '-'}</td>`
      : `<td>${escapeHtml(o.tenNVKD || '-')}</td>`;
    return `
      <tr>
        <td>${escapeHtml(o.maDonHang)}</td>
        <td>${formatVNDate(o.ngay)}</td>
        <td>${escapeHtml(o.loaiDichVu)}</td>
        <td>${o.tenGoiCuoc ? escapeHtml(o.tenGoiCuoc) : ''}</td>
        <td>${escapeHtml(o.hoTenKhachHang)}</td>
        <td>${escapeHtml(o.sdtKhachHang)}</td>
        ${identityCells}
        <td>${o.tenNVKyThuat ? escapeHtml(o.tenNVKyThuat) : '-'}</td>
        <td>${statusBadgeHtml(o.trangThai)}</td>
        <td>${formatVND(o.giaTri)}</td>
      </tr>`;
  }

  // Biểu đồ đường xu hướng doanh số nhiều chuỗi (vd. "Bạn" vs "Toàn đội CTV") theo 12 tháng gần nhất.
  // series: [{ key, name, color, data:[12 số] }]. Dựng bằng SVG thuần + có tooltip/đường dóng khi rê chuột,
  // dùng chung style .chart-legend/.chart-tooltip/.chart-crosshair-line/.chart-grid/.chart-axis-label/.chart-end-label sẵn có trong CSS.
  function renderTrendChart(containerId, series){
    const container = document.getElementById(containerId);
    if(!container) return;
    if(!series || series.length === 0 || series.every(s => !s.data || s.data.length === 0)){
      container.innerHTML = '<div style="color:var(--text-muted);font-size:13px;padding:20px 0;">Không có dữ liệu để hiển thị.</div>';
      return;
    }

    const W = 560, H = 220;
    const padL = 36, padR = 34, padT = 10, padB = 24;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;
    const n = MONTHS_12.length;
    const stepX = n > 1 ? plotW / (n - 1) : 0;
    const maxVal = Math.max(1, ...series.flatMap(s => s.data));

    const xAt = (i) => padL + i * stepX;
    const yAt = (v) => padT + plotH - (v / maxVal) * plotH;

    let gridLines = '';
    const gridSteps = 4;
    for(let g = 0; g <= gridSteps; g++){
      const v = maxVal * g / gridSteps;
      const y = yAt(v);
      gridLines += `<line class="chart-grid" x1="${padL}" y1="${y.toFixed(1)}" x2="${(W - padR).toFixed(1)}" y2="${y.toFixed(1)}"/>`;
      gridLines += `<text class="chart-axis-label" x="2" y="${(y - 3).toFixed(1)}">${formatCompact(v)}</text>`;
    }

    let xLabels = '';
    MONTHS_12.forEach((d, i) => {
      if(n > 6 && i % 2 !== 0 && i !== n - 1) return;
      xLabels += `<text class="chart-axis-label" x="${xAt(i).toFixed(1)}" y="${H - 6}" text-anchor="middle">Th${d.getMonth() + 1}</text>`;
    });

    let paths = '', pointsSvg = '', endLabels = '';
    series.forEach(s => {
      const dAttr = s.data.map((v, i) => `${i === 0 ? 'M' : 'L'}${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`).join(' ');
      paths += `<path d="${dAttr}" fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
      s.data.forEach((v, i) => {
        pointsSvg += `<circle cx="${xAt(i).toFixed(1)}" cy="${yAt(v).toFixed(1)}" r="3" fill="${s.color}"/>`;
      });
      const lastV = s.data[s.data.length - 1];
      endLabels += `<text class="chart-end-label" x="${(W - padR + 4).toFixed(1)}" y="${yAt(lastV).toFixed(1)}" fill="${s.color}">${formatCompact(lastV)}</text>`;
    });

    const legendHtml = `<div class="chart-legend">${series.map(s => `
      <div class="chart-legend-item"><span class="chart-legend-swatch" style="background:${s.color};"></span>${escapeHtml(s.name)}</div>
    `).join('')}</div>`;

    container.innerHTML = `
      ${legendHtml}
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;overflow:visible;display:block;">
        ${gridLines}
        ${paths}
        ${pointsSvg}
        ${xLabels}
        ${endLabels}
        <line class="chart-crosshair-line" id="${containerId}-crosshair" x1="0" y1="${padT}" x2="0" y2="${(padT + plotH).toFixed(1)}" style="opacity:0;"></line>
        <rect x="${padL}" y="${padT}" width="${plotW}" height="${plotH}" fill="transparent" id="${containerId}-hitarea" style="cursor:crosshair;"></rect>
      </svg>
      <div class="chart-tooltip" id="${containerId}-tooltip"></div>
    `;

    const svg = container.querySelector('svg');
    const hitArea = document.getElementById(containerId + '-hitarea');
    const crosshair = document.getElementById(containerId + '-crosshair');
    const tooltip = document.getElementById(containerId + '-tooltip');

    function idxFromEvent(e){
      const pt = svg.createSVGPoint();
      pt.x = e.clientX; pt.y = e.clientY;
      const loc = pt.matrixTransform(svg.getScreenCTM().inverse());
      const idx = Math.round((loc.x - padL) / (stepX || 1));
      return Math.max(0, Math.min(n - 1, idx));
    }

    hitArea.addEventListener('pointermove', (e) => {
      const idx = idxFromEvent(e);
      const x = xAt(idx);
      crosshair.setAttribute('x1', x.toFixed(1));
      crosshair.setAttribute('x2', x.toFixed(1));
      crosshair.style.opacity = 1;
      const monthLabel = `Tháng ${MONTHS_12[idx].getMonth() + 1}/${MONTHS_12[idx].getFullYear()}`;
      tooltip.innerHTML = `<div class="ttl-name">${monthLabel}</div>` + series.map(s => `
        <div><span class="ttl-name">${escapeHtml(s.name)}: </span><span class="ttl-val" style="color:${s.color};">${formatVND(s.data[idx])}</span></div>
      `).join('');
      tooltip.classList.add('show');
      positionTooltip(tooltip, container, e);
    });
    hitArea.addEventListener('pointerleave', () => {
      crosshair.style.opacity = 0;
      tooltip.classList.remove('show');
    });
  }

  /* ---------- Dữ liệu demo: hồ sơ NVKD + danh sách CTV trực thuộc ---------- */
  const STAFF_DEMO = {
    hoTen: 'Lê Văn Linh',
    maNV: 'NVKD00123',
    diaBan: 'Địa bàn Quận 1, TP.HCM',
    tinhCode: 'HCM',   // mã viết tắt tỉnh/thành theo địa bàn (vd. Hà Nội = HNI, TP.HCM = HCM) — dùng để dựng link phân kênh
    email: 'LINHLV12', // phần tên trước @ trong email nội bộ NVKD: Tên + chữ cái đầu Họ/Đệm + số thứ tự tránh trùng (cấp bởi phòng nhân sự)
    sdt: '0909000123', // số điện thoại liên hệ hiển thị cho khách hàng ở khối "Được giới thiệu bởi" (nút Gọi điện/Nhắn Zalo)
    rating: 5,
    reviews: 156,
    // Dùng ảnh thật có sẵn trong cùng thư mục với index.html (avatar_collab_1.png — nam, đúng giới tính
    // với "Lê Văn Linh") thay vì icon minh hoạ SVG cũ. Vẫn có thể đổi ảnh khác qua nút 📷 trong tab
    // "Tài khoản của tôi" — ảnh tải lên sẽ ghi đè bằng data URL, chỉ lưu tạm trong bộ nhớ trình duyệt.
    avatar: "avatar_collab_1.png",
  };

  // ---------- Danh mục dịch vụ NVKD/CTV phụ trách (dùng cho dashboard + link phân kênh) ----------
  // 4 nhóm nghiệp vụ theo đúng yêu cầu: Dịch vụ cố định, Dịch vụ di động, Lan tỏa, Chăm sóc khách hàng.
  // Mỗi nhóm có màu riêng, dùng đồng bộ cho biểu đồ "Loại dịch vụ" và lưới link phân kênh.
  const SERVICE_GROUPS = [
    { key:'co-dinh',   label:'Dịch vụ cố định',        icon:'🏠', color:'#EE0033' },
    { key:'di-dong',   label:'Dịch vụ di động',        icon:'📱', color:'#2a78d6' },
    { key:'lan-toa',   label:'Lan tỏa',                icon:'📲', color:'#F5A623' },
    { key:'cham-soc',  label:'Chăm sóc khách hàng',    icon:'🧾', color:'#3AAE58' },
  ];

  // Danh mục 12 dịch vụ cụ thể NVKD/CTV giới thiệu/xử lý cho khách hàng.
  // - page: trang demo tương ứng để nút "Xem trang dịch vụ" điều hướng tới (null = dịch vụ chưa có trang minh hoạ riêng).
  // - laDangKyMoi: true nếu hoàn thành đơn được tính là "thuê bao mới" (đăng ký mới thật sự,
  //   khác với các thao tác trên thuê bao đã có sẵn như đổi eSIM/chuyển đầu số/chăm sóc...).
  // - giaTriRange: khoảng giá trị đơn hàng demo (0-0 = dịch vụ không phát sinh doanh thu trực tiếp).
  const SERVICE_CATALOG = [
    { key:'ftth',               name:'FTTH (Internet cáp quang)',      group:'co-dinh',  icon:'🌐', page:'page-internet', laDangKyMoi:true,  giaTriRange:[150000, 450000] },
    { key:'combo',              name:'Combo Internet + Truyền hình',   group:'co-dinh',  icon:'📦', page:'page-internet', laDangKyMoi:true,  giaTriRange:[210000, 550000] },
    { key:'truyen-hinh',        name:'Truyền hình',                    group:'co-dinh',  icon:'📺', page:'page-internet', laDangKyMoi:true,  giaTriRange:[90000, 250000] },
    { key:'camera',             name:'Camera',                         group:'co-dinh',  icon:'📷', page:'page-internet', laDangKyMoi:true,  giaTriRange:[100000, 300000] },
    { key:'mua-sim-so',         name:'Mua sim/số',                     group:'di-dong',  icon:'📱', page:'page-sim',      laDangKyMoi:true,  giaTriRange:[50000, 500000] },
    { key:'doi-esim',           name:'Đổi eSIM',                       group:'di-dong',  icon:'🔄', page:'page-sim',      laDangKyMoi:false, giaTriRange:[25000, 25000] },
    { key:'mua-goi-data',       name:'Mua gói Data',                   group:'di-dong',  icon:'📶', page:'page-data',     laDangKyMoi:false, giaTriRange:[70000, 230000] },
    { key:'chuyen-tra-sau',     name:'Chuyển sang trả sau',            group:'di-dong',  icon:'💳', page:'page-sim',      laDangKyMoi:false, giaTriRange:[0, 0] },
    { key:'chuyen-tra-truoc',   name:'Chuyển sang trả trước',          group:'di-dong',  icon:'💰', page:'page-sim',      laDangKyMoi:false, giaTriRange:[0, 0] },
    { key:'dang-ky-thong-tin',  name:'Đăng ký thông tin thuê bao',     group:'di-dong',  icon:'🪪', page:'page-sim',      laDangKyMoi:false, giaTriRange:[0, 0] },
    { key:'lan-toa-app',        name:'Lan tỏa cài đặt App',            group:'lan-toa',  icon:'📲', page:null,            laDangKyMoi:false, giaTriRange:[10000, 30000] },
    { key:'cham-soc-thu-cuoc',  name:'Chăm sóc thu cước',              group:'cham-soc', icon:'🧾', page:null,            laDangKyMoi:false, giaTriRange:[0, 0] },
  ];
  function serviceGroupOf(key){
    const svc = SERVICE_CATALOG.find(s => s.key === key);
    return svc ? SERVICE_GROUPS.find(g => g.key === svc.group) : null;
  }

  // Mã định danh kênh giới thiệu của NVKD, đúng theo cấu trúc nghiệp vụ thật:
  // CNKD (cố định) + mã viết tắt địa bàn (tỉnh/thành) + email nội bộ (không gồm đuôi @...).
  // Không phân biệt theo dịch vụ (khác với CTV) vì đây là mã định danh NHÂN VIÊN, dùng chung cho mọi dịch vụ.
  function staffChannelNvCode(){
    return `CNKD_${STAFF_DEMO.tinhCode}_${STAFF_DEMO.email}`;
  }

  /* ---------- MOCKUP DỮ LIỆU ĐĂNG KÝ MỚI THEO CTV VÀ NVKD ---------- */
  // Giả lập thời điểm hiện tại là cuối tháng 8/2026 để biểu đồ demo hiển thị đầy đủ số liệu tháng 8
  const NOW = new Date('2026-08-31T23:59:59');
  const MONTHS_12 = Array.from({length: 12}).map((_, i) => new Date(NOW.getFullYear(), NOW.getMonth() - 11 + i, 1));

  function monthKey(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  }

  function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function randomSeeded(seed) {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }

  function monthsForRange(rangeKey) {
    if (rangeKey === 'thang-nay') return MONTHS_12.slice(11, 12);
    if (rangeKey === 'thang-truoc') return MONTHS_12.slice(10, 11);
    if (rangeKey === '3-thang') return MONTHS_12.slice(9, 12);
    return MONTHS_12.slice(0, 12);
  }

  // FIX lỗi thiếu thông tin: trước đây cột "Khách hàng" hiển thị placeholder "Khách hàng 132"
  // (chỉ ghép chữ + số ngẫu nhiên). Đổi sang sinh HỌ TÊN THẬT kiểu Việt Nam bằng random có seed
  // (dựa trên h — mã hash của mỗi đơn) để mỗi đơn hàng luôn ra cùng 1 tên cố định, không đổi
  // qua các lần render lại (giữ tính nhất quán như các trường dữ liệu demo khác trong file).
  const CUST_HO_POOL = ['Nguyễn','Trần','Lê','Phạm','Hoàng','Huỳnh','Phan','Vũ','Võ','Đặng','Bùi','Đỗ','Hồ','Ngô','Dương','Lý'];
  const CUST_TEN_NAM_POOL = ['Văn Bình','Văn Cường','Văn Dũng','Văn Hải','Văn Hùng','Văn Khánh','Văn Long','Văn Minh','Văn Nam','Văn Sơn','Văn Thắng','Văn Tuấn','Văn Việt','Đức Anh','Quốc Huy'];
  const CUST_TEN_NU_POOL = ['Thị Lan','Thị Hương','Thị Thảo','Thị Ngọc','Thị Nga','Thị Trang','Thị Vân','Thị Yến','Thị Thủy','Thu Hà','Mai Anh','Ngọc Linh','Phương Anh','Kim Ngân','Bảo Trân'];

  function randomCustomerName(h) {
    const ho = CUST_HO_POOL[Math.floor(randomSeeded(h + 6) * CUST_HO_POOL.length)];
    const tenPool = randomSeeded(h + 7) < 0.5 ? CUST_TEN_NAM_POOL : CUST_TEN_NU_POOL;
    const ten = tenPool[Math.floor(randomSeeded(h + 8) * tenPool.length)];
    return ho + ' ' + ten;
  }

  // Bổ sung các gói cước demo cho từng dịch vụ
  const MOCK_PLANS = {
    'ftth': ['(Gói SUN1T)', '(Gói SUN2T)', '(Gói SUN3T)', '(Gói STAR1T)', '(Gói STAR2T)', '(Gói STAR3T)', '(Gói FAST2)'],
    'combo': ['(Gói SUN1T + TV360)', '(Gói STAR1T + TV360)', '(Gói SUN2T + TV360)'],
    'truyen-hinh': ['(Gói TV360 Basic)', '(Gói TV360 Standard)'],
    'mua-goi-data': ['(Gói ST15K)', '(Gói ST30K)', '(Gói V90C)', '(Gói SD135)', '(Gói MXH120)']
  };

  function collectOrders(personKey, rangeKey, createdDate) {
    const wanted = new Set(monthsForRange(rangeKey).map(monthKey));
    const createdYm = createdDate ? monthKey(createdDate) : null;
    let orders = [];

    // FIX lỗi thiếu thông tin: trước đây cột CTV hiển thị cứng chuỗi "Cộng tác viên" thay vì tên
    // thật. Tra đúng CTV theo id nằm trong personKey (dạng "ctv:<id>") để lấy họ tên/SĐT thật.
    let ctvInfo = null;
    if (personKey.startsWith('ctv:')) {
      const ctvId = personKey.slice('ctv:'.length);
      ctvInfo = ctvList.find(c => c.id === ctvId) || null;
    }

    // Support for when rangeKey is literally 'YYYY-MM'
    if (rangeKey.match(/^\d{4}-\d{2}$/)) {
        wanted.clear();
        wanted.add(rangeKey);
    }

    wanted.forEach(ym => {
      if (createdYm && ym < createdYm) return;
      
      const parts = ym.split('-');
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const startD = new Date(y, m, 1);
      const endD = new Date(y, m + 1, 0);
      
      let d = new Date(startD);
      while (d <= endD) {
        if (d > NOW) break;
        const mStr = d.toISOString().split('T')[0];
        const h = hashCode(personKey + '-' + mStr);
        const r = randomSeeded(h);
        
        if (r < 0.25) {
          // Chọn 1 trong 12 dịch vụ (SERVICE_CATALOG) theo random có seed, rồi sinh giá trị đơn hàng
          // đúng trong khoảng giaTriRange riêng của dịch vụ đó (dịch vụ chăm sóc/hành chính có range [0,0]
          // -> không phát sinh doanh thu, chỉ tính là 1 đơn đã xử lý).
          const svc = SERVICE_CATALOG[Math.floor(randomSeeded(h + 5) * SERVICE_CATALOG.length)];
          const [minV, maxV] = svc.giaTriRange;
          const val = maxV > minV
            ? minV + Math.round(randomSeeded(h + 1) * (maxV - minV) / 10000) * 10000
            : minV;

          // Sinh đủ 4 trạng thái (khớp với các nút lọc trạng thái sẵn có trên UI), theo tỉ trọng
          // gần với thực tế: phần lớn đã hoàn thành/đang xử lý, một phần nhỏ bị huỷ.
          const rStatus = randomSeeded(h + 2);
          const trangThai = rStatus < 0.45 ? 'Hoàn thành'
            : rStatus < 0.68 ? 'Đang thực hiện'
            : rStatus < 0.88 ? 'Đang triển khai'
            : 'Đã hủy';

          // Bổ sung tên gói cước (nếu có)
          let tenGoiCuoc = null;
          if (MOCK_PLANS[svc.key]) {
            const planPool = MOCK_PLANS[svc.key];
            tenGoiCuoc = planPool[Math.floor(randomSeeded(h + 9) * planPool.length)];
          }

          orders.push({
            id: 'OD-' + h,
            maDonHang: 'OD' + h.toString().padStart(8, '0').slice(-8),
            ngay: mStr,
            ngaySort: d.getTime(),
            giaTri: val,
            trangThai,
            dichVuKey: svc.key,
            loaiDichVu: svc.name,
            tenGoiCuoc: tenGoiCuoc,
            hoTenKhachHang: randomCustomerName(h),
            sdtKhachHang: '09' + String(h % 100000000).padStart(8, '0'),
            tenNVKD: STAFF_DEMO.hoTen,
            tenCTV: ctvInfo ? ctvInfo.hoTen : null,
            sdtCTV: ctvInfo ? ctvInfo.sdt : null,
            tenNVKyThuat: randomSeeded(h + 4) > 0.5 ? 'Nguyễn Kỹ Thuật' : null
          });
        }
        d.setDate(d.getDate() + 1);
      }
    });
    return orders;
  }

  function aggregateSales(personKey, rangeKey, createdDate) {
    const orders = collectOrders(personKey, rangeKey, createdDate);
    let doanhSo = 0;
    let thueBaoMoi = 0;
    orders.forEach(o => {
      if (o.trangThai === 'Hoàn thành') {
        doanhSo += o.giaTri;
        // Chỉ tính "thuê bao mới" cho các dịch vụ thực sự phát sinh thuê bao/khách hàng mới
        // (vd. FTTH, Combo, mua sim/số...) — không tính các thao tác trên thuê bao có sẵn
        // (đổi eSIM, chuyển đầu số...) hay các hoạt động lan tỏa/chăm sóc không phải đăng ký mới.
        const svc = SERVICE_CATALOG.find(s => s.key === o.dichVuKey);
        if (svc && svc.laDangKyMoi) thueBaoMoi++;
      }
    });
    return { doanhSo, thueBaoMoi, tongDonHang: orders.length };
  }

  function monthlySeriesForChart(personKey, createdDate) {
    const createdYm = createdDate ? monthKey(createdDate) : null;
    return MONTHS_12.map(d => {
      const ym = monthKey(d);
      if (createdYm && ym < createdYm) {
        return { ym, doanhSo: 0 };
      }
      const agg = aggregateSales(personKey, ym, createdDate);
      return { ym, doanhSo: agg.doanhSo };
    });
  }

  function collectAllOrdersForRange(rangeKey) {
    let orders = collectOrders('staff', rangeKey, null);
    ctvList.forEach(c => {
      orders = orders.concat(collectOrders('ctv:' + c.id, rangeKey, new Date(c.ngayTaoISO)));
    });
    orders.sort((a, b) => b.ngaySort - a.ngaySort);
    return orders;
  }

  const RANGE_LABELS = {
    'thang-nay':'Tháng này', 'thang-truoc':'Tháng trước', '3-thang':'3 tháng gần nhất', '12-thang':'12 tháng gần nhất'
  };

  // BỔ SUNG: dùng ảnh thật có sẵn trong thư mục (thay cho 6 icon SVG minh hoạ cũ). Kiểm tra thực tế
  // cho thấy avatar_collab_4.png, avatar_collab_5.png, avatar_collab_6.png trong thư mục BỊ LỖI —
  // nội dung file thực chất là văn bản SVG (icon cũ) nhưng bị đặt sai đuôi .png, nên trình duyệt sẽ
  // không hiển thị được (ảnh vỡ). Vì vậy chỉ dùng 4 ảnh thật hợp lệ: avatar.png, avatar_collab_1.png,
  // avatar_collab_2.png, avatar_collab_3.png. CTV nào không có ảnh thật phù hợp thì để avatar:null để
  // tự động hiện chữ cái đầu tên (initialsOf) — giống cách các nơi khác trong app đã xử lý khi thiếu ảnh.
  const VIETTEL_AVATARS = [
    "avatar.png",
    "avatar_collab_2.png",
    "avatar_collab_3.png",
  ];

  // BỔ SUNG: mỗi CTV có địa chỉ hoạt động riêng (diaChi) trong cùng địa bàn của NVKD phụ trách
  // (Quận 1, TP.HCM) — hiện trong huy hiệu "Được giới thiệu bởi" giống NVKD.
  let ctvList = [
    { id:'ctv-001', hoTen:'Trần Thị Lan Hương', sdt:'0912000111', ngayTaoISO:'2024-05-12', avatar: 'avatar.png', trangThai:'active', diaChi:'Phường Bến Nghé, Quận 1, TP.HCM' },
    { id:'ctv-002', hoTen:'Lê Hoàng Nam',       sdt:'0987000222', ngayTaoISO:'2024-08-02', avatar: null, trangThai:'active', diaChi:'Phường Đa Kao, Quận 1, TP.HCM' },
    { id:'ctv-003', hoTen:'Phạm Ngọc Thảo',     sdt:'0977000333', ngayTaoISO:'2025-01-20', avatar: 'avatar_collab_2.png', trangThai:'active', diaChi:'Phường Nguyễn Thái Bình, Quận 1, TP.HCM' },
    { id:'ctv-004', hoTen:'Đinh Văn Khóa',      sdt:'0988000444', ngayTaoISO:'2024-11-11', avatar: null, trangThai:'locked', diaChi:'Phường Cầu Kho, Quận 1, TP.HCM' },
    { id:'ctv-005', hoTen:'Hoàng Tuấn Kiệt',    sdt:'0989858785', ngayTaoISO:'2025-05-05', avatar: null, trangThai:'active', diaChi:'Phường Cô Giang, Quận 1, TP.HCM' },
  ];

  // Danh sách 4 trạng thái đơn hàng, dùng màu đồng bộ với .status-badge sẵn có trong CSS.
  const ORDER_STATUS_LIST = [
    { key:'Hoàn thành',       color:'#0ca30c' },
    { key:'Đang thực hiện',   color:'#1c5cab' },
    { key:'Đang triển khai',  color:'#B8860B' },
    { key:'Đã hủy',           color:'#d03b3b' },
  ];

  /* ---------- Khối thống kê "Số lượng đơn hàng theo trạng thái" — dùng chung cho dashboard
     NVKD (toàn đội) lẫn dashboard CTV (chỉ đơn của riêng CTV đó), truyền sẵn mảng orders vào. ---------- */
  function renderStatusSummary(containerId, subLabelId, rangeKey, orders){
    const subEl = document.getElementById(subLabelId);
    if(subEl) subEl.textContent = 'Kỳ: ' + RANGE_LABELS[rangeKey];
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;">
      ${ORDER_STATUS_LIST.map(s => {
        const count = orders.filter(o => o.trangThai === s.key).length;
        return `
          <div class="staff-stat-card" style="padding:12px 14px;">
            <div class="staff-stat-label">${escapeHtml(s.key)}</div>
            <div class="staff-stat-value" style="font-size:18px;color:${s.color};">${count}</div>
            <div class="staff-stat-sub">đơn hàng</div>
          </div>`;
      }).join('')}
    </div>`;
  }

  /* ---------- Biểu đồ cột ngang: Đóng góp doanh thu ---------- */
  function renderContributionChart(containerId, subLabelId, rangeKey){
    document.getElementById(subLabelId).textContent = 'Kỳ: ' + RANGE_LABELS[rangeKey];
    const staffAgg = aggregateSales('staff', rangeKey, null);
    const rows = [
      { name: STAFF_DEMO.hoTen + ' (Bạn)', sub: STAFF_DEMO.sdt, value: staffAgg.doanhSo, color: '#EE0033' }
    ];
    ctvList.forEach(c => {
      const agg = aggregateSales('ctv:' + c.id, rangeKey, new Date(c.ngayTaoISO));
      rows.push({ name: c.hoTen, sub: c.sdt, value: agg.doanhSo, color: '#B7B7BE' });
    });
    rows.sort((a, b) => b.value - a.value);

    const maxVal = Math.max(1, ...rows.map(r => r.value));
    const container = document.getElementById(containerId);
    container.innerHTML = rows.map((r, i) => `
      <div class="hbar-row" data-hbar-idx="${i}">
        <div class="hbar-label" title="${escapeHtml(r.name)}">${escapeHtml(r.name)}</div>
        <div class="hbar-track"><div class="hbar-fill" style="width:${Math.max(2, r.value / maxVal * 100)}%;background:${r.color};"></div></div>
        <div class="hbar-value">${formatCompact(r.value)}</div>
      </div>
    `).join('') + `<div class="chart-tooltip" id="${containerId}-tooltip"></div>`;

    const tooltip = document.getElementById(containerId + '-tooltip');
    container.querySelectorAll('.hbar-row').forEach((row, i) => {
      const r = rows[i];
      row.addEventListener('pointermove', (e) => {
        tooltip.innerHTML = `<div class="ttl-name">${escapeHtml(r.name)} · ${escapeHtml(r.sub)}</div><div class="ttl-val">${formatVND(r.value)}</div>`;
        tooltip.classList.add('show');
        positionTooltip(tooltip, container, e);
      });
      row.addEventListener('pointerleave', () => tooltip.classList.remove('show'));
    });
  }

  /* ---------- Biểu đồ cột ngang: kết quả bán theo Loại dịch vụ ----------
     FIX/BỔ SUNG: trước đây biểu đồ này gom nhóm tự do theo chuỗi loaiDichVu (chỉ có 2 giá trị
     "Internet"/"Di động") và sắp xếp theo tổng số đơn giảm dần. Nay dựng CỐ ĐỊNH theo đúng
     12 dịch vụ trong SERVICE_CATALOG (kể cả dịch vụ chưa phát sinh đơn trong kỳ vẫn hiện dòng
     0 đơn), nhóm theo 4 nhóm nghiệp vụ (Dịch vụ cố định / Dịch vụ di động / Lan tỏa / Chăm sóc
     khách hàng) có tiêu đề nhóm riêng — đúng trọng tâm "số lượng đơn hàng theo loại dịch vụ". */
  function renderServiceTypeChart(containerId, subLabelId, rangeKey){
    document.getElementById(subLabelId).textContent = 'Kỳ: ' + RANGE_LABELS[rangeKey];

    const staffOrders = collectOrders('staff', rangeKey, null);
    let ctvOrders = [];
    ctvList.forEach(c => {
      ctvOrders = ctvOrders.concat(collectOrders('ctv:' + c.id, rangeKey, new Date(c.ngayTaoISO)));
    });

    // Khởi tạo đủ 12 dịch vụ (kể cả dịch vụ 0 đơn trong kỳ) để luôn thấy đúng cấu trúc cố định.
    const types = {};
    SERVICE_CATALOG.forEach(svc => {
      types[svc.key] = { key: svc.key, name: svc.name, group: svc.group, staff: 0, ctv: 0, total: 0 };
    });
    staffOrders.forEach(o => {
      if(!types[o.dichVuKey]) return;
      types[o.dichVuKey].staff++;
      types[o.dichVuKey].total++;
    });
    ctvOrders.forEach(o => {
      if(!types[o.dichVuKey]) return;
      types[o.dichVuKey].ctv++;
      types[o.dichVuKey].total++;
    });

    const container = document.getElementById(containerId);
    const maxVal = Math.max(1, ...Object.values(types).map(r => r.total));

    let rowIdx = 0;
    const rowsMeta = []; // giữ lại đúng thứ tự dòng đã render để gắn tooltip theo index
    let bodyHtml = '';
    SERVICE_GROUPS.forEach(g => {
      const groupRows = SERVICE_CATALOG.filter(s => s.group === g.key).map(s => types[s.key]);
      if(groupRows.length === 0) return;
      bodyHtml += `<div style="font-size:12px;font-weight:700;color:${g.color};margin:${rowIdx === 0 ? '0' : '16px'} 0 8px;text-transform:uppercase;letter-spacing:.02em;">${g.icon} ${escapeHtml(g.label)}</div>`;
      groupRows.forEach(r => {
        bodyHtml += `
          <div class="hbar-row" data-hbar-idx="${rowIdx}">
            <div class="hbar-label" title="${escapeHtml(r.name)}">${escapeHtml(r.name)}</div>
            <div class="hbar-track" style="display:flex; padding: 0;">
              <div class="hbar-fill" style="width:${r.staff / maxVal * 100}%; background:#EE0033; border-radius: 4px 0 0 4px; border-right: ${r.staff && r.ctv ? '1px solid #fff' : 'none'};"></div>
              <div class="hbar-fill" style="width:${r.ctv / maxVal * 100}%; background:#2a78d6; border-radius: ${r.staff ? '0 4px 4px 0' : '4px'};"></div>
            </div>
            <div class="hbar-value">${r.total} đơn</div>
          </div>
        `;
        rowsMeta.push(r);
        rowIdx++;
      });
    });

    container.innerHTML = `<div class="chart-legend" style="margin-bottom:12px;">
      <div class="chart-legend-item"><span class="chart-legend-swatch" style="background:#EE0033;"></span>Bạn (NVKD)</div>
      <div class="chart-legend-item"><span class="chart-legend-swatch" style="background:#2a78d6;"></span>Cộng tác viên</div>
    </div>` + bodyHtml + `<div class="chart-tooltip" id="${containerId}-tooltip"></div>`;

    const tooltip = document.getElementById(containerId + '-tooltip');
    container.querySelectorAll('.hbar-row').forEach((row) => {
      const r = rowsMeta[Number(row.dataset.hbarIdx)];
      if(!r) return;
      row.addEventListener('pointermove', (e) => {
        tooltip.innerHTML = `<div class="ttl-name">${escapeHtml(r.name)}</div>
                             <div class="ttl-val">Bạn: ${r.staff} đơn | CTV: ${r.ctv} đơn</div>
                             <div class="ttl-val" style="color:var(--text-muted);font-size:11px;margin-top:2px;">(Tổng cộng: ${r.total})</div>`;
        tooltip.classList.add('show');
        positionTooltip(tooltip, container, e);
      });
      row.addEventListener('pointerleave', () => tooltip.classList.remove('show'));
    });
  }


  /* ================= MODAL OTP DÙNG CHUNG (đăng nhập NVKD + tạo CTV) ================= */
  const OtpModal = (function(){
    const overlay = document.getElementById('otp-modal-overlay');
    const stepInfo = document.getElementById('otp-modal-step-info');
    const stepOtp = document.getElementById('otp-modal-step-otp');
    const stepSuccess = document.getElementById('otp-modal-step-success');
    const titleEl = document.getElementById('otp-modal-title');
    const subtitleEl = document.getElementById('otp-modal-subtitle');
    const fieldsWrap = document.getElementById('otp-modal-fields');
    const infoError = document.getElementById('otp-modal-info-error');
    const btnNext = document.getElementById('otp-modal-info-next');
    const btnInfoCancel = document.getElementById('otp-modal-info-cancel');

    const otpBoxesWrap = document.getElementById('otp-modal-otp-boxes');
    const otpPhoneDisplay = document.getElementById('otp-modal-otp-phone-display');
    const otpError = document.getElementById('otp-modal-otp-error');
    const demoHint = document.getElementById('otp-modal-demo-hint');
    const resendEl = document.getElementById('otp-modal-resend');
    const expireCountEl = document.getElementById('otp-modal-expire-count');
    const btnOtpCancel = document.getElementById('otp-modal-otp-cancel');
    const btnOtpConfirm = document.getElementById('otp-modal-otp-confirm');

    const successBody = document.getElementById('otp-modal-success-body');
    const btnDone = document.getElementById('otp-modal-done');

    const RESEND_SECONDS = 57;
    const EXPIRE_SECONDS = 4 * 60 + 57;

    let cfg = null;
    let values = {};
    let demoOtp = '';
    let resendTimer = null, expireTimer = null, resendLeft = 0, expireLeft = 0;

    function getOtpBoxes(){ return Array.from(otpBoxesWrap.querySelectorAll('.otp-box')); }
    function getOtpValue(){ return getOtpBoxes().map(b => b.value).join(''); }
    function genOtp(){ return String(Math.floor(100000 + Math.random() * 900000)); }
    function formatMMSS(s){ return Math.floor(s/60) + ':' + String(s%60).padStart(2,'0'); }
    function showStep(step){
      [stepInfo, stepOtp, stepSuccess].forEach(s => s.style.display = 'none');
      step.style.display = 'block';
      if(step === stepSuccess) replaySuccessIcoAnim(step);
    }
    function stopTimers(){
      if(resendTimer){ clearInterval(resendTimer); resendTimer = null; }
      if(expireTimer){ clearInterval(expireTimer); expireTimer = null; }
    }
    function renderResendCounting(sec){ resendEl.innerHTML = `Gửi lại OTP (<b>${sec}</b>s)`; }

    function startResendTimer(){
      resendLeft = RESEND_SECONDS;
      resendEl.classList.remove('resend-active');
      renderResendCounting(resendLeft);
      if(resendTimer) clearInterval(resendTimer);
      resendTimer = setInterval(() => {
        resendLeft--;
        if(resendLeft <= 0){
          clearInterval(resendTimer); resendTimer = null;
          resendEl.textContent = 'Gửi lại OTP';
          resendEl.classList.add('resend-active');
        } else renderResendCounting(resendLeft);
      }, 1000);
    }

    function startExpireTimer(){
      expireLeft = EXPIRE_SECONDS;
      expireCountEl.textContent = formatMMSS(expireLeft);
      if(expireTimer) clearInterval(expireTimer);
      expireTimer = setInterval(() => {
        expireLeft--;
        if(expireLeft <= 0){
          clearInterval(expireTimer); expireTimer = null;
          expireCountEl.textContent = '0:00';
          otpError.textContent = 'Mã OTP đã hết hạn. Vui lòng bấm "Gửi lại OTP".';
          getOtpBoxes().forEach(b => b.disabled = true);
          btnOtpConfirm.disabled = true;
        } else expireCountEl.textContent = formatMMSS(expireLeft);
      }, 1000);
    }

    function renderFields(){
      fieldsWrap.innerHTML = cfg.fields.map(f => `
        <div class="login-field">
          <input type="${f.type || 'text'}" id="otp-modal-field-${f.key}" placeholder="${f.placeholder}"
            ${f.type === 'tel' ? 'inputmode="numeric" maxlength="10"' : ''} autocomplete="off">
        </div>
      `).join('');
      cfg.fields.forEach(f => {
        document.getElementById('otp-modal-field-' + f.key).addEventListener('input', validateFields);
      });
    }

    function validateFields(){
      let ok = true;
      cfg.fields.forEach(f => {
        const el = document.getElementById('otp-modal-field-' + f.key);
        const v = el.value.trim();
        values[f.key] = v;
        if(!v || (f.validate && !f.validate(v))) ok = false;
      });
      btnNext.disabled = !ok;
      infoError.textContent = '';
    }

    function open(config){
      cfg = config;
      values = {};
      demoOtp = '';
      stopTimers();
      titleEl.textContent = config.title;
      subtitleEl.textContent = config.subtitle || '';
      renderFields();
      btnNext.disabled = true;
      infoError.textContent = '';
      otpError.textContent = '';
      getOtpBoxes().forEach(b => { b.value = ''; b.disabled = false; });
      showStep(stepInfo);
      overlay.classList.add('show');
    }

    function close(){ overlay.classList.remove('show'); stopTimers(); }

    btnInfoCancel.addEventListener('click', close);
    document.getElementById('otp-modal-close').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if(e.target === overlay) close(); });
    document.addEventListener('keydown', (e) => {
      if(e.key === 'Escape' && overlay.classList.contains('show')) close();
    });

    btnNext.addEventListener('click', () => {
      for(const f of cfg.fields){
        if(f.validate && !f.validate(values[f.key])){
          infoError.textContent = f.errorMsg || 'Thông tin không hợp lệ.';
          return;
        }
      }
      const phoneVal = values[cfg.phoneKey || 'sdt'];
      otpPhoneDisplay.textContent = phoneVal;
      demoOtp = genOtp();
      demoHint.innerHTML = `Đây là bản demo (không gửi SMS thật). Mã OTP của bạn là: <b>${demoOtp}</b>`;
      otpError.textContent = '';
      getOtpBoxes().forEach(b => { b.value = ''; b.disabled = false; });
      btnOtpConfirm.disabled = true;
      showStep(stepOtp);
      startResendTimer();
      startExpireTimer();
      setTimeout(() => getOtpBoxes()[0].focus(), 50);
    });

    document.getElementById('otp-modal-back').addEventListener('click', () => { stopTimers(); showStep(stepInfo); });
    btnOtpCancel.addEventListener('click', close);

    getOtpBoxes().forEach((box, idx) => {
      box.addEventListener('input', () => {
        box.value = box.value.replace(/[^0-9]/g, '');
        if(box.value && idx < 5) getOtpBoxes()[idx+1].focus();
        otpError.textContent = '';
        btnOtpConfirm.disabled = getOtpValue().length !== 6;
      });
      box.addEventListener('keydown', (e) => {
        if(e.key === 'Backspace' && !box.value && idx > 0) getOtpBoxes()[idx-1].focus();
      });
    });

    resendEl.addEventListener('click', () => {
      if(!resendEl.classList.contains('resend-active')) return;
      demoOtp = genOtp();
      demoHint.innerHTML = `Đây là bản demo (không gửi SMS thật). Mã OTP của bạn là: <b>${demoOtp}</b>`;
      getOtpBoxes().forEach(b => { b.value = ''; b.disabled = false; });
      btnOtpConfirm.disabled = true;
      otpError.textContent = '';
      startResendTimer();
      startExpireTimer();
    });

    btnOtpConfirm.addEventListener('click', () => {
      if(getOtpValue() !== demoOtp){
        otpError.textContent = 'Mã OTP không đúng. Vui lòng thử lại.';
        return;
      }
      stopTimers();
      successBody.innerHTML = '';
      cfg.onSuccess(values, successBody);
      showStep(stepSuccess);
    });

    btnDone.addEventListener('click', () => {
      close();
      if(cfg.onDone) cfg.onDone(values);
    });

    return { open, close };
  })();

  /* ---------- Sao chép văn bản vào clipboard (dự phòng cho môi trường file:// không có Clipboard API) ---------- */
  function copyText(text){
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch(e) { /* bỏ qua, chỉ là thao tác minh hoạ */ }
    document.body.removeChild(ta);
  }

  /* ---------- Huy hiệu nổi "Được giới thiệu bởi" — hiển thị ở mọi trang ---------- */
  // 2 nơi gọi tới cùng 1 khối hiển thị này: (1) chính NVKD/CTV tự xem trước qua nút "Xem trang liên kết"
  // (showRefBadge bên dưới), và (2) khách hàng THẬT bấm vào link chia sẻ có kèm ?NV=... (initReferralFromUrl).
  function referrerFromCtv(ctv){
    // BỔ SUNG: CTV giờ cũng có địa chỉ (ctv.diaChi) để hiện trong huy hiệu, giống NVKD — dùng chung
    // tên field "diaBan" với referrerFromStaff() để renderTrustBadge không cần phân biệt 2 luồng.
    return { type:'ctv', hoTen: ctv.hoTen, sdt: ctv.sdt, avatar: ctv.avatar, diaBan: ctv.diaChi, code: ctv.sdt, ctvId: ctv.id, personKey: 'ctv:' + ctv.id };
  }
  function referrerFromStaff(){
    return { type:'staff', hoTen: STAFF_DEMO.hoTen, sdt: STAFF_DEMO.sdt, avatar: STAFF_DEMO.avatar, diaBan: STAFF_DEMO.diaBan, code: staffChannelNvCode(), personKey:'staff' };
  }
  // Tra ra đúng NVKD/CTV tương ứng với mã trên URL (?NV=...) — dùng khi khách hàng bấm link chia sẻ.
  function resolveReferrer(nvCode){
    if(!nvCode) return null;
    if(nvCode === staffChannelNvCode()) return referrerFromStaff();
    const ctv = ctvList.find(c => c.sdt === nvCode);
    return ctv ? referrerFromCtv(ctv) : null;
  }

  let badgeInterval = null;
  function renderTrustBadge(referrer){
    // FIX: trước đây fallback về 1 file ảnh cố định ('avatar.png'/'avatar_collab_1.png') bất kể
    // referrer là ai — nếu CTV đó không có avatar riêng (vd. avatar:null) sẽ bị hiện NHẦM ảnh của
    // người khác (thậm chí ảnh của chính NVKD). Nay dùng đúng chữ cái đầu tên (initialsOf) làm
    // fallback, giống cách renderCtvGrid/renderCtvSelfAvatarDisplay đã xử lý khi thiếu ảnh.
    const avatarInner = referrer.avatar
      ? `<img src="${referrer.avatar}" alt="Ảnh đại diện ${escapeHtml(referrer.hoTen)}">`
      : escapeHtml(initialsOf(referrer.hoTen));
    document.getElementById('ref-badge-avatar').innerHTML = avatarInner;
    document.getElementById('ref-badge-name').textContent = referrer.hoTen;
    // BỔ SUNG: hiện địa chỉ (📍) cho cả NVKD lẫn CTV — trước đây chỉ NVKD có do referrerFromCtv()
    // chưa gán diaBan. Gộp chung 1 nhánh, chỉ khác câu chữ vai trò theo type.
    const roleLabel = referrer.type === 'staff' ? 'Nhân viên kinh doanh Viettel' : 'Cộng tác viên Viettel';
    document.getElementById('ref-badge-role').innerHTML = referrer.diaBan
      ? `${roleLabel}<br><span style="color:var(--text-muted);font-size:11px;">📍 ${escapeHtml(referrer.diaBan)}</span>`
      : roleLabel;
    
    document.getElementById('ref-badge-rating').innerHTML = referrer.type === 'staff'
      ? `<div style="display:flex;align-items:center;gap:4px;margin-top:4px;font-size:11px;">
           <span style="color:#F5A623;letter-spacing:1px;">★★★★★</span>
           <span style="color:var(--text-muted);font-weight:normal;">(${STAFF_DEMO.reviews} đánh giá)</span>
         </div>`
      : '';
    const callBtn = document.getElementById('ref-badge-call');
    callBtn.href = 'tel:' + referrer.sdt;
    callBtn.innerHTML = `<span class="ref-badge-btn-ico">📞</span><span class="ref-badge-btn-label">${escapeHtml(referrer.sdt)}</span>`;
    const zaloBtn = document.getElementById('ref-badge-zalo');
    if(zaloBtn) zaloBtn.href = zaloChatLink(referrer.sdt);
    document.getElementById('ref-badge').style.display = 'block';

    clearInterval(badgeInterval);
    let timeLeft = 2000;
    const countdownEl = document.getElementById('ref-badge-countdown');
    countdownEl.innerHTML = `Hiệu lực còn ${timeLeft} (giây)`;
    badgeInterval = setInterval(() => {
      timeLeft--;
      if(timeLeft <= 0){
         clearInterval(badgeInterval);
         document.getElementById('ref-badge').style.display = 'none';
      } else {
         countdownEl.innerHTML = `Hiệu lực còn ${timeLeft} (giây)`;
      }
    }, 1000);
  }
  function showRefBadge(ctvId){
    const c = ctvList.find(x => x.id === ctvId);
    if(!c) return;
    renderTrustBadge(referrerFromCtv(c));
  }
  document.getElementById('ref-badge-close').addEventListener('click', () => {
    document.getElementById('ref-badge').style.display = 'none';
  });

  // Ghi nhận 1 đơn đăng ký demo cho đúng NVKD/CTV đã giới thiệu (window.activeReferral) — chèn thẳng vào
  // đúng tháng hiện tại trong cache số liệu bán hàng (_monthlySalesCache) để đơn mới xuất hiện ngay trong
  // dashboard/bảng đơn hàng của người đó ở lần xem tiếp theo, không cần đợi tải lại trang.
  function recordReferredOrder(pkg, serviceLabel, canLapDat){
    const referrer = window.activeReferral;
    if(!referrer) return null;
    const monthly = genMonthlySales(referrer.personKey);
    const cur = monthly[monthly.length - 1]; // phần tử cuối luôn là tháng hiện tại (xem lastNMonths)
    const now = new Date();
    const ngayISO = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
    const maDonHang = '63' + String(Math.floor(10000000 + Math.random() * 90000000));
    cur.orders.unshift({
      maDonHang,
      ngay: ngayISO,
      ngaySort: now.getTime(),
      loaiDichVu: serviceLabel,
      canLapDat: !!canLapDat,
      hoTenKhachHang: 'Khách hàng qua giới thiệu',
      sdtKhachHang: '',
      tenNVKD: STAFF_DEMO.hoTen,
      tenCTV: referrer.type === 'ctv' ? referrer.hoTen : '',
      sdtCTV: referrer.type === 'ctv' ? referrer.sdt : '',
      tenNVKyThuat: canLapDat ? TECHNICIAN_NAMES[Math.floor(Math.random() * TECHNICIAN_NAMES.length)] : '',
      trangThai: 'Đang thực hiện',
      giaTri: pkg.gia,
      nguoiBanKey: referrer.personKey,
    });
    cur.thueBaoMoi += 1;
    // Trường hợp hiếm trong demo 1 trình duyệt: đúng người vừa được giới thiệu đang mở sẵn dashboard của
    // họ ở tab khác — làm mới ngay để thấy đơn mới mà không cần chờ đăng nhập lại.
    if(referrer.type === 'staff' && staffIsLoggedIn) renderStaffOverview();
    if(referrer.type === 'ctv' && loggedInCtv && loggedInCtv.id === referrer.ctvId) renderCtvSelfOverview();
    return `Đơn đăng ký này đã được ghi nhận cho ${referrer.type === 'ctv' ? 'Cộng tác viên' : 'Nhân viên kinh doanh'} ${referrer.hoTen}.`;
  }
  window.recordReferredOrder = recordReferredOrder;

  // Đọc ?NV=<mã NVKD/SĐT CTV>&SP=<mã gói> trên URL lúc tải trang — mô phỏng khách hàng bấm vào đúng link
  // chia sẻ của NVKD/CTV: nhận diện người giới thiệu, hiện huy hiệu "Được giới thiệu bởi", và nếu có kèm
  // mã gói thì tự điều hướng + mở sẵn modal chi tiết đúng gói đó để khách thấy ngay sản phẩm được giới thiệu.
  function initReferralFromUrl(){
    const params = new URLSearchParams(location.search);
    const nv = params.get('NV');
    if(!nv) return;
    const referrer = resolveReferrer(nv);
    if(!referrer) return;
    window.activeReferral = referrer;
    renderTrustBadge(referrer);

    // BỔ SUNG: ghi nhận lượt truy cập của khách vào "Visitor Log" (mô phỏng — xem tài liệu thiết kế
    // "Khách hàng tiềm năng"), làm cơ sở cho tab "🎯 Khách hàng tiềm năng" của NVKD/CTV. Thử lấy SĐT ngay
    // nếu đã có nguồn đáng tin cậy (khách đã đăng nhập / nhận diện ngầm qua mạng); nếu chưa có thì ghi
    // nhận lượt ghé trước, sẽ xin SĐT nhẹ nhàng sau nếu khách thể hiện đủ quan tâm (xem trackVisitorPackageView).
    recordVisit(referrer);

    // Link phân kênh theo dịch vụ (?DV=<mã dịch vụ>, xem SERVICE_CATALOG) — đưa thẳng khách hàng
    // tới đúng trang dịch vụ tương ứng nếu dịch vụ đó có trang minh hoạ trong bản demo.
    const dv = params.get('DV');
    if(dv){
      const svc = SERVICE_CATALOG.find(s => s.key === dv);
      if(svc && svc.page) switchToPage(svc.page);
    }

    const sp = params.get('SP');
    if(!sp) return;
    const loc = findPkgLocation(sp);
    if(!loc) return;
    switchToPage(loc.cat.page);
    window.scrollTo({ top:0, behavior:'auto' });
    if(loc.cat.tabBtn) document.querySelector(`.tab-btn[data-tab="${loc.cat.tabBtn}"]`)?.click();
    if(loc.cat.dataCat) document.querySelector(`.data-cat-tab[data-cat="${loc.cat.dataCat}"]`)?.click();
    // Đợi 1 nhịp để trang/tab chuyển xong trước khi mở modal (tránh mở modal trong lúc DOM đang chuyển tab).
    setTimeout(() => {
      openPackageDetailModal(loc.pkg, {
        groupLabel: loc.pkg.nhom, perMonth: loc.cat.perMonth, serviceLabel: loc.cat.serviceLabel, canLapDat: loc.cat.canLapDat,
        onRegister: () => {
          if(loc.cat.perMonth) showInternetSummary(loc.pkg, loc.cat.serviceLabel, loc.cat.canLapDat);
          else showDataSummary(loc.pkg, loc.pkg.nhom, loc.cat.serviceLabel);
        },
      });
    }, 60);
  }

  /* ---------- Modal xem mã QR phóng to ---------- */
  function openQrZoom(ctvId){
    const c = ctvList.find(x => x.id === ctvId);
    if(!c) return;
    const link = referralLink(c.sdt);
    document.getElementById('qr-zoom-content').innerHTML = qrSvg(link, { size:220, margin:2 });
    document.getElementById('qr-zoom-title').textContent = c.hoTen;
    document.getElementById('qr-zoom-link').textContent = link;
    document.getElementById('qr-zoom-overlay').classList.add('show');
  }
  document.getElementById('qr-zoom-close').addEventListener('click', () => {
    document.getElementById('qr-zoom-overlay').classList.remove('show');
  });
  document.getElementById('qr-zoom-overlay').addEventListener('click', (e) => {
    if(e.target.id === 'qr-zoom-overlay') e.currentTarget.classList.remove('show');
  });

  /* ---------- Modal "Chi tiết gói cước" / "Xem chi tiết" — danh sách giới thiệu chi tiết sản phẩm ---------- */
  // Nhãn + icon hiển thị cho từng trường dữ liệu có thể có trên 1 gói cước (không phải gói nào cũng có đủ các trường này,
  // nên chỉ hiển thị những mục thực sự tồn tại trong dữ liệu của gói đó).
  const PKG_DETAIL_FIELD_MAP = [
    { key:'nhom',    icon:'🏷️', label:'Nhóm gói' },
    { key:'tocDo',   icon:'📶', label:'Tốc độ' },
    { key:'data',    icon:'📶', label:'Dung lượng Data' },
    { key:'thoai',   icon:'📞', label:'Thoại' },
    { key:'sms',     icon:'✉️', label:'SMS' },
    { key:'uuDai',   icon:null, label:'Ưu đãi kèm theo' }, // icon riêng theo nội dung, xem uuDaiIcon()
    { key:'tienIch', icon:'⭐', label:'Tiện ích đi kèm' },
    { key:'thietBi', icon:'📦', label:'Thiết bị đi kèm' },
    { key:'khuVuc',  icon:'📍', label:'Khu vực áp dụng' },
    { key:'chuKy',   icon:'🔄', label:'Chu kỳ thanh toán' },
    { key:'thoiHan', icon:'⏳', label:'Thời hạn sử dụng' },
    { key:'phamVi',  icon:'🌍', label:'Phạm vi áp dụng' },
  ];

  // Quyền lợi chung khi đăng ký — áp dụng cho mọi loại gói cước, giúp danh sách chi tiết đầy đủ như trang giới thiệu sản phẩm thật.
  const PKG_DETAIL_BENEFITS = [
    'Đăng ký nhanh chóng, kích hoạt sử dụng ngay sau khi xác nhận.',
    'Không phát sinh phụ phí ngoài mức cước niêm yết.',
    'Hỗ trợ chăm sóc khách hàng 24/7 qua tổng đài và ứng dụng My Viettel.',
    'Có thể đổi sang gói cước khác hoặc hủy bất kỳ lúc nào theo chính sách hiện hành.',
  ];

  function pkgDetailSpecs(pkg){
    return PKG_DETAIL_FIELD_MAP
      .filter(f => pkg[f.key])
      .map(f => ({ icon: f.key === 'uuDai' ? uuDaiIcon(pkg.uuDai) : f.icon, label: f.label, value: pkg[f.key] }));
  }

  // Mô tả giới thiệu: ưu tiên trường moTa có sẵn trong dữ liệu, nếu không có thì tự tổng hợp từ các thông số nổi bật của gói.
  function pkgDetailDescription(pkg){
    if(pkg.moTa) return pkg.moTa;
    const parts = [];
    if(pkg.tocDo) parts.push(`tốc độ ${pkg.tocDo}`);
    if(pkg.data) parts.push(`dung lượng ${pkg.data}`);
    if(pkg.thoai) parts.push(pkg.thoai);
    if(pkg.uuDai) parts.push(`ưu đãi ${pkg.uuDai}`);
    return parts.length
      ? `Gói ${pkg.ma} phù hợp với nhu cầu sử dụng ${parts.join(', ')}.`
      : `Gói ${pkg.ma} là một trong các gói cước hiện có của Viettel, phù hợp với nhiều nhu cầu sử dụng khác nhau.`;
  }

  // Xuất mã QR (đang là SVG trong DOM) thành file ảnh PNG để NVKD/CTV tải về máy, tiện gửi qua Zalo/tin nhắn.
  function downloadQrPng(svgEl, filename){
    const pad = 20; // viền trắng quanh QR khi xuất ảnh, tránh mã bị sát mép
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width + pad * 2;
      canvas.height = img.height + pad * 2;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, pad, pad);
      canvas.toBlob(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }, 'image/png');
    };
    img.src = svgUrl;
  }

  // opts: { groupLabel: nhãn phụ đề (vd. "Combo Internet - TV360"), perMonth: true nếu giá tính theo tháng (Internet/Combo),
  //         serviceLabel/canLapDat: dùng khi ghi nhận đơn hàng nếu khách đăng ký qua giới thiệu (xem recordReferredOrder),
  //         onRegister: callback khi bấm "Đăng ký ngay" trong modal (dùng lại đúng luồng xác nhận đăng ký ở trang gốc) }
  function openPackageDetailModal(pkg, opts = {}){
    // BỔ SUNG: nếu khách đang xem qua link giới thiệu (?NV=...), mỗi lần mở "Chi tiết gói cước" được tính
    // là 1 tín hiệu quan tâm — dùng cho bước 2 của cơ chế thu thập SĐT "progressive" (xem tài liệu thiết kế
    // "Khách hàng tiềm năng"). Không ảnh hưởng gì tới luồng hiển thị modal hiện có nếu không phải khách qua giới thiệu.
    if(window.activeReferral) trackVisitorPackageView(pkg);

    const specs = pkgDetailSpecs(pkg);
    const giamPercent = pkg.giaGoc ? Math.round((1 - pkg.gia / pkg.giaGoc) * 100) : 0;

    document.getElementById('pkg-detail-title').textContent = pkg.ma;
    document.getElementById('pkg-detail-sub').textContent = opts.groupLabel || pkg.nhom || '';
    document.getElementById('pkg-detail-desc').textContent = pkgDetailDescription(pkg);

    document.getElementById('pkg-detail-price').innerHTML = `
      <span class="gia">${formatGia(pkg.gia)}</span>${opts.perMonth ? '<span class="don-vi">/tháng</span>' : ''}
      ${pkg.giaGoc ? `<span class="data-price-goc">${formatGia(pkg.giaGoc)}</span>` : ''}
      ${giamPercent > 0 ? `<span style="font-size:12px;color:#3AAE58;font-weight:700;">-${giamPercent}%</span>` : ''}
    `;

    document.getElementById('pkg-detail-specs').innerHTML = specs.length
      ? specs.map(s => `<li><span class="pkg-detail-ico">${s.icon}</span><span><b>${escapeHtml(s.label)}:</b> ${escapeHtml(String(s.value))}</span></li>`).join('')
      : '<li class="pkg-detail-empty">Chưa có thêm thông số chi tiết cho gói này.</li>';

    document.getElementById('pkg-detail-benefits').innerHTML = PKG_DETAIL_BENEFITS.map(b => `<li>${escapeHtml(b)}</li>`).join('');

    // Khối "🔗 Chia sẻ gói này tới khách hàng" — CHỈ hiện khi đang đăng nhập vai trò NVKD/CTV ở trình duyệt
    // này; khách hàng thường mở modal chi tiết gói sẽ không thấy khối này.
    const shareSection = document.getElementById('pkg-detail-share-section');
    const seller = currentSeller();
    if(seller){
      const link = referralLink(seller.code) + '&SP=' + encodeURIComponent(pkg.ma);
      document.getElementById('pkg-share-qr').innerHTML = qrSvg(link, { size:96, margin:2 });
      document.getElementById('pkg-share-link').value = link;
      document.getElementById('pkg-share-note-ma').textContent = pkg.ma;
      document.getElementById('pkg-share-copy').onclick = () => copyText(link);
      document.getElementById('pkg-share-download').onclick = () => {
        const svgEl = document.querySelector('#pkg-share-qr svg');
        if(svgEl) downloadQrPng(svgEl, `QR-${pkg.ma}-${seller.type === 'staff' ? STAFF_DEMO.maNV : seller.code}.png`);
      };
      shareSection.style.display = 'block';
    } else {
      shareSection.style.display = 'none';
    }

    const btnRegister = document.getElementById('pkg-detail-register');
    btnRegister.onclick = () => {
      closePkgDetailModal();
      if(opts.onRegister) opts.onRegister();
    };

    document.getElementById('pkg-detail-overlay').classList.add('show');
  }
  function closePkgDetailModal(){
    document.getElementById('pkg-detail-overlay').classList.remove('show');
  }
  document.getElementById('pkg-detail-close').addEventListener('click', closePkgDetailModal);
  document.getElementById('pkg-detail-close-btn').addEventListener('click', closePkgDetailModal);
  document.getElementById('pkg-detail-overlay').addEventListener('click', (e) => {
    if(e.target.id === 'pkg-detail-overlay') closePkgDetailModal();
  });
  // renderCard/renderDataCard/renderRoamingCard/renderGenericCard (khối script khai báo DATA ở trên, không nằm
  // trong IIFE này) cần gọi hàm này khi bấm nút "Chi tiết gói cước"/"Xem chi tiết" — expose ra window để gọi được
  // xuyên suốt 2 khối <script>, giống cách window.StaffPortal đã làm ở cuối file.
  window.openPackageDetailModal = openPackageDetailModal;

  // Phóng to mã QR của 1 kênh phân phối dịch vụ (tái dùng cùng modal QR với CTV ở trên)
  function openStaffChannelQrZoom(serviceKey){
    const ch = SERVICE_CATALOG.find(c => c.key === serviceKey);
    if(!ch) return;
    const link = referralLink(staffChannelNvCode()) + '&DV=' + ch.key;
    document.getElementById('qr-zoom-content').innerHTML = qrSvg(link, { size:220, margin:2 });
    document.getElementById('qr-zoom-title').textContent = ch.name;
    document.getElementById('qr-zoom-link').textContent = link;
    document.getElementById('qr-zoom-overlay').classList.add('show');
  }

  /* ---------- Tab "Tài khoản của tôi": link phân kênh theo TỪNG DỊCH VỤ (12 dịch vụ, 4 nhóm) ----------
     BỔ SUNG: trước đây chỉ có 3 link chung theo trang (Internet/Truyền hình, Di động/Sim số, Data/5G).
     Nay mỗi dịch vụ cụ thể (FTTH, Combo, Truyền hình, Camera, Mua sim/số, Đổi eSIM, Mua gói Data,
     Chuyển trả sau/trước, Đăng ký thông tin, Lan tỏa cài app, Chăm sóc thu cước) có link + mã QR
     riêng (kèm &DV=<mã dịch vụ>) để NVKD gửi đúng dịch vụ cho khách hàng và vẫn được ghi nhận kết
     quả về đúng dịch vụ đó trên dashboard. */
  function renderStaffChannelGrid(){
    const grid = document.getElementById('staff-channel-grid');
    if(!grid) return;

    let html = '';
    SERVICE_GROUPS.forEach(g => {
      const items = SERVICE_CATALOG.filter(s => s.group === g.key);
      if(items.length === 0) return;
      html += `<div style="grid-column:1/-1;font-size:13px;font-weight:700;color:${g.color};margin:${html ? '10px' : '0'} 0 -6px;text-transform:uppercase;letter-spacing:.02em;">${g.icon} ${escapeHtml(g.label)}</div>`;
      items.forEach(ch => {
        const link = referralLink(staffChannelNvCode()) + '&DV=' + ch.key;
        html += `
          <div class="ctv-card">
            <div class="ctv-card-top">
              <div class="ctv-avatar" style="font-size:20px;">${ch.icon}</div>
              <div>
                <div class="ctv-name">${escapeHtml(ch.name)}</div>
                <div class="ctv-meta">${escapeHtml(g.label)}</div>
              </div>
            </div>
            <div class="ctv-qr-wrap" data-staff-qr-open="${ch.key}" style="cursor:pointer;" title="Xem mã QR phóng to">
              ${qrSvg(link, { size:88 })}
            </div>
            <div class="ctv-link-row">
              <input type="text" readonly value="${link}">
              <button class="btn-outline" data-staff-copy-link="${ch.key}" style="padding:7px 10px;font-size:14px;" title="Sao chép">📋</button>
            </div>
            <div class="ctv-actions">
              ${ch.page
                ? `<button class="btn-outline" data-staff-view-channel="${ch.key}">👁 Xem trang dịch vụ</button>`
                : `<button class="btn-outline" disabled style="opacity:.55;cursor:not-allowed;" title="Dịch vụ này chưa có trang minh hoạ riêng trong bản demo">— Chưa có trang minh hoạ</button>`}
            </div>
          </div>`;
      });
    });
    grid.innerHTML = html;

    grid.querySelectorAll('[data-staff-qr-open]').forEach(el => {
      el.addEventListener('click', () => openStaffChannelQrZoom(el.dataset.staffQrOpen));
    });
    grid.querySelectorAll('[data-staff-copy-link]').forEach(el => {
      el.addEventListener('click', () => copyText(referralLink(staffChannelNvCode()) + '&DV=' + el.dataset.staffCopyLink));
    });
    grid.querySelectorAll('[data-staff-view-channel]').forEach(el => {
      el.addEventListener('click', () => {
        const ch = SERVICE_CATALOG.find(c => c.key === el.dataset.staffViewChannel);
        if(ch && ch.page) {
          switchToPage(ch.page);
          window.activeReferral = referrerFromStaff();
          renderTrustBadge(window.activeReferral);
        }
      });
    });
  }

  // Hiển thị ảnh đại diện NVKD (ảnh đã tải lên) hoặc chữ cái đầu tên (mặc định), kèm icon 📷 để đổi ảnh.
  const staffAvatarInput = document.getElementById('staff-avatar-file-input');
  function renderStaffAvatarDisplay(){
    const el = document.getElementById('staff-avatar');
    const inner = STAFF_DEMO.avatar
      ? `<img src="${STAFF_DEMO.avatar}" alt="Ảnh đại diện ${escapeHtml(STAFF_DEMO.hoTen)}">`
      : initialsOf(STAFF_DEMO.hoTen);
    el.innerHTML = `${inner}<div class="ctv-avatar-edit" id="btn-edit-staff-avatar" title="Cập nhật ảnh đại diện">📷</div>`;
    document.getElementById('btn-edit-staff-avatar').addEventListener('click', () => staffAvatarInput.click());
    const btnDirect = document.getElementById('btn-staff-avatar-upload-direct');
    if(btnDirect) btnDirect.addEventListener('click', () => staffAvatarInput.click());
  }
  staffAvatarInput.addEventListener('change', () => {
    const file = staffAvatarInput.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      STAFF_DEMO.avatar = reader.result;
      renderStaffAvatarDisplay();
      staffAvatarInput.value = '';
    };
    reader.readAsDataURL(file);
  });

  /* ---------- Xuất báo cáo kết quả bán hàng ra CSV ---------- */
  function csvEscape(v){
    const s = String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g,'""') + '"' : s;
  }

  function exportSalesCSV(scope, rangeKeyOverride){
    // rangeKeyOverride cho phép trang CTV (currentCtvRange) xuất đúng kỳ đang xem của họ,
    // thay vì luôn lấy currentStaffRange (kỳ đang chọn ở trang tổng quan của NVKD).
    const rangeKey = rangeKeyOverride || currentStaffRange;
    const rangeLabel = {
      'thang-nay':'Tháng này', 'thang-truoc':'Tháng trước', '3-thang':'3 tháng gần nhất', '12-thang':'12 tháng gần nhất'
    }[rangeKey];
    const rows = [['Đối tượng','Số điện thoại','Doanh số (đ)','Thuê bao mới','Tổng số đơn','Kỳ báo cáo']];

    function pushStaffRow(){
      const agg = aggregateSales('staff', rangeKey, null);
      rows.push([STAFF_DEMO.hoTen + ' (bạn)', '-', agg.doanhSo, agg.thueBaoMoi, agg.tongDonHang, rangeLabel]);
    }
    function pushCtvRow(c){
      const agg = aggregateSales('ctv:' + c.id, rangeKey, new Date(c.ngayTaoISO));
      rows.push([c.hoTen, c.sdt, agg.doanhSo, agg.thueBaoMoi, agg.tongDonHang, rangeLabel]);
    }

    if(scope === 'all'){
      pushStaffRow();
      ctvList.forEach(pushCtvRow);
    } else if(scope === 'staff'){
      pushStaffRow();
    } else {
      const c = ctvList.find(x => x.id === scope);
      if(!c) return;
      pushCtvRow(c);
    }

    const csv = '﻿' + rows.map(r => r.map(csvEscape).join(',')).join('\r\n');
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const fileTag = scope === 'all' ? 'toan-bo' : (scope === 'staff' ? STAFF_DEMO.maNV : scope);
    a.href = url;
    a.download = `bao-cao-ban-hang_${fileTag}_${rangeKey}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* ---------- Xuất danh sách đơn hàng chi tiết ra CSV (tách riêng với báo cáo tổng hợp ở trên) ---------- */
  function exportOrdersCSV(scope, rangeKeyOverride){
    const rangeKey = rangeKeyOverride || currentStaffRange;
    let orders;
    if(scope === 'all'){
      orders = collectAllOrdersForRange(rangeKey);
    } else if(scope === 'staff'){
      orders = collectOrders('staff', rangeKey, null);
    } else {
      const c = ctvList.find(x => x.id === scope);
      if(!c) return;
      orders = collectOrders('ctv:' + c.id, rangeKey, new Date(c.ngayTaoISO));
    }
    const rows = [[
      'Mã đơn hàng','Ngày','Loại dịch vụ','Họ tên khách hàng','SĐT khách hàng',
      'Nhân viên KD','Cộng tác viên','SĐT CTV','NV kỹ thuật','Trạng thái','Giá trị (đ)'
    ]];
    orders.forEach(o => rows.push([
      o.maDonHang, formatVNDate(o.ngay), o.loaiDichVu, o.hoTenKhachHang, o.sdtKhachHang,
      o.tenNVKD, o.tenCTV || '-', o.sdtCTV || '-', o.tenNVKyThuat || '-', o.trangThai, o.giaTri
    ]));
    const csv = '﻿' + rows.map(r => r.map(csvEscape).join(',')).join('\r\n');
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const fileTag = scope === 'all' ? 'toan-bo' : (scope === 'staff' ? STAFF_DEMO.maNV : scope);
    a.href = url;
    a.download = `danh-sach-don-hang_${fileTag}_${rangeKey}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* ---------- Tổng quan kết quả bán hàng (bộ lọc nhanh theo thời gian) ---------- */
  let currentStaffRange = 'thang-nay';

  function renderStaffOverview(){
    const rangeKey = currentStaffRange;
    const staffAgg = aggregateSales('staff', rangeKey, null);
    const ctvAggs = ctvList.map(c => ({ ctv:c, agg: aggregateSales('ctv:' + c.id, rangeKey, new Date(c.ngayTaoISO)) }));

    const teamDoanhSo = ctvAggs.reduce((s,x) => s + x.agg.doanhSo, 0);
    const teamThueBao = ctvAggs.reduce((s,x) => s + x.agg.thueBaoMoi, 0);
    const ctvHoatDong = ctvAggs.filter(x => x.agg.doanhSo > 0).length;

    document.getElementById('staff-stats').innerHTML = `
      <div class="staff-stat-card">
        <div class="staff-stat-label">Doanh số cá nhân</div>
        <div class="staff-stat-value">${formatVND(staffAgg.doanhSo)}</div>
        <div class="staff-stat-sub">${staffAgg.thueBaoMoi} thuê bao mới · Tổng ${staffAgg.tongDonHang} đơn hàng</div>
      </div>
      <div class="staff-stat-card">
        <div class="staff-stat-label">Doanh số toàn đội CTV</div>
        <div class="staff-stat-value">${formatVND(teamDoanhSo)}</div>
        <div class="staff-stat-sub">${teamThueBao} thuê bao mới</div>
      </div>
      <div class="staff-stat-card">
        <div class="staff-stat-label">Tổng doanh số (bạn + CTV)</div>
        <div class="staff-stat-value">${formatVND(staffAgg.doanhSo + teamDoanhSo)}</div>
      </div>
      <div class="staff-stat-card">
        <div class="staff-stat-label">CTV có phát sinh doanh số</div>
        <div class="staff-stat-value">${ctvHoatDong}/${ctvList.length}</div>
      </div>
    `;

    renderStatusSummary('staff-status-summary', 'staff-status-summary-sub', rangeKey, collectAllOrdersForRange(rangeKey));

    const rows = [];
    rows.push(`
      <tr>
        <td><b>${escapeHtml(STAFF_DEMO.hoTen)}</b><div class="ctv-meta">Bạn (NVKD)</div></td>
        <td>${formatVND(staffAgg.doanhSo)}</td>
        <td>${staffAgg.thueBaoMoi}</td>
        <td>${staffAgg.tongDonHang}</td>
        <td><button class="btn-outline btn-export-row" data-export-row="staff">⭳ Xuất</button></td>
      </tr>`);
    ctvAggs.forEach(x => {
      rows.push(`
        <tr>
          <td>${escapeHtml(x.ctv.hoTen)}<div class="ctv-meta">${x.ctv.sdt}</div></td>
          <td>${formatVND(x.agg.doanhSo)}</td>
          <td>${x.agg.thueBaoMoi}</td>
          <td>${x.agg.tongDonHang}</td>
          <td><button class="btn-outline btn-export-row" data-export-row="${x.ctv.id}">⭳ Xuất</button></td>
        </tr>`);
    });
    document.getElementById('staff-breakdown-body').innerHTML = rows.join('');
    document.querySelectorAll('#staff-breakdown-body [data-export-row]').forEach(btn => {
      btn.addEventListener('click', () => exportSalesCSV(btn.dataset.exportRow));
    });

    // Biểu đồ trực quan: xu hướng 12 tháng (Bạn vs Toàn đội) + đóng góp theo người (kỳ đang chọn)
    const teamSeries = MONTHS_12.map(d => {
      const ym = monthKey(d);
      let sum = 0;
      ctvList.forEach(c => {
        const found = monthlySeriesForChart('ctv:' + c.id, new Date(c.ngayTaoISO)).find(x => x.ym === ym);
        if(found) sum += found.doanhSo;
      });
      return sum;
    });
    const staffSeries = monthlySeriesForChart('staff', null).map(s => s.doanhSo);
    renderTrendChart('staff-trend-chart', [
      { key:'staff', name: STAFF_DEMO.hoTen + ' (bạn)', color:'#EE0033', data: staffSeries },
      { key:'team', name:'Toàn đội CTV', color:'#2a78d6', data: teamSeries },
    ]);
    renderContributionChart('staff-contrib-chart', 'staff-contrib-sub', rangeKey);
    renderServiceTypeChart('staff-service-type-chart', 'staff-service-type-sub', rangeKey);

    const staffOrders = collectOrders('staff', rangeKey, null);
    const staffPending = staffOrders.filter(o => o.trangThai === 'Đang thực hiện');
    const staffPendingRevenue = staffPending.reduce((s,o) => s + o.giaTri, 0);
    let pendingRows = [`
      <tr>
        <td><b>${escapeHtml(STAFF_DEMO.hoTen)}</b><div class="ctv-meta">Bạn (NVKD)</div></td>
        <td style="color:#1c5cab;font-weight:700;">${formatVND(staffPendingRevenue)}</td>
        <td>${staffPending.length}</td>
      </tr>`];
    ctvAggs.forEach(x => {
      const cOrders = collectOrders('ctv:' + x.ctv.id, rangeKey, new Date(x.ctv.ngayTaoISO));
      const cPending = cOrders.filter(o => o.trangThai === 'Đang thực hiện');
      const cPendingRev = cPending.reduce((s,o) => s + o.giaTri, 0);
      pendingRows.push(`
        <tr>
          <td>${escapeHtml(x.ctv.hoTen)}<div class="ctv-meta">${x.ctv.sdt}</div></td>
          <td style="color:#1c5cab;font-weight:700;">${formatVND(cPendingRev)}</td>
          <td>${cPending.length}</td>
        </tr>`);
    });
    const pendingBody = document.getElementById('staff-pending-revenue-body');
    if(pendingBody) pendingBody.innerHTML = pendingRows.join('');

    populateOrderPersonFilter();
    renderOrdersTable();
  }

  document.querySelectorAll('#staff-range-tabs .staff-range-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#staff-range-tabs .staff-range-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStaffRange = btn.dataset.range;
      renderStaffOverview();
    });
  });

  /* ---------- Bảng chi tiết đơn hàng — dashboard NVKD (lọc theo trạng thái + theo người bán) ---------- */
  const ORDERS_TABLE_ROW_CAP = 60;
  let orderStatusFilter = 'all';
  let orderPersonFilter = 'all';

  // Dựng lại danh sách người bán trong <select> lọc theo CTV hiện có, giữ nguyên lựa chọn đang chọn
  // nếu vẫn còn hợp lệ (vd. vừa tạo thêm CTV mới thì danh sách phải có tên CTV đó).
  function populateOrderPersonFilter(){
    const sel = document.getElementById('order-person-filter');
    if(!sel) return;
    const prev = sel.value;
    sel.innerHTML = `
      <option value="all">Tất cả (bạn + CTV)</option>
      <option value="staff">Chỉ mình bạn (bán trực tiếp)</option>
      ${ctvList.map(c => `<option value="ctv:${c.id}">${escapeHtml(c.hoTen)} (${c.sdt})</option>`).join('')}
    `;
    const stillValid = Array.from(sel.options).some(o => o.value === prev);
    sel.value = stillValid ? prev : 'all';
    orderPersonFilter = sel.value;
  }

  function renderOrdersTable(){
    const rangeKey = currentStaffRange;
    let orders;
    if(orderPersonFilter === 'all'){
      orders = collectAllOrdersForRange(rangeKey);
    } else if(orderPersonFilter === 'staff'){
      orders = collectOrders('staff', rangeKey, null);
    } else {
      const c = ctvList.find(x => 'ctv:' + x.id === orderPersonFilter);
      orders = c ? collectOrders('ctv:' + c.id, rangeKey, new Date(c.ngayTaoISO)) : [];
    }
    if(orderStatusFilter !== 'all') orders = orders.filter(o => o.trangThai === orderStatusFilter);
    orders = orders.slice().sort((a, b) => b.ngaySort - a.ngaySort);

    const shown = orders.slice(0, ORDERS_TABLE_ROW_CAP);
    document.getElementById('orders-table-body').innerHTML = shown.map(o => orderRowHtml(o, true)).join('')
      || `<tr><td colspan="10" style="text-align:center;color:var(--text-muted);">Không có đơn hàng nào phù hợp bộ lọc.</td></tr>`;

    const note = document.getElementById('orders-table-note');
    note.textContent = orders.length > ORDERS_TABLE_ROW_CAP
      ? `Đang hiển thị ${ORDERS_TABLE_ROW_CAP}/${orders.length} đơn hàng gần nhất. Bấm "Xuất danh sách đơn hàng (CSV)" để xem đầy đủ.`
      : `Tổng cộng ${orders.length} đơn hàng.`;
  }

  document.getElementById('order-status-filters').addEventListener('click', (e) => {
    const btn = e.target.closest('.order-filter-btn');
    if(!btn) return;
    document.querySelectorAll('#order-status-filters .order-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    orderStatusFilter = btn.dataset.status;
    renderOrdersTable();
  });
  document.getElementById('order-person-filter').addEventListener('change', (e) => {
    orderPersonFilter = e.target.value;
    renderOrdersTable();
  });
  document.getElementById('btn-export-orders-all').addEventListener('click', () => {
    exportOrdersCSV(orderPersonFilter === 'all' ? 'all' : (orderPersonFilter === 'staff' ? 'staff' : orderPersonFilter.slice(4)), currentStaffRange);
  });

  /* ---------- Chuyển tab "Dashboard" / "Quản lý cộng tác viên (CTV)" trong trang NVKD ---------- */
  document.querySelectorAll('#staff-main-tabs .staff-main-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#staff-main-tabs .staff-main-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('#staff-dashboard > .staff-tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('staff-tab-' + btn.dataset.staffTab).classList.add('active');
    });
  });

  /* ---------- Quản lý CTV trực thuộc: danh sách, avatar, tạo mới ---------- */
  let pendingAvatarCtvId = null;
  const ctvAvatarInput = document.getElementById('ctv-avatar-file-input');

  function renderCtvGrid(){
    const grid = document.getElementById('ctv-grid');
    grid.innerHTML = ctvList.map(c => {
      const link = referralLink(c.sdt);
      const avatarInner = c.avatar
        ? `<img src="${c.avatar}" alt="Ảnh đại diện ${escapeHtml(c.hoTen)}">`
        : initialsOf(c.hoTen);
      const locked = c.trangThai === 'locked';
      return `
        <div class="ctv-card${locked ? ' ctv-card-locked' : ''}">
          <div class="ctv-card-top">
            <div class="ctv-avatar">
              ${avatarInner}
              <div class="ctv-avatar-edit" data-avatar-edit="${c.id}" title="Cập nhật ảnh đại diện">📷</div>
            </div>
            <div style="flex:1;min-width:0;">
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                <div class="ctv-name">${escapeHtml(c.hoTen)}</div>
                ${ctvStatusBadge(c.trangThai)}
              </div>
              <div class="ctv-phone">${c.sdt}</div>
              <div class="ctv-meta">Tạo ngày ${formatVNDate(c.ngayTaoISO)}</div>
            </div>
          </div>
          <div class="ctv-qr-wrap" data-qr-open="${c.id}" style="cursor:pointer;" title="Xem mã QR phóng to">
            ${qrSvg(link, { size:88 })}
          </div>
          <div class="ctv-link-row">
            <input type="text" readonly value="${link}">
            <button class="btn-outline" data-copy-link="${c.id}" style="padding:7px 10px;font-size:14px;" title="Sao chép">📋</button>
          </div>
          <div class="ctv-actions">
            <button class="btn-outline" data-view-ref="${c.id}">👁 Xem trang liên kết</button>
            <button class="btn-outline" data-export="${c.id}">⭳ Xuất báo cáo</button>
          </div>
          <div class="ctv-actions">
            <button class="btn-outline" data-edit-ctv="${c.id}">✏️ Sửa</button>
            <button class="btn-outline" data-toggle-status="${c.id}">${locked ? '🔓 Mở khóa' : '🔒 Khóa'}</button>
            <button class="btn-outline" data-delete-ctv="${c.id}" style="color:var(--viettel-red);border-color:var(--viettel-red);">🗑️ Xóa</button>
          </div>
        </div>`;
    }).join('');

    grid.querySelectorAll('[data-avatar-edit]').forEach(el => {
      el.addEventListener('click', () => { pendingAvatarCtvId = el.dataset.avatarEdit; ctvAvatarInput.click(); });
    });
    grid.querySelectorAll('[data-copy-link]').forEach(el => {
      el.addEventListener('click', () => {
        const c = ctvList.find(x => x.id === el.dataset.copyLink);
        if(c) copyText(referralLink(c.sdt));
      });
    });
    grid.querySelectorAll('[data-view-ref]').forEach(el => {
      el.addEventListener('click', () => showRefBadge(el.dataset.viewRef));
    });
    grid.querySelectorAll('[data-export]').forEach(el => {
      el.addEventListener('click', () => exportSalesCSV(el.dataset.export));
    });
    grid.querySelectorAll('[data-qr-open]').forEach(el => {
      el.addEventListener('click', () => openQrZoom(el.dataset.qrOpen));
    });
    grid.querySelectorAll('[data-edit-ctv]').forEach(el => {
      el.addEventListener('click', () => openCtvEditModal(el.dataset.editCtv));
    });
    grid.querySelectorAll('[data-toggle-status]').forEach(el => {
      el.addEventListener('click', () => toggleCtvStatus(el.dataset.toggleStatus));
    });
    grid.querySelectorAll('[data-delete-ctv]').forEach(el => {
      el.addEventListener('click', () => confirmDeleteCtv(el.dataset.deleteCtv));
    });
  }

  // Khóa/Mở khóa: chỉ chặn đăng nhập CTV (xem handleCtvLogin), KHÔNG xóa dữ liệu bán hàng đã có.
  function toggleCtvStatus(id){
    const c = ctvList.find(x => x.id === id);
    if(!c) return;
    c.trangThai = c.trangThai === 'locked' ? 'active' : 'locked';
    renderCtvGrid();
  }

  // Xóa hẳn CTV khỏi danh sách (khác với Khóa — không thể hoàn tác) + dọn cache số liệu liên quan
  // + làm mới các nơi khác đang tham chiếu tới danh sách CTV (bộ lọc đơn hàng, tổng quan, biểu đồ).
  function deleteCtvRecord(id){
    const idx = ctvList.findIndex(x => x.id === id);
    if(idx === -1) return;
    ctvList.splice(idx, 1);
    _monthlySalesCache.delete('ctv:' + id);
    renderCtvGrid();
    renderStaffOverview();
  }

  function confirmDeleteCtv(id){
    const c = ctvList.find(x => x.id === id);
    if(!c) return;
    openConfirmModal({
      title: 'Xóa cộng tác viên?',
      message: `Bạn có chắc muốn xóa CTV "${c.hoTen}" (${c.sdt})? Liên kết giới thiệu và dữ liệu bán hàng demo của CTV này sẽ không còn hiển thị. Hành động này không thể hoàn tác.`,
      confirmText: 'Xóa',
      onConfirm: () => deleteCtvRecord(id),
    });
  }

  /* ---------- Sửa thông tin CTV (Họ tên / SĐT) — NVKD đã xác thực nên không yêu cầu lại OTP ---------- */
  const ctvEditOverlay = document.getElementById('ctv-edit-overlay');
  let editingCtvId = null;
  let editingCtvAvatarResult = null;

  const ctvEditAvatarFile = document.getElementById('ctv-edit-avatar-file');
  document.getElementById('btn-ctv-edit-upload').addEventListener('click', () => ctvEditAvatarFile.click());
  ctvEditAvatarFile.addEventListener('change', () => {
    const file = ctvEditAvatarFile.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      editingCtvAvatarResult = reader.result;
      const previewEl = document.getElementById('ctv-edit-avatar-preview');
      previewEl.innerHTML = `<img src="${reader.result}">`;
      ctvEditAvatarFile.value = '';
    };
    reader.readAsDataURL(file);
  });

  function openCtvEditModal(id){
    const c = ctvList.find(x => x.id === id);
    if(!c) return;
    editingCtvId = id;
    editingCtvAvatarResult = null;
    document.getElementById('ctv-edit-hoten').value = c.hoTen;
    document.getElementById('ctv-edit-sdt').value = c.sdt;
    document.getElementById('ctv-edit-error').textContent = '';
    
    // FIX: trước đây fallback cứng về 'avatar_collab_1.png' khi CTV chưa có ảnh — sẽ hiện nhầm ảnh
    // của người khác. Nay dùng chữ cái đầu tên (initialsOf), đồng bộ với renderCtvGrid.
    const previewEl = document.getElementById('ctv-edit-avatar-preview');
    previewEl.innerHTML = c.avatar
      ? `<img src="${c.avatar}">`
      : escapeHtml(initialsOf(c.hoTen));

    ctvEditOverlay.classList.add('show');
  }
  function closeCtvEditModal(){ ctvEditOverlay.classList.remove('show'); editingCtvId = null; editingCtvAvatarResult = null; }

  document.getElementById('ctv-edit-close').addEventListener('click', closeCtvEditModal);
  ctvEditOverlay.addEventListener('click', (e) => { if(e.target === ctvEditOverlay) closeCtvEditModal(); });

  document.getElementById('ctv-edit-save').addEventListener('click', () => {
    const errEl = document.getElementById('ctv-edit-error');
    const hoTen = document.getElementById('ctv-edit-hoten').value.trim();
    const sdt = document.getElementById('ctv-edit-sdt').value.trim();
    if(hoTen.length < 2){ errEl.textContent = 'Vui lòng nhập họ tên hợp lệ.'; return; }
    if(!PHONE_REGEX.test(sdt)){ errEl.textContent = 'Số điện thoại không hợp lệ.'; return; }
    const dup = ctvList.find(x => x.id !== editingCtvId && x.sdt === sdt);
    if(dup){ errEl.textContent = 'Số điện thoại này đã được dùng cho một CTV khác.'; return; }
    const c = ctvList.find(x => x.id === editingCtvId);
    if(c){
      c.hoTen = hoTen;
      c.sdt = sdt;
      if(editingCtvAvatarResult !== null) {
        c.avatar = editingCtvAvatarResult;
      }
      _monthlySalesCache.delete('ctv:' + c.id);
    }
    closeCtvEditModal();
    renderCtvGrid();
    renderStaffOverview();
  });

  /* ---------- Modal xác nhận thao tác dùng chung (xóa CTV...) — thay cho confirm() mặc định của trình duyệt ---------- */
  const confirmModalOverlay = document.getElementById('confirm-modal-overlay');
  let confirmModalOnConfirm = null;

  function openConfirmModal(cfg){
    document.getElementById('confirm-modal-title').textContent = cfg.title;
    document.getElementById('confirm-modal-message').textContent = cfg.message;
    document.getElementById('confirm-modal-confirm').textContent = cfg.confirmText || 'Xác nhận';
    confirmModalOnConfirm = cfg.onConfirm;
    confirmModalOverlay.classList.add('show');
  }
  function closeConfirmModal(){ confirmModalOverlay.classList.remove('show'); confirmModalOnConfirm = null; }

  document.getElementById('confirm-modal-cancel').addEventListener('click', closeConfirmModal);
  document.getElementById('confirm-modal-confirm').addEventListener('click', () => {
    const fn = confirmModalOnConfirm;
    closeConfirmModal();
    if(fn) fn();
  });
  confirmModalOverlay.addEventListener('click', (e) => { if(e.target === confirmModalOverlay) closeConfirmModal(); });

  // Modal Preview Tài liệu Marketing
  const docPreviewModalOverlay = document.getElementById('doc-preview-modal-overlay');
  window.openDocPreview = function(ma) {
    const doc = TAI_LIEU_MARKETING.find(d => d.ma === ma);
    if(!doc) return;
    document.getElementById('doc-preview-title').textContent = doc.ten;
    document.getElementById('doc-preview-meta').textContent = `${doc.loaiNoiDung} · Định dạng: ${doc.dinhDang} · Đăng ngày ${formatVNDate(doc.ngayDang)}`;
    document.getElementById('doc-preview-download-btn').href = doc.link;
    
    let htmlContent = '';
    
    // Tạo nội dung demo mô phỏng thay vì dùng iframe Google Drive
    if(doc.dinhDang === 'SVG' || doc.loaiNoiDung === 'Hình ảnh SP') {
       htmlContent = `<div style="display:flex; justify-content:center; align-items:center; height:100%; min-height:300px; background:#f5f5f5; border-radius:8px; border:2px dashed #ccc;">
          <div style="text-align:center; color:#666;">
            <div style="font-size:48px; margin-bottom:10px;">🖼️</div>
            <div style="font-size:16px; font-weight:bold;">${escapeHtml(doc.ten)}</div>
            <div style="font-size:13px; margin-top:5px;">(Ảnh demo minh họa)</div>
          </div>
       </div>`;
    } else {
       htmlContent = `
       <div style="max-width:640px; margin:0 auto; font-size:14px; line-height:1.6;">
         <h2 style="font-size:20px; margin-top:0; margin-bottom:16px; color:var(--text-dark);">${escapeHtml(doc.ten)}</h2>
         <p><strong>Nền tảng:</strong> ${escapeHtml(doc.nenTang || 'Đa nền tảng')}</p>
         <p><strong>Mô tả:</strong> ${escapeHtml(doc.moTa)}</p>
         <hr style="border:none; border-top:1px dashed #ccc; margin:20px 0;">
         <div style="background:#f9f9fa; padding:16px; border-left:4px solid var(--viettel-red); border-radius:4px; white-space:pre-wrap; color:#333;">[Nội dung Demo]

Kính gửi Quý Khách hàng,

Đây là nội dung bản nháp mô phỏng cho tài liệu "${escapeHtml(doc.ten)}". 
Nhân viên Kinh doanh / Cộng tác viên có thể copy nội dung này hoặc tải file gốc về máy để phục vụ công việc tư vấn, bán hàng, và chạy chiến dịch Marketing trên các kênh ${escapeHtml(doc.nenTang || 'Social')}.

Ưu điểm nổi bật:
- Triển khai nhanh chóng
- Đảm bảo tính nhất quán của nhận diện thương hiệu Viettel
- Hỗ trợ giải đáp khách hàng hiệu quả

Vui lòng bấm nút "Tải về" để có bản chuẩn và hình ảnh chất lượng cao nhất.
         </div>
       </div>`;
    }
    
    document.getElementById('doc-preview-content').innerHTML = htmlContent;
    docPreviewModalOverlay.classList.add('show');
  };

  document.getElementById('doc-preview-modal-close').addEventListener('click', () => {
    docPreviewModalOverlay.classList.remove('show');
    document.getElementById('doc-preview-content').innerHTML = '';
  });
  docPreviewModalOverlay.addEventListener('click', (e) => {
    if(e.target === docPreviewModalOverlay) {
      docPreviewModalOverlay.classList.remove('show');
      document.getElementById('doc-preview-content').innerHTML = '';
    }
  });

  ctvAvatarInput.addEventListener('change', () => {
    const file = ctvAvatarInput.files[0];
    if(!file || !pendingAvatarCtvId) return;
    const reader = new FileReader();
    reader.onload = () => {
      const c = ctvList.find(x => x.id === pendingAvatarCtvId);
      if(c){ c.avatar = reader.result; renderCtvGrid(); }
      pendingAvatarCtvId = null;
      ctvAvatarInput.value = '';
    };
    reader.readAsDataURL(file);
  });

  const DEMO_AVATAR_POOL = VIETTEL_AVATARS;
  function createCtvRecord(hoTen, sdt, avatar){
    const now = new Date();
    const defaultAvatar = DEMO_AVATAR_POOL[ctvList.length % DEMO_AVATAR_POOL.length];
    const ctv = {
      id: 'ctv-' + Date.now() + '-' + Math.floor(Math.random()*1000),
      hoTen, sdt,
      ngayTaoISO: now.toISOString().slice(0,10),
      avatar: avatar || defaultAvatar,
      trangThai: 'active',
      // CTV mới tạo mặc định cùng địa bàn với NVKD phụ trách (có thể sửa lại sau qua "✏️ Sửa").
      diaChi: STAFF_DEMO.diaBan,
    };
    ctvList.push(ctv);
    return ctv;
  }

  // Huy hiệu trạng thái hoạt động của CTV (tái dùng 2 màu status-badge sẵn có: xanh = tốt, đỏ = ngừng).
  function ctvStatusBadge(trangThai){
    return trangThai === 'locked'
      ? '<span class="status-badge status-da-huy">Đã khóa</span>'
      : '<span class="status-badge status-hoan-thanh">Hoạt động</span>';
  }

  function renderCtvCreatedSuccess(ctv){
    const link = referralLink(ctv.sdt);
    return `
      <h3 class="login-success-title">Tạo tài khoản CTV thành công</h3>
      <div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:12px;">
        <div class="ctv-avatar" style="width:48px;height:48px;">${ctv.avatar ? `<img src="${ctv.avatar}">` : escapeHtml(initialsOf(ctv.hoTen))}</div>
        <button type="button" class="btn-outline" onclick="openCtvEditModal('${ctv.id}')" style="font-size:12px;padding:5px 10px;">📷 Đổi ảnh avatar</button>
      </div>
      <p class="login-success-msg">${escapeHtml(ctv.hoTen)} (${ctv.sdt}) đã được thêm vào danh sách CTV trực thuộc.</p>
      <div class="ctv-qr-wrap" style="margin:0 auto 14px;max-width:150px;">${qrSvg(link, { size:130 })}</div>
      <div class="ctv-link-row">
        <input type="text" readonly value="${link}">
        <button type="button" class="btn-outline" id="new-ctv-copy-btn" style="padding:7px 10px;font-size:14px;" title="Sao chép">📋</button>
      </div>
    `;
  }

  /* ---------- Đăng nhập / đăng xuất NVKD & CTV ----------
     Từ bản cập nhật này, đăng nhập NVKD và CTV đều thực hiện qua CHÍNH ô "Đăng nhập" trên
     header (modal dùng chung với khách hàng, chọn tab dịch vụ "Nhân viên KD"/"Cộng tác viên"),
     không còn nút đăng nhập riêng ở trang này. window.StaffPortal là điểm nối để khối script
     đăng nhập khách hàng (ở trên) gọi vào 2 hàm bên dưới sau khi người dùng xác thực OTP thành
     công với vai trò tương ứng. */
  let loggedInCtv = null;
  let staffIsLoggedIn = false;

  // Danh tính "người bán" đang đăng nhập ở TRÌNH DUYỆT NÀY (NVKD hoặc CTV) — dùng để quyết định có
  // hiển thị khối "🔗 Chia sẻ gói này tới khách hàng" trong modal chi tiết gói cước hay không, và để
  // dựng đúng link/mã QR riêng của người đang đăng nhập. Khách hàng thường (chưa đăng nhập vai trò
  // NVKD/CTV) sẽ không thấy khối chia sẻ này.
  function currentSeller(){
    if(staffIsLoggedIn) return { type:'staff', hoTen: STAFF_DEMO.hoTen, code: staffChannelNvCode(), personKey:'staff' };
    if(loggedInCtv) return { type:'ctv', hoTen: loggedInCtv.hoTen, code: loggedInCtv.sdt, personKey:'ctv:' + loggedInCtv.id };
    return null;
  }

  // Chỉ 1 trong 3 trạng thái được hiển thị tại một thời điểm: khoá / dashboard NVKD / dashboard CTV.
  function showStaffPanel(which){
    document.getElementById('staff-locked').style.display = which === 'locked' ? 'block' : 'none';
    document.getElementById('staff-dashboard').style.display = which === 'staff' ? 'block' : 'none';
    document.getElementById('ctv-dashboard').style.display = which === 'ctv' ? 'block' : 'none';
  }

  function setStaffLoggedIn(phone){
    staffIsLoggedIn = true;
    if(phone){
      const cleanPhone = String(phone).replace(/\s+/g, '');
      STAFF_DEMO.sdt = cleanPhone;
    }
    document.getElementById('staff-locked-error').textContent = '';
    switchToPage('page-staff');
    showStaffPanel('staff');
    document.getElementById('staff-name-display').textContent = `${STAFF_DEMO.hoTen} — ${STAFF_DEMO.maNV}`;
    document.getElementById('staff-diaban-display').textContent = STAFF_DEMO.diaBan;
    renderStaffAvatarDisplay();
    document.querySelectorAll('#staff-main-tabs .staff-main-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.staffTab === 'dashboard'));
    document.querySelectorAll('#staff-dashboard > .staff-tab-panel').forEach(p => p.classList.toggle('active', p.id === 'staff-tab-dashboard'));
    renderStaffOverview();
    renderCtvGrid();
    renderStaffChannelGrid();
    renderStaffLeads();
  }
  function setStaffLoggedOut(){
    staffIsLoggedIn = false;
    showStaffPanel('locked');
  }
  document.getElementById('btn-staff-logout').addEventListener('click', setStaffLoggedOut);

  // Đăng nhập CTV: chỉ chấp nhận số điện thoại đã được một NVKD tạo tài khoản trước đó
  // (mục "Quản lý cộng tác viên") — mô phỏng đúng quan hệ nghiệp vụ CTV trực thuộc NVKD.
  function handleCtvLogin(phone){
    phone = (phone || '').replace(/\s+/g, '');
    switchToPage('page-staff');
    const ctv = ctvList.find(c => c.sdt === phone);
    if(ctv && ctv.trangThai === 'locked'){
      showStaffPanel('locked');
      document.getElementById('staff-locked-error').textContent =
        `Tài khoản Cộng tác viên của ${ctv.hoTen} (${ctv.sdt}) đã bị Nhân viên kinh doanh phụ trách khóa. Vui lòng liên hệ để được hỗ trợ mở khóa.`;
    } else if(ctv){
      setCtvLoggedIn(ctv);
    } else {
      showStaffPanel('locked');
      document.getElementById('staff-locked-error').textContent =
        `Số điện thoại ${phone} chưa được đăng ký làm Cộng tác viên. Vui lòng liên hệ Nhân viên kinh doanh phụ trách để được tạo tài khoản CTV.`;
    }
  }

  let currentCtvRange = 'thang-nay';

  // Cho phép CTV tự cập nhật ảnh đại diện của chính mình sau khi đăng nhập
  // (giống hệt luồng đổi ảnh đại diện NVKD/CTV do NVKD quản lý) — ảnh lưu thẳng
  // vào record CTV tương ứng trong ctvList nên NVKD xem lại danh sách CTV cũng thấy ảnh mới.
  const ctvSelfAvatarInput = document.getElementById('ctv-self-avatar-file-input');
  function renderCtvSelfAvatarDisplay(){
    if(!loggedInCtv) return;
    const el = document.getElementById('ctv-self-avatar');
    const inner = loggedInCtv.avatar
      ? `<img src="${loggedInCtv.avatar}" alt="Ảnh đại diện ${escapeHtml(loggedInCtv.hoTen)}">`
      : initialsOf(loggedInCtv.hoTen);
    el.innerHTML = `${inner}<div class="ctv-avatar-edit" id="btn-edit-ctv-self-avatar" title="Cập nhật ảnh đại diện">📷</div>`;
    document.getElementById('btn-edit-ctv-self-avatar').addEventListener('click', () => ctvSelfAvatarInput.click());
  }
  ctvSelfAvatarInput.addEventListener('change', () => {
    const file = ctvSelfAvatarInput.files[0];
    if(!file || !loggedInCtv) return;
    const reader = new FileReader();
    reader.onload = () => {
      loggedInCtv.avatar = reader.result;
      renderCtvSelfAvatarDisplay();
      ctvSelfAvatarInput.value = '';
    };
    reader.readAsDataURL(file);
  });

  function openCustomQrZoom(title, link){
    document.getElementById('qr-zoom-content').innerHTML = qrSvg(link, { size:220, margin:2 });
    document.getElementById('qr-zoom-title').textContent = title;
    document.getElementById('qr-zoom-link').textContent = link;
    document.getElementById('qr-zoom-overlay').classList.add('show');
  }

  // BỔ SUNG: trước đây CTV chỉ có 4 link nhanh theo gói cước hard-code (SUN1T/STAR1T/5G230B/MXH100).
  // Nay dùng chung đúng danh mục 12 dịch vụ (SERVICE_CATALOG) với NVKD, nhóm theo 4 nhóm nghiệp vụ,
  // để CTV cũng có link/QR riêng cho từng dịch vụ gửi khách hàng, và kết quả được ghi nhận đúng dịch vụ.
  function renderCtvQuickLinks(){
    if(!loggedInCtv) return;
    const grid = document.getElementById('ctv-quick-links-grid');
    if(!grid) return;

    let html = '';
    SERVICE_GROUPS.forEach(g => {
      const items = SERVICE_CATALOG.filter(s => s.group === g.key);
      if(items.length === 0) return;
      html += `<div style="grid-column:1/-1;font-size:13px;font-weight:700;color:${g.color};margin:${html ? '10px' : '0'} 0 -6px;text-transform:uppercase;letter-spacing:.02em;">${g.icon} ${escapeHtml(g.label)}</div>`;
      items.forEach(svc => {
        const link = referralLink(loggedInCtv.sdt) + '&DV=' + svc.key;
        html += `
          <div class="ctv-card">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
              <span style="font-size:18px;">${svc.icon}</span>
              <div style="font-weight:700;font-size:14.5px;color:var(--text-dark);">${escapeHtml(svc.name)}</div>
            </div>
            <div style="font-size:12.5px;color:var(--text-muted);margin-bottom:12px;">${escapeHtml(g.label)}</div>
            <div class="ctv-qr-wrap" style="max-width:120px;margin:0 auto 14px;cursor:pointer;" data-qr-title="${escapeHtml(svc.name)}" data-qr-quick="${link}" title="Xem mã QR phóng to">
              ${qrSvg(link, { size:100 })}
            </div>
            <div class="ctv-link-row">
              <input type="text" readonly value="${link}">
              <button class="btn-outline" data-copy-quick="${link}" style="padding:7px 10px;font-size:14px;" title="Sao chép">📋</button>
            </div>
            <div class="ctv-actions" style="margin-top:8px;">
              ${svc.page
                ? `<button class="btn-outline" data-ctv-view-channel="${svc.key}">👁 Xem trang dịch vụ</button>`
                : `<button class="btn-outline" disabled style="opacity:.55;cursor:not-allowed;" title="Dịch vụ này chưa có trang minh hoạ riêng trong bản demo">— Chưa có trang minh hoạ</button>`}
            </div>
          </div>
        `;
      });
    });
    grid.innerHTML = html;

    grid.querySelectorAll('[data-copy-quick]').forEach(el => {
      el.addEventListener('click', () => copyText(el.dataset.copyQuick));
    });
    grid.querySelectorAll('[data-qr-quick]').forEach(el => {
      el.addEventListener('click', () => {
        openCustomQrZoom(el.dataset.qrTitle, el.dataset.qrQuick);
      });
    });
    // BỔ SUNG: CTV cũng xem trước trang dịch vụ giống NVKD — chuyển tới đúng trang + hiện huy hiệu
    // "Được giới thiệu bởi" với thông tin của chính CTV này (renderTrustBadge tự ẩn sao/số đánh giá
    // khi referrer.type === 'ctv', nên không cần xử lý thêm gì để khác NVKD ở phần đó).
    grid.querySelectorAll('[data-ctv-view-channel]').forEach(el => {
      el.addEventListener('click', () => {
        const svc = SERVICE_CATALOG.find(s => s.key === el.dataset.ctvViewChannel);
        if(svc && svc.page && loggedInCtv) {
          switchToPage(svc.page);
          window.activeReferral = referrerFromCtv(loggedInCtv);
          renderTrustBadge(window.activeReferral);
        }
      });
    });
  }

  function setCtvLoggedIn(ctv){
    loggedInCtv = ctv;
    document.getElementById('staff-locked-error').textContent = '';
    showStaffPanel('ctv');
    
    // Đặt lại trạng thái tab mặc định
    const navs = document.querySelectorAll('#ctv-dashboard .staff-nav-link.tab-btn');
    const panels = document.querySelectorAll('#ctv-dashboard .tab-panel');
    navs.forEach(n => n.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    if(navs.length > 0) navs[0].classList.add('active');
    if(panels.length > 0) panels[0].classList.add('active');

    document.getElementById('ctv-self-name-display').textContent = ctv.hoTen;
    renderCtvSelfAvatarDisplay();
    const link = referralLink(ctv.sdt);
    document.getElementById('ctv-self-link-input').value = link;
    document.getElementById('ctv-self-qr-wrap').innerHTML = qrSvg(link, { size:150 });
    currentCtvRange = 'thang-nay';
    document.querySelectorAll('#ctv-range-tabs .staff-range-btn').forEach(b => b.classList.toggle('active', b.dataset.range === 'thang-nay'));
    renderCtvSelfOverview();
    renderCtvQuickLinks();
    renderCtvLeads();
  }
  function setCtvLoggedOut(){
    loggedInCtv = null;
    showStaffPanel('locked');
  }
  document.getElementById('btn-ctv-logout').addEventListener('click', setCtvLoggedOut);
  document.getElementById('btn-ctv-export-self').addEventListener('click', () => {
    if(loggedInCtv) exportSalesCSV(loggedInCtv.id, currentCtvRange);
  });
  document.getElementById('btn-ctv-self-copy').addEventListener('click', () => {
    if(loggedInCtv) copyText(referralLink(loggedInCtv.sdt));
  });
  document.getElementById('ctv-self-qr-wrap').addEventListener('click', () => {
    if(loggedInCtv) openQrZoom(loggedInCtv.id);
  });

  function renderCtvSelfOverview(){
    if(!loggedInCtv) return;
    const rangeKey = currentCtvRange;
    const createdDate = new Date(loggedInCtv.ngayTaoISO);
    const agg = aggregateSales('ctv:' + loggedInCtv.id, rangeKey, createdDate);

    document.getElementById('ctv-self-stats').innerHTML = `
      <div class="staff-stat-card">
        <div class="staff-stat-label">Doanh số</div>
        <div class="staff-stat-value">${formatVND(agg.doanhSo)}</div>
        <div class="staff-stat-sub">${agg.thueBaoMoi} thuê bao mới</div>
      </div>
      <div class="staff-stat-card">
        <div class="staff-stat-label">Tổng số đơn hàng</div>
        <div class="staff-stat-value">${agg.tongDonHang}</div>
      </div>
    `;

    renderStatusSummary('ctv-self-status-summary', 'ctv-self-status-summary-sub', rangeKey,
      collectOrders('ctv:' + loggedInCtv.id, rangeKey, createdDate));

    const series = monthlySeriesForChart('ctv:' + loggedInCtv.id, createdDate).map(s => s.doanhSo);
    renderTrendChart('ctv-self-trend-chart', [
      { key:'self', name:'Doanh số của bạn', color:'#EE0033', data: series },
    ]);

    renderCtvSelfOrdersTable();
  }

  document.querySelectorAll('#ctv-range-tabs .staff-range-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#ctv-range-tabs .staff-range-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCtvRange = btn.dataset.range;
      renderCtvSelfOverview();
    });
  });

  /* ---------- Bảng chi tiết đơn hàng — dashboard CTV (chỉ lọc theo trạng thái, không có bộ lọc người bán) ---------- */
  let ctvOrderStatusFilter = 'all';

  function renderCtvSelfOrdersTable(){
    if(!loggedInCtv) return;
    const rangeKey = currentCtvRange;
    const createdDate = new Date(loggedInCtv.ngayTaoISO);
    let orders = collectOrders('ctv:' + loggedInCtv.id, rangeKey, createdDate);
    if(ctvOrderStatusFilter !== 'all') orders = orders.filter(o => o.trangThai === ctvOrderStatusFilter);
    orders = orders.slice().sort((a, b) => b.ngaySort - a.ngaySort);

    const shown = orders.slice(0, ORDERS_TABLE_ROW_CAP);
    document.getElementById('ctv-orders-table-body').innerHTML = shown.map(o => orderRowHtml(o, false)).join('')
      || `<tr><td colspan="9" style="text-align:center;color:var(--text-muted);">Không có đơn hàng nào phù hợp bộ lọc.</td></tr>`;

    const note = document.getElementById('ctv-orders-table-note');
    note.textContent = orders.length > ORDERS_TABLE_ROW_CAP
      ? `Đang hiển thị ${ORDERS_TABLE_ROW_CAP}/${orders.length} đơn hàng gần nhất. Bấm "Xuất danh sách đơn hàng (CSV)" để xem đầy đủ.`
      : `Tổng cộng ${orders.length} đơn hàng.`;
  }

  document.getElementById('ctv-order-status-filters').addEventListener('click', (e) => {
    const btn = e.target.closest('.order-filter-btn');
    if(!btn) return;
    document.querySelectorAll('#ctv-order-status-filters .order-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    ctvOrderStatusFilter = btn.dataset.status;
    renderCtvSelfOrdersTable();
  });
  document.getElementById('btn-export-orders-self').addEventListener('click', () => {
    if(loggedInCtv) exportOrdersCSV(loggedInCtv.id, currentCtvRange);
  });

  document.getElementById('btn-open-ctv-create').addEventListener('click', () => {
    OtpModal.open({
      title: 'Tạo tài khoản cộng tác viên',
      subtitle: 'Nhập thông tin CTV và xác thực SĐT qua OTP',
      fields: [
        { key:'hoTen', type:'text', placeholder:'Họ và tên CTV', validate: v => v.trim().length >= 2, errorMsg:'Vui lòng nhập họ tên hợp lệ.' },
        { key:'sdt', type:'tel', placeholder:'Số điện thoại CTV', validate: v => PHONE_REGEX.test(v), errorMsg:'Số điện thoại không hợp lệ.' },
      ],
      phoneKey: 'sdt',
      onSuccess: (values, body) => {
        const ctv = createCtvRecord(values.hoTen.trim(), values.sdt);
        body.innerHTML = renderCtvCreatedSuccess(ctv);
        const copyBtn = document.getElementById('new-ctv-copy-btn');
        if(copyBtn) copyBtn.addEventListener('click', () => copyText(referralLink(ctv.sdt)));
      },
      onDone: () => { renderCtvGrid(); populateOrderPersonFilter(); renderOrdersTable(); },
    });
  });

  document.getElementById('btn-export-all').addEventListener('click', () => exportSalesCSV('all'));

  // Trạng thái ban đầu: chưa ai đăng nhập -> hiện màn hình khoá
  showStaffPanel('locked');

  // Cầu nối để modal đăng nhập chung (khối script đăng nhập khách hàng) gọi vào sau khi xác
  // thực OTP thành công với vai trò Nhân viên KD / Cộng tác viên.
  window.StaffPortal = {
    loginStaff: (phone) => setStaffLoggedIn(phone),
    loginCtv: (phone) => handleCtvLogin(phone),
  };

  /* ============================================================================
     TÍNH NĂNG: NHẬN DIỆN & ĐỐI CHIẾU "KHÁCH HÀNG TIỀM NĂNG" TỪ LINK PHÂN KÊNH
     (xem tài liệu thiết kế "DEV-Thiet-Ke-Ky-Thuat-Khach-Hang-Tiem-Nang.doc" cùng thư mục)
     Bản demo này KHÔNG có backend thật — dùng localStorage của trình duyệt để MÔ PHỎNG đúng luồng
     nghiệp vụ (ở môi trường thật sẽ là Google Sheet "VisitorLog" ghi/đọc qua Apps Script). Các dòng
     đánh dấu "TODO (Dev)" là nơi cần nối API/Apps Script thật khi triển khai chính thức.
  ============================================================================ */
  // v2: nâng cấp bộ dữ liệu demo (45 lượt ghé -> 43 khách sau khi gộp trùng SĐT, có kèm lịch sử ghi
  // chú) cho khớp với sheet "VisitorLog" trong Google Sheet DucLQ_Data_LPK. Đổi tên key để các trình
  // duyệt đã lỡ lưu bộ dữ liệu demo cũ (v1, chỉ 3 lead mẫu) tự động được cấp lại dữ liệu mới, không cần
  // xoá localStorage thủ công.
  const VISITOR_LOG_KEY = 'tammi_visitor_log_v2';
  const VISITOR_ENGAGEMENT_THRESHOLD = 2; // số lượt xem "Chi tiết gói cước" trước khi hiện form nhẹ xin SĐT
  const visitorPackageViewCount = {}; // đếm theo phiên trình duyệt (reset khi tải lại trang)

  function loadVisitorLog(){
    try { return JSON.parse(localStorage.getItem(VISITOR_LOG_KEY)) || []; }
    catch(e){ return []; }
  }
  function saveVisitorLog(list){
    try { localStorage.setItem(VISITOR_LOG_KEY, JSON.stringify(list)); }
    catch(e){ /* bỏ qua nếu trình duyệt chặn localStorage (vd. chế độ duyệt web riêng tư) */ }
  }

  // SĐT cần LOẠI TRỪ khỏi danh sách "khách hàng tiềm năng" — chính NVKD đang đăng nhập + toàn bộ CTV
  // trực thuộc, để NVKD/CTV tự bấm xem trước link của mình không bị tính nhầm thành 1 lead thật.
  function excludedPhoneSet(){
    const set = new Set(ctvList.map(c => c.sdt));
    if(STAFF_DEMO.sdt) set.add(STAFF_DEMO.sdt);
    return set;
  }

  // ID phiên khách ẩn danh khi chưa biết SĐT — lưu ở sessionStorage nên chỉ tồn tại trong 1 tab trình
  // duyệt, KHÔNG dùng để định danh lâu dài (khác hẳn SĐT thật một khi đã thu thập được).
  function getVisitorSessionId(){
    let id = sessionStorage.getItem('tammi_visitor_session_id');
    if(!id){
      id = 'vs-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
      sessionStorage.setItem('tammi_visitor_session_id', id);
    }
    return id;
  }

  // TODO (Dev): ở môi trường thật, thay hàm này bằng lời gọi API "network enabler" nội bộ Viettel để đọc
  // SĐT do hạ tầng mạng chèn sẵn vào header HTTP khi khách đang dùng DATA DI ĐỘNG của Viettel (không hoạt
  // động qua Wifi/mạng khác). Trình duyệt không có quyền đọc tầng mạng nên bản demo luôn trả về null.
  function detectCarrierPhoneSilently(){
    return null;
  }

  // Nguồn SĐT đáng tin cậy nhất hiện có, đúng thứ tự ưu tiên trong tài liệu thiết kế: (1) khách đã tự
  // đăng nhập ở trang này, (2) nhận diện ngầm qua mạng viễn thông.
  function bestKnownCustomerPhone(){
    if(window.currentCustomerPhone) return { sdt: window.currentCustomerPhone, nguon: 'khach-da-dang-nhap' };
    const carrier = detectCarrierPhoneSilently();
    if(carrier) return { sdt: carrier, nguon: 'ngam' };
    return null;
  }

  function maskPhone(sdt){
    if(!sdt) return '';
    const s = String(sdt);
    return s.length >= 6 ? s.slice(0, 3) + '***' + s.slice(-3) : s;
  }

  // Tìm/khởi tạo bản ghi visitor cho đúng người giới thiệu hiện tại — gộp theo SĐT nếu đã biết, nếu
  // chưa biết thì gộp theo visitorId (phiên trình duyệt) để không đếm trùng khi khách xem nhiều gói/nhiều lần.
  function findOrCreateVisitorEntry(referrer){
    const list = loadVisitorLog();
    const sessionId = getVisitorSessionId();
    const known = bestKnownCustomerPhone();

    let entry = null;
    if(known && known.sdt){
      entry = list.find(v => v.sdt === known.sdt && v.nguoiGioiThieuCode === referrer.code);
    }
    if(!entry){
      entry = list.find(v => v.visitorId === sessionId && v.nguoiGioiThieuCode === referrer.code);
    }
    if(!entry){
      entry = {
        visitorId: sessionId,
        sdt: null,
        nguoiGioiThieuCode: referrer.code,
        loaiNguoiGioiThieu: referrer.type,
        lanDauISO: new Date().toISOString(),
        lanCuoiISO: new Date().toISOString(),
        soLanGhe: 0,
        dichVuDaXem: [],
        nguonThuThapSdt: 'chua-co',
        loaiTru: false,
        trangThaiXuLy: 'chua-lien-he',
      };
      list.push(entry);
    }
    return { list, entry };
  }

  // Gán SĐT (đã biết hoặc mới thu thập) vào 1 bản ghi visitor + áp dụng ngay bước loại trừ NVKD/CTV.
  function applyPhoneToEntry(entry, sdt, nguon){
    entry.sdt = sdt;
    entry.nguonThuThapSdt = nguon;
    entry.loaiTru = excludedPhoneSet().has(sdt);
  }

  // Ghi nhận 1 lượt truy cập qua link phân kênh — gọi từ initReferralFromUrl() mỗi khi tải trang có ?NV=...
  function recordVisit(referrer){
    const { list, entry } = findOrCreateVisitorEntry(referrer);
    entry.soLanGhe += 1;
    entry.lanCuoiISO = new Date().toISOString();
    if(!entry.sdt){
      const known = bestKnownCustomerPhone();
      if(known && known.sdt) applyPhoneToEntry(entry, known.sdt, known.nguon);
    }
    saveVisitorLog(list);
  }

  // Ghi nhận 1 lượt xem "Chi tiết gói cước" — dùng để tính ngưỡng hiện form nhẹ xin SĐT (bước 2 của cơ
  // chế thu thập "progressive"). Chỉ có ý nghĩa khi khách đang vào qua link giới thiệu (activeReferral).
  function trackVisitorPackageView(pkg){
    const referrer = window.activeReferral;
    if(!referrer) return;
    const { list, entry } = findOrCreateVisitorEntry(referrer);
    if(pkg && pkg.ma && !entry.dichVuDaXem.includes(pkg.ma)) entry.dichVuDaXem.push(pkg.ma);
    saveVisitorLog(list);

    const sessionId = getVisitorSessionId();
    visitorPackageViewCount[sessionId] = (visitorPackageViewCount[sessionId] || 0) + 1;

    // Đã có SĐT (đăng nhập/nhận diện ngầm), hoặc khách đã từng bấm đóng banner trước đó -> không hỏi lại.
    if(entry.sdt || entry.nguonThuThapSdt === 'tu-choi') return;
    if(visitorPackageViewCount[sessionId] >= VISITOR_ENGAGEMENT_THRESHOLD){
      showVisitorPhonePrompt(referrer);
    }
  }

  // Hiện banner nhẹ xin SĐT — neo phía trên Huy hiệu tin cậy, KHÔNG chặn bất kỳ thao tác nào của khách.
  function showVisitorPhonePrompt(referrer){
    const box = document.getElementById('visitor-phone-prompt');
    if(!box || box.classList.contains('show')) return;
    document.getElementById('visitor-phone-prompt-text').textContent =
      `Bạn có muốn ${referrer.hoTen} liên hệ tư vấn thêm không? Để lại số điện thoại để được gọi lại nhanh hơn (không bắt buộc).`;
    box.classList.add('show');
  }
  function hideVisitorPhonePrompt(){
    document.getElementById('visitor-phone-prompt')?.classList.remove('show');
  }
  document.getElementById('visitor-phone-prompt-close')?.addEventListener('click', () => {
    // Khách chủ động từ chối — đánh dấu lại để không hỏi thêm lần nào nữa trong phiên này.
    const referrer = window.activeReferral;
    if(referrer){
      const { list, entry } = findOrCreateVisitorEntry(referrer);
      entry.nguonThuThapSdt = 'tu-choi';
      saveVisitorLog(list);
    }
    hideVisitorPhonePrompt();
  });
  document.getElementById('visitor-phone-prompt-submit')?.addEventListener('click', () => {
    const referrer = window.activeReferral;
    if(!referrer) return;
    const input = document.getElementById('visitor-phone-prompt-input');
    const sdt = (input.value || '').replace(/\s+/g, '');
    if(!PHONE_REGEX.test(sdt)){
      input.style.borderColor = 'var(--viettel-red)';
      return;
    }
    input.style.borderColor = '';
    const { list, entry } = findOrCreateVisitorEntry(referrer);
    applyPhoneToEntry(entry, sdt, 'chu-dong');
    saveVisitorLog(list);
    input.value = '';
    hideVisitorPhonePrompt();
  });

  // ---------- Đối chiếu & phân loại ----------
  // Tra 1 SĐT có từng xuất hiện trong đơn hàng hay không — tái dùng đúng collectAllOrdersForRange() đã có
  // sẵn cho dashboard (gộp cả NVKD + mọi CTV, 12 tháng gần nhất) thay vì viết lại logic sinh dữ liệu đơn hàng.
  function phoneHasOrderHistory(sdt){
    if(!sdt) return false;
    return collectAllOrdersForRange('12-thang').some(o => o.sdtKhachHang === sdt);
  }

  function classifyVisitor(entry){
    if(entry.loaiTru) return 'loai-tru';
    if(!entry.sdt) return 'chua-xac-dinh';
    if(phoneHasOrderHistory(entry.sdt)) return 'khach-hang-hien-huu';
    if(entry.soLanGhe >= 2) return 'tiem-nang-cao';
    return 'tiem-nang-moi';
  }

  const LEAD_META = {
    'tiem-nang-cao':       { label:'Tiềm năng cao',       cls:'lead-badge-cao',
      khuyenNghi: e => `Đã xem ${e.soLanGhe} lần, chưa đăng ký — nên gọi/Zalo tư vấn trong 24h.` },
    'tiem-nang-moi':       { label:'Tiềm năng mới',       cls:'lead-badge-moi',
      khuyenNghi: () => `Khách mới ghé lần đầu — nên liên hệ trong 3 ngày.` },
    'khach-hang-hien-huu': { label:'Khách hàng hiện hữu', cls:'lead-badge-hienhuu',
      khuyenNghi: () => `Đã là khách hàng — có thể chăm sóc/gia hạn/giới thiệu gói mới.` },
    'chua-xac-dinh':       { label:'Chưa xác định SĐT',   cls:'lead-badge-unknown',
      khuyenNghi: () => `Chưa thu thập được số liên hệ.` },
    'loai-tru':            { label:'Loại trừ (nội bộ)',   cls:'lead-badge-tru',
      khuyenNghi: () => `Số điện thoại nội bộ (NVKD/CTV) — không tính là khách hàng.` },
  };
  function leadBadgeHtml(kind){
    const meta = LEAD_META[kind];
    return `<span class="lead-badge ${meta.cls}">${escapeHtml(meta.label)}</span>`;
  }

  // Hiện ghi chú MỚI NHẤT của NVKD/CTV về khách này, kèm gợi ý số lượng ghi chú lịch sử còn lại (hover
  // vào để xem đầy đủ qua thuộc tính title) — để lần ghé/log tiếp theo vẫn nắm được bối cảnh đã trao đổi.
  function ghiChuCellHtml(entry){
    const notes = entry.ghiChu || [];
    if(!notes.length) return '<span style="color:var(--text-muted);">—</span>';
    const sorted = [...notes].sort((a, b) => new Date(a.ngay) - new Date(b.ngay));
    const latest = sorted[sorted.length - 1];
    const historyTitle = sorted.map(n => `${formatVNDate(n.ngay)} - ${n.tacGia}: ${n.noiDung}`).join('\n');
    const moreTag = sorted.length > 1
      ? ` <span style="color:var(--text-muted);font-size:10.5px;white-space:nowrap;">(+${sorted.length - 1} lịch sử)</span>`
      : '';
    return `<span title="${escapeHtml(historyTitle)}"><b>${escapeHtml(latest.tacGia)}:</b> ${escapeHtml(latest.noiDung)}</span>${moreTag}`;
  }

  // ---------- Hành động nhanh (Gọi / Zalo / Đánh dấu đã liên hệ / Bỏ qua) ----------
  function updateLeadStatus(visitorId, nguoiGioiThieuCode, trangThai){
    const list = loadVisitorLog();
    const entry = list.find(v => v.visitorId === visitorId && v.nguoiGioiThieuCode === nguoiGioiThieuCode);
    if(entry){
      entry.trangThaiXuLy = trangThai;
      saveVisitorLog(list);
    }
  }

  // Dựng 1 dòng <tr> cho bảng lead — dùng chung cho cả 2 tab NVKD/CTV. showSource=true (bản NVKD): hiện
  // thêm cột "Nguồn giới thiệu" để phân biệt lead của chính mình hay của CTV nào. Số bị "loại trừ" ẩn hẳn
  // khỏi bảng (không chỉ gắn badge) đúng theo yêu cầu ban đầu.
  function leadRowHtml(entry, showSource){
    if(!entry.sdt) return '';
    const kind = classifyVisitor(entry);
    if(kind === 'loai-tru') return '';
    const meta = LEAD_META[kind];
    const actionable = kind !== 'chua-xac-dinh';
    const sourceLabel = entry.loaiNguoiGioiThieu === 'staff'
      ? `${STAFF_DEMO.hoTen} (NVKD)`
      : (ctvList.find(c => c.sdt === entry.nguoiGioiThieuCode)?.hoTen || 'CTV') + ' (CTV)';
    const phoneCell = entry.sdt ? maskPhone(entry.sdt) : '<i style="color:var(--text-muted);">Ẩn danh</i>';
    const svcCell = entry.dichVuDaXem.length
      ? entry.dichVuDaXem.map(escapeHtml).join(', ')
      : '<span style="color:var(--text-muted);">—</span>';
    const doneNote = entry.trangThaiXuLy === 'da-lien-he'
      ? '<div style="font-size:11px;color:#1E7A45;margin-top:3px;">✔ Đã liên hệ</div>'
      : entry.trangThaiXuLy === 'bo-qua'
        ? '<div style="font-size:11px;color:var(--text-muted);margin-top:3px;">Đã bỏ qua</div>'
        : '';
    return `
      <tr data-lead-visitor="${escapeHtml(entry.visitorId)}" data-lead-code="${escapeHtml(entry.nguoiGioiThieuCode)}">
        <td>${phoneCell}</td>
        ${showSource ? `<td>${escapeHtml(sourceLabel)}</td>` : ''}
        <td>${formatVNDate(entry.lanCuoiISO.slice(0,10))}</td>
        <td>${entry.soLanGhe}</td>
        <td>${svcCell}</td>
        <td>${leadBadgeHtml(kind)}${doneNote}</td>
        <td style="font-size:12.5px;max-width:240px;">${ghiChuCellHtml(entry)}</td>
        <td>
          <div class="lead-actions">
            ${actionable ? `<button class="lead-btn-call" data-lead-call="${escapeHtml(entry.sdt)}">📞 Gọi</button>` : ''}
            ${actionable ? `<button class="lead-btn-zalo" data-lead-zalo="${escapeHtml(entry.sdt)}">💬 Zalo</button>` : ''}
            ${actionable && entry.trangThaiXuLy !== 'da-lien-he' ? `<button data-lead-done>✔ Đã liên hệ</button>` : ''}
            ${actionable && entry.trangThaiXuLy !== 'bo-qua' ? `<button data-lead-skip>Bỏ qua</button>` : ''}
          </div>
        </td>
      </tr>`;
  }

  function bindLeadRowActions(container, onChange){
    container.querySelectorAll('[data-lead-call]').forEach(btn => {
      btn.addEventListener('click', () => { location.href = 'tel:' + btn.dataset.leadCall; });
    });
    container.querySelectorAll('[data-lead-zalo]').forEach(btn => {
      btn.addEventListener('click', () => { window.open(zaloChatLink(btn.dataset.leadZalo), '_blank'); });
    });
    container.querySelectorAll('[data-lead-done]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tr = btn.closest('tr');
        updateLeadStatus(tr.dataset.leadVisitor, tr.dataset.leadCode, 'da-lien-he');
        onChange();
      });
    });
    container.querySelectorAll('[data-lead-skip]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tr = btn.closest('tr');
        updateLeadStatus(tr.dataset.leadVisitor, tr.dataset.leadCode, 'bo-qua');
        onChange();
      });
    });
  }

  // ---------- Render tab NVKD: xem TẤT CẢ lead (chính mình + mọi CTV trực thuộc) ----------
  function renderStaffLeads(){
    const tbody = document.getElementById('staff-leads-table-body');
    const emptyNote = document.getElementById('staff-leads-empty');
    if(!tbody) return;
    const list = loadVisitorLog();
    const rows = list
      .filter(e => e.nguoiGioiThieuCode === staffChannelNvCode() || ctvList.some(c => c.sdt === e.nguoiGioiThieuCode))
      .sort((a, b) => new Date(b.lanCuoiISO) - new Date(a.lanCuoiISO))
      .map(e => leadRowHtml(e, true))
      .join('');
    tbody.innerHTML = rows;
    if(emptyNote) emptyNote.style.display = rows ? 'none' : 'block';
    bindLeadRowActions(tbody, renderStaffLeads);
  }

  // ---------- Render tab CTV: CHỈ xem lead phát sinh từ đúng link của chính CTV này ----------
  function renderCtvLeads(){
    const tbody = document.getElementById('ctv-leads-table-body');
    const emptyNote = document.getElementById('ctv-leads-empty');
    if(!tbody || !loggedInCtv) return;
    const list = loadVisitorLog();
    const rows = list
      .filter(e => e.nguoiGioiThieuCode === loggedInCtv.sdt)
      .sort((a, b) => new Date(b.lanCuoiISO) - new Date(a.lanCuoiISO))
      .map(e => leadRowHtml(e, false))
      .join('');
    tbody.innerHTML = rows;
    if(emptyNote) emptyNote.style.display = rows ? 'none' : 'block';
    bindLeadRowActions(tbody, renderCtvLeads);
  }

  // Làm mới bảng lead mỗi khi bấm đúng tab tương ứng (dữ liệu có thể vừa đổi do NVKD/CTV tự xem trước
  // link của mình ở tab khác) — cộng thêm vào đúng handler chuyển tab sẵn có, không thay thế.
  document.querySelector('#staff-main-tabs [data-staff-tab="leads"]')?.addEventListener('click', renderStaffLeads);
  document.querySelector('#ctv-dashboard [data-tab="ctv-tab-leads"]')?.addEventListener('click', renderCtvLeads);

  // Gieo sẵn dữ liệu lead minh hoạ (chỉ khi Visitor Log còn trống — vd. lần đầu mở demo trên trình
  // duyệt này) để tab "Khách hàng tiềm năng" có dữ liệu xem thử ngay cho CẢ NVKD lẫn từng CTV (đặc biệt
  // CTV Hoàng Tuấn Kiệt), không cần đợi có khách thật truy cập qua link. Bộ dữ liệu này khớp 1-1 với
  // sheet "VisitorLog" trong Google Sheet DucLQ_Data_LPK (45 lượt ghé, gộp còn 43 khách sau khi hợp
  // nhất 2 cặp khách quay lại), kèm lịch sử ghi chú (mảng `ghiChu`) để lần ghé/log tiếp theo vẫn hiển
  // thị lại được các ghi chú trước đó — đúng yêu cầu "nắm được bối cảnh của khách hàng".
  function seedDemoVisitorLogIfEmpty(){
    if(loadVisitorLog().length > 0) return;
    const iso = d => d + 'T00:00:00.000Z';
    const ctvKiet = ctvList.find(c => c.sdt === '0989858785') || { sdt:'0989858785', hoTen:'Hoàng Tuấn Kiệt' };
    const ctvLanHuong = ctvList.find(c => c.sdt === '0912000111') || { sdt:'0912000111', hoTen:'Trần Thị Lan Hương' };
    const ctvHoangNam = ctvList.find(c => c.sdt === '0987000222') || { sdt:'0987000222', hoTen:'Lê Hoàng Nam' };
    const ctvNgocThao = ctvList.find(c => c.sdt === '0977000333') || { sdt:'0977000333', hoTen:'Phạm Ngọc Thảo' };
    const nvCode = staffChannelNvCode();
    const gc = (ngay, tacGia, noiDung) => ({ ngay, tacGia, noiDung });

    const entries = [
      // ----- Gốc (vl-0001 .. vl-0010) -----
      { visitorId:'vl-0001', sdt:'0938201122', nguoiGioiThieuCode:nvCode, loaiNguoiGioiThieu:'staff',
        lanDauISO:iso('2026-07-18'), lanCuoiISO:iso('2026-07-22'), soLanGhe:3,
        dichVuDaXem:['FTTH (Internet cáp quang)','Combo Internet + Truyền hình'],
        nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'chua-lien-he',
        ghiChu:[ gc('2026-07-22','NVKD - Lê Văn Linh','Đã nhắn Zalo giới thiệu gói FTTH, khách hẹn xem lại cuối tuần.') ] },
      { visitorId:'vl-0002', sdt:'0912000111', nguoiGioiThieuCode:ctvLanHuong.sdt, loaiNguoiGioiThieu:'ctv',
        lanDauISO:iso('2026-07-20'), lanCuoiISO:iso('2026-07-20'), soLanGhe:1,
        dichVuDaXem:['Mua gói Data'], nguonThuThapSdt:'chu-dong', loaiTru:true, trangThaiXuLy:'bo-qua',
        ghiChu:[ gc('2026-07-20','CTV - Trần Thị Lan Hương','Tự kiểm tra link cá nhân trước khi gửi khách.') ] },
      { visitorId:'vl-0003', sdt:'0977445566', nguoiGioiThieuCode:nvCode, loaiNguoiGioiThieu:'staff',
        lanDauISO:iso('2026-07-15'), lanCuoiISO:iso('2026-07-21'), soLanGhe:4,
        dichVuDaXem:['Mua gói Data','FTTH (Internet cáp quang)'],
        nguonThuThapSdt:'khach-da-dang-nhap', loaiTru:false, trangThaiXuLy:'da-lien-he',
        ghiChu:[ gc('2026-07-21','NVKD - Lê Văn Linh','Khách cũ, đã dùng gói Data - gợi ý nâng cấp FTTH, khách đồng ý cân nhắc.') ],
        _hienHuu:'nvkd' },
      { visitorId:'vl-0004', sdt:null, nguoiGioiThieuCode:nvCode, loaiNguoiGioiThieu:'staff',
        lanDauISO:iso('2026-07-22'), lanCuoiISO:iso('2026-07-22'), soLanGhe:1, dichVuDaXem:['FTTH (Internet cáp quang)'],
        nguonThuThapSdt:'chua-co', loaiTru:false, trangThaiXuLy:'chua-lien-he', ghiChu:[] },
      { visitorId:'vl-0005', sdt:'0955889900', nguoiGioiThieuCode:ctvHoangNam.sdt, loaiNguoiGioiThieu:'ctv',
        lanDauISO:iso('2026-07-19'), lanCuoiISO:iso('2026-07-22'), soLanGhe:2,
        dichVuDaXem:['Combo Internet + Truyền hình','Camera'], nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'chua-lien-he',
        ghiChu:[ gc('2026-07-22','CTV - Lê Hoàng Nam','Đã gọi 2 lần, khách còn phân vân giữa Combo và FTTH.') ] },
      { visitorId:'vl-0006', sdt:'0966009911', nguoiGioiThieuCode:ctvNgocThao.sdt, loaiNguoiGioiThieu:'ctv',
        lanDauISO:iso('2026-07-21'), lanCuoiISO:iso('2026-07-21'), soLanGhe:1, dichVuDaXem:['Mua gói Data'],
        nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'chua-lien-he',
        ghiChu:[ gc('2026-07-21','CTV - Phạm Ngọc Thảo','Mới nhắn hỏi giá, chưa phản hồi thêm.') ] },
      { visitorId:'vl-0007', sdt:'0933112233', nguoiGioiThieuCode:nvCode, loaiNguoiGioiThieu:'staff',
        lanDauISO:iso('2026-07-10'), lanCuoiISO:iso('2026-07-24'), soLanGhe:5,
        dichVuDaXem:['Mua sim/số','FTTH (Internet cáp quang)'],
        nguonThuThapSdt:'khach-da-dang-nhap', loaiTru:false, trangThaiXuLy:'da-lien-he',
        ghiChu:[ gc('2026-07-24','NVKD - Lê Văn Linh','Khách quen, đã mua sim/số và FTTH - chăm sóc định kỳ.') ],
        _hienHuu:'nvkd' },
      { visitorId:'vl-0008', sdt:'0944118822', nguoiGioiThieuCode:ctvKiet.sdt, loaiNguoiGioiThieu:'ctv',
        lanDauISO:iso('2026-07-23'), lanCuoiISO:iso('2026-07-23'), soLanGhe:1, dichVuDaXem:['Camera'],
        nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'chua-lien-he',
        ghiChu:[ gc('2026-07-23','CTV - Hoàng Tuấn Kiệt','Khách hỏi về Camera, đã gửi thêm thông tin giá.') ] },
      { visitorId:'vl-0009', sdt:'0909000123', nguoiGioiThieuCode:nvCode, loaiNguoiGioiThieu:'staff',
        lanDauISO:iso('2026-07-24'), lanCuoiISO:iso('2026-07-24'), soLanGhe:1, dichVuDaXem:['FTTH (Internet cáp quang)'],
        nguonThuThapSdt:'khach-da-dang-nhap', loaiTru:true, trangThaiXuLy:'bo-qua',
        ghiChu:[ gc('2026-07-24','NVKD - Lê Văn Linh','Tự bấm thử link cá nhân để kiểm tra giao diện.') ] },
      { visitorId:'vl-0010', sdt:'0922556677', nguoiGioiThieuCode:nvCode, loaiNguoiGioiThieu:'staff',
        lanDauISO:iso('2026-07-17'), lanCuoiISO:iso('2026-07-23'), soLanGhe:3,
        dichVuDaXem:['Truyền hình','Camera','Combo Internet + Truyền hình'],
        nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'da-lien-he',
        ghiChu:[ gc('2026-07-23','NVKD - Lê Văn Linh','Đã gặp trực tiếp tư vấn, khách hẹn quyết định trong tuần.') ] },

      // ----- 20 lead mới của NVKD (vl-0011 .. vl-0030) -----
      { visitorId:'vl-0011', sdt:'0911223344', nguoiGioiThieuCode:nvCode, loaiNguoiGioiThieu:'staff',
        lanDauISO:iso('2026-07-05'), lanCuoiISO:iso('2026-07-05'), soLanGhe:1, dichVuDaXem:['FTTH (Internet cáp quang)'],
        nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'chua-lien-he',
        ghiChu:[ gc('2026-07-05','NVKD - Lê Văn Linh','Khách mới ghé xem gói FTTH, chưa liên hệ.') ] },
      { visitorId:'vl-0012', sdt:'0922113355', nguoiGioiThieuCode:nvCode, loaiNguoiGioiThieu:'staff',
        lanDauISO:iso('2026-07-06'), lanCuoiISO:iso('2026-07-06'), soLanGhe:1, dichVuDaXem:['Combo Internet + Truyền hình'],
        nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'chua-lien-he',
        ghiChu:[ gc('2026-07-06','NVKD - Lê Văn Linh','Xem combo, chưa để lại phản hồi.') ] },
      { visitorId:'vl-0013', sdt:'0933224466', nguoiGioiThieuCode:nvCode, loaiNguoiGioiThieu:'staff',
        lanDauISO:iso('2026-07-07'), lanCuoiISO:iso('2026-07-07'), soLanGhe:1, dichVuDaXem:['Mua sim/số'],
        nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'chua-lien-he',
        ghiChu:[ gc('2026-07-07','NVKD - Lê Văn Linh','Quan tâm đổi số đẹp, sẽ theo dõi thêm.') ] },
      { visitorId:'vl-0014', sdt:'0944335577', nguoiGioiThieuCode:nvCode, loaiNguoiGioiThieu:'staff',
        lanDauISO:iso('2026-07-08'), lanCuoiISO:iso('2026-07-08'), soLanGhe:1, dichVuDaXem:['Camera'],
        nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'chua-lien-he',
        ghiChu:[ gc('2026-07-08','NVKD - Lê Văn Linh','Xem gói camera an ninh, chưa liên hệ.') ] },
      { visitorId:'vl-0015', sdt:'0955446688', nguoiGioiThieuCode:nvCode, loaiNguoiGioiThieu:'staff',
        lanDauISO:iso('2026-07-09'), lanCuoiISO:iso('2026-07-09'), soLanGhe:1, dichVuDaXem:['Mua gói Data'],
        nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'chua-lien-he',
        ghiChu:[ gc('2026-07-09','NVKD - Lê Văn Linh','Hỏi giá gói Data 5G, chưa phản hồi thêm.') ] },
      { visitorId:'vl-0016', sdt:'0966557799', nguoiGioiThieuCode:nvCode, loaiNguoiGioiThieu:'staff',
        lanDauISO:iso('2026-07-10'), lanCuoiISO:iso('2026-07-10'), soLanGhe:1, dichVuDaXem:['Truyền hình'],
        nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'chua-lien-he',
        ghiChu:[ gc('2026-07-10','NVKD - Lê Văn Linh','Quan tâm gói truyền hình, chưa liên hệ.') ] },
      { visitorId:'vl-0017', sdt:'0977668811', nguoiGioiThieuCode:nvCode, loaiNguoiGioiThieu:'staff',
        lanDauISO:iso('2026-07-11'), lanCuoiISO:iso('2026-07-11'), soLanGhe:1, dichVuDaXem:['FTTH (Internet cáp quang)'],
        nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'chua-lien-he',
        ghiChu:[ gc('2026-07-11','NVKD - Lê Văn Linh','Ghé xem FTTH tốc độ cao, chưa liên hệ.') ] },
      { visitorId:'vl-0018', sdt:'0988779922', nguoiGioiThieuCode:nvCode, loaiNguoiGioiThieu:'staff',
        lanDauISO:iso('2026-07-12'), lanCuoiISO:iso('2026-07-12'), soLanGhe:1, dichVuDaXem:['Đổi eSIM'],
        nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'chua-lien-he',
        ghiChu:[ gc('2026-07-12','NVKD - Lê Văn Linh','Hỏi thủ tục đổi eSIM, chưa liên hệ.') ] },
      { visitorId:'vl-0019', sdt:'0912233445', nguoiGioiThieuCode:nvCode, loaiNguoiGioiThieu:'staff',
        lanDauISO:iso('2026-07-13'), lanCuoiISO:iso('2026-07-13'), soLanGhe:1, dichVuDaXem:['Combo Internet + Truyền hình'],
        nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'chua-lien-he',
        ghiChu:[ gc('2026-07-13','NVKD - Lê Văn Linh','Xem combo giải trí, chưa liên hệ.') ] },
      { visitorId:'vl-0020', sdt:'0923344556', nguoiGioiThieuCode:nvCode, loaiNguoiGioiThieu:'staff',
        lanDauISO:iso('2026-07-14'), lanCuoiISO:iso('2026-07-14'), soLanGhe:1, dichVuDaXem:['Mua sim/số'],
        nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'chua-lien-he',
        ghiChu:[ gc('2026-07-14','NVKD - Lê Văn Linh','Quan tâm sim trả trước, chưa liên hệ.') ] },
      { visitorId:'vl-0021', sdt:'0934455667', nguoiGioiThieuCode:nvCode, loaiNguoiGioiThieu:'staff',
        lanDauISO:iso('2026-07-12'), lanCuoiISO:iso('2026-07-16'), soLanGhe:2,
        dichVuDaXem:['FTTH (Internet cáp quang)','Camera'], nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'chua-lien-he',
        ghiChu:[ gc('2026-07-16','NVKD - Lê Văn Linh','Ghé lại lần 2 xem thêm Camera, cần gọi tư vấn gấp.') ] },
      { visitorId:'vl-0022', sdt:'0945566778', nguoiGioiThieuCode:nvCode, loaiNguoiGioiThieu:'staff',
        lanDauISO:iso('2026-07-10'), lanCuoiISO:iso('2026-07-17'), soLanGhe:2,
        dichVuDaXem:['Combo Internet + Truyền hình'], nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'da-lien-he',
        ghiChu:[ gc('2026-07-17','NVKD - Lê Văn Linh','Đã gọi tư vấn, khách hẹn quyết định cuối tuần.') ] },
      { visitorId:'vl-0023', sdt:'0956677889', nguoiGioiThieuCode:nvCode, loaiNguoiGioiThieu:'staff',
        lanDauISO:iso('2026-07-11'), lanCuoiISO:iso('2026-07-18'), soLanGhe:2,
        dichVuDaXem:['Mua gói Data'], nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'chua-lien-he',
        ghiChu:[ gc('2026-07-18','NVKD - Lê Văn Linh','Ghé xem lần 2, nên chủ động gọi trước 25/07.') ] },
      { visitorId:'vl-0024', sdt:'0967788990', nguoiGioiThieuCode:nvCode, loaiNguoiGioiThieu:'staff',
        lanDauISO:iso('2026-07-13'), lanCuoiISO:iso('2026-07-19'), soLanGhe:2,
        dichVuDaXem:['Truyền hình','FTTH (Internet cáp quang)'], nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'da-lien-he',
        ghiChu:[ gc('2026-07-19','NVKD - Lê Văn Linh','Đã nhắn Zalo, khách đang so sánh giá đối thủ.') ] },
      // vl-0025 + vl-0026 gộp: khách Lâm Thị Kim quay lại lần 2 — minh hoạ trực tiếp yêu cầu
      // "hiển thị lại các ghi chú lịch sử" (2 ghi chú, 2 mốc thời gian, cùng 1 SĐT).
      { visitorId:'vl-0025', sdt:'0978899001', nguoiGioiThieuCode:nvCode, loaiNguoiGioiThieu:'staff',
        lanDauISO:iso('2026-07-15'), lanCuoiISO:iso('2026-07-21'), soLanGhe:2,
        dichVuDaXem:['Mua gói Data','FTTH (Internet cáp quang)'], nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'da-lien-he',
        ghiChu:[
          gc('2026-07-15','NVKD - Lê Văn Linh','Lâm Thị Kim mới ghé xem gói Data, chưa liên hệ.'),
          gc('2026-07-21','NVKD - Lê Văn Linh','Gọi lại lần 2, Lâm Thị Kim đã đồng ý dùng thử FTTH, hẹn lắp đặt tuần sau.'),
        ] },
      { visitorId:'vl-0027', sdt:'0988556677', nguoiGioiThieuCode:nvCode, loaiNguoiGioiThieu:'staff',
        lanDauISO:iso('2026-07-20'), lanCuoiISO:iso('2026-07-22'), soLanGhe:2,
        dichVuDaXem:['Combo Internet + Truyền hình'], nguonThuThapSdt:'khach-da-dang-nhap', loaiTru:false, trangThaiXuLy:'da-lien-he',
        ghiChu:[ gc('2026-07-22','NVKD - Lê Văn Linh','Khách cũ (Lê Văn Cường) - gợi ý nâng cấp combo, khách đồng ý xem xét.') ],
        _hienHuu:'nvkd' },
      { visitorId:'vl-0028', sdt:'0966223344', nguoiGioiThieuCode:nvCode, loaiNguoiGioiThieu:'staff',
        lanDauISO:iso('2026-07-19'), lanCuoiISO:iso('2026-07-23'), soLanGhe:2,
        dichVuDaXem:['Mua sim/số'], nguonThuThapSdt:'khach-da-dang-nhap', loaiTru:false, trangThaiXuLy:'chua-lien-he',
        ghiChu:[ gc('2026-07-23','NVKD - Lê Văn Linh','Khách cũ (Phạm Thị Hoa) quay lại xem thêm sim số đẹp.') ],
        _hienHuu:'nvkd' },
      { visitorId:'vl-0029', sdt:'0987000222', nguoiGioiThieuCode:nvCode, loaiNguoiGioiThieu:'staff',
        lanDauISO:iso('2026-07-24'), lanCuoiISO:iso('2026-07-24'), soLanGhe:1, dichVuDaXem:['FTTH (Internet cáp quang)'],
        nguonThuThapSdt:'khach-da-dang-nhap', loaiTru:true, trangThaiXuLy:'bo-qua',
        ghiChu:[ gc('2026-07-24','NVKD - Lê Văn Linh','Trùng SĐT CTV Lê Hoàng Nam - tự xem trước link, không tính lead.') ] },
      { visitorId:'vl-0030', sdt:null, nguoiGioiThieuCode:nvCode, loaiNguoiGioiThieu:'staff',
        lanDauISO:iso('2026-07-24'), lanCuoiISO:iso('2026-07-24'), soLanGhe:1, dichVuDaXem:['Camera'],
        nguonThuThapSdt:'chua-co', loaiTru:false, trangThaiXuLy:'chua-lien-he', ghiChu:[] },

      // ----- 15 lead mới của CTV Hoàng Tuấn Kiệt (vl-0031 .. vl-0045) -----
      { visitorId:'vl-0031', sdt:'0913344556', nguoiGioiThieuCode:ctvKiet.sdt, loaiNguoiGioiThieu:'ctv',
        lanDauISO:iso('2026-07-05'), lanCuoiISO:iso('2026-07-05'), soLanGhe:1, dichVuDaXem:['Mua gói Data'],
        nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'chua-lien-he',
        ghiChu:[ gc('2026-07-05','CTV - Hoàng Tuấn Kiệt','Khách mới hỏi gói Data, chưa liên hệ.') ] },
      { visitorId:'vl-0032', sdt:'0924455667', nguoiGioiThieuCode:ctvKiet.sdt, loaiNguoiGioiThieu:'ctv',
        lanDauISO:iso('2026-07-06'), lanCuoiISO:iso('2026-07-06'), soLanGhe:1, dichVuDaXem:['FTTH (Internet cáp quang)'],
        nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'chua-lien-he',
        ghiChu:[ gc('2026-07-06','CTV - Hoàng Tuấn Kiệt','Xem FTTH, chưa phản hồi thêm.') ] },
      { visitorId:'vl-0033', sdt:'0935566778', nguoiGioiThieuCode:ctvKiet.sdt, loaiNguoiGioiThieu:'ctv',
        lanDauISO:iso('2026-07-07'), lanCuoiISO:iso('2026-07-07'), soLanGhe:1, dichVuDaXem:['Camera'],
        nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'chua-lien-he',
        ghiChu:[ gc('2026-07-07','CTV - Hoàng Tuấn Kiệt','Hỏi camera an ninh, chưa liên hệ.') ] },
      { visitorId:'vl-0034', sdt:'0946677889', nguoiGioiThieuCode:ctvKiet.sdt, loaiNguoiGioiThieu:'ctv',
        lanDauISO:iso('2026-07-08'), lanCuoiISO:iso('2026-07-08'), soLanGhe:1, dichVuDaXem:['Combo Internet + Truyền hình'],
        nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'chua-lien-he',
        ghiChu:[ gc('2026-07-08','CTV - Hoàng Tuấn Kiệt','Xem combo, chưa liên hệ.') ] },
      { visitorId:'vl-0035', sdt:'0957788990', nguoiGioiThieuCode:ctvKiet.sdt, loaiNguoiGioiThieu:'ctv',
        lanDauISO:iso('2026-07-09'), lanCuoiISO:iso('2026-07-09'), soLanGhe:1, dichVuDaXem:['Mua sim/số'],
        nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'chua-lien-he',
        ghiChu:[ gc('2026-07-09','CTV - Hoàng Tuấn Kiệt','Hỏi sim số đẹp, chưa liên hệ.') ] },
      { visitorId:'vl-0036', sdt:'0968899001', nguoiGioiThieuCode:ctvKiet.sdt, loaiNguoiGioiThieu:'ctv',
        lanDauISO:iso('2026-07-10'), lanCuoiISO:iso('2026-07-10'), soLanGhe:1, dichVuDaXem:['Đổi eSIM'],
        nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'chua-lien-he',
        ghiChu:[ gc('2026-07-10','CTV - Hoàng Tuấn Kiệt','Hỏi thủ tục eSIM, chưa liên hệ.') ] },
      { visitorId:'vl-0037', sdt:'0979900112', nguoiGioiThieuCode:ctvKiet.sdt, loaiNguoiGioiThieu:'ctv',
        lanDauISO:iso('2026-07-11'), lanCuoiISO:iso('2026-07-11'), soLanGhe:1, dichVuDaXem:['Truyền hình'],
        nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'chua-lien-he',
        ghiChu:[ gc('2026-07-11','CTV - Hoàng Tuấn Kiệt','Xem gói truyền hình, chưa liên hệ.') ] },
      { visitorId:'vl-0038', sdt:'0914455226', nguoiGioiThieuCode:ctvKiet.sdt, loaiNguoiGioiThieu:'ctv',
        lanDauISO:iso('2026-07-10'), lanCuoiISO:iso('2026-07-18'), soLanGhe:2,
        dichVuDaXem:['FTTH (Internet cáp quang)','Camera'], nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'da-lien-he',
        ghiChu:[ gc('2026-07-18','CTV - Hoàng Tuấn Kiệt','Đã gọi, khách quan tâm combo FTTH+Camera.') ] },
      { visitorId:'vl-0039', sdt:'0925566337', nguoiGioiThieuCode:ctvKiet.sdt, loaiNguoiGioiThieu:'ctv',
        lanDauISO:iso('2026-07-11'), lanCuoiISO:iso('2026-07-19'), soLanGhe:2,
        dichVuDaXem:['Mua gói Data'], nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'chua-lien-he',
        ghiChu:[ gc('2026-07-19','CTV - Hoàng Tuấn Kiệt','Ghé lần 2, cần chủ động liên hệ sớm.') ] },
      { visitorId:'vl-0040', sdt:'0936677448', nguoiGioiThieuCode:ctvKiet.sdt, loaiNguoiGioiThieu:'ctv',
        lanDauISO:iso('2026-07-12'), lanCuoiISO:iso('2026-07-20'), soLanGhe:2,
        dichVuDaXem:['Combo Internet + Truyền hình'], nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'da-lien-he',
        ghiChu:[ gc('2026-07-20','CTV - Hoàng Tuấn Kiệt','Đã nhắn Zalo, khách hẹn quyết định trong tuần.') ] },
      // vl-0041 + vl-0042 gộp: khách Võ Thị Diễm quay lại lần 2 — minh hoạ thứ hai cho lịch sử ghi chú.
      { visitorId:'vl-0041', sdt:'0947788556', nguoiGioiThieuCode:ctvKiet.sdt, loaiNguoiGioiThieu:'ctv',
        lanDauISO:iso('2026-07-14'), lanCuoiISO:iso('2026-07-22'), soLanGhe:2,
        dichVuDaXem:['Mua gói Data','FTTH (Internet cáp quang)'], nguonThuThapSdt:'chu-dong', loaiTru:false, trangThaiXuLy:'da-lien-he',
        ghiChu:[
          gc('2026-07-14','CTV - Hoàng Tuấn Kiệt','Võ Thị Diễm mới ghé xem gói Data, chưa liên hệ.'),
          gc('2026-07-22','CTV - Hoàng Tuấn Kiệt','Gọi lại, Võ Thị Diễm đang cân nhắc giá, hẹn phản hồi tuần sau.'),
        ] },
      { visitorId:'vl-0043', sdt:'0912334455', nguoiGioiThieuCode:ctvKiet.sdt, loaiNguoiGioiThieu:'ctv',
        lanDauISO:iso('2026-07-21'), lanCuoiISO:iso('2026-07-23'), soLanGhe:2,
        dichVuDaXem:['Truyền hình'], nguonThuThapSdt:'khach-da-dang-nhap', loaiTru:false, trangThaiXuLy:'chua-lien-he',
        ghiChu:[ gc('2026-07-23','CTV - Hoàng Tuấn Kiệt','Khách cũ (Hoàng Văn Đức) ghé xem thêm gói truyền hình.') ],
        _hienHuu:'kiet' },
      { visitorId:'vl-0044', sdt:'0989858785', nguoiGioiThieuCode:ctvKiet.sdt, loaiNguoiGioiThieu:'ctv',
        lanDauISO:iso('2026-07-24'), lanCuoiISO:iso('2026-07-24'), soLanGhe:1, dichVuDaXem:['FTTH (Internet cáp quang)'],
        nguonThuThapSdt:'khach-da-dang-nhap', loaiTru:true, trangThaiXuLy:'bo-qua',
        ghiChu:[ gc('2026-07-24','CTV - Hoàng Tuấn Kiệt','Tự bấm thử link cá nhân, không tính lead.') ] },
      { visitorId:'vl-0045', sdt:null, nguoiGioiThieuCode:ctvKiet.sdt, loaiNguoiGioiThieu:'ctv',
        lanDauISO:iso('2026-07-24'), lanCuoiISO:iso('2026-07-24'), soLanGhe:1, dichVuDaXem:['Camera'],
        nguonThuThapSdt:'chua-co', loaiTru:false, trangThaiXuLy:'chua-lien-he', ghiChu:[] },
    ];

    // Với các lead được thiết kế để minh hoạ phân loại "Khách hàng hiện hữu" (_hienHuu), gán SĐT THẬT
    // lấy từ chính dữ liệu đơn hàng đang chạy (collectAllOrdersForRange) thay vì SĐT tự đặt cố định —
    // để classifyVisitor() (dựa trên phoneHasOrderHistory) luôn nhận diện đúng, không lệ thuộc số liệu
    // đơn hàng ngẫu nhiên theo seed hiện tại. Nếu không tìm đủ SĐT thật (trường hợp hiếm), giữ nguyên
    // SĐT mẫu — lead vẫn hiển thị bình thường, chỉ khác nhãn phân loại.
    try {
      const allOrders = collectAllOrdersForRange('12-thang');
      const nvkdPhones = [...new Set(allOrders.filter(o => !o.sdtCTV).map(o => o.sdtKhachHang))];
      const kietPhones = [...new Set(allOrders.filter(o => o.sdtCTV === ctvKiet.sdt).map(o => o.sdtKhachHang))];
      let nvkdIdx = 0, kietIdx = 0;
      entries.forEach(e => {
        if(e._hienHuu === 'nvkd' && nvkdPhones[nvkdIdx]) e.sdt = nvkdPhones[nvkdIdx++];
        else if(e._hienHuu === 'kiet' && kietPhones[kietIdx]) e.sdt = kietPhones[kietIdx++];
        delete e._hienHuu;
      });
    } catch(e) { /* nếu chưa sẵn sàng dữ liệu đơn hàng, giữ nguyên SĐT mẫu đã gán ở trên */ }

    saveVisitorLog(entries);
  }
  seedDemoVisitorLogIfEmpty();

  // ---------- Tab "Tài liệu Marketing" (NVKD + CTV) ----------
  // Dữ liệu demo mô phỏng đúng cấu trúc sheet "TaiLieuMarketing" trong Google Sheet DucLQ_Data_LPK
  // (do các phòng ban quản lý sản phẩm Di động/Cố định đăng tải, NVKD/CTV chỉ xem + tải về).
  const TAI_LIEU_MARKETING = [
    { ma:'TL001', ten:'Giới thiệu Gói cước Data 5G', dichVu:'Di động', loaiNoiDung:'Tài liệu giới thiệu SP', nenTang:'',
      moTa:'Tài liệu giới thiệu chi tiết gói Data 5G: thông tin gói, giá cước, ưu đãi, FAQ.', dinhDang:'DOC',
      ngayDang:'2026-07-01', phongBan:'Phòng QLSP Di động',
      link:'https://drive.google.com/file/d/1JO8N2zV_MlAl17LFGur_nkxwCXcpfKVA/view?usp=drivesdk' },
    { ma:'TL002', ten:'Giới thiệu Combo Internet + Truyền hình', dichVu:'Cố định', loaiNoiDung:'Tài liệu giới thiệu SP', nenTang:'',
      moTa:'Tài liệu giới thiệu combo FTTH + Truyền hình: thông số, giá cước, kịch bản tư vấn.', dinhDang:'DOC',
      ngayDang:'2026-07-02', phongBan:'Phòng QLSP Cố định',
      link:'https://drive.google.com/file/d/1Z0sOljH02kD5OqkWWA1lWzZZU2IurInA/view?usp=drivesdk' },
    { ma:'TL003', ten:'Content Facebook - Khuyến mãi Data 5G', dichVu:'Di động', loaiNoiDung:'Content MXH', nenTang:'Facebook',
      moTa:'Bài đăng Facebook giới thiệu ưu đãi tặng 1 tháng Data 5G.', dinhDang:'TXT',
      ngayDang:'2026-07-03', phongBan:'Phòng QLSP Di động',
      link:'https://drive.google.com/file/d/1d3kK1vCFYrMmRU3E8EMVIS6IMgaYgE2_/view?usp=drivesdk' },
    { ma:'TL004', ten:'Kịch bản TikTok - Data 5G', dichVu:'Di động', loaiNoiDung:'Content MXH', nenTang:'TikTok',
      moTa:'Kịch bản video ngắn 15-20 giây quảng bá gói Data 5G.', dinhDang:'TXT',
      ngayDang:'2026-07-04', phongBan:'Phòng QLSP Di động',
      link:'https://drive.google.com/file/d/1NsMb456RTr2uwqMweRSVGJjU7Z4j665G/view?usp=drivesdk' },
    { ma:'TL005', ten:'Content Zalo - Ưu đãi Combo FTTH', dichVu:'Cố định', loaiNoiDung:'Content MXH', nenTang:'Zalo',
      moTa:'Bài chia sẻ Zalo giới thiệu ưu đãi lắp đặt miễn phí Combo FTTH.', dinhDang:'TXT',
      ngayDang:'2026-07-05', phongBan:'Phòng QLSP Cố định',
      link:'https://drive.google.com/file/d/17EcyNt2Rnts6m69OAdDmodytVScZ7Jwc/view?usp=drivesdk' },
    { ma:'TL006', ten:'Kịch bản YouTube - Combo FTTH', dichVu:'Cố định', loaiNoiDung:'Content MXH', nenTang:'YouTube',
      moTa:'Kịch bản video 60 giây giới thiệu Combo Internet + Truyền hình.', dinhDang:'TXT',
      ngayDang:'2026-07-06', phongBan:'Phòng QLSP Cố định',
      link:'https://drive.google.com/file/d/1ZUsEi1Xn9IGQnyRSG6QWNPOrPnsr0wxJ/view?usp=drivesdk' },
    { ma:'TL007', ten:'Banner Data 5G 1080x1080', dichVu:'Di động', loaiNoiDung:'Hình ảnh SP', nenTang:'',
      moTa:'Ảnh banner vuông dùng cho Facebook/Zalo/Instagram quảng bá gói Data 5G.', dinhDang:'SVG',
      ngayDang:'2026-07-07', phongBan:'Phòng QLSP Di động',
      link:'https://drive.google.com/file/d/1lIcdDZuLrXWLd-rFpmj-I0N9AeWUiV11/view?usp=drivesdk' },
    { ma:'TL008', ten:'Banner Combo Internet + Truyền hình 1080x1080', dichVu:'Cố định', loaiNoiDung:'Hình ảnh SP', nenTang:'',
      moTa:'Ảnh banner vuông quảng bá Combo Internet + Truyền hình.', dinhDang:'SVG',
      ngayDang:'2026-07-08', phongBan:'Phòng QLSP Cố định',
      link:'https://drive.google.com/file/d/1c9Pw2i-Ln9opELrRCRsGcJD9zJc4oQp0/view?usp=drivesdk' },
  ];

  const DOC_LOAI_META = {
    'Tài liệu giới thiệu SP': { cls:'doc-badge-gioithieu', icon:'📄' },
    'Content MXH':            { cls:'doc-badge-content',   icon:'📱' },
    'Hình ảnh SP':            { cls:'doc-badge-hinhanh',   icon:'🖼️' },
  };

  function docCardHtml(doc){
    const meta = DOC_LOAI_META[doc.loaiNoiDung] || { cls:'doc-badge-dv', icon:'📁' };
    const nenTangBadge = doc.nenTang ? `<span class="doc-badge doc-badge-dv">${escapeHtml(doc.nenTang)}</span>` : '';
    return `
      <div class="doc-card" data-ma="${doc.ma}">
        <div class="doc-card-top">
          <div class="doc-card-icon">${meta.icon}</div>
          <div class="doc-card-title">${escapeHtml(doc.ten)}</div>
        </div>
        <div class="doc-badge-row">
          <span class="doc-badge ${meta.cls}">${escapeHtml(doc.loaiNoiDung)}</span>
          <span class="doc-badge doc-badge-dv">${escapeHtml(doc.dichVu)}</span>
          ${nenTangBadge}
        </div>
        <div class="doc-card-desc">${escapeHtml(doc.moTa)}</div>
        <div class="doc-card-meta">Định dạng: ${escapeHtml(doc.dinhDang)} · Đăng ngày ${formatVNDate ? formatVNDate(doc.ngayDang) : doc.ngayDang} · ${escapeHtml(doc.phongBan)}</div>
        <div class="doc-card-footer" style="display:flex;gap:10px;margin-top:12px;">
          <button class="btn-outline" style="flex:1;padding:8px 0;font-size:13.5px;" onclick="openDocPreview('${doc.ma}')">👁 Xem trước</button>
          <a class="btn-primary" style="flex:1;text-align:center;text-decoration:none;display:flex;align-items:center;justify-content:center;font-size:13.5px;border-radius:8px;" href="${doc.link}" target="_blank" rel="noopener">⭳ Tải về</a>
        </div>
      </div>`;
  }

  // Render lưới tài liệu theo 3 bộ lọc (Dịch vụ + Loại nội dung + Tìm kiếm) — dùng chung cho cả NVKD lẫn CTV
  // vì kho tài liệu là chung, không phân biệt theo người xem.
  function renderDocGrid(gridId, emptyId, filterDichVuId, filterLoaiId, filterSearchId){
    const grid = document.getElementById(gridId);
    const emptyNote = document.getElementById(emptyId);
    if(!grid) return;
    const dichVu = document.getElementById(filterDichVuId)?.value || 'all';
    const loai = document.getElementById(filterLoaiId)?.value || 'all';
    const search = (document.getElementById(filterSearchId)?.value || '').trim().toLowerCase();
    
    const filtered = TAI_LIEU_MARKETING.filter(d => {
      const matchSearch = search === '' || d.ten.toLowerCase().includes(search) || d.moTa.toLowerCase().includes(search);
      return (dichVu === 'all' || d.dichVu === dichVu) && (loai === 'all' || d.loaiNoiDung === loai) && matchSearch;
    });
    grid.innerHTML = filtered.map(docCardHtml).join('');
    if(emptyNote) emptyNote.style.display = filtered.length ? 'none' : 'block';
  }

  function renderStaffDocs(){ renderDocGrid('staff-doc-grid', 'staff-doc-empty', 'staff-doc-filter-dichvu', 'staff-doc-filter-loai', 'staff-doc-search'); }
  function renderCtvDocs(){ renderDocGrid('ctv-doc-grid', 'ctv-doc-empty', 'ctv-doc-filter-dichvu', 'ctv-doc-filter-loai', 'ctv-doc-search'); }

  document.querySelector('#staff-main-tabs [data-staff-tab="tailieu"]')?.addEventListener('click', renderStaffDocs);
  document.querySelector('#ctv-dashboard [data-tab="ctv-tab-tailieu"]')?.addEventListener('click', renderCtvDocs);
  document.getElementById('staff-doc-filter-dichvu')?.addEventListener('change', renderStaffDocs);
  document.getElementById('staff-doc-filter-loai')?.addEventListener('change', renderStaffDocs);
  document.getElementById('staff-doc-search')?.addEventListener('input', renderStaffDocs);
  document.getElementById('ctv-doc-filter-dichvu')?.addEventListener('change', renderCtvDocs);
  document.getElementById('ctv-doc-filter-loai')?.addEventListener('change', renderCtvDocs);
  document.getElementById('ctv-doc-search')?.addEventListener('input', renderCtvDocs);

  // "Phiên giới thiệu" đang hoạt động (đọc được từ URL ?NV=... khi khách hàng bấm link chia sẻ) — null nghĩa
  // là khách vào trang bình thường, không qua giới thiệu. showInternetSummary()/showDataSummary() đọc biến
  // này để quyết định có ghi nhận đơn đăng ký cho NVKD/CTV hay không.
  window.activeReferral = null;
  initReferralFromUrl();

})();
