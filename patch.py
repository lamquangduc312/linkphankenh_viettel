import codecs

path = 'G:/VIETTEL TAMMI/CĐBR+DĐ_PYC Link phan kenh/Viettel_Portal_LPK/index.html'

with codecs.open(path, 'r', 'utf-8') as f:
    content = f.read()

# Patch 1
content = content.replace(
    '<div class="ref-badge-role" id="ref-badge-role"></div>',
    '<div class="ref-badge-role" id="ref-badge-role"></div>\n      <div id="ref-badge-rating"></div>'
)

# Patch 2 (more robust)
if 'rating: 5' not in content:
    content = content.replace(
        "avatar: null, //",
        "rating: 5,\n    reviews: 156,\n    avatar: null, //"
    )

# Patch 3
old_code = """document.getElementById('ref-badge-role').textContent = referrer.type === 'staff'
      ? `Nhân viên kinh doanh Viettel - ${referrer.diaBan}`
      : 'Cộng tác viên Viettel';"""

old_code_crlf = old_code.replace('\n', '\r\n')

new_code = """document.getElementById('ref-badge-role').innerHTML = referrer.type === 'staff'
      ? `Nhân viên kinh doanh Viettel<br><span style="color:var(--text-muted);font-size:11px;">📍 ${referrer.diaBan}</span>`
      : 'Cộng tác viên Viettel';
    
    document.getElementById('ref-badge-rating').innerHTML = referrer.type === 'staff'
      ? `<div style="display:flex;align-items:center;gap:4px;margin-top:4px;font-size:11px;">
           <span style="color:#F5A623;letter-spacing:1px;">★★★★★</span>
           <span style="color:var(--text-muted);font-weight:normal;">(${STAFF_DEMO.reviews} đánh giá)</span>
         </div>`
      : '';"""

if old_code in content:
    content = content.replace(old_code, new_code)
elif old_code_crlf in content:
    content = content.replace(old_code_crlf, new_code)
else:
    print("Warning: old code not found")

with codecs.open(path, 'w', 'utf-8') as f:
    f.write(content)

print("Patch applied")
