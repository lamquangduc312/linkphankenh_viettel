
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
    avatar: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnMiIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkYwRjIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZENkRCIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0idXJsKCNiZzIpIi8+CiAgPHBhdGggZD0iTTM4IDE4NSBDMzggMTQwLCA2OCAxMzIsIDEwMCAxMzIgQzEzMiAxMzIsIDE2MiAxNDAsIDE2MiAxODUgWiIgZmlsbD0iI0VFMDAzMyIvPgogIDxwYXRoIGQ9Ik03MiAxMzIgTDk1IDE1MiBMMTAwIDEzNiBMMTA1IDE1MiBMMTI4IDEzMiBaIiBmaWxsPSIjRkZGRkZGIi8+CiAgPHBhdGggZD0iTTk2IDEzOCBMMTAwIDE2MiBMMTA0IDEzOCBaIiBmaWxsPSIjQ0MwMDJEIi8+CiAgPHJlY3QgeD0iOTAiIHk9IjExMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjI0IiBmaWxsPSIjRkZDQzgwIiByeD0iNCIvPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9Ijg4IiByPSIzNSIgZmlsbD0iI0ZGRTBCMiIvPgogIDxwYXRoIGQ9Ik02MiA4MiBDNjAgNDgsIDE0MCA0OCwgMTM4IDgyIEMxMzAgNjAsIDcwIDYwLCA2MiA4MiBaIiBmaWxsPSIjMUExQTFBIi8+CiAgPGNpcmNsZSBjeD0iODUiIGN5PSI4NiIgcj0iMy41IiBmaWxsPSIjMUExQTFBIi8+CiAgPGNpcmNsZSBjeD0iMTE1IiBjeT0iODYiIHI9IjMuNSIgZmlsbD0iIzFBMUExQSIvPgogIDxwYXRoIGQ9Ik04NiAxMDQgUTEwMCAxMTcgMTE0IDEwNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRDg0MzE1IiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4=", // 📷 trong tab "Tài khoản của tôi", chỉ lưu tạm trong bộ nhớ trình duyệt
  };

  // Danh sách kênh phân phối theo từng dịch vụ — dùng chung 1 liên kết/mã QR định danh theo NVKD
  // (xem staffChannelNvCode), chỉ khác nhau ở trang dịch vụ mà nút "Xem trang dịch vụ" điều hướng tới.
  const NVKD_CHANNELS = [
    { key:'internet', label:'Internet / Truyền hình', icon:'🌐', page:'page-internet' },
    { key:'di-dong',  label:'Di động / Sim số',        icon:'📱', page:'page-sim' },
    { key:'data-5g',  label:'Gói cước Data/5G',        icon:'📶', page:'page-data' },
  ];

  // Mã định danh kênh giới thiệu của NVKD, đúng theo cấu trúc nghiệp vụ thật:
  // CNKD (cố định) + mã viết tắt địa bàn (tỉnh/thành) + email nội bộ (không gồm đuôi @...).
  // Không phân biệt theo dịch vụ (khác với CTV) vì đây là mã định danh NHÂN VIÊN, dùng chung cho mọi dịch vụ.
  function staffChannelNvCode(){
    return `CNKD_${STAFF_DEMO.tinhCode}_${STAFF_DEMO.email}`;
  }

  /* ---------- MOCKUP DỮ LIỆU ĐĂNG KÝ MỚI THEO CTV VÀ NVKD ---------- */
  const NOW = new Date();
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

  function collectOrders(personKey, rangeKey, createdDate) {
    const wanted = new Set(monthsForRange(rangeKey).map(monthKey));
    const createdYm = createdDate ? monthKey(createdDate) : null;
    let orders = [];

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
          const val = Math.floor(randomSeeded(h + 1) * 20 + 5) * 100000;
          orders.push({
            id: 'OD-' + h,
            maDonHang: 'OD' + h.toString().padStart(8, '0').slice(-8),
            ngay: mStr,
            ngaySort: d.getTime(),
            giaTri: val,
            trangThai: randomSeeded(h + 2) > 0.7 ? 'Đang thực hiện' : 'Hoàn thành',
            loaiDichVu: randomSeeded(h + 3) > 0.5 ? 'Internet' : 'Di động',
            hoTenKhachHang: 'Khách hàng ' + (h % 1000),
            sdtKhachHang: '09' + String(h % 100000000).padStart(8, '0'),
            tenNVKD: STAFF_DEMO.hoTen,
            tenCTV: personKey.startsWith('ctv:') ? 'Cộng tác viên' : null,
            sdtCTV: personKey.startsWith('ctv:') ? '09...' : null,
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
        thueBaoMoi++;
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

    const VIETTEL_AVATARS = [
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnMSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkYwRjIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkVFMkU2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0idXJsKCNiZzEpIi8+CiAgPHBhdGggZD0iTTUwIDkwIEM0NSAxNDUsIDE1NSAxNDUsIDE1MCA5MCBaIiBmaWxsPSIjMjYzMjM4Ii8+CiAgPHBhdGggZD0iTTQwIDE4NSBDNDAgMTQwLCA3MCAxMzIsIDEwMCAxMzIgQzEzMCAxMzIsIDE2MCAxNDAsIDE2MCAxODUgWiIgZmlsbD0iI0VFMDAzMyIvPgogIDxwYXRoIGQ9Ik04NSAxMzIgTDEwMCAxNTUgTDExNSAxMzIgWiIgZmlsbD0iI0ZGRkZGRiIvPgogIDxwYXRoIGQ9Ik05MiAxMzIgTDEwMCAxNDggTDEwOCAxMzIgWiIgZmlsbD0iI0NDMDAyRCIvPgogIDxyZWN0IHg9IjkwIiB5PSIxMTIiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyNCIgZmlsbD0iI0ZGQ0M4MCIgcng9IjQiLz4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSI4OCIgcj0iMzQiIGZpbGw9IiNGRkUwQjIiLz4KICA8cGF0aCBkPSJNNjMgODUgQzYzIDUwLCAxMzcgNTAsIDEzNyA4NSBDMTI1IDY1LCA3NSA2NSwgNjMgODUgWiIgZmlsbD0iIzI2MzIzOCIvPgogIDxwYXRoIGQ9Ik02NSA4NSBDNjMgMTA1LCA3MiAxMjUsIDcyIDEyNSBDNzIgMTAwLCA3MCA4NSwgNjUgODUgWiIgZmlsbD0iIzI2MzIzOCIvPgogIDxwYXRoIGQ9Ik0xMzUgODUgQzEzNyAxMDUsIDEyOCAxMjUsIDEyOCAxMjUgQzEyOCAxMDAsIDEzMCA4NSwgMTM1IDg1IFoiIGZpbGw9IiMyNjMyMzgiLz4KICA8Y2lyY2xlIGN4PSI4NiIgY3k9Ijg2IiByPSIzLjUiIGZpbGw9IiMyNjMyMzgiLz4KICA8Y2lyY2xlIGN4PSIxMTQiIGN5PSI4NiIgcj0iMy41IiBmaWxsPSIjMjYzMjM4Ii8+CiAgPHBhdGggZD0iTTg3IDEwNCBRMTAwIDExNiAxMTMgMTA0IiBmaWxsPSJub25lIiBzdHJva2U9IiNFNjUxMDAiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPg==",
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnMiIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkYwRjIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZENkRCIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0idXJsKCNiZzIpIi8+CiAgPHBhdGggZD0iTTM4IDE4NSBDMzggMTQwLCA2OCAxMzIsIDEwMCAxMzIgQzEzMiAxMzIsIDE2MiAxNDAsIDE2MiAxODUgWiIgZmlsbD0iI0VFMDAzMyIvPgogIDxwYXRoIGQ9Ik03MiAxMzIgTDk1IDE1MiBMMTAwIDEzNiBMMTA1IDE1MiBMMTI4IDEzMiBaIiBmaWxsPSIjRkZGRkZGIi8+CiAgPHBhdGggZD0iTTk2IDEzOCBMMTAwIDE2MiBMMTA0IDEzOCBaIiBmaWxsPSIjQ0MwMDJEIi8+CiAgPHJlY3QgeD0iOTAiIHk9IjExMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjI0IiBmaWxsPSIjRkZDQzgwIiByeD0iNCIvPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9Ijg4IiByPSIzNSIgZmlsbD0iI0ZGRTBCMiIvPgogIDxwYXRoIGQ9Ik02MiA4MiBDNjAgNDgsIDE0MCA0OCwgMTM4IDgyIEMxMzAgNjAsIDcwIDYwLCA2MiA4MiBaIiBmaWxsPSIjMUExQTFBIi8+CiAgPGNpcmNsZSBjeD0iODUiIGN5PSI4NiIgcj0iMy41IiBmaWxsPSIjMUExQTFBIi8+CiAgPGNpcmNsZSBjeD0iMTE1IiBjeT0iODYiIHI9IjMuNSIgZmlsbD0iIzFBMUExQSIvPgogIDxwYXRoIGQ9Ik04NiAxMDQgUTEwMCAxMTcgMTE0IDEwNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRDg0MzE1IiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4=",
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnMyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkVCRUYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZDQ0QzIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0idXJsKCNiZzMpIi8+CiAgPHBhdGggZD0iTTQ1IDk1IEM0MCAxNTAsIDE2MCAxNTAsIDE1NSA5NSBaIiBmaWxsPSIjNEExNDhDIi8+CiAgPHBhdGggZD0iTTQyIDE4NSBDNDIgMTQwLCA3MiAxMzMsIDEwMCAxMzMgQzEyOCAxMzMsIDE1OCAxNDAsIDE1OCAxODUgWiIgZmlsbD0iI0VFMDAzMyIvPgogIDxwYXRoIGQ9Ik04OCAxMzMgTDEwMCAxNTQgTDExMiAxMzMgWiIgZmlsbD0iI0ZGRkZGRiIvPgogIDxyZWN0IHg9IjkxIiB5PSIxMTQiIHdpZHRoPSIxOCIgaGVpZ2h0PSIyMiIgZmlsbD0iI0ZGRTBCMiIgcng9IjQiLz4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSI4OCIgcj0iMzMiIGZpbGw9IiNGRkUwQjIiLz4KICA8cGF0aCBkPSJNNjQgODIgQzY0IDQ4LCAxMzYgNDgsIDEzNiA4MiBDMTI0IDY0LCA3NiA2NCwgNjQgODIgWiIgZmlsbD0iIzRBMTQ4QyIvPgogIDxjaXJjbGUgY3g9Ijg2IiBjeT0iODYiIHI9IjMuNSIgZmlsbD0iIzIxMjEyMSIvPgogIDxjaXJjbGUgY3g9IjExNCIgY3k9Ijg2IiByPSIzLjUiIGZpbGw9IiMyMTIxMjEiLz4KICA8cGF0aCBkPSJNODcgMTAzIFExMDAgMTE1IDExMyAxMDMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0U2NTEwMCIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+",
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnNCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkYwRjIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZENkRCIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0idXJsKCNiZzQpIi8+CiAgPHBhdGggZD0iTTM4IDE4NSBDMzggMTQwLCA2OCAxMzIsIDEwMCAxMzIgQzEzMiAxMzIsIDE2MiAxNDAsIDE2MiAxODUgWiIgZmlsbD0iI0VFMDAzMyIvPgogIDxwYXRoIGQ9Ik04NSAxMzIgTDEwMCAxNTUgTDExNSAxMzIgWiIgZmlsbD0iI0ZGRkZGRiIvPgogIDxwYXRoIGQ9Ik05NiAxNDAgTDEwNCAxNDAgTDEwMiAxNjggTDk4IDE2OCBaIiBmaWxsPSIjQ0MwMDJEIi8+CiAgPHJlY3QgeD0iOTAiIHk9IjExMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjI0IiBmaWxsPSIjRkZDQzgwIiByeD0iNCIvPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9Ijg4IiByPSIzNSIgZmlsbD0iI0ZGRTBCMiIvPgogIDxwYXRoIGQ9Ik02MiA4MiBDNjAgNDgsIDE0MCA0OCwgMTM4IDgyIEMxMzAgNjAsIDcwIDYwLCA2MiA4MiBaIiBmaWxsPSIjMDA0RDQwIi8+CiAgPGNpcmNsZSBjeD0iODQiIGN5PSI4NiIgcj0iMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzI2MzIzOCIgc3Ryb2tlLXdpZHRoPSIzIi8+CiAgPGNpcmNsZSBjeD0iMTE2IiBjeT0iODYiIHI9IjEwIiBmaWxsPSJub25lIiBzdHJva2U9IiMyNjMyMzgiIHN0cm9rZS13aWR0aD0iMyIvPgogIDxsaW5lIHgxPSI5NCIgeTE9Ijg2IiB4Mj0iMTA2IiB5Mj0iODYiIHN0cm9rZT0iIzI2MzIzOCIgc3Ryb2tlLXdpZHRoPSIzIi8+CiAgPHBhdGggZD0iTTg3IDEwNSBRMTAwIDExNyAxMTMgMTA1IiBmaWxsPSJub25lIiBzdHJva2U9IiNFNjUxMDAiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPg==",
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnNSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkYwRjIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZDQ0QzIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0idXJsKCNiZzUpIi8+CiAgPHBhdGggZD0iTTEzMCA4NSBDMTYwIDgwLCAxNjUgMTIwLCAxNDAgMTQwIEMxNDUgMTE1LCAxNDAgOTUsIDEzMCA4NSBaIiBmaWxsPSIjM0UyNzIzIi8+CiAgPHBhdGggZD0iTTQyIDE4NSBDNDIgMTQwLCA3MiAxMzMsIDEwMCAxMzMgQzEyOCAxMzMsIDE1OCAxNDAsIDE1OCAxODUgWiIgZmlsbD0iI0VFMDAzMyIvPgogIDxwYXRoIGQ9Ik04OCAxMzMgTDEwMCAxNTQgTDExMiAxMzMgWiIgZmlsbD0iI0ZGRkZGRiIvPgogIDxyZWN0IHg9IjkxIiB5PSIxMTQiIHdpZHRoPSIxOCIgaGVpZ2h0PSIyMiIgZmlsbD0iI0ZGRTBCMiIgcng9IjQiLz4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSI4OCIgcj0iMzMiIGZpbGw9IiNGRkUwQjIiLz4KICA8cGF0aCBkPSJNNjQgODIgQzY0IDQ4LCAxMzYgNDgsIDEzNiA4MiBDMTI0IDY0LCA3NiA2NCwgNjQgODIgWiIgZmlsbD0iIzNFMjcyMyIvPgogIDxjaXJjbGUgY3g9Ijg2IiBjeT0iODYiIHI9IjMuNSIgZmlsbD0iIzIxMjEyMSIvPgogIDxjaXJjbGUgY3g9IjExNCIgY3k9Ijg2IiByPSIzLjUiIGZpbGw9IiMyMTIxMjEiLz4KICA8cGF0aCBkPSJNODcgMTAzIFExMDAgMTE1IDExMyAxMDMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0U2NTEwMCIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+",
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnNiIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkYwRjIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZENkRCIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0idXJsKCNiZzYpIi8+CiAgPHBhdGggZD0iTTM4IDE4NSBDMzggMTQwLCA2OCAxMzIsIDEwMCAxMzIgQzEzMiAxMzIsIDE2MiAxNDAsIDE2MiAxODUgWiIgZmlsbD0iI0VFMDAzMyIvPgogIDxwYXRoIGQ9Ik03MiAxMzIgTDk1IDE1MiBMMTAwIDEzNiBMMTA1IDE1MiBMMTI4IDEzMiBaIiBmaWxsPSIjRkZGRkZGIi8+CiAgPHBhdGggZD0iTTk2IDEzOCBMMTAwIDE2MiBMMTA0IDEzOCBaIiBmaWxsPSIjQ0MwMDJEIi8+CiAgPHJlY3QgeD0iOTAiIHk9IjExMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjI0IiBmaWxsPSIjRkZDQzgwIiByeD0iNCIvPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9Ijg4IiByPSIzNSIgZmlsbD0iI0ZGRTBCMiIvPgogIDxwYXRoIGQ9Ik02MiA4MiBDNjAgNDgsIDE0MCA0OCwgMTM4IDgyIEMxMzAgNjAsIDcwIDYwLCA2MiA4MiBaIiBmaWxsPSIjMjEyMTIxIi8+CiAgPGNpcmNsZSBjeD0iODUiIGN5PSI4NiIgcj0iMy41IiBmaWxsPSIjMjEyMTIxIi8+CiAgPGNpcmNsZSBjeD0iMTE1IiBjeT0iODYiIHI9IjMuNSIgZmlsbD0iIzIxMjEyMSIvPgogIDxwYXRoIGQ9Ik04NiAxMDQgUTEwMCAxMTcgMTE0IDEwNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRDg0MzE1IiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4="
  ];

  let ctvList = [
    { id:'ctv-001', hoTen:'Trần Thị Lan Hương', sdt:'0912000111', ngayTaoISO:'2024-05-12', avatar: VIETTEL_AVATARS[0], trangThai:'active' },
    { id:'ctv-002', hoTen:'Lê Hoàng Nam',       sdt:'0987000222', ngayTaoISO:'2024-08-02', avatar: VIETTEL_AVATARS[1], trangThai:'active' },
    { id:'ctv-003', hoTen:'Phạm Ngọc Thảo',     sdt:'0977000333', ngayTaoISO:'2025-01-20', avatar: VIETTEL_AVATARS[2], trangThai:'active' },
    { id:'ctv-004', hoTen:'Đinh Văn Khóa',      sdt:'0988000444', ngayTaoISO:'2024-11-11', avatar: VIETTEL_AVATARS[3], trangThai:'locked' },
    { id:'ctv-005', hoTen:'Hoàng Tuấn Kiệt',    sdt:'0989858785', ngayTaoISO:'2025-05-05', avatar: VIETTEL_AVATARS[4], trangThai:'active' },
  ];

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

  /* ---------- Biểu đồ cột ngang: kết quả bán theo Loại dịch vụ ---------- */
  function renderServiceTypeChart(containerId, subLabelId, rangeKey){
    document.getElementById(subLabelId).textContent = 'Kỳ: ' + RANGE_LABELS[rangeKey];

    const staffOrders = collectOrders('staff', rangeKey, null);
    let ctvOrders = [];
    ctvList.forEach(c => {
      ctvOrders = ctvOrders.concat(collectOrders('ctv:' + c.id, rangeKey, new Date(c.ngayTaoISO)));
    });

    const types = {};
    staffOrders.forEach(o => {
      if(!types[o.loaiDichVu]) types[o.loaiDichVu] = { name: o.loaiDichVu, staff: 0, ctv: 0, total: 0 };
      types[o.loaiDichVu].staff++;
      types[o.loaiDichVu].total++;
    });
    ctvOrders.forEach(o => {
      if(!types[o.loaiDichVu]) types[o.loaiDichVu] = { name: o.loaiDichVu, staff: 0, ctv: 0, total: 0 };
      types[o.loaiDichVu].ctv++;
      types[o.loaiDichVu].total++;
    });

    const rows = Object.values(types).sort((a,b) => b.total - a.total);
    const maxVal = Math.max(1, ...rows.map(r => r.total));
    const container = document.getElementById(containerId);

    if(rows.length === 0){
      container.innerHTML = '<div style="color:var(--text-muted);font-size:13px;padding:20px 0;">Không có dữ liệu đơn hàng trong kỳ này.</div>';
      return;
    }

    container.innerHTML = `<div class="chart-legend" style="margin-bottom:12px;">
      <div class="chart-legend-item"><span class="chart-legend-swatch" style="background:#EE0033;"></span>Bạn (NVKD)</div>
      <div class="chart-legend-item"><span class="chart-legend-swatch" style="background:#2a78d6;"></span>Cộng tác viên</div>
    </div>` + rows.map((r, i) => `
      <div class="hbar-row" data-hbar-idx="${i}" style="margin-bottom: 12px;">
        <div class="hbar-label" title="${escapeHtml(r.name)}">${escapeHtml(r.name)}</div>
        <div class="hbar-track" style="display:flex; padding: 0;">
          <div class="hbar-fill" style="width:${r.staff / maxVal * 100}%; background:#EE0033; border-radius: 4px 0 0 4px; border-right: ${r.staff && r.ctv ? '1px solid #fff' : 'none'};"></div>
          <div class="hbar-fill" style="width:${r.ctv / maxVal * 100}%; background:#2a78d6; border-radius: ${r.staff ? '0 4px 4px 0' : '4px'};"></div>
        </div>
        <div class="hbar-value">${r.total} đơn</div>
      </div>
    `).join('') + `<div class="chart-tooltip" id="${containerId}-tooltip"></div>`;

    const tooltip = document.getElementById(containerId + '-tooltip');
    container.querySelectorAll('.hbar-row').forEach((row, i) => {
      const r = rows[i];
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
    return { type:'ctv', hoTen: ctv.hoTen, sdt: ctv.sdt, avatar: ctv.avatar, code: ctv.sdt, ctvId: ctv.id, personKey: 'ctv:' + ctv.id };
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
    const avatarUrl = referrer.avatar || (referrer.type === 'staff' ? 'avatar.png' : 'avatar_collab_1.png');
    const avatarInner = `<img src="${avatarUrl}" alt="Ảnh đại diện ${escapeHtml(referrer.hoTen)}">`;
    document.getElementById('ref-badge-avatar').innerHTML = avatarInner;
    document.getElementById('ref-badge-name').textContent = referrer.hoTen;
    document.getElementById('ref-badge-role').innerHTML = referrer.type === 'staff'
      ? `Nhân viên kinh doanh Viettel<br><span style="color:var(--text-muted);font-size:11px;">📍 ${referrer.diaBan}</span>`
      : 'Cộng tác viên Viettel';
    
    document.getElementById('ref-badge-rating').innerHTML = referrer.type === 'staff'
      ? `<div style="display:flex;align-items:center;gap:4px;margin-top:4px;font-size:11px;">
           <span style="color:#F5A623;letter-spacing:1px;">★★★★★</span>
           <span style="color:var(--text-muted);font-weight:normal;">(${STAFF_DEMO.reviews} đánh giá)</span>
         </div>`
      : '';
    const callBtn = document.getElementById('ref-badge-call');
    callBtn.href = 'tel:' + referrer.sdt;
    callBtn.innerHTML = '📞 ' + referrer.sdt;
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
  function openStaffChannelQrZoom(channelKey){
    const ch = NVKD_CHANNELS.find(c => c.key === channelKey);
    if(!ch) return;
    const link = referralLink(staffChannelNvCode());
    document.getElementById('qr-zoom-content').innerHTML = qrSvg(link, { size:220, margin:2 });
    document.getElementById('qr-zoom-title').textContent = ch.label;
    document.getElementById('qr-zoom-link').textContent = link;
    document.getElementById('qr-zoom-overlay').classList.add('show');
  }

  /* ---------- Tab "Tài khoản của tôi": link phân kênh theo dịch vụ + ảnh đại diện NVKD ---------- */
  function renderStaffChannelGrid(){
    const grid = document.getElementById('staff-channel-grid');
    if(!grid) return;
    grid.innerHTML = NVKD_CHANNELS.map(ch => {
      const link = referralLink(staffChannelNvCode()) + '&screen=' + ch.page;
      return `
        <div class="ctv-card">
          <div class="ctv-card-top">
            <div class="ctv-avatar" style="font-size:20px;">${ch.icon}</div>
            <div>
              <div class="ctv-name">${escapeHtml(ch.label)}</div>
              <div class="ctv-meta">Link phân kênh dịch vụ</div>
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
            <button class="btn-outline" data-staff-view-channel="${ch.key}">👁 Xem trang dịch vụ</button>
          </div>
        </div>`;
    }).join('');

    grid.querySelectorAll('[data-staff-qr-open]').forEach(el => {
      el.addEventListener('click', () => openStaffChannelQrZoom(el.dataset.staffQrOpen));
    });
    grid.querySelectorAll('[data-staff-copy-link]').forEach(el => {
      el.addEventListener('click', () => copyText(referralLink(staffChannelNvCode())));
    });
    grid.querySelectorAll('[data-staff-view-channel]').forEach(el => {
      el.addEventListener('click', () => {
        const ch = NVKD_CHANNELS.find(c => c.key === el.dataset.staffViewChannel);
        if(ch) {
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
    
    const previewEl = document.getElementById('ctv-edit-avatar-preview');
    const avatarUrl = c.avatar || 'avatar_collab_1.png';
    previewEl.innerHTML = `<img src="${avatarUrl}">`;

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
        <div class="ctv-avatar" style="width:48px;height:48px;"><img src="${ctv.avatar || 'avatar_collab_1.png'}"></div>
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

  function renderCtvQuickLinks(){
    if(!loggedInCtv) return;
    const grid = document.getElementById('ctv-quick-links-grid');
    if(!grid) return;
    const quickPackages = [
      { id: 'SUN1T', name: 'SUN1T - 150.000đ/tháng', type: 'Internet cáp quang' },
      { id: 'STAR1T', name: 'STAR1T - 210.000đ/tháng', type: 'Internet + Camera' },
      { id: '5G230B', name: '5G230B - 230.000đ/tháng', type: 'Gói cước 5G' },
      { id: 'MXH100', name: 'MXH100 - 100.000đ/tháng', type: 'Gói Data 4G (Free MXH)' }
    ];

    grid.innerHTML = quickPackages.map(pkg => {
      const link = 'https://viettel.vn/vx/gioithieu?NV=' + loggedInCtv.sdt + '&SP=' + pkg.id;
      return `
        <div class="ctv-card">
          <div style="font-weight:700;font-size:15px;color:var(--viettel-red);margin-bottom:4px;">${pkg.name}</div>
          <div style="font-size:12.5px;color:var(--text-muted);margin-bottom:12px;">Loại: ${pkg.type}</div>
          <div class="ctv-qr-wrap" style="max-width:120px;margin:0 auto 14px;cursor:pointer;" data-qr-title="${pkg.name}" data-qr-quick="${link}" title="Xem mã QR phóng to">
            ${qrSvg(link, { size:100 })}
          </div>
          <div class="ctv-link-row">
            <input type="text" readonly value="${link}">
            <button class="btn-outline" data-copy-quick="${link}" style="padding:7px 10px;font-size:14px;" title="Sao chép">📋</button>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('[data-copy-quick]').forEach(el => {
      el.addEventListener('click', () => copyText(el.dataset.copyQuick));
    });
    grid.querySelectorAll('[data-qr-quick]').forEach(el => {
      el.addEventListener('click', () => {
        openCustomQrZoom(el.dataset.qrTitle, el.dataset.qrQuick);
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

  // "Phiên giới thiệu" đang hoạt động (đọc được từ URL ?NV=... khi khách hàng bấm link chia sẻ) — null nghĩa
  // là khách vào trang bình thường, không qua giới thiệu. showInternetSummary()/showDataSummary() đọc biến
  // này để quyết định có ghi nhận đơn đăng ký cho NVKD/CTV hay không.
  window.activeReferral = null;
  initReferralFromUrl();

})();
