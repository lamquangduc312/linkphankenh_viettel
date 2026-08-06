$replacements = @('Gi&#225; t&#7889;t', 'Ph&#7893; bi&#7871;n', 'Khuy&#234;n d&#249;ng', '&#272;&#7881;nh cao', 'Ti&#7871;t ki&#7879;m', 'B&#225;n ch&#7841;y', 'Hot', 'VIP', '&#431;u &#273;&#227;i', '&#272;&#432;&#7907;c y&#234;u th&#237;ch')
$content = Get-Content index.html -Encoding utf8
$count = 0
for ($i=0; $i -lt $content.Length; $i++) {
    if ($content[$i] -match '<div class="product-badge new">M&#7899;i</div>' -or $content[$i] -match '<div class="product-badge new">Mới</div>') {
        if ($count -lt 10) {
            $content[$i] = '                    <div class="product-badge new">' + $replacements[$count] + '</div>'
            $count++
        }
    }
}
$content | Set-Content index.html -Encoding utf8
