$mesh_packages = @("Meshvt1", "Meshvt2", "Meshvt3", "Meshvt4", "Giga1", "Giga2", "Giga3", "Giga4")
$wifi6_packages = @("Netvt1", "Netvt2")

function Get-Card($name) {
    return @"
                <div class="product-card promo">
                    <div class="product-badge new">Mới</div>
                    <div class="product-header">
                        <h3>$name</h3>
                        <div class="price">Đang cập nhật<span>/ tháng</span></div>
                    </div>
                    <div class="product-body">
                        <ul class="features">
                            <li><i class="fa-solid fa-wifi"></i> Tốc độ <strong>Cao</strong></li>
                            <li><i class="fa-solid fa-server"></i> Trang bị Modem Wifi</li>
                            <li><i class="fa-solid fa-gift"></i> Tặng 1-2 tháng</li>
                        </ul>
                    </div>
                    <div class="product-footer">
                        <button class="btn btn-buy" data-service="$name" data-url="https://viettel.vn">Đăng ký <i class="fa-solid fa-arrow-right"></i></button>
                    </div>
                </div>
"@
}

$html = @()
$html += '        <!-- Internet Mesh -->'
$html += '        <section id="internet-mesh" class="product-section">'
$html += '            <div class="section-header">'
$html += '                <h2 class="section-title">Các gói cước tốc độ cao, tích hợp giải pháp Mesh wifi</h2>'
$html += '                <a href="#" class="view-all">Xem tất cả <i class="fa-solid fa-angle-right"></i></a>'
$html += '            </div>'
$html += '            <div class="product-grid">'
foreach ($p in $mesh_packages) {
    $html += Get-Card $p
}
$html += '            </div>'
$html += '        </section>'
$html += ''
$html += '        <!-- Internet Wifi 6 -->'
$html += '        <section id="internet-wifi6" class="product-section">'
$html += '            <div class="section-header">'
$html += '                <h2 class="section-title">Gói cước WIFI 6 tốc độ cao</h2>'
$html += '                <a href="#" class="view-all">Xem tất cả <i class="fa-solid fa-angle-right"></i></a>'
$html += '            </div>'
$html += '            <div class="product-grid">'
foreach ($p in $wifi6_packages) {
    $html += Get-Card $p
}
$html += '            </div>'
$html += '        </section>'

$html -join "`r`n" | Out-File -FilePath "temp_internet.html" -Encoding utf8
Write-Host "Created temp_internet.html"
