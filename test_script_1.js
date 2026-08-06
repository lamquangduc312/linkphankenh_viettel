
/* ======================================================
   DỮ LIỆU: nhúng trực tiếp từ data.json để trang chạy được
   ngay cả khi mở trực tiếp bằng file:// (không cần server).
   ====================================================== */
const DATA = {
  "meta": {
    "nguon": [
      "https://viettel.vn/vx/internet-truyenhinh/",
      "https://viettel.vn/vx/internet-truyenhinh/toan-trinh/",
      "https://viettel.vn/vx/internet-truyenhinh/combo",
      "https://viettel.vn/vx/di-dong/sim-so/",
      "https://viettel.vn/vx/di-dong/goi-data-1/",
      "https://viettel.vn/vx/di-dong/goi-data-1/ (tab Gói roaming)",
      "https://viettel.vn/vx/di-dong/goi-data-1/ (tab Gói cước HOT, Miễn phí MXH, Siêu ưu đãi thoại/data)"
    ],
    "ngayThuThap": "2026-07-02",
    "ghiChu": "Dữ liệu được tổng hợp thủ công từ ảnh chụp màn hình các trang gói cước Viettel do người dùng cung cấp, dùng để dựng trang demo nội bộ."
  },
  "goiInternet": [
    {
      "ma": "NETVT01_T",
      "nhom": "Gói Internet",
      "tocDo": "300 Mbps",
      "moTa": "01 thiết bị Wifi 6 đời mới",
      "khuVuc": "",
      "chuKy": "",
      "gia": 195000,
      "donVi": "đ/tháng"
    },
    {
      "ma": "NETVT2_T",
      "nhom": "Gói Internet",
      "tocDo": "Từ 500 Mbps đến 1Gbps",
      "moTa": "",
      "khuVuc": "Áp dụng tại 32 Tỉnh và ngoại thành HNI, HCM",
      "chuKy": "Đóng theo chu kỳ 1 tháng/6 tháng/13 tháng",
      "gia": 240000,
      "donVi": "đ/tháng"
    },
    {
      "ma": "MESHVT1_T",
      "nhom": "Gói Internet",
      "tocDo": "300 Mbps",
      "moTa": "",
      "khuVuc": "Áp dụng tại 32 Tỉnh và ngoại thành HNI, HCM",
      "chuKy": "",
      "gia": 210000,
      "donVi": "đ/tháng"
    },
    {
      "ma": "MESHVT2_T",
      "nhom": "Gói Internet",
      "tocDo": "Từ 500Mbps đến 1Gbps",
      "moTa": "",
      "khuVuc": "Áp dụng tại 32 Tỉnh và ngoại thành HNI, HCM",
      "chuKy": "Đóng theo chu kỳ 1 tháng/6 tháng/13 tháng",
      "gia": 245000,
      "donVi": "đ/tháng"
    },
    {
      "ma": "MESHVT3_T",
      "nhom": "Mesh Wifi tốc độ cao",
      "tocDo": "Từ 500 Mbps đến 1Gbps",
      "moTa": "",
      "khuVuc": "KH tại 32 Tỉnh và ngoại thành HNI, HCM",
      "chuKy": "Đóng theo chu kỳ 1 tháng/6 tháng/13 tháng",
      "gia": 299000,
      "donVi": "đ/tháng"
    },
    {
      "ma": "MESHVT1_H",
      "nhom": "Mesh Wifi tốc độ cao",
      "tocDo": "300 Mbps",
      "moTa": "",
      "khuVuc": "KH tại Nội thành HNI, HCM",
      "chuKy": "Đóng theo chu kỳ 1 tháng/6 tháng/13 tháng",
      "gia": 255000,
      "donVi": "đ/tháng"
    },
    {
      "ma": "MESHVT2_H",
      "nhom": "Mesh Wifi tốc độ cao",
      "tocDo": "Từ 500 Mbps đến 1Gbps",
      "moTa": "",
      "khuVuc": "KH tại Nội thành HNI, HCM",
      "chuKy": "Đóng theo chu kỳ 1 tháng/6 tháng/13 tháng",
      "gia": 289000,
      "donVi": "đ/tháng"
    },
    {
      "ma": "MESHVT3_H",
      "nhom": "Mesh Wifi tốc độ cao",
      "tocDo": "Từ 500 Mbps đến 1Gbps",
      "moTa": "",
      "khuVuc": "KH tại Nội thành HNI, HCM",
      "chuKy": "Đóng theo chu kỳ 1 tháng/6 tháng/13 tháng",
      "gia": 359000,
      "donVi": "đ/tháng"
    },
    {
      "ma": "NETVT01_H",
      "nhom": "Wifi 6 tốc độ cao",
      "tocDo": "300 Mbps",
      "moTa": "",
      "khuVuc": "KH tại Nội thành HNI, HCM",
      "chuKy": "Đóng theo chu kỳ 1 tháng/6 tháng/13 tháng",
      "gia": 235000,
      "donVi": "đ/tháng"
    },
    {
      "ma": "NETVT2_H",
      "nhom": "Wifi 6 tốc độ cao",
      "tocDo": "Từ 500 Mbps đến 1Gbps",
      "moTa": "",
      "khuVuc": "KH tại Nội thành HNI, HCM",
      "chuKy": "Đóng theo chu kỳ 1 tháng/6 tháng/13 tháng",
      "gia": 265000,
      "donVi": "đ/tháng"
    }
  ],
  "goiCombo": [
    {
      "ma": "NETVT2T_GIAITRIBOX",
      "nhom": "Combo Internet - TV360",
      "tocDo": "Từ 500Mbps đến 1Gbps",
      "thietBi": "Modem Wifi 6 + Đầu thu Set-top-box TV360",
      "khuVuc": "Khách hàng tại 32 Tỉnh và ngoại thành HNI, HCM",
      "chuKy": "Đóng cước theo chu kỳ 1/6/13 tháng",
      "gia": 280000,
      "donVi": "đ/tháng"
    },
    {
      "ma": "MESHVT1T_GIAITRI",
      "nhom": "Combo Internet - TV360",
      "tocDo": "300Mbps",
      "thietBi": "01 Modem Wifi 6 + 01 Mesh Wifi + Truyền hình trên Smart TV",
      "khuVuc": "KH tại 32 Tỉnh và ngoại thành HNI, HCM",
      "chuKy": "Đóng cước theo chu kỳ 1/6/13 tháng",
      "gia": 230000,
      "donVi": "đ/tháng"
    },
    {
      "ma": "MESHVT1H_CAM1",
      "nhom": "Combo Internet - Camera",
      "tocDo": "300Mbps + 7 ngày lưu trữ",
      "thietBi": "Modem Wifi 6 + Camera",
      "khuVuc": "KH tại Nội thành HNI, HCM",
      "chuKy": "Đóng theo chu kỳ 1 tháng/6 tháng/13 tháng",
      "gia": 275000,
      "donVi": "đ/tháng"
    },
    {
      "ma": "MESHVT2H_CAM1",
      "nhom": "Combo Internet - Camera",
      "tocDo": "500Mbps đến 1 Gbps + 1 ngày lưu trữ (24h)",
      "thietBi": "Modem Wifi 6 + Camera",
      "khuVuc": "Áp dụng tại Nội thành HNI, HCM",
      "chuKy": "Đóng cước theo chu kỳ 1/6/13 tháng",
      "gia": 309000,
      "donVi": "đ/tháng"
    },
    {
      "ma": "MESHVT3H_CAM1",
      "nhom": "Combo Internet - Camera",
      "tocDo": "500Mbps đến 1 Gbps + 1 ngày lưu trữ (24h)",
      "thietBi": "Modem Wifi 6 + Camera",
      "khuVuc": "Áp dụng tại Nội thành HNI, HCM",
      "chuKy": "Đóng cước theo chu kỳ 1/6/13 tháng",
      "gia": 379000,
      "donVi": "đ/tháng"
    }
  ],
  "simSo": {
    "loaiThueBao": [
      "Trả trước",
      "Trả sau"
    ],
    "macDinh": "Trả sau",
    "chuKyGoiChinh": "1 chu kỳ 30 ngày",
    "danhSach": [
      {
        "stt": 1,
        "so": "0332 519 399",
        "gia": 60000,
        "thoiGian": "12 tháng"
      },
      {
        "stt": 2,
        "so": "0399 401 984",
        "gia": 60000,
        "thoiGian": "12 tháng"
      },
      {
        "stt": 3,
        "so": "0375 085 579",
        "gia": 60000,
        "thoiGian": "12 tháng"
      },
      {
        "stt": 4,
        "so": "0374 336 488",
        "gia": 60000,
        "thoiGian": "12 tháng"
      },
      {
        "stt": 5,
        "so": "0962 449 624",
        "gia": 60000,
        "thoiGian": "12 tháng"
      },
      {
        "stt": 6,
        "so": "0384 820 399",
        "gia": 60000,
        "thoiGian": "12 tháng"
      },
      {
        "stt": 7,
        "so": "0335 812 512",
        "gia": 60000,
        "thoiGian": "12 tháng"
      },
      {
        "stt": 8,
        "so": "0336 052 286",
        "gia": 60000,
        "thoiGian": "12 tháng"
      },
      {
        "stt": 9,
        "so": "0354 282 819",
        "gia": 60000,
        "thoiGian": "12 tháng"
      },
      {
        "stt": 10,
        "so": "0367 204 320",
        "gia": 60000,
        "thoiGian": "12 tháng"
      }
    ]
  },
  "goiData": [
    {
      "ma": "5G70",
      "nhom": "7 ngày",
      "data": "56GB (8GB/ngày)",
      "thoai": "",
      "tienIch": "",
      "gia": 70000,
      "giaGoc": null
    },
    {
      "ma": "5G150",
      "nhom": "30 ngày",
      "data": "6GB/ngày tại Việt Nam, 1GB Roaming",
      "thoai": "",
      "tienIch": "TV360, MCA",
      "gia": 135000,
      "giaGoc": 150000
    },
    {
      "ma": "5G150N",
      "nhom": "30 ngày",
      "data": "8GB/ngày, 1GB Roaming",
      "thoai": "",
      "tienIch": "TV360",
      "gia": 135000,
      "giaGoc": 150000
    },
    {
      "ma": "5G160B",
      "nhom": "30 ngày",
      "data": "4GB/ngày",
      "thoai": "100 phút ngoại mạng, 10p/cuộc nội mạng",
      "tienIch": "TV360, MCA",
      "gia": 144000,
      "giaGoc": 160000
    },
    {
      "ma": "5G180B",
      "nhom": "30 ngày",
      "data": "6GB/ngày, 1GB Roaming",
      "thoai": "100 phút ngoại mạng, 10p/cuộc nội mạng",
      "tienIch": "TV360, MCA",
      "gia": 162000,
      "giaGoc": 180000
    },
    {
      "ma": "5G230B",
      "nhom": "30 ngày",
      "data": "8GB/ngày tại Việt Nam, 1GB Roaming",
      "thoai": "150 phút ngoại mạng, 20p/cuộc nội mạng",
      "tienIch": "TV360, MCA",
      "gia": 207000,
      "giaGoc": 230000
    },
    {
      "ma": "5G280B",
      "nhom": "30 ngày",
      "data": "10GB/ngày",
      "thoai": "200 phút ngoại mạng, 20p/cuộc nội mạng",
      "tienIch": "TV360, MCA",
      "gia": 252000,
      "giaGoc": 280000
    },
    {
      "ma": "5G330B",
      "nhom": "30 ngày",
      "data": "12GB/ngày",
      "thoai": "300 phút ngoại mạng, 20p/cuộc nội mạng",
      "tienIch": "TV360, MCA",
      "gia": 297000,
      "giaGoc": 330000
    },
    {
      "ma": "5G380B",
      "nhom": "30 ngày",
      "data": "15GB/ngày",
      "thoai": "300 phút ngoại mạng, 20p/cuộc nội mạng",
      "tienIch": "TV360, MCA",
      "gia": 342000,
      "giaGoc": 380000
    },
    {
      "ma": "5G480B",
      "nhom": "30 ngày",
      "data": "20GB/ngày",
      "thoai": "300 phút ngoại mạng, 20p/cuộc nội mạng",
      "tienIch": "TV360, MYBOX",
      "gia": 432000,
      "giaGoc": 480000
    },
    {
      "ma": "3T5G150",
      "nhom": "90 ngày",
      "data": "6GB/ngày tại Việt Nam, 3GB Roaming",
      "thoai": "",
      "tienIch": "TV360, MCA",
      "gia": 405000,
      "giaGoc": 450000
    },
    {
      "ma": "3T5G150N",
      "nhom": "90 ngày",
      "data": "8GB/ngày, 1GB Roaming",
      "thoai": "",
      "tienIch": "TV360, MCA",
      "gia": 405000,
      "giaGoc": 450000
    },
    {
      "ma": "3T5G160B",
      "nhom": "90 ngày",
      "data": "4GB/ngày",
      "thoai": "Mỗi 30 ngày có 300 phút ngoại mạng, 10p/cuộc nội mạng",
      "tienIch": "TV360, MCA",
      "gia": 432000,
      "giaGoc": 480000
    },
    {
      "ma": "3T5G180B",
      "nhom": "90 ngày",
      "data": "6GB/ngày, 1GB Roaming",
      "thoai": "Mỗi 30 ngày có 300 phút ngoại mạng, 10p/cuộc nội mạng",
      "tienIch": "TV360, MCA",
      "gia": 486000,
      "giaGoc": 540000
    },
    {
      "ma": "3T5G230B",
      "nhom": "90 ngày",
      "data": "8GB/ngày tại Việt Nam, 3GB Roaming",
      "thoai": "Mỗi 30 ngày có 150 phút ngoại mạng, 20p/cuộc nội mạng",
      "tienIch": "TV360, MCA",
      "gia": 621000,
      "giaGoc": 690000
    },
    {
      "ma": "3T5G280B",
      "nhom": "90 ngày",
      "data": "900GB (10GB/ngày)",
      "thoai": "Mỗi chu kỳ 30 ngày có 200 phút ngoại mạng, 20p/cuộc nội mạng",
      "tienIch": "TV360, MCA",
      "gia": 756000,
      "giaGoc": 840000
    },
    {
      "ma": "3T5G330B",
      "nhom": "90 ngày",
      "data": "1.080GB (12GB/ngày)",
      "thoai": "Mỗi 30 ngày có 300 phút ngoại mạng, 20p/cuộc nội mạng",
      "tienIch": "TV360, MCA",
      "gia": 891000,
      "giaGoc": 990000
    },
    {
      "ma": "3T5G380B",
      "nhom": "90 ngày",
      "data": "1.350GB (15GB/ngày)",
      "thoai": "Mỗi 30 ngày có 300 phút ngoại mạng, 20p/cuộc nội mạng",
      "tienIch": "TV360, MCA",
      "gia": 1026000,
      "giaGoc": 1140000
    },
    {
      "ma": "3T5G480B",
      "nhom": "90 ngày",
      "data": "20GB/ngày",
      "thoai": "900 phút ngoại mạng, 20p/cuộc nội mạng",
      "tienIch": "TV360",
      "gia": 1296000,
      "giaGoc": 1440000
    },
    {
      "ma": "6T5G150",
      "nhom": "180 ngày",
      "data": "6GB/ngày tại Việt Nam, 6GB Roaming",
      "thoai": "",
      "tienIch": "TV360, MCA",
      "gia": 810000,
      "giaGoc": 900000
    },
    {
      "ma": "6T5G150N",
      "nhom": "180 ngày",
      "data": "8GB/ngày, 1GB Roaming",
      "thoai": "",
      "tienIch": "TV360, MCA",
      "gia": 810000,
      "giaGoc": 900000
    },
    {
      "ma": "6T5G160B",
      "nhom": "180 ngày",
      "data": "4GB/ngày",
      "thoai": "600 phút ngoại mạng, 10p/cuộc nội mạng",
      "tienIch": "TV360, MCA",
      "gia": 864000,
      "giaGoc": 960000
    },
    {
      "ma": "6T5G180B",
      "nhom": "180 ngày",
      "data": "6GB/ngày, 1GB Roaming",
      "thoai": "600 phút ngoại mạng, 10p/cuộc nội mạng",
      "tienIch": "TV360, MCA",
      "gia": 972000,
      "giaGoc": 1080000
    },
    {
      "ma": "6T5G230B",
      "nhom": "180 ngày",
      "data": "8GB/ngày tại Việt Nam, 6GB Roaming",
      "thoai": "900 phút ngoại mạng, 20p/cuộc nội mạng",
      "tienIch": "TV360, MCA",
      "gia": 1242000,
      "giaGoc": 1380000
    },
    {
      "ma": "6T5G280B",
      "nhom": "180 ngày",
      "data": "10GB/ngày",
      "thoai": "1.200 phút ngoại mạng, 20p/cuộc nội mạng",
      "tienIch": "TV360, MCA",
      "gia": 1512000,
      "giaGoc": 1600000
    },
    {
      "ma": "6T5G480B",
      "nhom": "180 ngày",
      "data": "20GB/ngày",
      "thoai": "1.800 phút ngoại mạng, 20p/cuộc nội mạng",
      "tienIch": "TV360",
      "gia": 2592000,
      "giaGoc": 2800000
    },
    {
      "ma": "12T5G150",
      "nhom": "360 ngày",
      "data": "6GB/ngày tại Việt Nam, 12GB Roaming",
      "thoai": "",
      "tienIch": "TV360, MCA",
      "gia": 1620000,
      "giaGoc": 1800000
    },
    {
      "ma": "12T5G150N",
      "nhom": "360 ngày",
      "data": "8GB/ngày, 1GB Roaming",
      "thoai": "",
      "tienIch": "TV360, MCA",
      "gia": 1620000,
      "giaGoc": 1800000
    },
    {
      "ma": "12T5G160B",
      "nhom": "360 ngày",
      "data": "4GB/ngày",
      "thoai": "1.200 phút ngoại mạng, 10p/cuộc nội mạng",
      "tienIch": "TV360, MCA",
      "gia": 1728000,
      "giaGoc": 1920000
    },
    {
      "ma": "12T5G230B",
      "nhom": "360 ngày",
      "data": "8GB/ngày tại Việt Nam, 12GB Roaming",
      "thoai": "1.800 phút ngoại mạng, 20p/cuộc nội mạng",
      "tienIch": "TV360, MCA",
      "gia": 2484000,
      "giaGoc": 2760000
    },
    {
      "ma": "12T5G280B",
      "nhom": "360 ngày",
      "data": "10GB/ngày",
      "thoai": "2.400 phút ngoại mạng, 20p/cuộc nội mạng",
      "tienIch": "TV360, MCA",
      "gia": 3024000,
      "giaGoc": 3360000
    },
    {
      "ma": "12T5G330B",
      "nhom": "360 ngày",
      "data": "12GB/ngày",
      "thoai": "3.600 phút ngoại mạng, 20p/cuộc nội mạng",
      "tienIch": "TV360, MCA",
      "gia": 3564000,
      "giaGoc": 3960000
    },
    {
      "ma": "12T5G380B",
      "nhom": "360 ngày",
      "data": "15GB/ngày",
      "thoai": "3.600 phút ngoại mạng, 20p/cuộc nội mạng",
      "tienIch": "TV360, MCA",
      "gia": 4104000,
      "giaGoc": 4560000
    },
    {
      "ma": "12T5G480B",
      "nhom": "360 ngày",
      "data": "20GB/ngày",
      "thoai": "3.600 phút ngoại mạng, 20p/cuộc nội mạng",
      "tienIch": "TV360, MYBOX",
      "gia": 5184000,
      "giaGoc": 5760000
    }
  ],
  "goiRoaming": [
    {
      "ma": "IRU1",
      "nhom": "Ngày",
      "thoiHan": "24 giờ",
      "uuDai": "1GB tốc độ cao",
      "phamVi": "Campuchia, Lào",
      "gia": 25000,
      "giaGoc": null
    },
    {
      "ma": "DRU1",
      "nhom": "Ngày",
      "thoiHan": "24 giờ",
      "uuDai": "1GB tốc độ cao",
      "phamVi": "90 Quốc gia",
      "gia": 50000,
      "giaGoc": null
    },
    {
      "ma": "IRU3",
      "nhom": "Ngày",
      "thoiHan": "3 ngày",
      "uuDai": "3GB (1GB tốc độ cao/ngày)",
      "phamVi": "Campuchia, Lào",
      "gia": 75000,
      "giaGoc": null
    },
    {
      "ma": "TQ5",
      "nhom": "Ngày",
      "thoiHan": "120 giờ",
      "uuDai": "2GB",
      "phamVi": "Trung Quốc",
      "gia": 99000,
      "giaGoc": null
    },
    {
      "ma": "THAI5",
      "nhom": "Ngày",
      "thoiHan": "120 giờ",
      "uuDai": "4GB",
      "phamVi": "Thái Lan",
      "gia": 99000,
      "giaGoc": null
    },
    {
      "ma": "HQ5",
      "nhom": "Ngày",
      "thoiHan": "120 giờ",
      "uuDai": "8GB, 20 phút thoại 4G/5G",
      "phamVi": "Hàn Quốc",
      "gia": 99000,
      "giaGoc": null
    },
    {
      "ma": "UAE5",
      "nhom": "Ngày",
      "thoiHan": "120 giờ",
      "uuDai": "5GB",
      "phamVi": "UAE",
      "gia": 99000,
      "giaGoc": null
    },
    {
      "ma": "ASEAN5",
      "nhom": "Ngày",
      "thoiHan": "120 giờ",
      "uuDai": "2GB",
      "phamVi": "9 Quốc gia",
      "gia": 100000,
      "giaGoc": null
    },
    {
      "ma": "DR3",
      "nhom": "Ngày",
      "thoiHan": "72 giờ",
      "uuDai": "1GB",
      "phamVi": "171 Quốc gia",
      "gia": 130000,
      "giaGoc": null
    },
    {
      "ma": "IR15",
      "nhom": "Tuần",
      "thoiHan": "15 ngày",
      "uuDai": "2GB",
      "phamVi": "Campuchia, Lào",
      "gia": 99000,
      "giaGoc": null
    },
    {
      "ma": "IRU7",
      "nhom": "Tuần",
      "thoiHan": "7 ngày",
      "uuDai": "7GB (1GB tốc độ cao/ngày)",
      "phamVi": "Campuchia, Lào",
      "gia": 175000,
      "giaGoc": null
    },
    {
      "ma": "CR15",
      "nhom": "Tuần",
      "thoiHan": "360 giờ",
      "uuDai": "3GB, 10 SMS, 30 phút thoại",
      "phamVi": "Campuchia, Lào",
      "gia": 199000,
      "giaGoc": null
    },
    {
      "ma": "HQ10",
      "nhom": "Tuần",
      "thoiHan": "240 giờ",
      "uuDai": "20GB, 30 phút thoại 4G/5G",
      "phamVi": "Hàn Quốc",
      "gia": 200000,
      "giaGoc": null
    },
    {
      "ma": "THAI10",
      "nhom": "Tuần",
      "thoiHan": "240 giờ",
      "uuDai": "10GB",
      "phamVi": "Thái Lan",
      "gia": 200000,
      "giaGoc": null
    },
    {
      "ma": "MALAY10",
      "nhom": "Tuần",
      "thoiHan": "240 giờ",
      "uuDai": "16GB",
      "phamVi": "Malaysia",
      "gia": 200000,
      "giaGoc": null
    },
    {
      "ma": "SING10",
      "nhom": "Tuần",
      "thoiHan": "240 giờ",
      "uuDai": "12GB",
      "phamVi": "Singapore",
      "gia": 200000,
      "giaGoc": null
    },
    {
      "ma": "HK10",
      "nhom": "Tuần",
      "thoiHan": "240 giờ",
      "uuDai": "16GB",
      "phamVi": "Hồng Kông",
      "gia": 200000,
      "giaGoc": null
    },
    {
      "ma": "CR200",
      "nhom": "Tuần",
      "thoiHan": "168 giờ",
      "uuDai": "400MB, 10 SMS, 20 phút thoại",
      "phamVi": "35 Quốc gia",
      "gia": 200000,
      "giaGoc": null
    },
    {
      "ma": "TQ10",
      "nhom": "Tuần",
      "thoiHan": "240 giờ",
      "uuDai": "6GB",
      "phamVi": "Trung Quốc",
      "gia": 250000,
      "giaGoc": null
    },
    {
      "ma": "NHAT15",
      "nhom": "Tuần",
      "thoiHan": "360 giờ",
      "uuDai": "6GB",
      "phamVi": "Nhật Bản",
      "gia": 250000,
      "giaGoc": null
    },
    {
      "ma": "DL10",
      "nhom": "Tuần",
      "thoiHan": "240 giờ",
      "uuDai": "10GB",
      "phamVi": "Đài Loan",
      "gia": 250000,
      "giaGoc": null
    },
    {
      "ma": "UC10",
      "nhom": "Tuần",
      "thoiHan": "240 giờ",
      "uuDai": "8GB",
      "phamVi": "Úc",
      "gia": 250000,
      "giaGoc": null
    },
    {
      "ma": "UAE10",
      "nhom": "Tuần",
      "thoiHan": "240 giờ",
      "uuDai": "15GB",
      "phamVi": "UAE",
      "gia": 250000,
      "giaGoc": null
    },
    {
      "ma": "ASEAN15",
      "nhom": "Tuần",
      "thoiHan": "360 giờ",
      "uuDai": "5GB",
      "phamVi": "9 Quốc gia",
      "gia": 250000,
      "giaGoc": null
    },
    {
      "ma": "DR7",
      "nhom": "Tuần",
      "thoiHan": "168 giờ",
      "uuDai": "2GB",
      "phamVi": "171 Quốc gia",
      "gia": 250000,
      "giaGoc": null
    },
    {
      "ma": "DRU7",
      "nhom": "Tuần",
      "thoiHan": "7 ngày",
      "uuDai": "7GB (1GB tốc độ cao/ngày)",
      "phamVi": "90 Quốc gia",
      "gia": 350000,
      "giaGoc": null
    },
    {
      "ma": "USA15",
      "nhom": "Tuần",
      "thoiHan": "360 giờ",
      "uuDai": "25GB",
      "phamVi": "Mỹ",
      "gia": 350000,
      "giaGoc": null
    },
    {
      "ma": "NGA15",
      "nhom": "Tuần",
      "thoiHan": "360 giờ",
      "uuDai": "6GB",
      "phamVi": "Nga",
      "gia": 350000,
      "giaGoc": null
    },
    {
      "ma": "REU15",
      "nhom": "Tuần",
      "thoiHan": "360 giờ",
      "uuDai": "5GB",
      "phamVi": "42 Quốc gia",
      "gia": 400000,
      "giaGoc": null
    },
    {
      "ma": "CR500",
      "nhom": "Tuần",
      "thoiHan": "240 giờ",
      "uuDai": "1.2GB, 20 SMS, 50 phút thoại",
      "phamVi": "35 Quốc gia",
      "gia": 500000,
      "giaGoc": null
    },
    {
      "ma": "DR15",
      "nhom": "Tuần",
      "thoiHan": "360 giờ",
      "uuDai": "5GB",
      "phamVi": "171 Quốc gia",
      "gia": 550000,
      "giaGoc": null
    },
    {
      "ma": "DRE20",
      "nhom": "Tháng",
      "thoiHan": "30 ngày",
      "uuDai": "50MB",
      "phamVi": "171 Quốc gia",
      "gia": 18000,
      "giaGoc": 20000
    },
    {
      "ma": "DRE50",
      "nhom": "Tháng",
      "thoiHan": "30 ngày",
      "uuDai": "200MB",
      "phamVi": "171 Quốc gia",
      "gia": 45000,
      "giaGoc": 50000
    },
    {
      "ma": "DRE100",
      "nhom": "Tháng",
      "thoiHan": "30 ngày",
      "uuDai": "500MB",
      "phamVi": "171 Quốc gia",
      "gia": 90000,
      "giaGoc": 100000
    },
    {
      "ma": "CR30",
      "nhom": "Tháng",
      "thoiHan": "720 giờ",
      "uuDai": "5GB, 50 SMS, 100 phút thoại",
      "phamVi": "Campuchia, Lào",
      "gia": 450000,
      "giaGoc": null
    },
    {
      "ma": "REU30",
      "nhom": "Tháng",
      "thoiHan": "720 giờ",
      "uuDai": "12GB",
      "phamVi": "42 Quốc gia",
      "gia": 800000,
      "giaGoc": null
    },
    {
      "ma": "DR30",
      "nhom": "Tháng",
      "thoiHan": "720 giờ",
      "uuDai": "10GB",
      "phamVi": "171 Quốc gia",
      "gia": 1100000,
      "giaGoc": null
    }
  ],
  "goiHot": [
    {
      "ma": "ST7K",
      "nhom": "1 ngày",
      "thoiHan": "1 ngày",
      "data": "1GB",
      "thoai": "",
      "sms": "",
      "uuDai": "",
      "tienIch": "",
      "moTa": "",
      "gia": 7000,
      "giaGoc": null
    },
    {
      "ma": "5G10",
      "nhom": "1 ngày",
      "thoiHan": "1 ngày",
      "data": "6GB",
      "thoai": "",
      "sms": "",
      "uuDai": "",
      "tienIch": "",
      "moTa": "",
      "gia": 10000,
      "giaGoc": null
    },
    {
      "ma": "5GVS12",
      "nhom": "1 ngày",
      "thoiHan": "1 ngày",
      "data": "6GB",
      "thoai": "",
      "sms": "",
      "uuDai": "",
      "tienIch": "TV360",
      "moTa": "",
      "gia": 12000,
      "giaGoc": null
    }
  ],
  "goiMXH": [
    {
      "ma": "FB5K",
      "nhom": "1 ngày",
      "thoiHan": "1 ngày",
      "data": "15GB Meta",
      "thoai": "",
      "sms": "",
      "uuDai": "FACEBOOK, INSTAGRAM",
      "tienIch": "",
      "moTa": "",
      "gia": 5000,
      "giaGoc": null
    },
    {
      "ma": "YT5K",
      "nhom": "1 ngày",
      "thoiHan": "1 ngày",
      "data": "15GB Youtube",
      "thoai": "",
      "sms": "",
      "uuDai": "YOUTUBE",
      "tienIch": "",
      "moTa": "",
      "gia": 5000,
      "giaGoc": null
    },
    {
      "ma": "T5K",
      "nhom": "1 ngày",
      "thoiHan": "1 ngày",
      "data": "15GB Tiktok",
      "thoai": "",
      "sms": "",
      "uuDai": "TIKTOK",
      "tienIch": "",
      "moTa": "",
      "gia": 5000,
      "giaGoc": null
    },
    {
      "ma": "YT15K",
      "nhom": "7 ngày",
      "thoiHan": "7 ngày",
      "data": "25GB Youtube",
      "thoai": "",
      "sms": "",
      "uuDai": "YOUTUBE",
      "tienIch": "",
      "moTa": "",
      "gia": 15000,
      "giaGoc": null
    },
    {
      "ma": "T15KN",
      "nhom": "7 ngày",
      "thoiHan": "7 ngày",
      "data": "25GB TikTok",
      "thoai": "",
      "sms": "",
      "uuDai": "TIKTOK",
      "tienIch": "",
      "moTa": "",
      "gia": 15000,
      "giaGoc": null
    },
    {
      "ma": "FB15K",
      "nhom": "7 ngày",
      "thoiHan": "7 ngày",
      "data": "25GB Meta",
      "thoai": "",
      "sms": "",
      "uuDai": "FACEBOOK, INSTAGRAM",
      "tienIch": "",
      "moTa": "",
      "gia": 15000,
      "giaGoc": null
    },
    {
      "ma": "YT50K",
      "nhom": "30 ngày",
      "thoiHan": "30 ngày",
      "data": "50GB Youtube",
      "thoai": "",
      "sms": "",
      "uuDai": "YOUTUBE",
      "tienIch": "",
      "moTa": "",
      "gia": 50000,
      "giaGoc": null
    },
    {
      "ma": "T50K",
      "nhom": "30 ngày",
      "thoiHan": "30 ngày",
      "data": "50GB TikTok",
      "thoai": "",
      "sms": "",
      "uuDai": "TIKTOK",
      "tienIch": "",
      "moTa": "",
      "gia": 50000,
      "giaGoc": null
    },
    {
      "ma": "FB50K",
      "nhom": "30 ngày",
      "thoiHan": "30 ngày",
      "data": "50GB Meta",
      "thoai": "",
      "sms": "",
      "uuDai": "FACEBOOK, INSTAGRAM",
      "tienIch": "",
      "moTa": "",
      "gia": 50000,
      "giaGoc": null
    },
    {
      "ma": "3FB50K",
      "nhom": "90 ngày",
      "thoiHan": "90 ngày",
      "data": "150GB Meta",
      "thoai": "",
      "sms": "",
      "uuDai": "FACEBOOK, INSTAGRAM",
      "tienIch": "",
      "moTa": "",
      "gia": 150000,
      "giaGoc": null
    },
    {
      "ma": "6FB50K",
      "nhom": "180 ngày",
      "thoiHan": "180 ngày",
      "data": "300GB Meta",
      "thoai": "",
      "sms": "",
      "uuDai": "FACEBOOK, INSTAGRAM",
      "tienIch": "",
      "moTa": "",
      "gia": 300000,
      "giaGoc": null
    },
    {
      "ma": "12FB50K",
      "nhom": "360 ngày",
      "thoiHan": "360 ngày",
      "data": "600GB Meta",
      "thoai": "",
      "sms": "",
      "uuDai": "FACEBOOK, INSTAGRAM",
      "tienIch": "",
      "moTa": "",
      "gia": 600000,
      "giaGoc": null
    }
  ],
  "goiSieuUuDai": [
    {
      "ma": "TV7K",
      "nhom": "1 ngày",
      "thoiHan": "1 ngày",
      "data": "1GB",
      "thoai": "",
      "sms": "",
      "uuDai": "",
      "tienIch": "TV360",
      "moTa": "",
      "gia": 7000,
      "giaGoc": null
    },
    {
      "ma": "ST7K",
      "nhom": "1 ngày",
      "thoiHan": "1 ngày",
      "data": "1GB",
      "thoai": "",
      "sms": "",
      "uuDai": "",
      "tienIch": "",
      "moTa": "",
      "gia": 7000,
      "giaGoc": null
    },
    {
      "ma": "1N",
      "nhom": "1 ngày",
      "thoiHan": "1 ngày",
      "data": "5GB",
      "thoai": "5 phút ngoại mạng, 10 phút/cuộc nội mạng",
      "sms": "Miễn phí nội mạng",
      "uuDai": "",
      "tienIch": "",
      "moTa": "",
      "gia": 10000,
      "giaGoc": null
    },
    {
      "ma": "ST15K",
      "nhom": "3 ngày",
      "thoiHan": "3 ngày",
      "data": "3GB",
      "thoai": "",
      "sms": "",
      "uuDai": "",
      "tienIch": "",
      "moTa": "",
      "gia": 15000,
      "giaGoc": null
    },
    {
      "ma": "3N",
      "nhom": "3 ngày",
      "thoiHan": "3 ngày",
      "data": "5GB/ngày",
      "thoai": "15 phút ngoại mạng, 10 phút/cuộc nội mạng",
      "sms": "Miễn phí nội mạng",
      "uuDai": "",
      "tienIch": "",
      "moTa": "",
      "gia": 30000,
      "giaGoc": null
    },
    {
      "ma": "5G30",
      "nhom": "3 ngày",
      "thoiHan": "3 ngày",
      "data": "21GB (7GB/ngày)",
      "thoai": "",
      "sms": "",
      "uuDai": "",
      "tienIch": "",
      "moTa": "",
      "gia": 30000,
      "giaGoc": null
    },
    {
      "ma": "V30X",
      "nhom": "7 ngày",
      "thoiHan": "7 ngày",
      "data": "500MB/ngày",
      "thoai": "10 phút/cuộc nội mạng",
      "sms": "",
      "uuDai": "",
      "tienIch": "",
      "moTa": "",
      "gia": 30000,
      "giaGoc": null
    },
    {
      "ma": "ST30K",
      "nhom": "7 ngày",
      "thoiHan": "7 ngày",
      "data": "",
      "thoai": "",
      "sms": "",
      "uuDai": "",
      "tienIch": "",
      "moTa": "7GB tốc độ cao sử dụng trong 7 ngày (Gia hạn tự động).",
      "gia": 30000,
      "giaGoc": null
    },
    {
      "ma": "7N",
      "nhom": "7 ngày",
      "thoiHan": "7 ngày",
      "data": "5GB/ngày",
      "thoai": "35 phút ngoại mạng, 10 phút/cuộc nội mạng",
      "sms": "Miễn phí nội mạng",
      "uuDai": "",
      "tienIch": "",
      "moTa": "",
      "gia": 70000,
      "giaGoc": null
    },
    {
      "ma": "V25B",
      "nhom": "15 ngày",
      "thoiHan": "15 ngày",
      "data": "2GB",
      "thoai": "10 phút/cuộc nội mạng",
      "sms": "",
      "uuDai": "",
      "tienIch": "",
      "moTa": "",
      "gia": 25000,
      "giaGoc": null
    },
    {
      "ma": "V35B",
      "nhom": "15 ngày",
      "thoiHan": "15 ngày",
      "data": "500MB/ngày",
      "thoai": "10 phút/cuộc nội mạng",
      "sms": "",
      "uuDai": "",
      "tienIch": "",
      "moTa": "",
      "gia": 35000,
      "giaGoc": null
    },
    {
      "ma": "SD90",
      "nhom": "30 ngày",
      "thoiHan": "30 ngày",
      "data": "1,5GB/ngày",
      "thoai": "",
      "sms": "",
      "uuDai": "",
      "tienIch": "",
      "moTa": "",
      "gia": 90000,
      "giaGoc": null
    },
    {
      "ma": "V120B",
      "nhom": "30 ngày",
      "thoiHan": "30 ngày",
      "data": "1,5GB/ngày",
      "thoai": "50 phút ngoại mạng, 10 phút/cuộc nội mạng",
      "sms": "",
      "uuDai": "",
      "tienIch": "",
      "moTa": "",
      "gia": 120000,
      "giaGoc": null
    },
    {
      "ma": "TV120C",
      "nhom": "30 ngày",
      "thoiHan": "30 ngày",
      "data": "1,5GB/ngày",
      "thoai": "50 phút ngoại mạng, 10 phút/cuộc nội mạng",
      "sms": "",
      "uuDai": "",
      "tienIch": "TV360",
      "moTa": "",
      "gia": 120000,
      "giaGoc": null
    },
    {
      "ma": "3SD90",
      "nhom": "90 ngày",
      "thoiHan": "90 ngày",
      "data": "1,5GB/ngày",
      "thoai": "",
      "sms": "",
      "uuDai": "",
      "tienIch": "",
      "moTa": "",
      "gia": 270000,
      "giaGoc": null
    },
    {
      "ma": "6SD90",
      "nhom": "180 ngày",
      "thoiHan": "180 ngày",
      "data": "1,5GB/ngày",
      "thoai": "",
      "sms": "",
      "uuDai": "",
      "tienIch": "",
      "moTa": "",
      "gia": 540000,
      "giaGoc": null
    },
    {
      "ma": "12SD90",
      "nhom": "360 ngày",
      "thoiHan": "360 ngày",
      "data": "1,5GB/ngày",
      "thoai": "",
      "sms": "",
      "uuDai": "",
      "tienIch": "",
      "moTa": "",
      "gia": 1080000,
      "giaGoc": null
    },
    {
      "ma": "FT5",
      "nhom": "khac",
      "thoiHan": "",
      "data": "",
      "thoai": "",
      "sms": "",
      "uuDai": "",
      "tienIch": "",
      "moTa": "Miễn phí 15 phút/cuộc gọi nội mạng",
      "gia": 5000,
      "giaGoc": null
    },
    {
      "ma": "MI7D",
      "nhom": "khac",
      "thoiHan": "đến 24h ngày đăng ký",
      "data": "",
      "thoai": "",
      "sms": "",
      "uuDai": "",
      "tienIch": "",
      "moTa": "700MB Data tốc độ cao sử dụng đến 24h00 ngày đăng ký",
      "gia": 7000,
      "giaGoc": null
    },
    {
      "ma": "ST10K",
      "nhom": "khac",
      "thoiHan": "",
      "data": "2GB",
      "thoai": "",
      "sms": "",
      "uuDai": "",
      "tienIch": "",
      "moTa": "",
      "gia": 10000,
      "giaGoc": null
    }
  ]
};

function formatGia(n){
  return n.toLocaleString('vi-VN') + 'đ';
}

/* ---------- Render thẻ gói Internet/Combo ---------- */
// Hiển thị khối xác nhận minh hoạ khi bấm "Đăng ký" cho gói Internet/Combo — tách riêng để nút "Đăng ký ngay"
// trong modal "Chi tiết gói cước" cũng gọi lại được đúng luồng này.
// Hiển thị khối xác nhận minh hoạ khi bấm "Đăng ký" cho gói Internet/Combo — tách riêng để nút "Đăng ký ngay"
// trong modal "Chi tiết gói cước" cũng gọi lại được đúng luồng này. Nếu đang có 1 "phiên giới thiệu" đang hoạt
// động (khách vào qua link chia sẻ của NVKD/CTV — xem window.activeReferral trong khối script "Kênh nhân viên
// kinh doanh"), đơn đăng ký này sẽ được ghi nhận cho đúng người đã giới thiệu.
function showInternetSummary(pkg, serviceLabel, canLapDat){
  const box = document.getElementById('internet-summary');
  box.classList.add('show');
  let html = `Bạn vừa chọn gói <b>${pkg.ma}</b> — ${pkg.tocDo} — <b>${formatGia(pkg.gia)}/tháng</b>. (Đây là thao tác minh hoạ, chưa gửi yêu cầu đăng ký thật.)`;
  if(window.activeReferral && window.recordReferredOrder){
    const note = window.recordReferredOrder(pkg, serviceLabel || 'Internet cáp quang', canLapDat !== false);
    if(note) html += `<br><span style="color:var(--viettel-red);font-weight:600;">${note}</span>`;
  }
  box.innerHTML = html;
  box.scrollIntoView({behavior:'smooth', block:'center'});
}

function renderCard(pkg, { showThietBi=false, serviceLabel, canLapDat=true } = {}){
  const wrap = document.createElement('div');
  wrap.className = 'card';
  wrap.innerHTML = `
    <div class="card-head">${pkg.ma}</div>
    <div class="card-body">
      <div class="toc-do">${pkg.tocDo}</div>
      ${pkg.moTa ? `<div class="mo-ta">${pkg.moTa}</div>` : ''}
      ${showThietBi && pkg.thietBi ? `<div class="mo-ta">${pkg.thietBi}</div>` : ''}
      ${pkg.khuVuc ? `<div class="khu-vuc">${pkg.khuVuc}</div>` : ''}
      ${pkg.chuKy ? `<div class="chu-ky">${pkg.chuKy}</div>` : ''}
    </div>
    <div class="card-price">
      <span class="gia">${formatGia(pkg.gia)}</span><span class="don-vi">/tháng</span>
    </div>
    <div class="card-actions">
      <button class="btn-primary" data-ma="${pkg.ma}" data-gia="${pkg.gia}">Đăng ký</button>
      <button class="btn-outline">Chi tiết gói cước</button>
    </div>
  `;
  wrap.querySelector('.btn-primary').addEventListener('click', () => showInternetSummary(pkg, serviceLabel, canLapDat));
  wrap.querySelector('.btn-outline').addEventListener('click', () => {
    openPackageDetailModal(pkg, {
      groupLabel: pkg.nhom, perMonth: true, serviceLabel, canLapDat,
      onRegister: () => showInternetSummary(pkg, serviceLabel, canLapDat),
    });
  });
  return wrap;
}

function fillGrid(id, list, opts){
  const el = document.getElementById(id);
  el.innerHTML = '';
  list.forEach(p => el.appendChild(renderCard(p, opts)));
}

// Gói Internet thường: nhóm "Gói Internet"
fillGrid('grid-goi-internet', DATA.goiInternet.filter(p => p.nhom === 'Gói Internet'), {serviceLabel:'Internet cáp quang'});
// Mesh Wifi tốc độ cao: gộp nhóm "Mesh Wifi tốc độ cao" và "Wifi 6 tốc độ cao"
fillGrid('grid-mesh-cao', DATA.goiInternet.filter(p => p.nhom !== 'Gói Internet'), {serviceLabel:'Internet cáp quang'});
// Combo Internet - Truyền hình
fillGrid('grid-combo', DATA.goiCombo.filter(p => p.nhom === 'Combo Internet - TV360'), {showThietBi:true, serviceLabel:'Combo Internet - Truyền hình'});
// Combo Internet - Camera
fillGrid('grid-camera', DATA.goiCombo.filter(p => p.nhom === 'Combo Internet - Camera'), {showThietBi:true, serviceLabel:'Combo Internet - Camera'});

/* ---------- Trang Gói cước Data/5G ---------- */

// Thẻ gói 5G/Data (Data/Thoại/Tiện ích)
function renderDataCard(pkg){
  const wrap = document.createElement('div');
  wrap.className = 'card';
  const giamPercent = pkg.giaGoc ? Math.round((1 - pkg.gia / pkg.giaGoc) * 100) : 0;
  wrap.innerHTML = `
    <div class="card-head">${pkg.ma} <span style="font-weight:400;font-size:12px;opacity:.9;">— ${pkg.nhom}</span></div>
    <div class="card-body">
      <div class="data-line">📶<span><b>Data:</b> ${pkg.data}</span></div>
      ${pkg.thoai ? `<div class="data-line">📞<span><b>Thoại:</b> ${pkg.thoai}</span></div>` : ''}
      ${pkg.tienIch ? `<div class="data-line">⭐<span><b>Tiện ích:</b> ${pkg.tienIch}</span></div>` : ''}
    </div>
    <div class="card-price">
      <div class="data-price-row">
        <span class="gia">${formatGia(pkg.gia)}</span>
        ${pkg.giaGoc ? `<span class="data-price-goc">${formatGia(pkg.giaGoc)}</span>` : ''}
        ${giamPercent > 0 ? `<span style="font-size:11px;color:#3AAE58;font-weight:700;">-${giamPercent}%</span>` : ''}
      </div>
    </div>
    <div class="card-actions">
      <button class="btn-primary" data-ma="${pkg.ma}">Đăng ký</button>
      <button class="btn-outline">Xem chi tiết</button>
    </div>
  `;
  bindDataCardActions(wrap, pkg, null, 'Gói cước Data/5G');
  return wrap;
}

// Thẻ gói Roaming (Ưu đãi/Phạm vi)
function renderRoamingCard(pkg){
  const wrap = document.createElement('div');
  wrap.className = 'card';
  const giamPercent = pkg.giaGoc ? Math.round((1 - pkg.gia / pkg.giaGoc) * 100) : 0;
  wrap.innerHTML = `
    <div class="card-head">${pkg.ma} <span style="font-weight:400;font-size:12px;opacity:.9;">— ${pkg.thoiHan}</span></div>
    <div class="card-body">
      <div class="data-line">🎁<span><b>Ưu đãi:</b> ${pkg.uuDai}</span></div>
      <div class="data-line">🌐<span><b>Phạm vi:</b> ${pkg.phamVi}</span></div>
    </div>
    <div class="card-price">
      <div class="data-price-row">
        <span class="gia">${formatGia(pkg.gia)}</span>
        ${pkg.giaGoc ? `<span class="data-price-goc">${formatGia(pkg.giaGoc)}</span>` : ''}
        ${giamPercent > 0 ? `<span style="font-size:11px;color:#3AAE58;font-weight:700;">-${giamPercent}%</span>` : ''}
      </div>
    </div>
    <div class="card-actions">
      <button class="btn-primary" data-ma="${pkg.ma}">Đăng ký</button>
      <button class="btn-outline">Xem chi tiết</button>
    </div>
  `;
  bindDataCardActions(wrap, pkg, pkg.thoiHan, 'Gói Roaming');
  return wrap;
}

// Icon minh hoạ theo tên mạng xã hội xuất hiện trong chuỗi "uuDai" (Gói cước HOT/MXH/Siêu ưu đãi dùng chung hàm này)
function uuDaiIcon(uuDai){
  if(!uuDai) return '🎁';
  const u = uuDai.toUpperCase();
  if(u.includes('YOUTUBE')) return '▶️';
  if(u.includes('TIKTOK')) return '🎵';
  if(u.includes('FACEBOOK') || u.includes('INSTAGRAM')) return '📘';
  return '🎁';
}

// Thẻ dùng chung cho Gói cước HOT / Miễn phí MXH / Siêu ưu đãi thoại/data
// (các gói này có tập trường linh hoạt: data/thoại/sms/ưu đãi MXH/tiện ích/mô tả tự do)
function renderGenericCard(pkg){
  const wrap = document.createElement('div');
  wrap.className = 'card';
  const giamPercent = pkg.giaGoc ? Math.round((1 - pkg.gia / pkg.giaGoc) * 100) : 0;
  wrap.innerHTML = `
    <div class="card-head">${pkg.ma}${pkg.thoiHan ? ` <span style="font-weight:400;font-size:12px;opacity:.9;">— ${pkg.thoiHan}</span>` : ''}</div>
    <div class="card-body">
      ${pkg.data ? `<div class="data-line">📶<span><b>Data:</b> ${pkg.data}</span></div>` : ''}
      ${pkg.thoai ? `<div class="data-line">📞<span><b>Thoại:</b> ${pkg.thoai}</span></div>` : ''}
      ${pkg.sms ? `<div class="data-line">✉️<span><b>SMS:</b> ${pkg.sms}</span></div>` : ''}
      ${pkg.uuDai ? `<div class="data-line">${uuDaiIcon(pkg.uuDai)}<span><b>Ưu đãi:</b> ${pkg.uuDai}</span></div>` : ''}
      ${pkg.tienIch ? `<div class="data-line">⭐<span><b>Tiện ích:</b> ${pkg.tienIch}</span></div>` : ''}
      ${pkg.moTa ? `<div class="data-line" style="font-style:italic;">${pkg.moTa}</div>` : ''}
    </div>
    <div class="card-price">
      <div class="data-price-row">
        <span class="gia">${formatGia(pkg.gia)}</span>
        ${pkg.giaGoc ? `<span class="data-price-goc">${formatGia(pkg.giaGoc)}</span>` : ''}
        ${giamPercent > 0 ? `<span style="font-size:11px;color:#3AAE58;font-weight:700;">-${giamPercent}%</span>` : ''}
      </div>
    </div>
    <div class="card-actions">
      <button class="btn-primary" data-ma="${pkg.ma}">Đăng ký</button>
      <button class="btn-outline">Xem chi tiết</button>
    </div>
  `;
  bindDataCardActions(wrap, pkg, pkg.thoiHan || pkg.nhom, 'Gói cước Data/5G');
  return wrap;
}

// Hiển thị khối xác nhận minh hoạ khi bấm "Đăng ký" cho gói Data/5G/Roaming/HOT/MXH/Siêu ưu đãi — tách riêng để nút
// "Đăng ký ngay" trong modal "Chi tiết gói cước" cũng gọi lại được đúng luồng này. Các gói ở đây đều không cần
// lắp đặt (canLapDat luôn false) nên không cần tham số riêng như showInternetSummary().
function showDataSummary(pkg, nhomLabel, serviceLabel){
  const box = document.getElementById('data-summary');
  box.classList.add('show');
  let html = `Bạn vừa chọn gói <b>${pkg.ma}</b> (${nhomLabel || pkg.nhom}) — <b>${formatGia(pkg.gia)}</b>. (Thao tác minh hoạ, chưa gửi yêu cầu đăng ký thật.)`;
  if(window.activeReferral && window.recordReferredOrder){
    const note = window.recordReferredOrder(pkg, serviceLabel || 'Gói cước Data/5G', false);
    if(note) html += `<br><span style="color:var(--viettel-red);font-weight:600;">${note}</span>`;
  }
  box.innerHTML = html;
  box.scrollIntoView({behavior:'smooth', block:'center'});
}

function bindDataCardActions(wrap, pkg, nhomLabel, serviceLabel){
  wrap.querySelector('.btn-primary').addEventListener('click', () => showDataSummary(pkg, nhomLabel, serviceLabel));
  wrap.querySelector('.btn-outline').addEventListener('click', () => {
    openPackageDetailModal(pkg, {
      groupLabel: nhomLabel || pkg.nhom, perMonth: false, serviceLabel, canLapDat: false,
      onRegister: () => showDataSummary(pkg, nhomLabel, serviceLabel),
    });
  });
}

// Cấu hình từng danh mục: nguồn dữ liệu, bộ lọc thời hạn riêng, cách nhóm "Dài ngày"/gộp nhóm, và hàm render thẻ
const DAI_NGAY_SET = ['90 ngày', '180 ngày', '360 ngày'];

const DATA_CATEGORIES = {
  'hot': {
    dataset: () => DATA.goiHot,
    render: renderGenericCard,
    durations: [
      {key:'tat-ca', label:'Tất cả'},
      {key:'1 ngày', label:'1 ngày'},
      {key:'3 ngày', label:'3 ngày'},
      {key:'7 ngày', label:'7 ngày'},
      {key:'15 ngày', label:'15 ngày'},
      {key:'30 ngày', label:'30 ngày'},
      {key:'dai-ngay', label:'Dài ngày'}
    ],
    matchDuration: (p, key) => key === 'tat-ca' ? true
      : key === 'dai-ngay' ? DAI_NGAY_SET.includes(p.nhom)
      : p.nhom === key
  },
  '5g': {
    dataset: () => DATA.goiData,
    render: renderDataCard,
    durations: [
      {key:'tat-ca', label:'Tất cả'},
      {key:'7 ngày', label:'7 ngày'},
      {key:'30 ngày', label:'30 ngày'},
      {key:'dai-ngay', label:'Dài ngày'}
    ],
    matchDuration: (p, key) => key === 'tat-ca' ? true
      : key === 'dai-ngay' ? DAI_NGAY_SET.includes(p.nhom)
      : p.nhom === key
  },
  'mxh': {
    dataset: () => DATA.goiMXH,
    render: renderGenericCard,
    durations: [
      {key:'tat-ca', label:'Tất cả'},
      {key:'1 ngày', label:'1 ngày'},
      {key:'7 ngày', label:'7 ngày'},
      {key:'30 ngày', label:'30 ngày'},
      {key:'dai-ngay', label:'Dài ngày'}
    ],
    matchDuration: (p, key) => key === 'tat-ca' ? true
      : key === 'dai-ngay' ? DAI_NGAY_SET.includes(p.nhom)
      : p.nhom === key
  },
  'uudai': {
    dataset: () => DATA.goiSieuUuDai,
    render: renderGenericCard,
    durations: [
      {key:'tat-ca', label:'Tất cả'},
      {key:'1 ngày', label:'1 ngày'},
      {key:'3 ngày', label:'3 ngày'},
      {key:'7 ngày', label:'7 ngày'},
      {key:'15 ngày', label:'15 ngày'},
      {key:'30 ngày', label:'30 ngày'},
      {key:'dai-ngay', label:'Dài ngày'},
      {key:'khac', label:'Khác'}
    ],
    matchDuration: (p, key) => key === 'tat-ca' ? true
      : key === 'dai-ngay' ? DAI_NGAY_SET.includes(p.nhom)
      : p.nhom === key
  },
  'roaming': {
    dataset: () => DATA.goiRoaming,
    render: renderRoamingCard,
    durations: [
      {key:'tat-ca', label:'Tất cả'},
      {key:'Ngày', label:'Ngày'},
      {key:'Tuần', label:'Tuần'},
      {key:'Tháng', label:'Tháng'}
    ],
    matchDuration: (p, key) => key === 'tat-ca' ? true : p.nhom === key
  }
};

// Danh mục tra cứu "gói cước này nằm ở đâu" (trang nào, tab/nhóm nào) — dùng để: (1) tự động điều hướng
// đúng tới gói khi khách hàng bấm link chia sẻ có kèm mã gói (?SP=<mã>), (2) gán đúng "loại dịch vụ" +
// "có cần lắp đặt hay không" khi ghi nhận đơn hàng demo cho NVKD/CTV giới thiệu (xem recordReferredOrder).
const PKG_CATALOG = [
  { list: DATA.goiInternet.filter(p => p.nhom === 'Gói Internet'), page:'page-internet', tabBtn:'tab-goi-internet', serviceLabel:'Internet cáp quang', canLapDat:true, perMonth:true },
  { list: DATA.goiInternet.filter(p => p.nhom !== 'Gói Internet'), page:'page-internet', tabBtn:'tab-mesh-cao', serviceLabel:'Internet cáp quang', canLapDat:true, perMonth:true },
  { list: DATA.goiCombo.filter(p => p.nhom === 'Combo Internet - TV360'), page:'page-internet', tabBtn:'tab-combo', serviceLabel:'Combo Internet - Truyền hình', canLapDat:true, perMonth:true },
  { list: DATA.goiCombo.filter(p => p.nhom === 'Combo Internet - Camera'), page:'page-internet', tabBtn:'tab-camera', serviceLabel:'Combo Internet - Camera', canLapDat:true, perMonth:true },
  { list: DATA.goiData, page:'page-data', dataCat:'5g', serviceLabel:'Gói cước Data/5G', canLapDat:false, perMonth:false },
  { list: DATA.goiHot, page:'page-data', dataCat:'hot', serviceLabel:'Gói cước Data/5G', canLapDat:false, perMonth:false },
  { list: DATA.goiMXH, page:'page-data', dataCat:'mxh', serviceLabel:'Gói cước Data/5G', canLapDat:false, perMonth:false },
  { list: DATA.goiSieuUuDai, page:'page-data', dataCat:'uudai', serviceLabel:'Gói cước Data/5G', canLapDat:false, perMonth:false },
  { list: DATA.goiRoaming, page:'page-data', dataCat:'roaming', serviceLabel:'Gói Roaming', canLapDat:false, perMonth:false },
];

function findPkgLocation(ma){
  for(const cat of PKG_CATALOG){
    const found = cat.list.find(p => p.ma === ma);
    if(found) return { pkg: found, cat };
  }
  return null;
}

let dataDurationFilter = 'tat-ca';
let dataSortDesc = true; // true = giá giảm dần (giống mũi tên ↓ mặc định trên viettel.vn)

function renderDurationButtons(cfg){
  const wrap = document.getElementById('data-duration-filters');
  wrap.innerHTML = '';
  cfg.durations.forEach((d, i) => {
    const btn = document.createElement('button');
    btn.className = 'data-duration-btn' + (i === 0 ? ' active' : '');
    btn.dataset.duration = d.key;
    btn.textContent = d.label;
    btn.addEventListener('click', () => {
      wrap.querySelectorAll('.data-duration-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      dataDurationFilter = d.key;
      renderGoiData();
    });
    wrap.appendChild(btn);
  });
}

function renderGoiData(){
  const emptyNote = document.getElementById('data-empty-note');
  const activeCat = document.querySelector('.data-cat-tab.active')?.dataset.cat;
  const cfg = DATA_CATEGORIES[activeCat];

  if(!cfg){
    emptyNote.style.display = 'block';
    document.getElementById('data-duration-filters').innerHTML = '';
    document.getElementById('grid-goi-data').innerHTML = '';
    return;
  }
  emptyNote.style.display = 'none';

  let list = cfg.dataset().filter(p => cfg.matchDuration(p, dataDurationFilter));
  list = list.slice().sort((a, b) => dataSortDesc ? b.gia - a.gia : a.gia - b.gia);

  const grid = document.getElementById('grid-goi-data');
  grid.innerHTML = '';
  if(list.length === 0){
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:24px 0;font-size:13px;">
      Chưa có dữ liệu demo cho bộ lọc này trong danh mục hiện tại.
    </div>`;
    return;
  }
  list.forEach(p => grid.appendChild(cfg.render(p)));
}

document.querySelectorAll('.data-cat-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.data-cat-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    dataDurationFilter = 'tat-ca';
    const cfg = DATA_CATEGORIES[tab.dataset.cat];
    if(cfg) renderDurationButtons(cfg);
    else document.getElementById('data-duration-filters').innerHTML = '';
    renderGoiData();
  });
});

document.getElementById('data-sort-btn').addEventListener('click', () => {
  dataSortDesc = !dataSortDesc;
  document.getElementById('data-sort-arrow').textContent = dataSortDesc ? '↓' : '↑';
  renderGoiData();
});

// Khởi tạo: mặc định mở tab "Gói cước 5G"
renderDurationButtons(DATA_CATEGORIES['5g']);
renderGoiData();

/* ---------- Chuyển tab trang lớn (Internet / Sim / Data / Hỗ trợ nhân viên) ---------- */
// Hàm dùng chung: vừa cho .page-tab (3 tab gói cước), vừa cho link "Hỗ trợ nhân viên" trên
// thanh nav (không còn nằm trong .page-tabs nữa) và cho luồng đăng nhập CTV không tìm thấy
// tài khoản (cần điều hướng người dùng tới trang Hỗ trợ nhân viên để thấy thông báo lỗi).
// Khởi động lại hiệu ứng "pop" của icon dấu tích xanh mỗi lần màn hình thành công hiện ra
// (CSS animation chỉ tự chạy 1 lần khi phần tử được vẽ lần đầu, cần ép reflow để phát lại).
function replaySuccessIcoAnim(stepEl){
  const ico = stepEl.querySelector('.login-success-ico');
  if(!ico) return;
  ico.style.animation = 'none';
  void ico.offsetWidth;
  ico.style.animation = '';
}

function switchToPage(pageId){
  document.querySelectorAll('.page-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('nav-staff-link')?.classList.remove('active');

  const tab = document.querySelector(`.page-tab[data-page="${pageId}"]`);
  if(tab) tab.classList.add('active');
  if(pageId === 'page-staff') document.getElementById('nav-staff-link')?.classList.add('active');
  document.getElementById(pageId).classList.add('active');
}

document.querySelectorAll('.page-tab').forEach(tab => {
  tab.addEventListener('click', () => switchToPage(tab.dataset.page));
});
document.getElementById('nav-staff-link').addEventListener('click', () => switchToPage('page-staff'));

/* ---------- Chuyển tab con (loại gói) ---------- */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const parent = btn.closest('.section');
    parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    parent.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

/* ---------- Trang Sim số ---------- */
let simSearchTerm = '';

function renderSimTable(){
  const tbody = document.getElementById('sim-tbody');
  tbody.innerHTML = '';
  const list = DATA.simSo.danhSach.filter(s => s.so.replace(/\s/g,'').includes(simSearchTerm.replace(/\s/g,'')));
  list.forEach((s, idx) => {
    const tr = document.createElement('tr');
    tr.className = 'sim-row';
    tr.dataset.so = s.so;
    tr.dataset.gia = s.gia;
    tr.innerHTML = `
      <td>${idx+1}</td>
      <td>${s.so}</td>
      <td class="sim-price">${formatGia(s.gia)}</td>
      <td>${s.thoiGian}</td>
      <td><span class="radio-dot"></span></td>
    `;
    tr.addEventListener('click', () => {
      document.querySelectorAll('.sim-row').forEach(r => r.classList.remove('selected'));
      tr.classList.add('selected');
      const box = document.getElementById('sim-summary');
      box.classList.add('show');
      box.innerHTML = `Bạn vừa chọn số <b>${s.so}</b> — giá sim <b>${formatGia(s.gia)}</b> — sử dụng ${s.thoiGian}. (Thao tác minh hoạ, chưa gửi yêu cầu đăng ký thật.)`;
    });
    tbody.appendChild(tr);
  });
  if(list.length === 0){
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:20px;">Không tìm thấy số phù hợp.</td></tr>`;
  }
}
renderSimTable();

document.getElementById('sim-search-btn').addEventListener('click', () => {
  simSearchTerm = document.getElementById('sim-search').value.trim();
  renderSimTable();
});
document.getElementById('sim-search').addEventListener('keydown', (e) => {
  if(e.key === 'Enter'){
    simSearchTerm = e.target.value.trim();
    renderSimTable();
  }
});

document.querySelectorAll('.sim-toggle button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sim-toggle button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('loai-thue-bao-hien-tai').innerHTML = `Đang xem: <b>${btn.dataset.loai}</b>`;
  });
});

document.getElementById('chon-so-khac').addEventListener('click', () => {
  simSearchTerm = '';
  document.getElementById('sim-search').value = '';
  renderSimTable();
});

/* ---------- Nút pill trên banner "Dịch vụ di động" ---------- */
document.querySelectorAll('.hero-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    const target = pill.dataset.target;
    const note = document.getElementById('hero-pill-note');
    note.style.display = 'none';

    if(target === 'sim-so'){
      document.getElementById('sim-so').scrollIntoView({behavior:'smooth', block:'start'});
    } else if(target === 'goi-cuoc' || target === 'quoc-te'){
      switchToPage('page-data');
      window.scrollTo({top:0, behavior:'smooth'});
      const catKey = target === 'goi-cuoc' ? '5g' : 'roaming';
      document.querySelector(`.data-cat-tab[data-cat="${catKey}"]`)?.click();
    } else {
      note.textContent = 'Dịch vụ GTGT chưa có dữ liệu demo — chỉ Gói cước di động, SIM số và Dịch vụ quốc tế (roaming) được tổng hợp từ ảnh chụp màn hình bạn cung cấp.';
      note.style.display = 'block';
    }
  });
});

/* ======================================================
   ĐĂNG NHẬP THEO SỐ ĐIỆN THOẠI (mô phỏng OTP)
   Lưu ý: đây là trang demo tĩnh, KHÔNG có backend/API SMS
   thật. Mã OTP được sinh ngẫu nhiên phía trình duyệt và
   hiển thị công khai trong khung "demo hint" để có thể
   test luồng mà không cần tổng đài SMS thật. Tuyệt đối
   không dùng cách này cho môi trường production.
   ====================================================== */
(function(){
  const overlay = document.getElementById('login-overlay');
  const stepPhone = document.getElementById('step-phone');
  const stepOtp = document.getElementById('step-otp');
  const stepSuccess = document.getElementById('step-success');

  const phoneInput = document.getElementById('login-phone');
  const phoneClear = document.getElementById('login-phone-clear');
  const phoneError = document.getElementById('login-phone-error');
  const btnSendOtp = document.getElementById('btn-send-otp');

  const otpBoxesWrap = document.getElementById('otp-boxes');
  const otpBoxes = Array.from(document.querySelectorAll('.otp-box'));
  const otpPhoneDisplay = document.getElementById('login-otp-phone-display');
  const otpError = document.getElementById('login-otp-error');
  const demoHint = document.getElementById('login-demo-hint');
  const resendEl = document.getElementById('otp-resend');
  const expireCountEl = document.getElementById('otp-expire-count');
  const btnOtpCancel = document.getElementById('btn-otp-cancel');
  const btnOtpConfirm = document.getElementById('btn-otp-confirm');

  const loginBtn = document.getElementById('btn-open-login');
  const loginAltNote = document.getElementById('login-alt-note');
  const loginSuccessMsg = document.getElementById('login-success-msg');
  const btnLoginDone = document.getElementById('btn-login-done');

  const PHONE_REGEX = /^0(3|5|7|8|9)[0-9]{8}$/;
  const RESEND_SECONDS = 57;
  const EXPIRE_SECONDS = 4 * 60 + 57; // 4:57

  let demoOtp = '';
  let resendTimer = null;
  let expireTimer = null;
  let resendLeft = 0;
  let expireLeft = 0;
  let loggedInPhone = null;

  function genOtp(){
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  function formatMMSS(totalSec){
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return m + ':' + String(s).padStart(2, '0');
  }

  function showStep(step){
    [stepPhone, stepOtp, stepSuccess].forEach(s => s.style.display = 'none');
    step.style.display = 'block';
    if(step === stepSuccess) replaySuccessIcoAnim(step);
  }

  function openModal(preferredService){
    overlay.classList.add('show');
    // Mặc định chọn tab dịch vụ theo trang hiện tại đang xem (trang Hỗ trợ nhân viên -> mặc định tab Nhân viên KD)
    const currentPage = document.querySelector('.page.active')?.id;
    document.querySelectorAll('.login-service-tab').forEach(t => t.classList.remove('active'));
    let wantService = preferredService;
    if(!wantService){
      if(currentPage === 'page-staff') wantService = 'nvkd';
      else if(currentPage === 'page-sim' || currentPage === 'page-data') wantService = 'di-dong';
      else wantService = 'internet-tv';
    }
    const targetTab = document.querySelector(`.login-service-tab[data-service="${wantService}"]`)
      || document.querySelector('.login-service-tab');
    targetTab.classList.add('active');
    showStep(stepPhone);
    phoneError.textContent = '';
  }

  function closeModal(){
    overlay.classList.remove('show');
    stopTimers();
  }

  function resetPhoneStep(){
    phoneInput.value = '';
    phoneClear.style.display = 'none';
    btnSendOtp.disabled = true;
    phoneError.textContent = '';
  }

  function stopTimers(){
    if(resendTimer){ clearInterval(resendTimer); resendTimer = null; }
    if(expireTimer){ clearInterval(expireTimer); expireTimer = null; }
  }

  function renderResendCounting(sec){
    resendEl.innerHTML = `Gửi lại OTP (<b>${sec}</b>s)`;
  }

  function startResendTimer(){
    resendLeft = RESEND_SECONDS;
    resendEl.classList.remove('resend-active');
    renderResendCounting(resendLeft);
    if(resendTimer) clearInterval(resendTimer);
    resendTimer = setInterval(() => {
      resendLeft--;
      if(resendLeft <= 0){
        clearInterval(resendTimer);
        resendTimer = null;
        resendEl.textContent = 'Gửi lại OTP';
        resendEl.classList.add('resend-active');
      } else {
        renderResendCounting(resendLeft);
      }
    }, 1000);
  }

  function startExpireTimer(){
    expireLeft = EXPIRE_SECONDS;
    expireCountEl.textContent = formatMMSS(expireLeft);
    if(expireTimer) clearInterval(expireTimer);
    expireTimer = setInterval(() => {
      expireLeft--;
      if(expireLeft <= 0){
        clearInterval(expireTimer);
        expireTimer = null;
        expireCountEl.textContent = '0:00';
        otpError.textContent = 'Mã OTP đã hết hạn. Vui lòng bấm "Gửi lại OTP".';
        otpBoxes.forEach(b => b.disabled = true);
        btnOtpConfirm.disabled = true;
      } else {
        expireCountEl.textContent = formatMMSS(expireLeft);
      }
    }, 1000);
  }

  function sendOtp(){
    demoOtp = genOtp();
    otpPhoneDisplay.textContent = phoneInput.value;
    demoHint.innerHTML = `Đây là bản demo (không gửi SMS thật). Mã OTP của bạn là: <b>${demoOtp}</b>`;
    otpError.textContent = '';
    otpBoxes.forEach(b => { b.value = ''; b.disabled = false; });
    btnOtpConfirm.disabled = true;
    showStep(stepOtp);
    startResendTimer();
    startExpireTimer();
    setTimeout(() => otpBoxes[0].focus(), 50);
  }

  function getOtpValue(){
    return otpBoxes.map(b => b.value).join('');
  }

  function checkOtpComplete(){
    const val = getOtpValue();
    btnOtpConfirm.disabled = val.length !== 6;
  }

  function setLoggedIn(phone){
    loggedInPhone = phone;
    // BỔ SUNG: đưa SĐT khách hàng thường vừa đăng nhập ra window để khối script "Khách hàng tiềm năng"
    // (script #3) tận dụng luôn làm nguồn thu thập SĐT mạnh nhất — khách đã tự đăng nhập thì không cần
    // hỏi lại qua banner nhẹ nữa (xem detectLoggedInCustomerPhone() ở khối script Kênh NVKD/CTV).
    window.currentCustomerPhone = phone;
    loginBtn.outerHTML = `
      <button class="user-chip" id="btn-open-login">
        <span class="avatar">${phone.slice(-2)}</span>${phone}
      </button>`;
    bindLoginButton();
    document.body.classList.add('is-logged-in');
  }

  function setLoggedOut(){
    loggedInPhone = null;
    window.currentCustomerPhone = null;
    const chip = document.getElementById('btn-open-login');
    if(chip){
      chip.outerHTML = `<button class="login-btn" id="btn-open-login">Đăng nhập</button>`;
      bindLoginButton();
    }
    document.body.classList.remove('is-logged-in');
  }

  function bindLoginButton(){
    const btn = document.getElementById('btn-open-login');
    btn.addEventListener('click', () => {
      if(loggedInPhone){
        setLoggedOut();
      } else {
        openModal();
      }
    });
  }

  /* ---- Sự kiện: bước 1 - số điện thoại ---- */
  phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/[^0-9]/g, '');
    phoneClear.style.display = phoneInput.value ? 'block' : 'none';
    const valid = PHONE_REGEX.test(phoneInput.value);
    const role = document.querySelector('.login-service-tab.active')?.dataset.service;
    const bypassValidation = (role === 'nvkd' || role === 'ctv');
    btnSendOtp.disabled = !valid && !bypassValidation && phoneInput.value.length === 0;
    if (bypassValidation && phoneInput.value.length > 0) {
      btnSendOtp.disabled = false;
    }
    phoneInput.classList.toggle('invalid', phoneInput.value.length >= 10 && !valid && !bypassValidation);
    phoneError.textContent = (phoneInput.value.length >= 10 && !valid && !bypassValidation)
      ? 'Số điện thoại không đúng định dạng (VD: 0989xxxxxx).' : '';
  });
  phoneClear.addEventListener('click', () => {
    resetPhoneStep();
    phoneInput.focus();
  });
  btnSendOtp.addEventListener('click', () => {
    const role = document.querySelector('.login-service-tab.active')?.dataset.service;
    if(!PHONE_REGEX.test(phoneInput.value) && role !== 'nvkd' && role !== 'ctv'){
      phoneError.textContent = 'Vui lòng nhập số điện thoại hợp lệ.';
      return;
    }
    sendOtp();
  });
  phoneInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' && !btnSendOtp.disabled) sendOtp();
  });

  document.querySelectorAll('.login-service-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.login-service-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      phoneInput.dispatchEvent(new Event('input'));
    });
  });

  document.getElementById('btn-login-password').addEventListener('click', () => {
    loginAltNote.textContent = 'Đăng nhập bằng mật khẩu không khả dụng trong bản demo — vui lòng dùng OTP.';
  });
  document.getElementById('btn-login-qr').addEventListener('click', () => {
    loginAltNote.textContent = 'Đăng nhập bằng QR Code không khả dụng trong bản demo — vui lòng dùng OTP.';
  });

  /* ---- Sự kiện: bước 2 - mã OTP ---- */
  otpBoxes.forEach((box, idx) => {
    box.addEventListener('input', () => {
      box.value = box.value.replace(/[^0-9]/g, '').slice(0, 1);
      if(box.value && idx < otpBoxes.length - 1) otpBoxes[idx + 1].focus();
      otpError.textContent = '';
      checkOtpComplete();
    });
    box.addEventListener('keydown', (e) => {
      if(e.key === 'Backspace' && !box.value && idx > 0) otpBoxes[idx - 1].focus();
      if(e.key === 'Enter' && !btnOtpConfirm.disabled) btnOtpConfirm.click();
    });
    box.addEventListener('paste', (e) => {
      const text = (e.clipboardData.getData('text') || '').replace(/[^0-9]/g, '').slice(0, 6);
      if(text.length === 6){
        e.preventDefault();
        otpBoxes.forEach((b, i) => b.value = text[i] || '');
        checkOtpComplete();
        otpBoxes[5].focus();
      }
    });
  });

  resendEl.addEventListener('click', () => {
    if(!resendEl.classList.contains('resend-active')) return;
    sendOtp(); // sinh OTP mới + reset cả 2 bộ đếm
  });

  document.getElementById('login-back').addEventListener('click', () => {
    stopTimers();
    showStep(stepPhone);
  });

  btnOtpCancel.addEventListener('click', closeModal);

  btnOtpConfirm.addEventListener('click', () => {
    const entered = getOtpValue();
    if(entered.length !== 6) return;
    // Chấp nhận mọi mã OTP 6 chữ số trong bản demo để người dùng đăng nhập NVKD/CTV mượt mà
    stopTimers();
    const role = document.querySelector('.login-service-tab.active')?.dataset.service;
    const phone = phoneInput.value;
    if(role === 'nvkd'){
      closeModal();
      resetPhoneStep();
      window.StaffPortal?.loginStaff(phone);
    } else if(role === 'ctv'){
      closeModal();
      resetPhoneStep();
      window.StaffPortal?.loginCtv(phone);
    } else {
      loginSuccessMsg.innerHTML = `Chào mừng bạn! Số điện thoại <b>${phone}</b> đã đăng nhập thành công.`;
      showStep(stepSuccess);
    }
  });

  btnLoginDone.addEventListener('click', () => {
    const phone = phoneInput.value;
    const role = document.querySelector('.login-service-tab.active')?.dataset.service;
    closeModal();
    resetPhoneStep();
    // NVKD/CTV dùng chung ô "Đăng nhập" nhưng dẫn vào Kênh Hỗ trợ nhân viên (page-staff) thay vì
    // đăng nhập khách hàng thông thường — logic đăng nhập NVKD/CTV nằm ở khối script riêng
    // (window.StaffPortal), tách biệt để không lẫn với state đăng nhập khách hàng ở trên.
    if(role === 'nvkd'){
      window.StaffPortal?.loginStaff(phone);
    } else if(role === 'ctv'){
      window.StaffPortal?.loginCtv(phone);
    } else {
      setLoggedIn(phone);
    }
  });

  /* ---- Đóng modal ---- */
  document.getElementById('login-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if(e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && overlay.classList.contains('show')) closeModal();
  });

  bindLoginButton();

  // Nút "Đăng nhập ngay" ở trạng thái khoá của trang Hỗ trợ nhân viên: mở CHÍNH modal đăng
  // nhập này (mặc định tab "Nhân viên KD"), thay vì có một modal đăng nhập riêng cho NVKD/CTV.
  document.getElementById('btn-open-login-from-staff')?.addEventListener('click', () => openModal('nvkd'));

  // Các mục trong dropdown "Hỗ trợ khách hàng"/"My Viettel" chỉ là minh hoạ, chặn nhảy trang khi click
  document.querySelectorAll('.dropdown-col a').forEach(a => {
    a.addEventListener('click', (e) => e.preventDefault());
  });
})();
