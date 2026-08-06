const fs = require('fs');
const filepath = 'e:/VIETTEL TAMMI/Link phan kenh/Viettel_Portal_LPK/viettel_sales_mobile_dashboard.html';
let content = fs.readFileSync(filepath, 'utf-8');

const newServices = `
      meshvt1: { name: "Meshvt1", color: "from-red-500 to-rose-600", unit: "Thuê bao", price: 235000, target: 10 },
      meshvt2: { name: "Meshvt2", color: "from-red-500 to-rose-600", unit: "Thuê bao", price: 265000, target: 10 },
      meshvt3: { name: "Meshvt3", color: "from-red-500 to-rose-600", unit: "Thuê bao", price: 299000, target: 10 },
      meshvt4: { name: "Meshvt4", color: "from-red-500 to-rose-600", unit: "Thuê bao", price: 349000, target: 10 },
      giga1: { name: "Giga1", color: "from-red-500 to-rose-600", unit: "Thuê bao", price: 320000, target: 15 },
      giga2: { name: "Giga2", color: "from-red-500 to-rose-600", unit: "Thuê bao", price: 355000, target: 15 },
      giga3: { name: "Giga3", color: "from-red-500 to-rose-600", unit: "Thuê bao", price: 390000, target: 15 },
      giga4: { name: "Giga4", color: "from-red-500 to-rose-600", unit: "Thuê bao", price: 425000, target: 15 },
      netvt1: { name: "Netvt1", color: "from-red-500 to-rose-600", unit: "Thuê bao", price: 235000, target: 10 },
      netvt2: { name: "Netvt2", color: "from-red-500 to-rose-600", unit: "Thuê bao", price: 265000, target: 10 },`;

content = content.replace(/ftth: \{.*?\},/, newServices.trim() + ',');

content = content.replace(
  'const cap1Counts = { esim: 0, ftth: 0, camera: 0, tv360: 0, combo: 0, simGoi: 0, data: 0, roaming: 0 };\n      const ctvCounts = { esim: 0, ftth: 0, camera: 0, tv360: 0, combo: 0, simGoi: 0, data: 0, roaming: 0 };',
  'const cap1Counts = {};\n      const ctvCounts = {};\n      Object.keys(SERVICES_METADATA).forEach(k => { cap1Counts[k] = 0; ctvCounts[k] = 0; });'
);

content = content.replace(
  /ftth: \d+,/,
  'meshvt1: 5, meshvt2: 5, meshvt3: 5, meshvt4: 5, giga1: 15, giga2: 15, giga3: 15, giga4: 15, netvt1: 10, netvt2: 10,'
);

content = content.replace(/`TX\$\{txCounter\+\+\}`/g, 'String(Math.floor(10000000 + Math.random() * 90000000))');
content = content.replace(/"TX100\d"/g, 'String(Math.floor(10000000 + Math.random() * 90000000))');

content = content.replace(/"ftth"/g, '"giga1"');

content = content.replace(
  '<option value="ftth">Internet Cáp Quang (Cáp Quang FTTH)</option>',
  '<option value="giga1">Giga1 (Cáp Quang Tốc Độ Cao)</option>'
);

content = content.replace(
  '<span class="font-bold text-slate-200">${tx.customerName}</span>',
  '<span class="font-bold text-slate-200">#${tx.id} - ${tx.customerName} - ${SERVICES_METADATA[tx.serviceKey].name} - <span class="text-amber-400">${SERVICES_METADATA[tx.serviceKey].price.toLocaleString()}đ</span></span>'
);

content = content.replace(
  '${isSelf ? "Bạn bán" : `CTV ${tx.agentId}`}',
  '${isSelf ? "Bạn bán" : tx.agentId}'
);

content = content.replace(
  '<span class="font-bold text-slate-200">${SERVICES_METADATA[tx.serviceKey].name}</span>\n                    <span class="text-slate-500 block font-mono">${tx.customerName} - ${tx.customerPhone}</span>',
  '<span class="font-bold text-slate-200">#${tx.id} - ${SERVICES_METADATA[tx.serviceKey].name}</span>\n                    <span class="text-slate-500 block font-mono">${tx.customerName} - ${tx.customerPhone} - <span class="text-amber-400">${SERVICES_METADATA[tx.serviceKey].price.toLocaleString()}đ</span></span>'
);

content = content.replace(
  '<option value="ftth">Internet Cáp Quang</option>',
  '<optgroup label="Các gói cước tốc độ cao, tích hợp giải pháp Mesh wifi">\n<option value="meshvt1">Meshvt1</option>\n<option value="meshvt2">Meshvt2</option>\n<option value="meshvt3">Meshvt3</option>\n<option value="meshvt4">Meshvt4</option>\n<option value="giga1">Giga1</option>\n<option value="giga2">Giga2</option>\n<option value="giga3">Giga3</option>\n<option value="giga4">Giga4</option>\n</optgroup>\n<optgroup label="Gói cước WIFI 6 tốc độ cao">\n<option value="netvt1">Netvt1</option>\n<option value="netvt2">Netvt2</option>\n</optgroup>'
);

fs.writeFileSync(filepath, content, 'utf-8');
console.log("Success");
